// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { getTransactions, getAlerts, getStats } from "./api";
import StatsCards from "./components/StatsCards";
import AddTransactionForm from "./components/AddTransactionForm";
import TransactionTable from "./components/TransactionTable";
import AlertsPanel from "./components/AlertsPanel";

// Global styles — classic newspaper
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --paper:  #ffffff;
    --ink:    #0a0a0a;
    --muted:  #555555;
    --light:  #999999;
    --rule:   #0a0a0a;
    --danger: #8b0000;
    --warn:   #5a3800;
    --ok:     #1a3a1a;
    --serif:  'Times New Roman', Times, Georgia, serif;
  }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--serif);
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  input, select, button, textarea {
    font-family: var(--serif);
  }

  input::placeholder { color: var(--light); }
  select option { background: var(--paper); color: var(--ink); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--paper); }
  ::-webkit-scrollbar-thumb { background: #ccc; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .fade-in { animation: fadeIn 0.3s ease forwards; }

  /* Thin horizontal rule used throughout */
  .rule-thick { border: none; border-top: 3px solid var(--ink); margin: 0; }
  .rule-thin  { border: none; border-top: 1px solid var(--ink); margin: 0; }
  .rule-dot   { border: none; border-top: 1px dotted #aaa; margin: 0; }
`;
document.head.appendChild(style);

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts]             = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [updatedAt, setUpdatedAt]       = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [txRes, alertsRes, statsRes] = await Promise.all([
        getTransactions(),
        getAlerts(),
        getStats(),
      ]);
      setTransactions(txRes.data);
      setAlerts(alertsRes.data);
      setStats(statsRes.data);
      setUpdatedAt(new Date().toLocaleTimeString("en-US", { hour12: true }));
    } catch {
      setError("Cannot reach backend. Ensure the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>

      {/* ── Masthead ───────────────────────────────────────────── */}
      <header style={{ borderBottom: "3px solid var(--ink)", padding: "0 32px" }}>

        {/* Top dateline bar */}
        <div style={{
          borderBottom: "1px solid var(--ink)",
          padding: "6px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}>
          <span>Personal Finance Monitor</span>
          <span style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {updatedAt && <span>Last updated: {updatedAt}</span>}
            <button
              onClick={fetchAll}
              style={{
                background: "none",
                border: "1px solid var(--ink)",
                color: "var(--ink)",
                padding: "2px 10px",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--serif)",
              }}
            >
              Refresh
            </button>
          </span>
        </div>

        {/* Publication title */}
        <div style={{ textAlign: "center", padding: "18px 0 14px" }}>
          <h1 style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "48px",
            fontWeight: "bold",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "var(--ink)",
          }}>
            Transaction Monitor
          </h1>
          <div style={{
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginTop: "6px",
            fontStyle: "italic",
          }}>
            Fraud Detection &amp; Alert Intelligence
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 40px" }}>

        {/* Error banner */}
        {error && (
          <div style={{
            borderBottom: "1px solid var(--danger)",
            borderTop: "1px solid var(--danger)",
            padding: "10px 0",
            margin: "16px 0",
            color: "var(--danger)",
            fontSize: "13px",
            textAlign: "center",
            fontStyle: "italic",
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{
            padding: "80px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontStyle: "italic",
            fontSize: "16px",
          }}>
            Loading the latest data...
          </div>
        ) : (
          <div className="fade-in">

            {/* Stats row */}
            <StatsCards stats={stats} />

            {/* Section divider */}
            <div style={{
              borderTop: "3px solid var(--ink)",
              borderBottom: "1px solid var(--ink)",
              padding: "4px 0",
              margin: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <span style={{
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                File a Transaction
              </span>
            </div>

            <AddTransactionForm onTransactionAdded={fetchAll} />

            {/* Two-column layout */}
            <div style={{
              borderTop: "3px solid var(--ink)",
              borderBottom: "1px solid var(--ink)",
              padding: "4px 0",
              margin: "24px 0 0",
              display: "flex",
              gap: "12px",
            }}>
              <span style={{
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Transaction Ledger
              </span>
              <span style={{ borderLeft: "1px solid var(--ink)", paddingLeft: "12px",
                fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--muted)",
              }}>
                Active Alerts
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "0",
              borderLeft: "none",
            }}>
              <div style={{ borderRight: "1px solid var(--ink)", paddingRight: "24px" }}>
                <TransactionTable transactions={transactions} onRefresh={fetchAll} />
              </div>
              <div style={{ paddingLeft: "24px" }}>
                <AlertsPanel alerts={alerts} />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "3px solid var(--ink)",
        padding: "12px 32px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        color: "var(--muted)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        <span>Personal Finance Fraud Detector</span>
        <span>React &mdash; Node.js &mdash; PostgreSQL</span>
      </footer>
    </div>
  );
}
