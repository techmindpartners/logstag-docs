One row per monitored database with its hosting instance. Click a row to open the database's detail view.

### Columns

- **Database** — the database's name with its engine icon.
- **Instance** — the hosting instance. Filterable by instance.
- **Engine** — PostgreSQL, SQL Server, MongoDB, Redis, Valkey, or Oracle.
- **Status** — Online when both the database and its instance are active; Offline otherwise.
- **CPU** — the host's average CPU usage. Instance-level: databases sharing a host share this value. Rising is shown red.
- **Memory** — the host's average memory usage, same instance-level scope and coloring.
- **Alerts** — active alert counts as severity chips: Critical, High, Medium, Low. Zeroes render muted.

The list can be searched by database or instance name, filtered per column (engine, status, CPU and memory ranges, with or without alerts), sorted by most columns, and paginated.

### Reading it

Sort by Alerts to triage, or filter to a single engine when rolling out an engine-specific change. Because CPU and Memory are host-scoped, several red rows on the same instance are one host problem, not several database problems — fix it once at the instance.
