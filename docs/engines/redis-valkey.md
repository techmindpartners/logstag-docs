---
sidebar_position: 4
---

# Redis and Valkey Setup

Redis and Valkey monitoring use Redis-compatible commands for server, client, memory, persistence, command, CPU, slowlog, latency, configuration, security, and replication signals.

## Minimum Redis Target Configuration

```toml
[targets.production-redis]
platform = "self-hosted"
db_engine = "redis"
db_host = "redis.example.internal"
db_port = 6379
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "0"
```

## Minimum Valkey Target Configuration

```toml
[targets.production-valkey]
platform = "self-hosted"
db_engine = "valkey"
db_host = "valkey.example.internal"
db_port = 6379
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "0"
```

## Data Collected

Redis and Valkey collectors can include server stats, client stats, replication stats, memory stats, persistence stats, command stats, CPU stats, slowlog entries, latency stats, configuration stats, and security stats.

## Operator Notes

For Redis and Valkey, `db_name` is the logical database number as a string. If ACLs are enabled, configure a user with the minimum command access required by the collectors.
