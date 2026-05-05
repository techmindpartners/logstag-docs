---
sidebar_position: 5
---

# Supported Engines

Logstag supports multiple database engines through engine-specific agent collectors, backend ingestion endpoints, alert templates, health checks, and web application views.

| Engine | Status in codebase | Notes |
| --- | --- | --- |
| PostgreSQL | Supported | Activity, query, instance, schema, role, replication, alert, and health workflows. |
| Microsoft SQL Server | Supported | Session activity, database activity, Query Store or DMV query statistics, performance counters, schema, index, Availability Groups, security, alert, and health workflows. |
| MongoDB | Supported | Server, database, collection, operation, connection pool, security, storage, replication, alert, and health workflows. |
| Redis | Supported | Server, client, memory, persistence, command, CPU, slowlog, latency, configuration, security, replication, alert, and health workflows. |
| Valkey | Supported | Redis-compatible monitoring paths for Valkey targets. |
| Oracle | Supported | Sessions, waits, locks, tablespace I/O, memory, SQL performance, ASH, Data Guard, backup, AQ, redo logs, profile settings, schema, index, alert, and health workflows. |
| MySQL | Not supported in agent enum | Do not document MySQL as supported until the agent and backend expose it as a supported engine. |

Engine-specific setup pages should include tested permissions, required database features, configuration examples, and verification steps.
