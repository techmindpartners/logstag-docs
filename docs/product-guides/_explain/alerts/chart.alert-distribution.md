Share of currently open alerts by severity (Critical, High, Medium, Low).

### How it's calculated

- Built from `summary.bySeverity` on the same un-windowed `GET /api/v1/alerts/query` call as Active Alerts / Critical.
- Bars show percent of open alerts; a zero-count severity can still render as 0%.
- There is no Info or Best Practice bar, but those alerts are not missing: the severity summary counts both levels **inside Low**. So Low here means "Low, Info and Best Practice", while the history charts drop those two levels entirely.
- Instance filter applies; the time window does not. Subtitle: across open alerts.

### Reading it

This is a snapshot of the open queue's mix. It will disagree with Alerts Activity whenever recent firings have already cleared — and also because the two cards treat Info and Best Practice differently: folded into Low here, excluded there.
