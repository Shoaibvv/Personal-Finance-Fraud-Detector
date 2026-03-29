// fraudDetector.js
// This is the "brain" of the app — it decides if a transaction is suspicious.
// We use simple rules that are easy to understand and explain in interviews.

// ─────────────────────────────────────────────────────────────────
// RULE THRESHOLDS
// Change these numbers to adjust how sensitive the detection is.
// ─────────────────────────────────────────────────────────────────
const LARGE_AMOUNT_THRESHOLD = 1000;    // flag if over $1,000
const RAPID_FIRE_COUNT = 3;             // flag if 3+ transactions...
const RAPID_FIRE_MINUTES = 10;          // ...within 10 minutes
const ODD_HOURS_START = 1;             // flag if between 1am...
const ODD_HOURS_END = 5;               // ...and 5am

/**
 * analyzeTransaction
 *
 * Checks a single transaction against all our fraud rules.
 * Returns an object with a risk level and the reason it was flagged.
 *
 * @param {Object} transaction - the transaction to check
 * @param {Array}  recentTransactions - other recent transactions by the same user
 * @returns {Object|null} - { riskLevel, reason } or null if not suspicious
 */
function analyzeTransaction(transaction, recentTransactions = []) {
  const { amount, created_at } = transaction;

  // ── RULE 1: Large Amount ──────────────────────────────────────
  // If the transaction amount is over our threshold, flag it as HIGH risk.
  if (parseFloat(amount) >= LARGE_AMOUNT_THRESHOLD) {
    return {
      riskLevel: "HIGH",
      reason: `Large transaction: $${parseFloat(amount).toFixed(2)} exceeds $${LARGE_AMOUNT_THRESHOLD} threshold`,
    };
  }

  // ── RULE 2: Rapid-Fire Transactions ───────────────────────────
  // Count how many transactions this user made in the last 10 minutes.
  // If it's 3 or more (including this one), flag as MEDIUM risk.
  const transactionTime = new Date(created_at);
  const tenMinutesAgo = new Date(transactionTime.getTime() - RAPID_FIRE_MINUTES * 60 * 1000);

  const recentCount = recentTransactions.filter((t) => {
    const tTime = new Date(t.created_at);
    return tTime >= tenMinutesAgo && tTime <= transactionTime;
  }).length;

  if (recentCount >= RAPID_FIRE_COUNT) {
    return {
      riskLevel: "MEDIUM",
      reason: `Rapid transactions: ${recentCount} transactions within ${RAPID_FIRE_MINUTES} minutes`,
    };
  }

  // ── RULE 3: Odd Hours ─────────────────────────────────────────
  // Transactions between 1am and 5am are unusual. Flag as MEDIUM risk.
  const hour = transactionTime.getHours();
  if (hour >= ODD_HOURS_START && hour < ODD_HOURS_END) {
    return {
      riskLevel: "MEDIUM",
      reason: `Odd-hours transaction at ${transactionTime.toLocaleTimeString()} (between ${ODD_HOURS_START}am–${ODD_HOURS_END}am)`,
    };
  }

  // No rules triggered — transaction looks normal
  return null;
}

/**
 * getRiskBadgeColor
 * Simple helper to convert risk level to a color label for the frontend.
 */
function getRiskBadgeColor(riskLevel) {
  const colors = {
    HIGH: "red",
    MEDIUM: "orange",
    LOW: "green",
  };
  return colors[riskLevel] || "gray";
}

module.exports = { analyzeTransaction, getRiskBadgeColor };
