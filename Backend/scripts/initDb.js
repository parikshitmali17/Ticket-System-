require("dotenv").config();

const { connectDB, closeDB } = require("../src/config/db");

async function main() {
  try {
    await connectDB();
    console.log("Database initialization complete.");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exitCode = 1;
  } finally {
    await closeDB().catch(() => {});
  }
}

main();
