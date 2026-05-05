---
sidebar_position: 3
---

# MongoDB Setup

MongoDB monitoring uses server, database, collection, operation, connection pool, storage, replication, and security metadata exposed by MongoDB commands and admin views.

## Minimum Target Configuration

```toml
[targets.production-mongodb]
platform = "self-hosted"
db_engine = "mongodb"
db_host = "mongodb.example.internal"
db_port = 27017
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "admin"
```

## Recommended Database Features

- Use a dedicated monitoring user.
- Grant cluster and database visibility required by the enabled collectors.
- Confirm whether authentication is enabled before documenting empty credential examples.

## Data Collected

MongoDB collectors can include server stats, database stats, collection stats, collection performance, connection pool data, security stats, and current operation information.

## Operator Notes

MongoDB metadata can include database names, collection names, role assignments, command statistics, and operation samples. Treat access to Logstag and exported payloads accordingly.
