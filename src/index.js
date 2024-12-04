// Load environment variables from .env
require("dotenv").config();

// Access environment variables
const databaseUrl = process.env.DATABASE_URL;
const smtpHost = process.env.SMTP_HOST;

console.log("Database URL:", databaseUrl);
console.log("SMTP Host:", smtpHost);
