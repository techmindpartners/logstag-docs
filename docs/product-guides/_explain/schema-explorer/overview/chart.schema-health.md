The selected schema's health score, using the same five-dimension model as the database health score — Performance, Security, Configuration, Schema, Maintenance — scoped to this schema's alerts.

### How it's calculated

- The dimensions, weights, and score bands are identical to the database health score (see the Database Explorer's health reference); the ring turns green at 80 and amber at 60.
- The schema scoping is in the alert counting: alerts that name this schema count against it, and alerts with no schema context are treated as database-wide — they affect every schema in the database. Instance-level alerts always count too, because a server problem is every schema's problem.
- On MongoDB, the database is the schema, so all of the database's alerts count.
- The per-category arrows open the Alerts tab pre-filtered to the alerts behind that dimension.

### Reading it

Compare it against the parent database's score: a schema scoring below its database means this schema specifically carries the findings — usually schema-dimension alerts like missing indexes or bloat on its objects. Matching scores mean the drag is database-wide, and the database's own health view is the better place to work from.
