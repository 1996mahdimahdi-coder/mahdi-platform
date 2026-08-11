const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const SOURCE_PATH = path.join(
  process.cwd(),
  "src",
  "db",
  "algeria-cities-source.json"
);

function normalize(value) {
  return String(value ?? "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ");
}

async function main() {
  console.log("=================================");
  console.log("=== Algeria database fix ===");
  console.log("=================================");
  console.log("");

  if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error(
      "Source file not found: " + SOURCE_PATH
    );
  }

  const data = JSON.parse(
    fs.readFileSync(SOURCE_PATH, "utf8")
  );

  const wilayasMap = new Map();

  for (const row of data) {
    const code = String(
      row.wilaya_code ?? ""
    ).padStart(2, "0");

    if (!code || code === "00") {
      throw new Error(
        "Invalid Wilaya code in source file."
      );
    }

    if (!wilayasMap.has(code)) {
      wilayasMap.set(code, {
        code: code,
        nameAr: normalize(row.wilaya_name),
        nameFr: normalize(row.wilaya_name_fr),
        communes: []
      });
    }

    wilayasMap.get(code).communes.push({
      nameAr: normalize(row.commune_name),
      nameFr: normalize(row.commune_name_fr)
    });
  }

  const wilayasData =
    Array.from(wilayasMap.values()).sort(
      (a, b) =>
        a.code.localeCompare(b.code)
    );

  const totalCommunes =
    wilayasData.reduce(
      (total, wilaya) =>
        total + wilaya.communes.length,
      0
    );

  console.log(
    "Source records :",
    data.length
  );

  console.log(
    "Wilayas        :",
    wilayasData.length
  );

  console.log(
    "Communes       :",
    totalCommunes
  );

  console.log("");

  if (data.length !== 1541) {
    throw new Error(
      "Expected 1541 source records, got " +
      data.length
    );
  }

  if (wilayasData.length !== 69) {
    throw new Error(
      "Expected 69 wilayas, got " +
      wilayasData.length
    );
  }

  if (totalCommunes !== 1541) {
    throw new Error(
      "Expected 1541 communes, got " +
      totalCommunes
    );
  }

  const requiredCodes = [
    "28",
    "30",
    "55"
  ];

  for (const code of requiredCodes) {
    const wilaya =
      wilayasData.find(
        (item) => item.code === code
      );

    if (!wilaya) {
      throw new Error(
        "Required Wilaya " +
        code +
        " is missing."
      );
    }

    console.log(
      "Wilaya " +
      code +
      ": " +
      wilaya.nameAr +
      " | " +
      wilaya.nameFr
    );
  }

  console.log("");
  console.log(
    "Source validation: OK"
  );
  console.log("");

  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "app_db",
    password:
      process.env.PGPASSWORD ||
      undefined,
    port: 5432
  });

  await client.connect();

  console.log(
    "PostgreSQL connection: OK"
  );

  console.log("");

  try {
    await client.query("BEGIN");

    console.log(
      "Reading visitor profiles..."
    );

    const visitorResult =
      await client.query(
        [
          "SELECT",
          "  vp.id,",
          "  vp.wilaya_id,",
          "  vp.wilaya_name,",
          "  w.code AS old_wilaya_code",
          "FROM visitor_profiles vp",
          "LEFT JOIN wilayas w",
          "  ON w.id = vp.wilaya_id",
          "ORDER BY vp.id"
        ].join("\n")
      );

    console.log(
      "Visitor profiles:",
      visitorResult.rows.length
    );

    const visitors =
      visitorResult.rows.map(
        (visitor) => ({
          id: visitor.id,

          oldWilayaCode:
            visitor.old_wilaya_code
              ? String(
                  visitor.old_wilaya_code
                ).padStart(2, "0")
              : null,

          wilayaName:
            normalize(
              visitor.wilaya_name
            )
        })
      );

    console.log("");

    console.log(
      "Checking visitor Wilaya references..."
    );

    for (const visitor of visitors) {
      if (!visitor.oldWilayaCode) {
        throw new Error(
          "Visitor " +
          visitor.id +
          " has no valid Wilaya code. " +
          "Migration stopped safely."
        );
      }
    }

    console.log(
      "Visitor references: OK"
    );

    console.log("");

    console.log(
      "Removing visitor_profiles foreign key..."
    );

    await client.query(
      "ALTER TABLE visitor_profiles " +
      "DROP CONSTRAINT IF EXISTS " +
      "visitor_profiles_wilaya_id_wilayas_id_fk"
    );

    console.log(
      "Foreign key removed."
    );

    console.log("");

    console.log(
      "Deleting old communes..."
    );

    await client.query(
      "DELETE FROM communes"
    );

    console.log(
      "Deleting old wilayas..."
    );

    await client.query(
      "DELETE FROM wilayas"
    );

    console.log(
      "Old geographic data removed."
    );

    console.log("");

    console.log(
      "Resetting sequences..."
    );

    await client.query(
      "ALTER SEQUENCE wilayas_id_seq " +
      "RESTART WITH 1"
    );

    await client.query(
      "ALTER SEQUENCE communes_id_seq " +
      "RESTART WITH 1"
    );

    console.log(
      "Sequences reset."
    );

    console.log("");

    console.log(
      "Inserting 69 wilayas..."
    );

    const wilayaIds =
      new Map();

    for (
      const wilaya of wilayasData
    ) {
      const result =
        await client.query(
          [
            "INSERT INTO wilayas",
            "  (code, name_ar, name_fr, area_type)",
            "VALUES",
            "  ($1, $2, $3, $4)",
            "RETURNING id"
          ].join("\n"),
          [
            wilaya.code,
            wilaya.nameAr,
            wilaya.nameFr,
            "urban"
          ]
        );

      wilayaIds.set(
        wilaya.code,
        result.rows[0].id
      );
    }

    if (wilayaIds.size !== 69) {
      throw new Error(
        "Only " +
        wilayaIds.size +
        " wilayas were inserted."
      );
    }

    console.log(
      "Wilayas inserted:",
      wilayaIds.size
    );

    console.log("");

    console.log(
      "Inserting 1541 communes..."
    );

    let insertedCommunes = 0;

    for (
      const wilaya of wilayasData
    ) {
      const wilayaId =
        wilayaIds.get(
          wilaya.code
        );

      if (!wilayaId) {
        throw new Error(
          "Missing database ID for Wilaya " +
          wilaya.code
        );
      }

      for (
        const commune of wilaya.communes
      ) {
        await client.query(
          [
            "INSERT INTO communes",
            "  (wilaya_id, name_ar, name_fr, population_density)",
            "VALUES",
            "  ($1, $2, $3, $4)"
          ].join("\n"),
          [
            wilayaId,
            commune.nameAr,
            commune.nameFr,
            "medium"
          ]
        );

        insertedCommunes++;

        if (
          insertedCommunes % 250 === 0
        ) {
          console.log(
            "Communes inserted:",
            insertedCommunes
          );
        }
      }
    }

    if (
      insertedCommunes !== 1541
    ) {
      throw new Error(
        "Only " +
        insertedCommunes +
        " communes were inserted."
      );
    }

    console.log(
      "Communes inserted:",
      insertedCommunes
    );

    console.log("");

    console.log(
      "Restoring visitor Wilaya references..."
    );

    let restoredVisitors = 0;

    for (
      const visitor of visitors
    ) {
      const target =
        await client.query(
          [
            "SELECT id",
            "FROM wilayas",
            "WHERE code = $1",
            "LIMIT 1"
          ].join("\n"),
          [
            visitor.oldWilayaCode
          ]
        );

      if (
        target.rows.length !== 1
      ) {
        throw new Error(
          "Wilaya code " +
          visitor.oldWilayaCode +
          " not found for visitor " +
          visitor.id
        );
      }

      await client.query(
        [
          "UPDATE visitor_profiles",
          "SET wilaya_id = $1",
          "WHERE id = $2"
        ].join("\n"),
        [
          target.rows[0].id,
          visitor.id
        ]
      );

      restoredVisitors++;
    }

    console.log(
      "Visitors restored:",
      restoredVisitors
    );

    console.log("");

    console.log(
      "Restoring visitor_profiles foreign key..."
    );

    await client.query(
      [
        "ALTER TABLE visitor_profiles",
        "ADD CONSTRAINT visitor_profiles_wilaya_id_wilayas_id_fk",
        "FOREIGN KEY (wilaya_id)",
        "REFERENCES wilayas(id)",
        "ON DELETE RESTRICT"
      ].join("\n")
    );

    console.log(
      "Foreign key restored."
    );

    console.log("");

    console.log(
      "Running final validation..."
    );

    const finalWilayas =
      await client.query(
        "SELECT COUNT(*)::int AS count " +
        "FROM wilayas"
      );

    const finalCommunes =
      await client.query(
        "SELECT COUNT(*)::int AS count " +
        "FROM communes"
      );

    const finalVisitors =
      await client.query(
        "SELECT COUNT(*)::int AS count " +
        "FROM visitor_profiles"
      );

    const invalidVisitors =
      await client.query(
        "SELECT COUNT(*)::int AS count " +
        "FROM visitor_profiles " +
        "WHERE wilaya_id IS NULL"
      );

    if (
      finalWilayas.rows[0].count !== 69
    ) {
      throw new Error(
        "Final Wilaya count is " +
        finalWilayas.rows[0].count +
        ", expected 69."
      );
    }

    if (
      finalCommunes.rows[0].count !== 1541
    ) {
      throw new Error(
        "Final commune count is " +
        finalCommunes.rows[0].count +
        ", expected 1541."
      );
    }

    if (
      finalVisitors.rows[0].count !==
      visitorResult.rows.length
    ) {
      throw new Error(
        "Visitor count changed during migration."
      );
    }

    if (
      invalidVisitors.rows[0].count !== 0
    ) {
      throw new Error(
        "Some visitor profiles have NULL wilaya_id."
      );
    }

    const finalRequired =
      await client.query(
        [
          "SELECT code, name_ar, name_fr",
          "FROM wilayas",
          "WHERE code IN ('28', '30', '55')",
          "ORDER BY code"
        ].join("\n")
      );

    if (
      finalRequired.rows.length !== 3
    ) {
      throw new Error(
        "Final validation failed: " +
        "Wilayas 28, 30, 55 are not all present."
      );
    }

    for (
      const row of finalRequired.rows
    ) {
      console.log(
        row.code +
        ": " +
        row.name_ar +
        " | " +
        row.name_fr
      );
    }

    await client.query(
      "COMMIT"
    );

    console.log("");
    console.log(
      "================================="
    );
    console.log(
      "ALGERIA DATA FIX COMPLETED"
    );
    console.log(
      "================================="
    );

    console.log(
      "Wilayas inserted :",
      finalWilayas.rows[0].count
    );

    console.log(
      "Communes inserted:",
      finalCommunes.rows[0].count
    );

    console.log(
      "Visitors preserved:",
      finalVisitors.rows[0].count
    );

    console.log(
      "Visitors restored :",
      restoredVisitors
    );

    console.log("");

    console.log(
      "Database migration finished successfully."
    );
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error("");
    console.error(
      "================================="
    );
    console.error(
      "ERROR: Database transaction rolled back."
    );
    console.error(
      "================================="
    );
    console.error("");
    console.error(
      error.message
    );
    console.error("");
    console.error(
      "NO CHANGES WERE COMMITTED."
    );

    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("");
  console.error(
    "FATAL ERROR:"
  );
  console.error(error);
  process.exitCode = 1;
});
