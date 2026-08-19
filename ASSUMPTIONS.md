# Product & Engineering Assumptions — Spendly

This document records the key product assumptions and interpretations made while building the Spendly full-stack dashboard.

---

## 1. Financial & Analytics Assumptions

### 1.1 "Total Spending" Definition
- **Assumption**: Only transactions with `status === "SUCCESS"` count towards the user's "Total Spending" figure, monthly spending trends, and category breakdown.
- **Rationale**: In credit-card and banking apps, declined or failed payments do not settle and do not deduct funds. Showing failed transactions in total spending would inflate the user's real expenditure.
- **Handling**: Failed payments are tracked separately in their own KPI card ("Failed Payments") and status filters.

### 1.2 Reward Coin Accrual Rate & Rules
- **Assumption**: Reward coins are awarded strictly for `SUCCESS` transactions at the rate of **1 coin per ₹100 spent** (`Math.floor(amount / 100)`).
- **Initial State**: The demo user starts with **2,450 Spendly Coins** to allow testing redemption flows immediately.

### 1.3 Currency Formatting
- **Assumption**: The app uses the Indian Rupee (`₹` / INR) with Indian numbering convention (`₹1,24,560.00`) across all metric cards, table amounts, and vouchers.

---

## 2. Data Hygiene & Dataset Assumptions

### 2.1 Handling Anomalies in `Transactions_.json`
During data profiling of the 10,000 raw transaction records, several data anomalies were discovered:
1. **Duplicate IDs**: 40 duplicate transaction IDs were detected.
   - *Resolution*: The seed script deduplicates records on primary key `id` so database integrity is preserved.
2. **Missing Categories**: 200 records lacked a category or had `null`.
   - *Resolution*: Defaulted to `"Other"` so category grouping and charts remain complete without crashing.
3. **Mixed Timestamp Formats**: Timestamps appeared in ISO 8601 (`2025-10-03T21:03:27Z`), epoch milliseconds (`1768265109000`), and slash format (`12/10/2025 16:24:49`).
   - *Resolution*: Flexible multi-pattern datetime parser normalizes all inputs into UTC `datetime` objects.
4. **Negative Amounts**: Any negative values (e.g. refunds) are normalized via `abs()` to satisfy non-negative column constraints.

---

## 3. Rewards & Redemption Flow

### 3.1 Voucher Structure
- **Assumption**: A realistic 5-voucher catalog was designed spanning diverse everyday spending categories:
  - `rew_1`: ₹250 Shopping Voucher (500 coins)
  - `rew_2`: ₹500 Food Voucher (900 coins)
  - `rew_3`: ₹100 Instant Cashback (300 coins)
  - `rew_4`: ₹200 Entertainment Voucher (400 coins)
  - `rew_5`: ₹500 Travel Voucher (1,000 coins)

### 3.2 Atomicity & Failure Rollback
- **Assumption**: Coin balance deductions are handled inside an atomic database transaction with row-level locking (`with_for_update()`). If the backend rejects a redemption (e.g. insufficient funds), the frontend rolls back the optimistic balance and displays an informative error notification.

---

## 4. User Model & Multi-Tenancy

- **Assumption**: Single authenticated user session (Demo User: Saloni, User ID `1`). When real auth (OAuth2/JWT) is introduced, the backend services already accept `user_id` as a parameter.
