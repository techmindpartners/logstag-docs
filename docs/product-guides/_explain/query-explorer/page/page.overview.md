The Query Explorer shows query-level performance across your monitored databases: which statements run, how often, how long they take, and which ones carry alerts.

### What the page shows

- One row per distinct statement shape. Repeated executions of the same statement — with different values — are grouped under one identity: PostgreSQL statements are parameter-normalized by the agent, SQL Server statements are grouped by the engine's own query hash, and Oracle statements by their SQL_ID.
- Query-level statistics are collected for **PostgreSQL, SQL Server, and Oracle**. Databases on other engines do not appear here.
- For Oracle, the agent samples the top statements by elapsed time each cycle; when an Oracle database tracks more unique statements than the list shows, a hint under the table says how many are tracked.

Selecting a row opens the query's detail view: summary metrics and trend charts, the full statement text, an execution plan where available, and detailed statistics.

### Reading it

Sort by Execution Time for the slowest statements and by Calls for the busiest — the statement worth tuning first is usually high on *both*. The alert chips mark statements that already crossed thresholds; everything else here is proactive hunting.
