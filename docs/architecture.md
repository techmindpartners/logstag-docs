---
sidebar_position: 3
---

# Architecture

Logstag uses an agent-based architecture. The agent runs close to the monitored database, collects operational metadata and statistics, and sends metric payloads to the Logstag backend. The web application uses backend APIs to show health, activity, query, schema, alert, and asset views.

## Data Flow

1. The agent loads its TOML configuration.
2. Each configured target is validated.
3. The agent connects to the database with the configured monitoring user.
4. Engine-specific collectors run on configured intervals.
5. Payloads are sent to the Logstag agent API under `/agent-api/v1`.
6. The backend ingests and stores metrics.
7. Alert checks and health reports use the ingested data.
8. The web application reads product APIs for operator workflows.

## Trust Boundary

The agent runs inside the customer environment. It needs outbound access to the Logstag API and database access to configured targets.

Logstag does not require inbound network access to the agent. The backend receives data from the agent; it does not connect back into customer databases.

## Data Handling

Logstag collects operational metadata and statistics. Depending on the engine and enabled collectors, this can include:

- Query text or normalized query identifiers.
- Database, schema, table, index, collection, queue, or object names.
- User, role, permission, and configuration metadata.
- Runtime activity such as sessions, waits, locks, replication, memory, persistence, and command statistics.

Logstag does not read or copy application table rows.

## Main Product Areas

- Health Check: Engine-specific health reports across performance, security, configuration, schema, and maintenance signals.
- Database Explorer: Database inventory, metrics, status, alerts, and details.
- Schema Explorer: Schema, object, index, permission, and change views where supported by the engine.
- Activity Explorer: Connections, sessions, waits, blocking, and runtime activity.
- Query Explorer: Query performance and query detail views where the engine exposes query statistics.
- Alerts: Active and historical alert management.
- Assets: Monitored infrastructure and database assets.
- Integrations: External workflow and incident management integrations.
- Audit Logs: Administrative and organization audit events.
