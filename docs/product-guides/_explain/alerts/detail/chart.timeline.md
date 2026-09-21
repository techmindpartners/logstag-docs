When and where this template fired in the window — bubbles by instance over time.

### How it's calculated

- Built client-side from the header occurrence page (≤100 rows), not from `GET /api/v1/alerts/history`.
- Each cell is instance × time bucket: size is count, color is worst severity in the cell. Bucket width follows the same history-range helper used elsewhere on Alerts.
- Caption notes when only the latest N of total occurrences are plotted.

### Reading it

Placed under All Occurrences so you can jump from a dense bubble to the matching rows. Empty timeline usually means widen the time range or clear an instance filter that excluded every row.
