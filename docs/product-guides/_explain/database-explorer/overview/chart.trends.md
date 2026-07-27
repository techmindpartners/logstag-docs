The time-series charts for this database over the selected window. There are two groups: **key-metric charts** tracking the summary tiles over time (size, connections, throughput), and **engine charts** showing deeper operational signals specific to the engine.

### What each engine shows

- **PostgreSQL** — key metrics: Database Size, Connections, Transactions; engine charts: Query Latency, Disk IO, Deadlocks, Table Scans, Index Scans.
- **SQL Server** — key metrics: Database Size, Objects, Connections, Transactions; engine charts: Query Latency, Disk IO, Lock Wait, Deadlock Rate, Table Scans, Index Scans.
- **Oracle** — key metrics: Database Size, Connections, Executions; engine charts: Query Latency, Disk IO, Wait Events, Blocking Locks.
- **MongoDB** — key metrics: Database Size, Collections & Indexes, Server Connections; engine charts: Server Operations, Data vs Index Size.
- **Redis / Valkey** — key metrics: Memory Usage, Total Keys, Connections; engine charts: Operations, Keyspace Hit Rate.

### How to read them

- All charts share a synchronized hover — moving the cursor on one moves it on all, so you can line up cause and effect across signals at the same instant.
- Gaps in a line are honest: they mean no samples were collected for that stretch, not zero. An isolated dot is a real data point whose neighbors are missing.
- The footer under each chart names the time window the data covers; changing the window from the top bar re-scopes every chart at once.
- An empty chart means the signal applies to this engine but nothing was collected in the window — usually a collector that has not run yet or a quiet database.

### Reading it

Start with the key metrics for the "what changed" and use the engine charts for the "why": rising query latency with rising table scans and flat index scans is a missing index; rising disk IO with a falling cache-hit signal is a working set outgrowing memory. When a chart moves at a fixed time every day, it is a scheduled job introducing itself.
