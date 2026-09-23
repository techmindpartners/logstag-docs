Narrows the list to one or more finding categories.

### How it's calculated

- Multi-select chips. Selecting several shows findings in any of them, and no selection shows every category. Changing the selection returns to page 1.
- Two categories have detectors today:
  - **Query lifecycle**: N+1 patterns and regressions (queries, MongoDB collection operations, Redis and Valkey commands).
  - **Workload anomaly**: changes in a database's overall workload shape, such as read/write mix, connections, or cache behavior.
- **Query cost**, **Schema health**, **Security posture**, and **Fleet pattern** are reserved for upcoming detectors and currently return no findings.
- Applies to the list only. The KPI strip ignores it.

### Reading it

Use **Query lifecycle** to find specific queries or commands to fix, and **Workload anomaly** for database-wide shifts that usually trace back to a deploy, a traffic change, or a new job. Combine it with the Severity, Confidence, and Database filters in the same row.
