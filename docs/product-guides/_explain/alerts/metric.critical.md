How many open alerts are at Critical severity right now.

### How it's calculated

- Taken from the same un-windowed `GET /api/v1/alerts/query` summary as Active Alerts (`summary.bySeverity.critical`).
- Counts open Critical rows only. Muted alerts are excluded. Instance filter applies; time window does not.

### Reading it

Treat this as the urgent slice of Active Alerts. A rising Critical count with a flat Active total means severity is concentrating, not just volume.
