// src/components/StatsCards.jsx
import React from "react";

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      flex: "1",
      minWidth: "140px",
      padding: "14px 0",
      borderRight: "1px solid #ccc",
    }}>
      {/* Label */}
      <div style={{
        fontSize: "10px",
        fontWeight: "bold",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#555",
        marginBottom: "6px",
      }}>
        {label}
      </div>

      {/* Value */}
      <div style={{
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "32px",
        fontWeight: "bold",
        color: accent || "#0a0a0a",
        lineHeight: 1,
        marginBottom: "4px",
      }}>
        {value}
      </div>

      {/* Sub label */}
      {sub && (
        <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const volume = parseFloat(stats.totalVolume).toLocaleString("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  });

  const alertRate = stats.totalTransactions > 0
    ? ((stats.totalAlerts / stats.totalTransactions) * 100).toFixed(1)
    : "0.0";

  return (
    <div style={{
      borderTop: "3px solid #0a0a0a",
      borderBottom: "1px solid #0a0a0a",
      padding: "0 0 4px",
      marginBottom: "20px",
    }}>
      {/* Section label */}
      <div style={{
        fontSize: "10px",
        fontWeight: "bold",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: "4px 0",
        borderBottom: "1px solid #0a0a0a",
        marginBottom: "4px",
      }}>
        Market Summary
      </div>

      {/* Four stat columns */}
      <div style={{ display: "flex", gap: "0" }}>
        <StatCard
          label="Transactions"
          value={stats.totalTransactions}
          sub="total recorded"
        />
        <div style={{ width: "24px" }} />
        <StatCard
          label="Volume"
          value={volume}
          sub="total processed"
        />
        <div style={{ width: "24px" }} />
        <StatCard
          label="Alerts"
          value={stats.totalAlerts}
          sub={alertRate + "% flag rate"}
          accent="#5a3800"
        />
        <div style={{ width: "24px" }} />
        <StatCard
          label="High Risk"
          value={stats.highRiskAlerts}
          sub="require review"
          accent="#8b0000"
        />
      </div>
    </div>
  );
}
