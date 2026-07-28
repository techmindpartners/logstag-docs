How many objects of each type the selected schema contains — one tile per object type the engine reports.

### What each engine shows

- **PostgreSQL** — tables, indexes, views, functions, and sequences.
- **SQL Server** — tables, indexes, views, procedures, functions, triggers, and sequences.
- **MongoDB** — collections, indexes, and documents; the database is the schema scope here, and the Documents tile is a volume figure rather than a structural one.
- **Oracle** — tables, indexes, views, procedures, functions, triggers, and sequences, plus the Valid / Invalid / N/A validity tiles.

A tile appears only when the engine provides that object type; a zero means the engine reported zero, not that nothing was collected.

### How it's calculated

- Counts come from the agent's schema inventory, scoped to this schema: refreshed roughly every 10 minutes on PostgreSQL and MongoDB, every 4 hours on SQL Server and Oracle with default intervals.
- The change chip compares against the previous comparable period.

### Reading it

Counts should move when deployments move them and stay flat otherwise. When a tile changes and nobody claims it, the Changes tab names the object, the change type, and the moment it happened — that is the drill-down, not the tile itself.
