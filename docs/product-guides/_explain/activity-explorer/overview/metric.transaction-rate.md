The rate of transactions the database is committing, per second, averaged over the selected window.

### How it's calculated

- The agent collects the engine's cumulative transaction counters; Logstag turns the window's growth into a per-second rate.
- The trend arrow compares against the preceding window of the same length.
- This tile appears for PostgreSQL and SQL Server. Oracle does not currently show a rate tile on this tab.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_database` transaction counters (`xact_commit`, `xact_rollback`) |
| SQL Server | the engine's transaction performance counters |

### Reading it

This is your throughput baseline. Read it together with Active Sessions and Avg Query Time: rate up with flat latency is healthy growth; rate down while active sessions climb means work is arriving but not completing — usually blocking or resource saturation. A rate near zero on a database that should be busy is worth checking before anything else, starting with whether the application can reach it.
