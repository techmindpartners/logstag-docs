The rate of SQL statement executions per second on this Oracle database — Oracle's counterpart to the Transactions/sec tile other engines show.

### How it's calculated

- The agent collects execution counters from Oracle's SQL statistics (`v$sqlarea`). The tile shows the per-second rate of the Executions chart's latest bucket in the selected time window, rounded to two decimal places.
- If that bucket has no sample, the tile shows `—`, even when earlier buckets contain data. It does not use an earlier populated bucket or the whole-window average as a fallback.
- Executions are used rather than commit counts because they track the workload Oracle actually processes, including read-only statements that never commit.
- The trend arrow compares the selected window's average rate against the preceding window's average rate, independently of the latest-bucket value.

### Reading it

With sparse samples, the tile can be empty while the chart still shows earlier activity. For example, an Oracle instance reporting every 10 to 20 minutes will often have no sample in the latest bucket when a short time window uses 1- or 2-minute buckets. An empty tile means no sample in that bucket, not zero executions.

Read it the same way as a transaction rate: as the workload baseline. Because it counts executions, a jump here without an application change often means *more statements per unit of work* — the classic N+1 signature — which the Insights page detects and the Activity Explorer's Wait Activity tab can attribute to specific SQL_IDs.
