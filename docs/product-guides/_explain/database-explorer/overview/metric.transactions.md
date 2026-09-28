The database's transaction throughput, per second. This tile appears for PostgreSQL and SQL Server; Oracle shows **Executions/sec** and MongoDB, Redis, and Valkey show **Operations/sec** instead.

### How it's calculated

- The agent collects the engine's cumulative transaction counters — `xact_commit` and `xact_rollback` from `pg_stat_database` on PostgreSQL, the transaction performance counters on SQL Server. The tile shows the per-second rate of the Transactions chart's latest bucket in the selected time window, rounded to two decimal places.
- If that bucket has no sample, the tile shows `—`, even when earlier buckets contain data. It does not use an earlier populated bucket or the whole-window average as a fallback.
- The trend arrow compares the selected window's average rate against the preceding window's average rate, independently of the latest-bucket value.

### Reading it

An empty tile means no sample in the latest bucket, not zero transactions. This can happen between collections when the chart's buckets are shorter than the reporting interval.

This is the database's heartbeat. Learn its daily rhythm, then read deviations against that rhythm rather than any absolute number: a flatline during business hours is an application problem before it is a database problem, and a spike with rising query latency in the trend charts below means the workload outgrew something — plans, indexes, or hardware.
