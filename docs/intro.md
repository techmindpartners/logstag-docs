---
sidebar_position: 1
slug: /
---

# Introduction

Logstag is a database monitoring platform for teams that operate production databases. It collects operational metadata and database statistics through a lightweight agent, sends those measurements to the Logstag backend, and presents them through focused views for health, activity, queries, schema, alerts, and database inventory.

Logstag is designed for observability and operational review. It does not act as a database proxy, query builder, migration tool, backup system, or database administration console.

## What Logstag Collects

The Logstag agent connects to configured database targets and collects engine-specific operational signals, including:

- Instance and server status.
- Active sessions, waits, locks, blocking, and connection activity.
- Query performance statistics where the database engine exposes them.
- Schema, index, object, permission, and configuration metadata.
- Replication, availability, persistence, memory, and capacity signals where supported.

Logstag does not read or copy application table rows. Some metadata can still be sensitive, such as query text, object names, users, roles, permissions, and configuration values. Treat the agent configuration and Logstag access controls accordingly.

## Core Components

### Logstag Agent

The agent is a Rust service that runs in the customer environment. It uses configured database credentials to run monitoring queries, then sends metric payloads to the Logstag agent API.

Current agent capabilities include:

- TOML-based configuration.
- Multiple database targets per agent.
- Configurable collection intervals.
- Optional password and API key encryption in local configuration.
- Linux, Windows, and Docker-oriented packaging paths.
- Engine-specific collectors for PostgreSQL, Microsoft SQL Server, MongoDB, Redis, Valkey, and Oracle.

### Logstag Backend

The backend receives agent payloads, stores time-series and relational metadata, evaluates alerts, and serves product APIs for the web application.

Current backend capabilities include:

- Agent registration and ingestion APIs under `/agent-api/v1`.
- Per-engine metric ingestion for PostgreSQL, Microsoft SQL Server, MongoDB, Redis, Valkey, and Oracle.
- Template-based alerting backed by embedded YAML templates.
- Health check report generation.
- Multi-tenant organization, user, role, API key, billing, integration, audit log, and alert management APIs.

### Logstag Web Application

The web application is the primary operator interface. The main product areas are:

- Health Check
- Database Explorer
- Schema Explorer
- Activity Explorer
- Query Explorer
- Alerts
- Assets
- Integrations
- Audit Logs

## Supported Database Engines

Logstag currently has agent and backend support for:

| Engine | Monitoring focus |
| --- | --- |
| PostgreSQL | Activity, query statistics, instance metrics, schema metadata, roles, replication, configuration, alerts, and health checks. |
| Microsoft SQL Server | Session activity, database activity, Query Store or DMV query statistics, performance counters, schema and index metadata, Availability Groups, security, alerts, and health checks. |
| MongoDB | Server, database, collection, operation, connection pool, security, storage, replication, alerts, and health checks. |
| Redis | Server, clients, memory, persistence, commands, CPU, slowlog, latency, configuration, security, replication, alerts, and health checks. |
| Valkey | Redis-compatible monitoring paths for server, clients, memory, persistence, commands, latency, configuration, security, replication, and alerts. |
| Oracle | Sessions, wait events, locks, tablespace I/O, memory, SQL performance, ASH, Data Guard, backup, AQ, redo logs, profile settings, schema, index, alerts, and health checks. |

MySQL is not currently listed as a supported agent engine in the codebase.

## Collection Intervals

The agent groups monitoring work into configurable intervals:

| Interval | Default | Typical use |
| --- | ---: | --- |
| High frequency | 10 seconds | Active sessions, connection pressure, waits, critical runtime signals. |
| Medium frequency | 60 seconds | Query performance, replication, memory, persistence, command, or workload signals. |
| Low frequency | 600 seconds | Configuration, system, and less frequently changing operational signals. |
| Schema frequency | 14,400 seconds | Schema and index metadata, where collection is heavier and changes less often. |

The exact collectors assigned to each interval vary by database engine.

## What Logstag Does Not Do

Logstag does not:

- Modify application tables or database schema.
- Read or copy application table rows.
- Sit between applications and databases.
- Replace backups, replication, or disaster recovery.
- Rewrite queries or automatically apply database changes.
- Remove the need for database permissions review.

## Next Step

Start with [Getting Started](./getting-started.md) to understand the minimum setup path, then use [Agent Configuration](./agent-configuration.md) and the engine-specific setup pages for production configuration details.
