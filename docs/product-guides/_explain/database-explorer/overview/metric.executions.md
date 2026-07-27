The rate of SQL statement executions per second on this Oracle database — Oracle's counterpart to the Transactions/sec tile other engines show.

### How it's calculated

- The agent collects execution counters from Oracle's SQL statistics (`v$sqlarea`), and Logstag turns the window's growth into a per-second rate.
- Executions are used rather than commit counts because they track the workload Oracle actually processes, including read-only statements that never commit.
- The trend arrow compares against the preceding window.

### Reading it

Read it the same way as a transaction rate: as the workload baseline. Because it counts executions, a jump here without an application change often means *more statements per unit of work* — the classic N+1 signature — which the Insights page detects and the Activity Explorer's Wait Activity tab can attribute to specific SQL_IDs.
