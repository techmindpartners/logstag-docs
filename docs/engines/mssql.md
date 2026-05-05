---
sidebar_position: 2
---

# Microsoft SQL Server Setup

Microsoft SQL Server monitoring uses DMVs, database state, Query Store where configured, performance counters, schema metadata, index metadata, security metadata, and Availability Groups metadata.

## Minimum Target Configuration

```toml
[targets.production-mssql]
platform = "self-hosted"
db_engine = "mssql"
db_host = "sqlserver.example.internal"
db_port = 1433
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "master"
```

## Recommended Database Features

- Enable Query Store for richer query history where supported.
- Use a dedicated monitoring login.
- Review server-level and database-level permissions separately.

## Data Collected

SQL Server collectors can include session activity, database activity, query statistics, instance statistics, performance counters, schema metadata, index statistics, Availability Groups, and security signals.

## Operator Notes

Permission snippets should be tested against the current collectors before publication. SQL Server monitoring often requires visibility into server-level DMVs as well as database-level metadata.
