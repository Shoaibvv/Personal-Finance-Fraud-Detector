// server.js
// The main entry point for our backend.
// This file sets up Express and defines all our API routes.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const { analyzeTransaction } = require("./fraudDetector");

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// MIDDLEWARE
// These run on every request before hitting our routes.
// ─────────────────────────────────────────────

// cors() lets our React app (on port 3000) talk to this server (on port 5000).
// Without this, the browser blocks cross-origin requests.
app.use(cors());

// express.json() lets us read JSON data sent in request bodies (for POST requests).
app.use(express.json());

// ─────────────────────────────────────────────
// ROUTE 1: GET /api/transactions
// Returns all transactions, newest first.
// ─────────────────────────────────────────────
app.get("/api/transactions", async (req, res) => {
  try {
    // SQL: select all columns from transactions, order by newest first
    const result = await db.query(
      "SELECT * FROM transactions ORDER BY created_at DESC"
    );

    res.json(result.rows); // send the rows as JSON back to React
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// ─────────────────────────────────────────────
// ROUTE 2: POST /api/transactions
// Adds a new transaction, then runs fraud detection on it.
// ─────────────────────────────────────────────
app.post("/api/transactions", async (req, res) => {
  // Pull the fields out of the request body
  const { user_id, amount, category, description } = req.body;

  // Basic validation — make sure required fields are present
  if (!user_id || !amount || !category) {
    return res.status(400).json({ error: "user_id, amount, and category are required" });
  }

  try {
    // Step 1: Insert the new transaction into the database
    const insertResult = await db.query(
      `INSERT INTO transactions (user_id, amount, category, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, amount, category, description]
    );

    const newTransaction = insertResult.rows[0];

    // Step 2: Get recent transactions by the same user (for rapid-fire check)
    const recentResult = await db.query(
      `SELECT * FROM transactions
       WHERE user_id = $1
         AND id != $2
         AND created_at >= NOW() - INTERVAL '10 minutes'`,
      [user_id, newTransaction.id]
    );

    // Step 3: Run fraud detection
    const fraudResult = analyzeTransaction(newTransaction, recentResult.rows);

    // Step 4: If suspicious, save an alert to the alerts table
    if (fraudResult) {
      await db.query(
        `INSERT INTO alerts (transaction_id, risk_level, reason)
         VALUES ($1, $2, $3)`,
        [newTransaction.id, fraudResult.riskLevel, fraudResult.reason]
      );
    }

    // Return the new transaction (and alert info if flagged)
    res.status(201).json({
      transaction: newTransaction,
      alert: fraudResult || null,
    });
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// ─────────────────────────────────────────────
// ROUTE 3: GET /api/alerts
// Returns all alerts with the linked transaction details.
// ─────────────────────────────────────────────
app.get("/api/alerts", async (req, res) => {
  try {
    // SQL JOIN: combine alerts with their transaction info
    const result = await db.query(
      `SELECT
         alerts.id,
         alerts.risk_level,
         alerts.reason,
         alerts.created_at,
         transactions.user_id,
         transactions.amount,
         transactions.category,
         transactions.description
       FROM alerts
       JOIN transactions ON alerts.transaction_id = transactions.id
       ORDER BY alerts.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching alerts:", error.message);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// ─────────────────────────────────────────────
// ROUTE 4: GET /api/stats
// Returns summary numbers for the dashboard cards.
// ─────────────────────────────────────────────
app.get("/api/stats", async (req, res) => {
  try {
    // Run multiple queries at the same time using Promise.all (faster than one-by-one)
    const [totalTx, totalAlerts, highRisk, totalVolume] = await Promise.all([
      db.query("SELECT COUNT(*) FROM transactions"),
      db.query("SELECT COUNT(*) FROM alerts"),
      db.query("SELECT COUNT(*) FROM alerts WHERE risk_level = 'HIGH'"),
      db.query("SELECT COALESCE(SUM(amount), 0) AS total FROM transactions"),
    ]);

    res.json({
      totalTransactions: parseInt(totalTx.rows[0].count),
      totalAlerts: parseInt(totalAlerts.rows[0].count),
      highRiskAlerts: parseInt(highRisk.rows[0].count),
      totalVolume: parseFloat(totalVolume.rows[0].total),
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─────────────────────────────────────────────
// ROUTE 5: DELETE /api/transactions/:id
// Deletes a transaction (and its alerts via CASCADE).
// ─────────────────────────────────────────────
app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM transactions WHERE id = $1", [id]);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

// ─────────────────────────────────────────────
// START THE SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
