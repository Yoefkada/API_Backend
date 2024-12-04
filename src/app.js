const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, param, query, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.use(express.json());


require("dotenv").config();



app.use(express.json());

// Example endpoint to test environment variables
app.get("/config", (req, res) => {
  res.json({
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
  });
});

// Import the routes
const notesRoutes = require("./routes/notes");
app.use("/api", notesRoutes);  // Example route prefix

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
