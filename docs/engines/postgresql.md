---
sidebar_position: 1
---

# PostgreSQL Setup

PostgreSQL monitoring uses catalog views, statistics views, role metadata, replication metadata, and query statistics where available.

## Minimum Target Configuration

```toml
[targets.production-postgres]
platform = "self-hosted"
db_engine = "postgresql"
db_host = "postgres.example.internal"
db_port = 5432
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "postgres"
```

## Recommended Database Features

- Enable `pg_stat_statements` for query statistics.
- Use a dedicated monitoring role.
- Grant only the permissions required for monitoring views and metadata.

## Data Collected

PostgreSQL collectors can include instance metrics, process activity, database activity, query statistics, schema metadata, roles, settings, and replication information.

## Operator Notes

Validate permissions against the current PostgreSQL collectors before publishing final SQL snippets. Avoid granting broader privileges than the monitored workflow requires.
