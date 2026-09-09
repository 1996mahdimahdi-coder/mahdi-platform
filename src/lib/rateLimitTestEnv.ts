// Test-only module. Loaded FIRST by tests that import @/lib/rateLimit (whose
// module graph pulls in @/db, which throws when DATABASE_URL is unset).
//
// - Loads dotenv from the workspace root if a .env exists.
// - Guarantees DATABASE_URL is present so the module graph loads everywhere;
//   when no real database is reachable the integration tests skip themselves
//   (connection is refused instantly on 127.0.0.1:1, no timeout wait).
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Next.js convention: `.env.local` overrides `.env` and is not committed.
// Prefer it so the integration tests exercise the real local database just
// like the running app. A machine without the file still works: the tests
// self-skip when the database is unreachable.
if (existsSync(resolve(".env.local"))) {
  loadEnv({ path: resolve(".env.local"), override: false });
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgres://nobody:noop@127.0.0.1:1/none";
}