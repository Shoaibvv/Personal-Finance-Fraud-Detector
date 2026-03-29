// src/api.js
// All our API calls live here in one place.
// This way, if the backend URL changes, we only update it once.

import axios from "axios";

// The base URL of our backend server
const API_BASE = "http://localhost:5000/api";

// ── Transactions ──────────────────────────────
// Get all transactions
export const getTransactions = () => axios.get(`${API_BASE}/transactions`);

// Add a new transaction
export const addTransaction = (data) => axios.post(`${API_BASE}/transactions`, data);

// Delete a transaction by ID
export const deleteTransaction = (id) => axios.delete(`${API_BASE}/transactions/${id}`);

// ── Alerts ────────────────────────────────────
// Get all fraud alerts
export const getAlerts = () => axios.get(`${API_BASE}/alerts`);

// ── Stats ─────────────────────────────────────
// Get summary stats for dashboard cards
export const getStats = () => axios.get(`${API_BASE}/stats`);
