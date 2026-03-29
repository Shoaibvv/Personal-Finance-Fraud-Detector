// src/components/AddTransactionForm.jsx
import React, { useState } from "react";
import { addTransaction } from "../api";

const CATEGORIES = ["Food", "Shopping", "Travel", "Health", "Utilities", "Transfer", "Entertainment", "Other"];

const inputStyle = {
  width: "100%",
  background: "#ffffff",
  border: "none",
  borderBottom: "1px solid #0a0a0a",
  color: "#0a0a0a",
  padding: "6px 0",
  fontSize: "14px",
  fontFamily: "'Times New Roman', Times, serif",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#555",
  marginBottom: "4px",
  fontFamily: "'Times New Roman', Times, serif",
};

export default function AddTransactionForm({ onTransactionAdded }) {
  const [userId, setUserId]           = useState("user_1");
  const [amount, setAmount]           = useState("");
  const [category, setCategory]       = useState("Food");
  const [description, setDescription] = useState("");
  const [loading, setLoading]         = useState(false);
  const [feedback, setFeedback]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await addTransaction({
        user_id: userId,
        amount: parseFloat(amount),
        category,
        description,
      });

      const { alert } = res.data;

      if (alert) {
        setFeedback({
          type: alert.riskLevel === "HIGH" ? "high" : "medium",
          text: alert.riskLevel + " risk detected — " + alert.reason,
        });
      } else {
        setFeedback({ type: "ok", text: "Transaction recorded. No suspicious activity detected." });
      }

      setAmount("");
      setDescription("");
      onTransactionAdded();
    } catch {
      setFeedback({ type: "err", text: "Request failed. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  };

  const feedbackColor = {
    high:   "#8b0000",
    medium: "#5a3800",
    ok:     "#1a3a1a",
    err:    "#8b0000",
  };

  return (
    <div style={{ marginBottom: "0", paddingBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "20px",
          marginBottom: "16px",
        }}>
          {/* User */}
          <div>
            <label style={labelStyle}>User ID</label>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              style={inputStyle}
            >
              {["user_1","user_2","user_3","user_4","user_5","user_6"].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label style={labelStyle}>Amount (USD)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={inputStyle}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              placeholder="optional"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#eee" : "#0a0a0a",
            color: loading ? "#888" : "#ffffff",
            border: "none",
            padding: "8px 24px",
            fontSize: "11px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          {loading ? "Filing..." : "File Transaction"}
        </button>
      </form>

      {/* Feedback */}
      {feedback && (
        <div style={{
          marginTop: "12px",
          borderLeft: "3px solid " + feedbackColor[feedback.type],
          paddingLeft: "10px",
          color: feedbackColor[feedback.type],
          fontSize: "13px",
          fontStyle: "italic",
        }}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
