---
sidebar_position: 3
---

# MongoDB Setup

Logstag monitors MongoDB through server commands, database statistics, collection statistics, index usage metadata, connection pool metadata, replication metadata, and security metadata where permissions allow it.

Use a dedicated monitoring user with read access to MongoDB operational metadata. Keep this user separate from application users and without write access to application collections.

## Target Configuration

Add a target entry to the agent configuration.

```toml
[targets.production-mongodb]
platform = "self-hosted"
db_engine = "mongodb"
db_host = "mongodb.example.internal"
db_port = 27017
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "YourDatabase"
```

Use `db_name` for the database Logstag should monitor. If the MongoDB deployment is configured without authentication, `db_username` and `db_password` can be left empty, but this should be limited to controlled development environments.

## Access Model

| Access area | Required for |
| --- | --- |
| Database connection | Agent connection checks and target registration. |
| `read` on the monitored database | Database statistics, collection discovery, collection statistics, index usage, and document size estimates. |
| `clusterMonitor` | Server statistics, connection pool metadata, collection operation timings, and replica set status. |
| User and role visibility | Security inventory, role assignments, inherited roles, and privilege analysis. |
| Replica set visibility | Replication state and lag metadata for replica set deployments. |
| Current operation visibility | Optional operation-level diagnostics when enabled and permitted. |

Security inventory and current operation visibility can expose sensitive operational metadata. Grant these only when that level of visibility is expected.

## Create a Monitoring User

Create the monitoring user in the monitored database and grant read-only database access plus cluster monitoring visibility.

```javascript
use YourDatabase

db.createUser({
  user: "logstag_monitor",
  pwd: "<strong-password>",
  roles: [
    { role: "read", db: "YourDatabase" },
    { role: "clusterMonitor", db: "admin" }
  ]
})
```

Replace `YourDatabase` with the monitored database name.

If the user already exists, grant the same roles instead of recreating it.

```javascript
use YourDatabase

db.grantRolesToUser("logstag_monitor", [
  { role: "read", db: "YourDatabase" },
  { role: "clusterMonitor", db: "admin" }
])
```

## Optional Security Inventory

MongoDB security inventory uses user and role metadata. This can include user names, authentication databases, direct roles, inherited roles, and privilege levels.

If security inventory is required, the monitoring user needs permission to read user and role information. In many environments this requires a user administration role, which is broader than standard monitoring access.

```javascript
use YourDatabase

db.grantRolesToUser("logstag_monitor", [
  { role: "userAdminAnyDatabase", db: "admin" }
])
```

Only grant this role when Logstag is expected to report MongoDB security posture. If the role is not granted, Logstag can still collect operational metrics and skip security inventory where MongoDB denies access.

## Optional Current Operation Diagnostics

Current operation diagnostics are permission-dependent and work best as a controlled diagnostic layer. They can expose namespace, operation type, application name, execution duration, lock state, and client metadata.

When enabled and permitted, Logstag collects minimized operation metadata. Full command bodies, literal query filters, raw aggregation pipelines, and document payloads are outside the required monitoring data boundary.

If the environment does not allow this visibility, MongoDB operational monitoring still works from aggregate server, database, collection, index, and replication metadata.

## Data Collected

Depending on enabled collectors and granted visibility, Logstag can collect:

- Server runtime metrics, uptime, memory, network counters, operation counters, lock counters, and WiredTiger cache signals.
- Connection pool metadata for clustered, replica set, or sharded deployments.
- Database statistics, collection counts, document counts, average document size, storage size, index size, and filesystem size signals.
- Collection operation timings for reads, writes, commands, cursor operations, and lock-related timings.
- Collection metadata, namespace names, index names, index sizes, index usage counters, capped collection settings, and sharding-related collection signals where present.
- Static server information, including MongoDB version, storage engine, host capacity, CPU architecture, operating system name, and configured limits exposed by MongoDB.
- Replica set status, role, set name, oplog size, and replication lag where applicable.
- Security metadata, including users, roles, inherited roles, and privilege level analysis when the monitoring user has the required visibility.

Logstag does not copy MongoDB documents as dataset content. Collection statistics may execute metadata-focused aggregations, including document size estimation, but exported values remain measurements and operational metadata rather than document payloads.

## Deployment Notes

Standalone MongoDB, replica set, and sharded deployments expose different metadata. For example, connection pool and replication fields may be empty or unavailable on standalone instances.

For managed MongoDB services, confirm which admin commands and cluster roles are allowed by the provider. If a provider restricts an admin command, Logstag may collect the remaining metrics and report reduced coverage for the restricted area.

## Validate Setup

After updating the target configuration, validate the agent configuration before restarting the service.


Restart the agent after validation.

```bash
sudo systemctl restart logstag-agent
sudo systemctl status logstag-agent
```

On Windows, restart the Logstag Agent service from the Services console or with the approved service management command used in your environment.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Connection fails | Confirm host, port, database name, credentials, firewall rules, TLS policy, and MongoDB authentication settings. |
| Server metrics are missing | Confirm the monitoring user has cluster monitoring visibility. |
| Database or collection metrics are missing | Confirm the user has `read` access on the monitored database and can list collections. |
| Connection pool metrics are empty | Confirm the deployment type. Standalone instances may not expose meaningful connection pool data. |
| Replication metrics are missing | Confirm the target is part of a replica set and the user has cluster monitoring visibility. |
| Security inventory is missing | Confirm user and role visibility is intentionally granted. If not granted, this area is expected to be unavailable. |
| Current operation diagnostics are unavailable | Confirm the required diagnostic visibility is granted and that collection is enabled for the target. |
| No metrics arrive after configuration changes | Re-check the target settings in the configuration file, restart the agent, and review local agent logs. |
