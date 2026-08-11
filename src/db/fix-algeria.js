const fs = require("fs");

const source = JSON.parse(
  fs.readFileSync("src/db/algeria-cities-source.json", "utf8")
);

const map = new Map();

for (const x of source) {
  const code = String(x.wilaya_code).padStart(2, "0");

  if (!map.has(code)) {
    map.set(code, {
      code,
      nameAr: x.wilaya_name,
      nameFr: x.wilaya_name_fr,
      communes: [],
    });
  }

  const wilaya = map.get(code);

  const exists = wilaya.communes.some(
    (c) =>
      c.nameAr === x.commune_name &&
      c.nameFr === x.commune_name_fr
  );

  if (!exists) {
    wilaya.communes.push({
      nameAr: x.commune_name,
      nameFr: x.commune_name_fr,
    });
  }
}

const wilayas = [...map.values()].sort((a, b) =>
  a.code.localeCompare(b.code)
);

console.log("=================================");
console.log("Algeria data preparation");
console.log("=================================");
console.log("Source records :", source.length);
console.log("Wilayas        :", wilayas.length);
console.log(
  "Communes       :",
  wilayas.reduce((n, w) => n + w.communes.length, 0)
);

if (wilayas.length !== 69) {
  throw new Error("Expected 69 wilayas, got " + wilayas.length);
}

const communeCount = wilayas.reduce(
  (n, w) => n + w.communes.length,
  0
);

if (communeCount !== 1541) {
  throw new Error("Expected 1541 communes, got " + communeCount);
}

const w28 = wilayas.find((w) => w.code === "28");
const w30 = wilayas.find((w) => w.code === "30");
const w55 = wilayas.find((w) => w.code === "55");

console.log("");
console.log("Wilaya 28:", w28.nameAr, "|", w28.nameFr);
console.log("Wilaya 30:", w30.nameAr, "|", w30.nameFr);
console.log("Wilaya 55:", w55.nameAr, "|", w55.nameFr);

if (w28.nameFr !== "M'Sila") {
  throw new Error("Wilaya 28 is not M'Sila");
}

if (w30.nameFr !== "Ouargla") {
  throw new Error("Wilaya 30 is not Ouargla");
}

if (w55.nameFr !== "Touggourt") {
  throw new Error("Wilaya 55 is not Touggourt");
}

const escapeSql = (value) =>
  "'" + String(value).replace(/'/g, "''") + "'";

let sql = "";

sql += "BEGIN;\n\n";

/*
 * IMPORTANT:
 * We cannot delete wilayas first because visitor_profiles
 * references them with ON DELETE RESTRICT.
 *
 * Therefore:
 * 1. Delete communes.
 * 2. Update existing wilayas.
 * 3. Insert missing wilayas.
 * 4. Delete obsolete wilayas only if they are not referenced.
 * 5. Insert all communes.
 */

sql += "-- Remove existing communes\n";
sql += "DELETE FROM communes;\n\n";

sql += "-- Update existing wilayas\n";

for (const w of wilayas) {
  sql +=
    "UPDATE wilayas SET " +
    "name_ar = " +
    escapeSql(w.nameAr) +
    ", name_fr = " +
    escapeSql(w.nameFr) +
    ", area_type = " +
    escapeSql("urban") +
    " WHERE code = " +
    escapeSql(w.code) +
    ";\n";
}

sql += "\n-- Insert missing wilayas\n";

for (const w of wilayas) {
  sql +=
    "INSERT INTO wilayas (code, name_ar, name_fr, area_type) " +
    "SELECT " +
    escapeSql(w.code) +
    ", " +
    escapeSql(w.nameAr) +
    ", " +
    escapeSql(w.nameFr) +
    ", " +
    escapeSql("urban") +
    " WHERE NOT EXISTS (" +
    "SELECT 1 FROM wilayas WHERE code = " +
    escapeSql(w.code) +
    ");\n";
}

sql += "\n-- Insert all communes\n";

for (const w of wilayas) {
  for (const c of w.communes) {
    sql +=
      "INSERT INTO communes " +
      "(wilaya_id, name_ar, name_fr, population_density) " +
      "SELECT id, " +
      escapeSql(c.nameAr) +
      ", " +
      escapeSql(c.nameFr) +
      ", " +
      escapeSql("medium") +
      " FROM wilayas " +
      "WHERE code = " +
      escapeSql(w.code) +
      ";\n";
  }
}

sql += "\n-- Keep visitor profile connected to its wilaya\n";
sql +=
  "UPDATE visitor_profiles vp " +
  "SET wilaya_name = w.name_ar " +
  "FROM wilayas w " +
  "WHERE vp.wilaya_id = w.id;\n";

sql += "\nCOMMIT;\n";

fs.writeFileSync(
  "backup_before_algeria_fix.sql",
  sql,
  "utf8"
);

console.log("");
console.log("SQL file created successfully.");
console.log("File: backup_before_algeria_fix.sql");
console.log("SQL size:", sql.length, "characters");
