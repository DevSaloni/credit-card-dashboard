# AI Usage Disclosure — Spendly

In accordance with the assignment guidelines, this document details how AI assistance was leveraged during development, along with specific examples of flawed AI output that were identified, discarded, or refactored.

---

## 1. Tools & Areas of Usage

| Tool | Usage Area | Purpose |
| :--- | :--- | :--- |
| **Antigravity AI / Claude / Gemini** | Full-Stack Architecture | Scaffolding TypeScript types, design token variables, FastAPI schemas, and initial component layout |
| **Recharts / Lucide Docs** | Data Visualization | Syntax reference for responsive pie/area charts and iconography |

---

## 2. Flawed AI Output: Examples & Fixes

### Example 1: CSS Containing Block Trap in Fixed Drawer
- **Initial AI Output**: The AI generated a sliding drawer using standard CSS `position: fixed; inset: 0;` inside the page hierarchy, combined with an entry animation `.animate-fade-in { transform: scale(0.98); }`.
- **Why it Failed**: In modern CSS standards, any parent container with a `transform` other than `none` establishes a new containing block for all its descendants, even those with `position: fixed`. When the user scrolled down the 10,000-row table and clicked "View", the drawer was positioned relative to the scrolled ancestor instead of the screen viewport. This pushed the drawer header (`Transaction Details`, close button, and top amount card) hundreds of pixels off-screen above the viewport.
- **How It Was Fixed**:
  1. Replaced the inline element with **React Portals** (`createPortal(..., document.body)`), anchoring the drawer directly to the root DOM.
  2. Removed `transform` from the global `fadeIn` animation so parent containers remain transparent to layout trees.

---

### Example 2: Naive ISO Date Parsing in Database Seeder
- **Initial AI Output**: The AI wrote a seed script using Python's `datetime.fromisoformat(item["timestamp"])` under the assumption that all timestamps in `Transactions_.json` were ISO-8601 strings.
- **Why it Failed**: Real-world data profiling revealed that the 10,000 records contained mixed datetime formats: ISO strings (`2025-10-03T21:03:27Z`), slash-delimited date strings (`12/10/2025 16:24:49`), and millisecond epoch integers (`1768265109000`). The seeder immediately crashed on record #4 with `ValueError: Invalid isoformat string`.
- **How It Was Fixed**:
  Engineered a resilient `parse_timestamp()` utility with fallback pattern matching (`%d/%m/%Y %H:%M:%S`, `%m/%d/%Y %H:%M`, epoch conversion, etc.) and timezone normalization to UTC.

---

### Example 3: FastAPI Parameterized Route Precedence Bug
- **Initial AI Output**: The AI declared route handlers in the order:
  1. `@router.get("/transactions/{transaction_id}")`
  2. `@router.get("/transactions/categories")`
- **Why it Failed**: In FastAPI / Starlette, routes are evaluated sequentially. A request to `/api/transactions/categories` was intercepted by `/{transaction_id}`, attempting to query the database for a transaction with ID `"categories"` and returning a `404 Not Found`.
- **How It Was Fixed**: Reordered the route hierarchy to place static sub-routes (`/categories`) before parameterized dynamic routes (`/{transaction_id}`).
