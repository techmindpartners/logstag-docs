The main alerts table for this page — open alerts whose last trigger falls in the selected window (grouped by template by default).

### How it's calculated

- **Flat:** `GET /api/v1/alerts/query` with `from` / `to` on `last_triggered_at` and default status **Active** (`New` + `Acknowledged`).
- **Grouped:** `GET /api/v1/alerts/grouped` for the same time and instance scope — one row per alert template code. Opening a group goes to `/alerts/detail?code=…`.
- Resolved and AutoResolved rows are hidden unless you widen the status filter. Muted rows stay hidden until Show muted is on. Charts still count all activity in the window.

### Reading it

A quiet list with busy Alerts History / Alerts Activity usually means alerts fired and cleared inside the window. Use Grouped mode to triage by template; use Flat when you need individual occurrences.
