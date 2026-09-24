Average and worst per-query latency across the selected window.

### How it's calculated

- Served by `GET /api/v1/metrics/query-performance` with the dashboard's `from` / `to` / `bucketSize` and optional instance filter (empty = whole org). Results are cached for 30 s.
- Covers PostgreSQL, SQL Server and Oracle only — MongoDB and MySQL are not included.
- **Avg Latency (ms):** total query execution time ÷ total executions in the bucket, across all engines (execution-weighted, so busier engines pull the average toward themselves).
- **Max Latency (ms):** the slowest query's *average* latency in the bucket — the highest per-query mean, not the slowest single execution.
  - PostgreSQL: from `pg_stat_statements` deltas, collected every ~60 s.
  - SQL Server: Query Store interval max where available, otherwise the per-execution average.
  - Oracle: per-plan average from SQL statistics deltas; a statement seen only once in the bucket contributes nothing.
- Oracle has no historical rollup, so it only contributes to windows within the last ~7 days.
- Buckets with no data come back `null` and are drawn as gaps; a real zero stays 0. A failed read on one engine silently drops that engine's contribution.

### Reading it

Avg Latency tracks overall load; Max Latency tracks the worst offender. A rising Max with a flat Avg usually means one query regressed, not the whole workload. On Oracle-heavy estates, expect gaps to appear in older buckets once they age past the ~7-day rollup window. Hover stays in sync with the other three trend tiles.
