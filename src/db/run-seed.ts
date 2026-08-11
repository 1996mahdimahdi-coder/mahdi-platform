import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { seedDatabase } from "./seed";

seedDatabase()
  .then(() => {
    console.log("SEED FINISHED");
    process.exit(0);
  })
  .catch((error) => {
    console.error("SEED FAILED:", error);
    process.exit(1);
  });