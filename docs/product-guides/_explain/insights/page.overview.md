Findings that background detectors raise when a database drifts from its own recent baseline: a KPI strip, a Confidence mix bar, and one filterable list.

### How it's calculated

- Detectors run about every 15 minutes per database, using metrics Logstag has already collected. They never open new connections to the monitored database.
- Three detector families:
  - **N+1 pattern**: a query called many times that returns about one row per call. PostgreSQL, SQL Server, and Oracle only.
  - **Regression**: slower queries on PostgreSQL, SQL Server, and Oracle; slower collection operations on MongoDB; slower or failing commands on Redis and Valkey.
  - **Workload anomaly**: the database's overall workload shape has changed. Runs on all six engines.
- Every finding is compared against the database's own history, not a global threshold. Low-severity findings are not kept, so the list shows Medium, High, and Critical findings.
- The KPIs and the list follow the topbar instance and time filters. A finding is in range if it was active at any point in the selected window, not only if it was first detected there. Results are cached for about 5 minutes; dismissing a finding refreshes them.
- The surface is marked **Beta**.

### Reading it

Use the KPI strip to see how much is happening and how much of it you can trust. Then work the list from the top: open a finding to see what changed, the recommended fix, and the evidence behind it.
