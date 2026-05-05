---
sidebar_position: 5
---

# Oracle Setup

Oracle monitoring uses dynamic performance views, dictionary metadata, session and wait statistics, Data Guard metadata, backup metadata, AQ metadata, schema metadata, index metadata, and profile settings.

## Minimum Target Configuration

```toml
[targets.production-oracle]
platform = "self-hosted"
db_engine = "oracle"
db_host = "oracle.example.internal"
db_port = 1521
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "FREEPDB1"
```

## Recommended Database Features

- Use Oracle Database 19c or later where possible.
- Use a dedicated monitoring user.
- Grant access to the dynamic performance views and dictionary metadata required by the enabled collectors.
- Review Data Guard and multitenant requirements separately when monitoring those deployments.

## Data Collected

Oracle collectors can include sessions, wait events, locks, tablespace I/O, memory, SQL performance, ASH, Data Guard, backup, AQ, redo logs, profile settings, schema metadata, and index metadata.

## Operator Notes

Oracle permissions need careful review because broad dictionary privileges can expose sensitive metadata. Publish tested permission sets per deployment model rather than relying on a single generic grant.
