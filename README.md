# SPENDLY — "Your money, understood."

Full-Stack Credit Card Spending Tracker & Rewards Platform built for the **Digital Alpha Technologies Full Stack Engineer Take-Home Assignment**.

---

## 🚀 Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS design tokens + Tailwind CSS v4, Recharts, Lucide Icons
- **Backend**: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn
- **Database**: PostgreSQL (with SQLAlchemy ORM, indexed queries, check constraints, and connection pooling)

---

## ⚡ Quick Start (< 5 minutes)

### 1. Clone & Database Setup

```bash
git clone <your-repo-url>
cd credit-card-dashboard
```

Create `backend/.env` (or copy from `backend/.env.example`):
```env
# PostgreSQL connection string:
DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/spendly

# Frontend CORS URL:
FRONTEND_URL=http://localhost:3000
```

### 2. Seed Database (One-Command)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate          # Windows PowerShell
pip install -r requirements.txt
python seed.py
```
> **What this does**: Automatically creates tables, indexes, constraints, seeds the demo user with 2,450 coins, adds the 5-tier voucher catalog, and batch-loads all 10,000 transactions from `Transactions_.json`.

### 3. Start Backend

```bash
# Inside backend/ with venv activated:
uvicorn app.main:app --reload --port 8000
```
- API Docs (Swagger): [`http://localhost:8000/docs`](http://localhost:8000/docs)

### 4. Start Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [`http://localhost:3000`](http://localhost:3000)

---

## 📊 Features & Deliverables

### 1. Transactions Ledger & Dashboard (`/dashboard`)
- **Hand-Built Native Table**: Created without component libraries (no MUI, Ant, Chakra, or shadcn table).
- **Sticky Header & Custom Scroll**: Sticks neatly during long scrolling across 10,000 records.
- **Multi-Filter Suite**: Merchant name real-time search, category dropdown, payment status selector, and min/max amount range.
- **Sorting & Pagination**: 4-way sort (Date Newest/Oldest, Amount High/Low), 25 rows/page with clear counter pagination.
- **Interactive Spend Analytics**:
  - *Where your money goes*: Donut chart showing category breakdown. Clicking any slice instantly filters the transactions table.
  - *Monthly spending*: Responsive Area chart tracking settled spending over time.
- **Transaction Details Drawer**: Custom accessible slide-in drawer (Escape to close, Portal mounted) showing full settlement breakdown, copyable ID, and verification badge.

### 2. Rewards Store & Redemption Hub (`/rewards`)
- **Visible Coin Accrual**: Dedicated glowing header coin pill and overview balance card showing 1 coin earned per ₹100 spent on success.
- **5-Tier Rewards Catalog**: Shopping, Food, Cashback, Entertainment, and Travel vouchers with affordability indicators.
- **Atomic Redemption Flow**: Modal confirmation showing before/after balance calculation, voucher code generator, and backend rejection on insufficient funds.

---

## 📋 Status & Honest Assessment

### Done ✅
- [x] Hand-built custom responsive table with full state management
- [x] Multi-filter combinable search (category, status, min/max amount, merchant)
- [x] Sorting by date and amount + client/server pagination
- [x] Category donut chart with slice click-to-filter interaction
- [x] Monthly spending area trend chart
- [x] Full rewards catalog & atomic redeem flow with balance rollback on failure
- [x] Transaction details drawer with portal & accessible keyboard dismiss
- [x] Bespoke fintech design system & vector SVG monogram logo
- [x] Clean 3-tier backend architecture (routers → services → models)
- [x] One-command database setup and seed script (`python seed.py`)
- [x] Comprehensive documentation (`ASSUMPTIONS.md`, `DECISIONS.md`, `AI-USAGE.md`)

### Known Limitations / Future Work ⏳
- **Calendar Date Picker**: Currently filters by category, status, merchant, and min/max amount; full calendar UI picker can be integrated next.
- **Two-Way Cross-Filtering**: Donut chart slice clicks filter the table; full two-way table-to-chart filter recalculation is planned.

---

## 📂 Project Structure

```
credit-card-dashboard/
├── backend/
│   ├── app/
│   │   ├── models/           # SQLAlchemy models (User, Transaction, Reward, Redemption)
│   │   ├── routers/          # FastAPI routers (/transactions, /analytics, /rewards)
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic & aggregation queries
│   │   ├── config.py         # App settings & env loading
│   │   ├── database.py       # Engine & sessionmaker
│   │   └── main.py           # FastAPI factory & CORS
│   ├── seed.py               # One-command DB migration & JSON seeder
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router (layout, dashboard, rewards)
│   │   ├── components/
│   │   │   ├── ui/           # Custom primitives (Button, Card, Badge, Drawer, Modal, Select)
│   │   │   ├── layout/       # Header, AppShell, MobileNavigation
│   │   │   ├── dashboard/    # SummaryCards, SpendingByCategory, MonthlySpending
│   │   │   ├── transactions/ # TransactionTable, TransactionFilters, TransactionDetails
│   │   │   └── rewards/      # RewardBalance, RewardsGrid, RedeemModal
│   │   ├── context/          # RewardContext (live balance state)
│   │   └── lib/              # API client & formatters
│   └── package.json
├── Transactions_.json        # 10,000 transaction dataset
├── README.md
├── ASSUMPTIONS.md
├── DECISIONS.md
└── AI-USAGE.md
```
