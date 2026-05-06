---
sidebar_position: 5
---

# Supported Engines

Logstag supports multiple database engines through engine-specific agent collectors, ingestion, alert templates, health checks, and web application views.

## Currently Supported

| Engine | Status | Notes |
| --- | --- | --- |
| PostgreSQL | Supported | Activity, query, instance, schema, role, replication, alert, and health workflows. |
| Microsoft SQL Server | Supported | Session activity, database activity, Query Store or DMV query statistics, performance counters, schema, index, Availability Groups, security, alert, and health workflows. |
| MongoDB | Supported | Server, database, collection, operation, connection pool, security, storage, replication, alert, and health workflows. |
| Redis | Supported | Server, client, memory, persistence, command, CPU, slowlog, latency, configuration, security, replication, alert, and health workflows. |
| Valkey | Supported | Redis-compatible monitoring paths for Valkey targets. |
| Oracle | Supported | Sessions, waits, locks, tablespace I/O, memory, SQL performance, ASH, Data Guard, backup, AQ, redo logs, profile settings, schema, index, alert, and health workflows. |

## Planned Engines

Logstag is planned to expand engine coverage beyond the currently supported set. These engines are on the product roadmap and will receive setup, permissions, and verification guidance as support becomes available:

| Engine | Status |
| --- | --- |
| MySQL | Planned |
| ClickHouse | Planned |
| Cassandra | Planned |
| Altibase | Planned |
| SAP | Planned |
| CockroachDB | Planned |

As each engine becomes available, its setup guidance will include tested permissions, required database features, configuration examples, and verification steps.
