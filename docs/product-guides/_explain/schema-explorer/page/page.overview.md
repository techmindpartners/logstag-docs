The Schema Explorer is the structural inventory of your monitored databases: which schemas exist, how large they are, what objects they contain, what changed recently, and who can access them.

### What the page shows

- One row per schema-like scope: database schemas on PostgreSQL and SQL Server, the database itself on MongoDB, the owner/schema on Oracle.
- Redis and Valkey are key-value stores without a schema model, so they do not appear here.
- Each row carries the schema's size and its active alert counts by severity.

Selecting a row opens the schema's detail view: an overview with health and the object inventory, the change history, the permissions view, and the schema's alerts.

### Reading it

This surface answers structure questions without touching data: sort by Size to find the heavy schemas, filter to a database when reviewing a deployment's footprint, and let the alert chips point at schemas whose structure is already causing findings. It is not a data browser — table contents never appear here.
