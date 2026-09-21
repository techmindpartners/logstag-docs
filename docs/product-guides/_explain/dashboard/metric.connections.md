How many client connections are open across the selected instances at this moment.

### How it's calculated

- Served by `GET /api/v1/metrics/connections` — a **point-in-time snapshot**, not a series over the topbar time window.
- Each engine (PostgreSQL, SQL Server, Oracle) contributes its latest per-session sample; Logstag merges the engines by summing the state buckets (total, active, idle, waiting, and related splits).
- When the topbar instance filter is set, only those servers' databases are included. The card's hint line breaks the same snapshot into active · idle · waiting.
- The snapshot is independent of the time-window chip: Refresh re-fetches "now", but changing Last 1 hour → Last 24 hours does not redefine this number.

### Reading it

Treat this as current load on the estate. Correlate spikes with the Utilization and Wait Events trend tiles below — a high total that is mostly idle is a pool-sizing story; a high total that is mostly active or waiting is a contention story.
