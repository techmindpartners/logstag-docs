How many objects of each type the database contains — one tile per object type the engine reports.

### What each engine shows

- **PostgreSQL** — tables, indexes, views, functions, and sequences.
- **SQL Server** — tables, indexes, views, procedures, functions, triggers, and sequences.
- **MongoDB** — collections, indexes, and documents. The Documents tile is a volume figure, not a structural one — it moves with data, the others move with schema.
- **Oracle** — tables, indexes, views, procedures, functions, triggers, and sequences, plus the Valid / Invalid / N/A validity tiles.

A tile appears only when the engine provides that object type; a zero means the engine reported zero, not that nothing was collected.

### How it's calculated

- Counts come from the agent's schema inventory: refreshed roughly every 10 minutes on PostgreSQL and MongoDB, every 4 hours on SQL Server and Oracle with default intervals.
- The change chip compares against the previous comparable period.

### Reading it

Counts are structural pulses — they should move when deployments move them and stay flat otherwise. An unexplained change is precisely what the Changes tab exists for: it names the object, the change type, and when it happened.
