The database's transaction throughput, per second. This tile appears for PostgreSQL and SQL Server; Oracle shows **Executions/sec** and MongoDB, Redis, and Valkey show **Operations/sec** instead.

### How it's calculated

- The agent collects the engine's cumulative transaction counters — `xact_commit` and `xact_rollback` from `pg_stat_database` on PostgreSQL, the transaction performance counters on SQL Server — and Logstag turns the window's growth into a rate.
- The trend arrow compares against the preceding window.

### Reading it

This is the database's heartbeat. Learn its daily rhythm, then read deviations against that rhythm rather than any absolute number: a flatline during business hours is an application problem before it is a database problem, and a spike with rising query latency in the trend charts below means the workload outgrew something — plans, indexes, or hardware.
