---
sidebar_position: 5
---

# Security Model

Logstag uses an agent-based monitoring model. The agent runs in the customer environment, connects to configured database targets, reads operational metadata, and sends monitoring payloads to Logstag.

The model is designed around controlled access, explicit credentials, and permission-based visibility. Logstag does not sit in the application transaction path and does not act as a database proxy.

## Access Principles

Logstag follows these principles for database monitoring:

| Principle | Meaning |
| --- | --- |
| Customer-controlled access | The agent only connects to targets configured by the operator. |
| Dedicated monitoring identity | Each database target should use a dedicated monitoring user or service account. |
| Least practical privilege | Grant only the permissions required for the enabled engine and monitoring scope. |
| Read-oriented collection | The agent reads system views, metadata, runtime statistics, and engine diagnostic outputs. |
| Permission-based coverage | If a required permission is missing, the affected signal may be unavailable instead of being inferred. |

Some database engines expose monitoring and security posture data through privileged metadata views. For those engines, the monitoring user may need broad read access to system catalogs or performance views. This should be reviewed by the database owner before production rollout.

## Network Model

The agent is deployed inside the customer-controlled environment. It needs network access to:

- The configured database targets.
- The Logstag service.
- Cloud provider APIs, when cloud platform metrics are enabled.

The agent initiates outbound communication to Logstag. Normal monitoring does not require inbound access from Logstag into the customer network.

Operators should restrict egress to the expected Logstag destination, keep database access scoped to the agent host, and use network controls appropriate for the deployment environment.

## Credential Handling

The agent uses credentials supplied by the operator. Depending on the configured targets, these may include:

- Agent API key.
- Database username and password.
- Cloud provider access key and secret key.
- Cloud region, project, and instance identifiers.

Sensitive configuration values can be stored using the agent's encrypted local format. Encrypted values are bound to the machine where they were created, so they should be generated on the host that runs the agent.

Production deployments should use encrypted local secrets where available, restrict file permissions on the agent configuration, rotate credentials on a defined schedule, and avoid using personal administrator accounts for monitoring.

## Database Permissions

The exact permission set depends on the database engine and enabled monitoring capabilities.

| Engine | Typical Access Scope |
| --- | --- |
| PostgreSQL | Connection access, monitoring role access, schema metadata visibility, and query statistics when enabled. |
| Microsoft SQL Server | Database and server state visibility, Query Store or DMV visibility, schema metadata, role metadata, and availability metadata where applicable. |
| MongoDB | Server and database statistics, collection and index metadata, role and user metadata where permitted, and optional current operation visibility. |
| Redis / Valkey | Runtime information, client metadata, replication state, slow log entries, configuration metadata, and ACL metadata where permitted. |
| Oracle | Session access, dictionary and performance view visibility, schema metadata, role and privilege metadata, and profile/security posture settings. |

Engine-specific setup pages should be used for concrete permission preparation. This page describes the security model; it does not replace DBA review for production access.

## Sensitive Metadata

Logstag collects operational metadata, not application datasets. However, some metadata can still be sensitive.

Examples include:

- Query text or query fragments.
- Redis slow log command arguments.
- MongoDB operation metadata when current operation visibility is enabled.
- Database, schema, table, collection, index, function, procedure, and user-defined object names.
- User, role, permission, and privilege metadata.
- Client host, application, session, and connection metadata.
- Configuration and security posture indicators.

Treat Logstag monitoring data as operationally sensitive. Access to the Logstag workspace should be limited to users who are allowed to inspect database performance, security posture, and schema-level metadata.

## Read-Only Behavior

Monitoring collection is designed to read from engine-provided metadata and diagnostic interfaces.

Logstag does not require application write access for monitoring. It does not create, update, or delete application rows, MongoDB documents, Redis keys, or Oracle/MSSQL/PostgreSQL schema objects as part of normal monitoring.

For Redis and Valkey, the agent reads slow log entries without resetting the slow log. Normal monitoring does not rely on state-changing commands.

Some engines require read access to powerful metadata interfaces. A permission may be read-only while still revealing sensitive operational or security information. Review those grants according to your internal access policy.

## Permission-Limited Data

When the monitoring user lacks permission for a specific signal, Logstag treats that signal as unavailable or permission-limited.

This matters for:

- Query performance data that depends on engine-level query statistics.
- Security posture data that depends on user, role, ACL, or privilege visibility.
- Live operation visibility in MongoDB.
- Redis and Valkey ACL inspection.
- Oracle performance views that may require additional licensing or database privileges.

Unavailable data is not a healthy zero-value metric. It means the agent could not observe that signal under the current permission model.

## Operator Responsibilities

Before production rollout:

1. Use a dedicated monitoring identity for each target.
2. Grant only the permissions required for the enabled engine and monitoring scope.
3. Store agent credentials using encrypted local secrets where available.
4. Restrict access to the agent configuration file.
5. Limit database network access to the agent host or approved runtime environment.
6. Review which metadata categories are acceptable for your environment.
7. Rotate API keys, database passwords, and cloud secrets according to your internal policy.
8. Restrict Logstag workspace access to authorized operational users.

The security model should be reviewed together with the Data Collection and Privacy page and the engine-specific setup pages.
