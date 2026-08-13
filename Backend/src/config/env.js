function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL || "";
  if (!url) return false;
  if (url.includes("username:password")) return false;
  if (url.includes("YOUR_PASSWORD")) return false;
  return true;
}

module.exports = { isDatabaseConfigured };
