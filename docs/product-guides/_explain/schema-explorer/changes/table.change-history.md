Every structural change detected in the selected schema and window, newest first. Click a row to open the full change detail, including property-level old and new values for modifications.

### Columns

- **Timestamp** — when the change was detected.
- **Object** — the object the change belongs to.
- **Type** — the object type. The available types depend on the engine: PostgreSQL tracks tables, columns, indexes, views, functions, sequences, constraints, foreign keys, and **permissions** — a grant or revoke appears here as a change; SQL Server tracks tables, views, procedures, functions, sequences, synonyms, and triggers; MongoDB tracks collections; Oracle tracks its object types at an aggregate level.
- **Change** — Added, Modified, or Removed.
- **User** — the owner or schema context recorded with the change, when available.
- **Description** — a summary of what changed (hidden by default; enable it from the column menu).

### How it's calculated

- Changes are derived by comparing consecutive schema inventory snapshots, so detection lags collection: within about 10 minutes on PostgreSQL and MongoDB, up to 4 hours on SQL Server and Oracle with default intervals.
- **Oracle rows are aggregates, not individual objects**: Oracle inventory is collected as object counts per owner and type, so a row like `HR.TABLE` means the count of HR's tables changed — the object-name filter does not apply to Oracle.
- Very broad windows are capped at 5,000 change records; when the cap is hit, narrow the window for an exact set.

### Reading it

Filter by Change = Removed first after any incident. On MongoDB, remember index changes appear as a Modified event on the collection (the index count changed) rather than as separate index rows. And on PostgreSQL, this table doubles as a lightweight permission-change audit — grants and revokes are first-class change records here.
