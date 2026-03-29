# 🔍 Fraud Detector Dashboard

A full-stack personal finance transaction monitoring app that automatically detects suspicious activity using rule-based fraud detection.

Built with **React**, **Node.js + Express**, and **PostgreSQL**.

---

## 📸 Features

- **Add transactions** with user ID, amount, category, and description
- **Automatic fraud detection** using 3 simple rules:
  - 🚨 **High Risk** — Transactions over $1,000
  - ⚠️ **Medium Risk** — 3+ transactions within 10 minutes (rapid-fire)
  - ⚠️ **Medium Risk** — Transactions between 1am and 5am (odd hours)
- **Real-time alerts panel** with color-coded risk levels
- **Stats dashboard** showing total transactions, volume, and alert counts
- **Searchable, filterable** transaction table
- **Delete transactions** with cascade removal of linked alerts

---

## 🗂️ Project Structure

```
fraud-detector/
├── backend/
│   ├── server.js          # Express server + all API routes
│   ├── db.js              # PostgreSQL connection
│   ├── fraudDetector.js   # Fraud detection rule engine
│   ├── setup.sql          # Database table setup + sample data
│   ├── .env.example       # Template for your environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx                        # Root component
        ├── index.js                       # React entry point
        ├── api.js                         # All API calls (axios)
        └── components/
            ├── StatsCards.jsx             # Summary metric cards
            ├── AddTransactionForm.jsx     # Form to add transactions
            ├── TransactionTable.jsx       # Filterable transactions table
            └── AlertsPanel.jsx            # Fraud alerts list
```

---

## 🚀 How to Run Locally

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or newer)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or newer)

---

### Step 1 — Set up the database

Open your terminal and create the database:

```bash
psql -U postgres
```

Inside the psql prompt:

```sql
CREATE DATABASE fraud_detector;
\q
```

Now load the tables and sample data:

```bash
psql -U postgres -d fraud_detector -f backend/setup.sql
```

---

### Step 2 — Configure backend environment variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fraud_detector
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=5000
```

---

### Step 3 — Start the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database!
🚀 Server running on http://localhost:5000
```

---

### Step 4 — Start the frontend

Open a **new terminal tab**:

```bash
cd frontend
npm install
npm start
```

The app will open automatically at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a transaction (runs fraud check) |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/alerts` | Get all fraud alerts |
| GET | `/api/stats` | Get summary stats |

---

## 🧪 Testing Fraud Detection

Try these to trigger different alerts:

| Scenario | What to do |
|----------|------------|
| High Risk | Add any transaction with amount > $1,000 |
| Rapid Fire | Add the same user 3+ times in under 10 minutes |
| Odd Hours | Change your system clock to 2am, then add a transaction |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| DB Client | node-postgres (pg) |

---

## 📖 How the Fraud Detection Works

The detection logic lives in `backend/fraudDetector.js`. It checks each new transaction against three simple rules:

```
1. Amount > $1,000        → HIGH risk
2. 3+ transactions in 10 minutes by the same user → MEDIUM risk  
3. Transaction between 1am–5am  → MEDIUM risk
```

If a rule matches, an entry is created in the `alerts` table linking back to the transaction.

---

## 🤝 Contributing

Pull requests are welcome! To add a new fraud detection rule:

1. Open `backend/fraudDetector.js`
2. Add your rule inside the `analyzeTransaction` function
3. Follow the same pattern as existing rules (check condition → return `{ riskLevel, reason }`)

---

## 📄 License

MIT
