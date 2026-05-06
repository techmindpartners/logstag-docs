---
sidebar_position: 4
---

# Data Collection and Privacy

Logstag collects operational metadata and database statistics for monitoring, alerting, health checks, and explorer views. The agent is designed to observe database behavior, configuration, security posture, schema shape, and workload signals without acting as a database proxy or copying application datasets.

This page defines the data boundary operators should understand before connecting production databases.

## Summary

Logstag collects:

- Runtime activity and workload statistics.
- Query and command metadata where the database engine exposes it.
- Schema, object, index, collection, and permission metadata.
- Configuration, security, replication, availability, storage, and capacity signals.

Logstag does not:

- Copy application table rows into Logstag.
- Store MongoDB documents as application records.
- Modify database schema or application data.
- Reset Redis slow logs or alter database configuration as part of monitoring.
- Send database passwords as monitoring metrics.

Some collected metadata can still be sensitive. Treat Logstag access, agent configuration, and exported diagnostics as operationally sensitive.

## Data Categories

| Category | What it includes | Why Logstag uses it |
| --- | --- | --- |
| Runtime activity | Sessions, connections, waits, locks, blocking, transactions, active operations, client activity, and replication state. | Activity Explorer, Health Checks, Alerts, and troubleshooting workflows. |
| Query and command metadata | Query identifiers, normalized query text, SQL text snippets, execution counts, rows processed, CPU, I/O, duration, command names, and slowlog entries where supported. | Query Explorer, performance alerts, workload analysis, and regression review. |
| Schema and object metadata | Database, schema, table, view, procedure, function, sequence, index, collection, queue, object, and column metadata where supported. | Schema Explorer, Health Checks, schema risk detection, and inventory views. |
| Security and permission metadata | Users, roles, role membership, privileges, permissions, authentication settings, policy settings, and elevated access indicators. | Security health checks, permission review, and security alerts. |
| Configuration metadata | Database and instance settings, memory settings, audit settings, engine configuration, startup warnings, feature flags, and server options. | Configuration health checks, operational review, and configuration alerts. |
| Capacity and storage metrics | Database size, table or collection size, index size, object counts, row or document counts, memory usage, persistence, tablespace, and file statistics. | Capacity planning, schema review, storage alerts, and database inventory. |
| Availability and maintenance metrics | Replication, Data Guard, Availability Groups, backup status, redo logs, persistence, vacuum activity, checkpoints, and queue health. | Availability review, maintenance alerts, and health reporting. |

## Sensitive Metadata

The following data types should be treated as sensitive operational metadata:

- Query text, normalized query text, SQL snippets, and command arguments.
- Database, schema, table, column, index, collection, queue, function, procedure, and object names.
- Usernames, role names, role memberships, permissions, and privilege levels.
- Client addresses, application names, session identifiers, and connection metadata.
- Configuration values, authentication settings, audit settings, and security posture indicators.
- Redis slowlog command arguments, which can include key names or command parameters.
- MongoDB index key definitions and namespace names.

These fields are not application rows, but they can reveal application structure, access patterns, naming conventions, and operational behavior.

## Engine Coverage Matrix

