A single-instance health report over a chosen date range, computed from continuous monitoring (no separate health-check run required).

### How it's calculated

- Backend kind `InstanceScorecard`. PDF sections include Overall health, Resource utilization, Alert history, Remediation plan, Recommendations, and Detailed results (Performance, Security, Configuration, Schema, Maintenance).
- Requires exactly one instance; optional one database on that instance. Time window: Past 7 days, Past 30 days, or a custom range of at most **31 days** (`from` / `to` UTC, floored to the minute at request time).
- Async PDF delivery only — request form + history on this page.

### Reading it

Default landing window is Past 30 days. Database-scoped reports still include instance-wide findings in the score where the backend notes that. Ranges wider than 31 days are refused.
