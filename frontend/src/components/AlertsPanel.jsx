// src/components/AlertsPanel.jsx
import React from "react";

function fmtDate(str) {
  return new Date(str).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function fmtAmt(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  });
}

const serif = "'Times New Roman', Times, serif";

function riskStyle(level) {
  if (level === "HIGH")   return { color: "#8b0000", label: "High Risk"   };
  if (level === "MEDIUM") return { color: "#5a3800", label: "Medium Risk" };
  return                         { color: "#1a3a1a", label: "Low Risk"    };
}

export default function AlertsPanel({ alerts }) {
  return (
    <div style={{ paddingTop: "12px" }}>

      {/* Alert count headline */}
      <div style={{
        fontFamily: serif,
        fontSize: "13px",
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#555",
        marginBottom: "12px",
        borderBottom: "1px solid #ddd",
        paddingBottom: "8px",
      }}>
        {alerts.length === 0
          ? "No alerts on record."
          : alerts.length + " alert" + (alerts.length !== 1 ? "s" : "") + " filed"}
      </div>

      {alerts.length === 0 ? (
        <p style={{
          fontFamily: serif,
          fontStyle: "italic",
          color: "#aaa",
          fontSize: "13px",
          lineHeight: 1.6,
        }}>
          No suspicious activity detected. Add a transaction over $1,000 to trigger an alert.
        </p>
      ) : (
        <div>
          {alerts.map(alert => {
            const rs = riskStyle(alert.risk_level);
            return (
              <div
                key={alert.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "12px",
                  marginBottom: "12px",
                }}
              >
                {/* Risk level label */}
                <div style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: rs.color,
                  marginBottom: "4px",
                  fontFamily: serif,
                }}>
                  {rs.label}
                </div>

                {/* User + amount headline */}
                <div style={{
                  fontFamily: serif,
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#0a0a0a",
                  marginBottom: "3px",
                  lineHeight: 1.3,
                }}>
                  {alert.user_id} &mdash; {fmtAmt(alert.amount)}
                </div>

                {/* Category */}
                <div style={{
                  fontFamily: serif,
                  fontSize: "12px",
                  color: "#555",
                  fontStyle: "italic",
                  marginBottom: "5px",
                }}>
                  {alert.category}
                </div>

                {/* Reason — editorial body text style */}
                <div style={{
                  fontFamily: serif,
                  fontSize: "13px",
                  color: "#0a0a0a",
                  lineHeight: 1.5,
                  marginBottom: "5px",
                }}>
                  {alert.reason}
                </div>

                {/* Timestamp byline */}
                <div style={{
                  fontFamily: serif,
                  fontSize: "11px",
                  color: "#aaa",
                  fontStyle: "italic",
                }}>
                  Filed {fmtDate(alert.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
