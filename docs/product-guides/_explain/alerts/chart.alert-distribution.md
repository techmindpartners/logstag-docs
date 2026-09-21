Share of currently open alerts by severity (Critical, High, Medium, Low).

### How it's calculated

- Built from `summary.bySeverity` on the same un-windowed `GET /api/v1/alerts/query` call as Active Alerts / Critical.
- Bars show percent of open alerts; a zero-count severity can still render as 0%. Info is not shown on this distribution.
- Instance filter applies; the time window does not. Subtitle: across open alerts.

### Reading it

This is a snapshot of the open queue's mix. It will disagree with Alerts Activity whenever recent firings have already cleared.
