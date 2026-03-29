// src/components/TransactionTable.jsx
import React, { useState } from "react";
import { deleteTransaction } from "../api";

function fmt(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

function fmtDate(str) {
  return new Date(str).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

const serif = "'Times New Roman', Times, serif";

export default function TransactionTable({ transactions, onRefresh }) {
  const [search, setSearch]         = useState("");
  const [filterUser, setFilterUser] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const users = ["All", ...new Set(transactions.map(t => t.user_id))];

  const filtered = transactions.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || t.user_id.includes(q)
      || t.category.toLowerCase().includes(q)
      || (t.description || "").toLowerCase().includes(q);
    const matchUser = filterUser === "All" || t.user_id === filterUser;
    return matchSearch && matchUser;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this transaction from the ledger?")) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      onRefresh();
    } catch {
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const thStyle = {
    padding: "6px 8px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#0a0a0a",
    borderBottom: "2px solid #0a0a0a",
    fontFamily: serif,
    background: "#ffffff",
  };

  const tdStyle = {
    padding: "7px 8px",
    fontSize: "13px",
    borderBottom: "1px solid #ddd",
    color: "#0a0a0a",
    fontFamily: serif,
    verticalAlign: "middle",
  };

  const inputStyle = {
    background: "#ffffff",
    border: "none",
    borderBottom: "1px solid #0a0a0a",
    color: "#0a0a0a",
    padding: "4px 0",
    fontSize: "13px",
    fontFamily: serif,
    outline: "none",
  };

  return (
    <div style={{ paddingTop: "12px" }}>
      {/* Filter row */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "12px",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", fontFamily: serif }}>
            Search
          </label>
          <input
            type="text"
            placeholder="user, category, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "200px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <label style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", fontFamily: serif }}>
            User
          </label>
          <select
            value={filterUser}
            onChange={e => setFilterUser(e.target.value)}
            style={inputStyle}
          >
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div style={{ marginLeft: "auto", fontSize: "12px", color: "#888", fontStyle: "italic", fontFamily: serif }}>
          {filtered.length} of {transactions.length} entries
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: serif }}>
          <thead>
            <tr>
              <th style={thStyle}>No.</th>
              <th style={thStyle}>User</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ ...tdStyle, textAlign: "center", fontStyle: "italic", color: "#888", padding: "24px" }}>
                  No transactions found.
                </td>
              </tr>
            ) : filtered.map((t) => (
              <tr
                key={t.id}
                onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
                onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}
              >
                <td style={{ ...tdStyle, color: "#aaa", fontSize: "11px" }}>{t.id}</td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: "bold", fontSize: "12px" }}>{t.user_id}</span>
                </td>
                <td style={{
                  ...tdStyle,
                  textAlign: "right",
                  fontWeight: parseFloat(t.amount) >= 1000 ? "bold" : "normal",
                  color: parseFloat(t.amount) >= 1000 ? "#8b0000" : "#0a0a0a",
                }}>
                  {fmt(t.amount)}
                </td>
                <td style={tdStyle}>{t.category}</td>
                <td style={{ ...tdStyle, color: "#555", fontStyle: "italic" }}>{t.description || "—"}</td>
                <td style={{ ...tdStyle, color: "#888", fontSize: "12px", whiteSpace: "nowrap" }}>{fmtDate(t.created_at)}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#aaa",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontFamily: serif,
                      textDecoration: "underline",
                      padding: 0,
                    }}
                    onMouseEnter={e => e.target.style.color = "#8b0000"}
                    onMouseLeave={e => e.target.style.color = "#aaa"}
                  >
                    {deletingId === t.id ? "..." : "remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
