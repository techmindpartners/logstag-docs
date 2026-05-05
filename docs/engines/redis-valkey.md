---
sidebar_position: 4
---

# Redis and Valkey Setup

Logstag monitors Redis and Valkey through the Redis protocol. The same monitoring model is used for both engines because Valkey is Redis protocol compatible.

Use a dedicated monitoring user when ACLs are enabled. The user should have read-only operational visibility and should not be used by the application.

## Supported Deployment Scope

| Area | Support |
| --- | --- |
| Redis | Redis 7.0 and later. |
| Valkey | Valkey 8.0 and later. |
| Standalone | Supported. |
| Replication | Supported for primary and replica role visibility. |
| Redis Cluster | Not currently documented as a supported target mode. |
| Sentinel | Not currently documented as a supported target mode. |

For clustered Redis or Sentinel environments, monitor each supported Redis or Valkey node according to the deployment guidance approved for that environment.

## Redis Target Configuration

Add a Redis target entry to the agent configuration.

```toml
[targets.production-redis]
platform = "self-hosted"
db_engine = "redis"
db_host = "redis.example.internal"
db_port = 6379
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "0"
```

For Redis and Valkey, `db_name` is the logical database number as a string. Use a value from `0` to `15` unless your environment has a different approved database layout.

## Valkey Target Configuration

Add a Valkey target entry with the same field model.

```toml
[targets.production-valkey]
platform = "self-hosted"
db_engine = "valkey"
db_host = "valkey.example.internal"
db_port = 6379
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "0"
```

If the deployment is configured without authentication, `db_username` and `db_password` can be left empty. This should be limited to controlled development environments.

## Access Model

| Access area | Required for |
| --- | --- |
| `PING` | Agent health checks. |
| `SELECT` | Selecting the configured logical database. |
| `INFO` | Server, client, keyspace, memory, command, persistence, CPU, and replication metrics. |
| `DBSIZE` | Key count for the monitored logical database. |
| `ROLE` | Primary or replica role detection. |
| `CLIENT LIST` | Client connection metadata. |
| `MEMORY STATS` | Detailed memory and allocator metadata. |
| `SLOWLOG LEN` and `SLOWLOG GET` | Slow command monitoring. |
| `LATENCY LATEST` | Redis latency event metadata. |
| `CONFIG GET` | Configuration monitoring and drift detection. |
| `ACL USERS` and `ACL GETUSER` | Optional ACL and security inventory. |

The minimum useful monitoring account needs `PING`, `SELECT`, `INFO`, `DBSIZE`, and `ROLE`. The remaining commands improve coverage but should be granted according to the monitoring scope you want Logstag to report.

## Create a Monitoring User

In Redis 6.0 and later, create or update an ACL user for monitoring.

```text
ACL SETUSER logstag_monitor on >strong-password ~* &* \
  +ping +select +info +dbsize +role
```

This gives the user the core command visibility needed for health checks, database selection, server metrics, key count, and role detection.

For fuller operational coverage, add the read-only diagnostic commands required by your monitoring scope.

```text
ACL SETUSER logstag_monitor \
  +client|list \
  +memory|stats \
  +slowlog|get +slowlog|len \
  +latency|latest \
  +config|get
```

If Logstag should collect ACL security inventory, grant ACL read visibility as a separate decision.

```text
ACL SETUSER logstag_monitor +acl|users +acl|getuser
```

Avoid granting write or destructive commands to the monitoring user.

## Password-Only Authentication

Some Redis deployments use password-only authentication instead of named ACL users. In that case, leave `db_username` empty and set `db_password`.

```toml
[targets.production-redis]
platform = "self-hosted"
db_engine = "redis"
db_host = "redis.example.internal"
db_port = 6379
db_username = ""
db_password = "<your-database-password>"
db_name = "0"
```

Use named ACL users when the Redis version and security policy allow it. Named users make monitoring access easier to audit and rotate.

## Data Collected

Depending on enabled collectors and granted visibility, Logstag can collect:

- Server runtime metrics, command throughput, network counters, keyspace hits and misses, evicted keys, expired keys, connected clients, blocked clients, and uptime.
- Logical database key counts and key expiration counts for the configured database.
- Client connection metadata, including client identifiers, address metadata, client names, idle time, selected database, subscriptions, buffer sizes, and last command names.
- Replication role, connected replicas, replication offsets, backlog metadata, primary link state, and replica sync state.
- Memory usage, memory limits, fragmentation, allocator metadata, Lua or script memory, and active defragmentation state where exposed.
- Per-command usage counters, rejected calls, failed calls, and command CPU time.
- Slow log summary and recent slow log entries, including command names, arguments, duration, timestamp, client address, and client name where Redis exposes them.
- Latency event metadata for Redis latency spikes.
- Persistence status for RDB and AOF, including save status, rewrite state, copy-on-write memory, pending operations, and persistence file size signals.
- CPU counters for Redis server and background processes.
- Configuration parameters and configuration drift indicators when `CONFIG GET` is permitted.
- ACL user metadata, command permissions, key patterns, channel patterns, selectors, and privilege summaries when ACL read visibility is permitted.

Logstag does not read Redis key values as dataset content. Some Redis metadata can still be sensitive: key patterns, client addresses, client names, command arguments in slow logs, ACL rules, bind addresses, file names, and configuration parameters should be treated as operational metadata.

## Deployment Notes

Standalone Redis and Valkey instances may not expose meaningful replication metrics. Replication metrics are collected only when the node reports a primary or replica role.

Redis Cluster and Sentinel mode are not covered by this setup page. Do not use this page to infer cluster-wide monitoring behavior.

Managed Redis services may restrict commands such as `CONFIG GET`, `SLOWLOG`, `LATENCY`, `CLIENT LIST`, or ACL inspection. When a command is restricted, Logstag can continue collecting the remaining permitted metrics and report reduced coverage for the restricted area.

## Validate Setup

After updating the target configuration, validate the agent configuration before restarting the service.

```bash
logstag-agent --config /etc/logstag-agent/config.toml --check-config
```

Restart the agent after validation.

```bash
sudo systemctl restart logstag-agent
sudo systemctl status logstag-agent
```

On Windows, restart the Logstag Agent service from the Services console or with the approved service management command used in your environment.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Connection fails | Confirm host, port, password or ACL credentials, firewall rules, TLS policy, and Redis authentication settings. |
| Database selection fails | Confirm `db_name` is a valid logical database number and the user can run `SELECT`. |
| Server metrics are missing | Confirm the user can run `INFO`. |
| Key count metrics are missing | Confirm the user can select the configured database and run `DBSIZE`. |
| Replication metrics are missing | Confirm the target is primary or replica and the user can run `ROLE` and read replication information. |
| Client metrics are missing | Confirm `CLIENT LIST` is permitted. |
| Slow log metrics are missing | Confirm `SLOWLOG LEN` and `SLOWLOG GET` are permitted. |
| Configuration metrics are missing | Confirm `CONFIG GET` is permitted by ACL and provider policy. |
| Security inventory is missing | Confirm ACL read visibility is intentionally granted. If not granted, this area is expected to be unavailable. |
| No metrics arrive after configuration changes | Validate the configuration, restart the agent, and review local agent logs. |
