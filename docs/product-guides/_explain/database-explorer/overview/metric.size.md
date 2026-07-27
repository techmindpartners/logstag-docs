How much space this database occupies, as the engine itself reports it. On Redis and Valkey the tile is labeled **Memory Usage**, because memory is their storage.

### How it's calculated

- The agent asks the engine for its own size figure and Logstag shows the latest value for the selected window, with the trend compared against the preceding window.
- Sizes are shown in adaptive units (MB, GB, …).

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_database_size()` — when unavailable on a managed service, Logstag falls back to summing the sizes of the database's objects |
| MongoDB | the `dbStats` command |
| Redis / Valkey | `used_memory` from `INFO memory` |
| SQL Server | the engine's database size statistics |
| Oracle | the engine's database size statistics |

### Reading it

Watch the slope, not the number. Databases are supposed to grow; what deserves attention is a change in the growth *rate* — a sudden jump usually maps to a bulk load or a runaway log/temp structure, and a sudden drop to a cleanup or a restore. The Schema tab's size treemap shows which objects the space actually lives in.