| Engine | Runtime activity | Query or command metadata | Schema and object metadata | Security and permissions | Configuration and capacity |
| --- | --- | --- | --- | --- | --- |
| PostgreSQL | Sessions, waits, blocking, transactions, database activity, replication. | Active query text and normalized query text from query statistics where available. | Schemas, tables, columns, indexes, views, functions, sequences, constraints, bloat, vacuum activity. | Roles, role membership, schema/table/function privileges, elevated role attributes. | Database settings, table and index sizes, row estimates, cache and I/O activity. |
| Microsoft SQL Server | Sessions, waits, blocking, database activity, performance counters, Availability Groups. | Current SQL text and query text from Query Store or DMV-based collection. | Schemas, tables, columns, views, procedures, functions, indexes, permissions, object metadata. | Logins, users, roles, sysadmin membership, orphaned users, password policy indicators, permission grants. | Instance settings, server configuration, memory, database files, index usage, storage and row estimates. |
| MongoDB | Server status, operation counters, connection pool, collection performance, replication and lock signals. | Aggregate operation counters and collection-level operation timings. Current operation command documents are outside the current collection boundary. | Databases, collections, namespaces, collection size metrics, index names, index key definitions, index usage. | Users, roles, inherited roles, privileges, authentication and TLS-related indicators where available. | Server build and host info, command line options, startup warnings, storage engine, collection and index size metrics. |
| Redis | Server stats, client stats, replication state, latency, persistence, CPU, memory. | Command statistics and slowlog entries, including command names and arguments returned by Redis. | Keyspace-level statistics and logical database metrics. Individual key values are not copied as records. | ACL users, command permissions, key and channel access patterns, password-present indicators. | Configuration statistics, memory, persistence, replication, CPU, eviction, expiry, and command activity. |
| Valkey | Redis-compatible runtime activity and replication metrics. | Redis-compatible command statistics and slowlog metadata where available. | Redis-compatible keyspace and logical database metrics. | Redis-compatible ACL and security metadata where available. | Redis-compatible configuration, memory, persistence, CPU, and capacity metrics. |
| Oracle | Sessions, waits, locks, tablespace I/O, ASH samples, Data Guard, AQ, redo, backup status. | SQL identifiers, plan hashes, SQL performance metrics, and SQL text snippets where exposed by Oracle. | Schemas, objects, indexes, tablespaces, queues, roles, and object-level metadata. | Users, roles, role hierarchies, object privileges, system privileges, profile security settings. | Instance configuration, audit settings, profile settings, memory, backup, redo, tablespace, and index metrics. |

## What Logstag Does Not Collect

Logstag does not copy application datasets into Logstag. In practical terms:

- PostgreSQL and Microsoft SQL Server table rows are not copied as row data.
- MongoDB documents are not stored as application documents in Logstag.
- Redis and Valkey key values are not copied as datasets.
- Oracle application table rows are not copied as row data.
- Database passwords are not sent as metric payload fields.

This does not mean the agent never inspects database structures or runtime records exposed by monitoring views. Database engines expose operational metadata through system views, statistics tables, commands, and logs. Logstag uses those sources for monitoring.

## Query Text and Commands

Query and command metadata is important for performance diagnostics, but it can contain sensitive information.

Engine behavior differs:

- PostgreSQL can expose active query text and normalized query text from query statistics.
- Microsoft SQL Server can expose current SQL text and query text through Query Store or DMV-based collection.
- Oracle can expose SQL identifiers, plan hashes, metrics, and SQL text snippets.
- Redis and Valkey slowlog entries can include command arguments.
- MongoDB currently focuses on server, database, collection, security, and aggregate operation metrics rather than storing current operation command documents.

Operators should avoid embedding secrets, tokens, personally identifiable information, or business-sensitive literals in SQL, Redis commands, or database object names. Where an engine supports query normalization, normalization can reduce but does not eliminate sensitivity.

## MongoDB Document Handling

MongoDB collection metrics can include document counts, average document size, storage size, index statistics, namespace names, and index key definitions. Some collection statistics may be derived by inspecting aggregate document size characteristics.

Logstag does not store MongoDB documents as application records. It stores aggregate metrics and metadata needed for monitoring, capacity analysis, schema review, and alerts.

## Credentials and Secrets

The agent needs credentials to connect to monitored databases. Those credentials belong in the agent configuration, not in metric payloads.

Production operators should:

- Use dedicated monitoring users.
- Grant the minimum permissions required for the enabled collectors.
- Encrypt local sensitive configuration values where supported.
- Restrict access to agent configuration files and logs.
- Rotate API keys and database credentials when access changes.
- Redact query text, command arguments, object names, and configuration values before sharing diagnostic exports outside trusted channels.

## Operator Guidance

Before enabling Logstag in production:

1. Review the engine-specific setup page for required permissions.
2. Confirm which collectors are enabled for the target engine.
3. Decide whether query text, command arguments, role metadata, and object names are acceptable to collect in your environment.
4. Use a dedicated monitoring identity with least-privilege access.
5. Restrict Logstag user access to teams that should see database operational metadata.
6. Validate the first collected payloads and product views in a non-production or limited-scope environment when possible.

For regulated environments, treat Logstag as a system that stores sensitive operational metadata, even though it does not copy application table rows or MongoDB documents as datasets.
