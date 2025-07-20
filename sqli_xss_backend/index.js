require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const puppeteer = require("puppeteer");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:6841",
      "https://*.vercel.app",
      "https://vercel.app",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 1314;
const BASE_URL = process.env.BASE_URL || `http://${HOST}:${PORT}`;

const client = new Client({
  host: process.env.SUPABASE_HOST,
  port: 6543,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

client.connect();

// login interface (vulnerable to SQL injection)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("executed SQL:", sql);

  try {
    const result = await client.query(sql);
    console.log("Query result:", result.rows);

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "No matching user found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("database error");
  }
});

app.post("/query-grade", async (req, res) => {
  const { key } = req.body;

  // WAF: block common SQL keywords
  const wafKeywords = [
    "SELECT",
    "FROM",
    "UNION",
    "WHERE",
    "OR",
    "AND",
    "JOIN",
    "FLAG",
    "select",
    "from",
    "union",
    "where",
    "or",
    "and",
    "join",
    "flag",
  ];
  const wafPattern = new RegExp(`\\b(${wafKeywords.join("|")})\\b`);

  if (wafPattern.test(key) || key.includes(" ")) {
    return res.status(400).json({ error: "Forbidden keyword or space detected" });
  }

  // Intentionally NOT parameterized (vulnerable to SQLi)
  const sql = `SELECT id, grade FROM users WHERE key = '${key}'`;

  console.log("executed SQL:", sql);

  try {
    const result = await client.query(sql);
    return res.json({ data: result.rows });
  } catch (err) {
    return res.status(400).json({ error: "Query failed" });
  }
});

// ------------------------------------------------------------------------------------------------
// XSS Challenge - Message Board APIs
app.post("/submit-message", async (req, res) => {
  const { name, message } = req.body;

  // Intentionally vulnerable - no input sanitization
  const sql = `INSERT INTO messages (name, message, created_at) VALUES ($1, $2, NOW())`;

  console.log("Submitting message:", { name, message });

  try {
    const result = await client.query(sql, [name, message]);
    res.json({ success: true, message: "Message submitted successfully!" });
  } catch (err) {
    console.error("Error submitting message:", err);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

app.get("/get-messages", async (req, res) => {
  const sql = `SELECT id, name, message, created_at FROM messages ORDER BY created_at DESC`;

  try {
    const result = await client.query(sql);
    // Intentionally return raw data without any HTML encoding
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.delete("/delete-messages", async (req, res) => {
  const sql = `DELETE FROM messages`;
  try {
    await client.query(sql);
    res.json({ success: true, message: "Messages deleted successfully" });
  } catch (err) {
    console.error("Error deleting messages:", err);
    res.status(500).json({ error: "Failed to delete messages" });
  }
});

// Simulate admin viewing
app.get("/admin/messages/:id", async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT id, name, message, created_at FROM messages WHERE id = ${id}`;

  try {
    const result = await client.query(sql);

    res.cookie("adminFlag", "CUINSPACE{yoU_ARe_GEnius}", {
      httpOnly: false, // so it can be accessed by JavaScript
      secure: false, // should be true if https
      sameSite: "lax", // More secure than 'none' but less strict than 'strict' which blocks all cross-site requests
    });

    // Return a simple HTML page, directly inserting the message (vulnerable to XSS)
    const message = result.rows.length > 0 ? result.rows[0].message : "No message found";
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Message View</title>
      </head>
      <body>
        <h1>Hi, admin. Please view the message below:</h1>
        <div>${message}</div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error fetching admin messages:", err);
    res.status(500).send("Failed to fetch messages");
  }
});

app.post("/report-message", async (req, res) => {
  const { messageId, reason } = req.body;

  console.log(`Message ${messageId} reported for: ${reason}`);

  res.json({
    success: true,
    message: "Message reported successfully. An admin will review it shortly.",
  });

  // Simulate admin viewing with real browser
  setTimeout(async () => {
    try {
      console.log(`Admin bot is reviewing message ${messageId}...`);

      // Launch headless browser to simulate admin viewing
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // local path to chrome
      });
      const page = await browser.newPage();

      await page.goto(`${BASE_URL}/admin/messages/${messageId}`);

      await page.evaluate(() => {
        document.cookie = "adminSession=admin_session_token";
      });

      // Wait for any scripts to execute
      await new Promise((resolve) => setTimeout(resolve, 10000));

      console.log("Admin bot finished reviewing messages");

      await browser.close();
    } catch (err) {
      console.error("Admin bot error:", err);
    }
  }, 2000);
});

app.listen(PORT, HOST, () => {
  console.log(`backend API running at ${BASE_URL}`);
});
