---
sidebar_position: 2
---

# Architecture

Logstag uses an agent-based architecture. The agent runs in the customer environment, collects operational metadata and statistics from configured databases, and sends monitoring payloads to Logstag. The web application presents that data through focused views for health, activity, queries, schema, alerts, and assets.

## Data Flow

1. The agent loads its local configuration.
2. Each configured database target is validated.
3. The agent connects to the database with the configured monitoring user.
4. Engine-specific collectors run on configured intervals.
5. The agent sends monitoring payloads to Logstag.
6. Logstag ingests and stores the received metrics and metadata.
7. Alert checks and health reports use the ingested data.
8. Operators review the results in the Logstag web application.

## Trust Boundary

The agent runs inside the customer environment. It needs outbound access to Logstag and database access to configured targets.

Logstag does not require inbound network access to the agent. Logstag receives data from the agent; it does not connect back into customer databases.

## Data Handling

Logstag collects operational metadata and statistics. Depending on the engine and enabled collectors, this can include:

- Query text or normalized query identifiers.
- Database, schema, table, index, collection, queue, or object names.
- User, role, permission, and configuration metadata.
- Runtime activity such as sessions, waits, locks, replication, memory, persistence, and command statistics.

Logstag does not read or copy application table rows.

## Collection Timing

Collection timing is configurable. Runtime signals can be collected as frequently as every 10 seconds by default. Other categories are collected less frequently, such as 1 minute for workload metrics, 10 minutes for lower-change operational signals, and 240 minutes for schema and index metadata.

## Main Product Areas

- Database Explorer: Database inventory, metrics, status, alerts, and details.
- Schema Explorer: Schema, object, index, permission, and change views where supported by the engine.
- Activity Explorer: Connections, sessions, waits, blocking, and runtime activity.
- Query Explorer: Query performance and query detail views where the engine exposes query statistics.
- Alerts: Active and historical alert management.
- Assets: Monitored infrastructure and database assets.
- Integrations: External workflow and incident management integrations.
- Audit Logs: Account Owner-only administrative and organization audit events.
