How many objects the database contains. The label adapts to the engine's object model: **Objects** on PostgreSQL, SQL Server, and Oracle; **Collections & Indexes** on MongoDB; **Total Keys** on Redis and Valkey.

### How it's calculated

- Relational engines count schema objects from the agent's schema inventory — for PostgreSQL, the current table and index inventory.
- MongoDB counts collections and indexes; Redis and Valkey report the key count from `DBSIZE`.
- The trend arrow compares against the preceding window.

### Reading it

This is a structural pulse, not a performance number. It normally moves only when deployments create or drop objects — so an unexplained change is worth a look at the Schema tab's object list and, for audited environments, the schema-change history. On Redis, a steadily climbing key count with flat memory usually means many small keys; the reverse means fewer, bigger values.
