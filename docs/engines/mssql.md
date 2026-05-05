---
sidebar_position: 2
---

# Microsoft SQL Server Setup

Logstag monitors Microsoft SQL Server through server and database metadata, dynamic management views, Query Store where enabled, performance counters, schema metadata, index metadata, security metadata, and Availability Groups metadata where applicable.

Use a dedicated monitoring login. The account should be able to connect to the monitored database and read operational metadata, but it should not own application schemas or application data.

## Target Configuration

Add a target entry to the agent configuration.

```toml
[targets.production-mssql]
platform = "self-hosted"
db_engine = "mssql"
db_host = "sqlserver.example.internal"
db_port = 1433
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "YourDatabase"
```

Use a stable target name that identifies the environment and SQL Server target clearly. The `db_name` value should point to the database Logstag is expected to monitor.

## Access Model

| Access area | Required for |
| --- | --- |
| SQL Server login | Connecting to the SQL Server instance. |
| Database user | Connecting to the monitored database. |
| `VIEW SERVER STATE` | Session activity, requests, connections, waits, performance counters, and server-level runtime visibility. |
| `VIEW DATABASE STATE` | Database-level runtime metadata and Query Store visibility. |
| Metadata visibility | Schemas, tables, columns, indexes, procedures, views, functions, permissions, users, and roles visible to the monitoring user. |
| Availability Groups visibility | Availability Group state and replica metadata when Always On monitoring is expected. |

Some hardened SQL Server environments may split server state and performance visibility differently by version or policy. In that case, grant the equivalent read-only visibility approved by the database administration team.

## Create a Monitoring Login

Create a dedicated SQL Server login and map it to a user in the monitored database.

```sql
USE [master];
CREATE LOGIN [logstag_monitor] WITH PASSWORD = '<strong-password>';
GO

USE [<database_name>];
CREATE USER [logstag_monitor] FOR LOGIN [logstag_monitor];
GRANT CONNECT TO [logstag_monitor];
GO
```

Replace `<database_name>` with the monitored database name.

## Grant Monitoring Visibility

Grant server-level and database-level metadata visibility to the monitoring account.

```sql
USE [master];
GRANT VIEW SERVER STATE TO [logstag_monitor];
GO

USE [<database_name>];
GRANT VIEW DATABASE STATE TO [logstag_monitor];
GO
```

These grants are intended for observability metadata. They do not grant ownership over application schemas and do not grant write access to application tables.

## Query Store

Query Store is recommended for query performance history. It provides persisted query, plan, runtime, and interval-based metadata that is more reliable than volatile plan-cache visibility.

Enable Query Store on each monitored database where query performance history is expected.

```sql
ALTER DATABASE [<database_name>] SET QUERY_STORE = ON;
GO
```

If Query Store is not enabled, query performance coverage can be reduced. DMV-based visibility may depend on plan cache state, instance restart history, and SQL Server permissions.

## Availability Groups

If the SQL Server instance uses Always On Availability Groups, confirm that the monitoring account can read the required Availability Group catalog and runtime metadata.

Availability Group monitoring is only relevant for SQL Server environments where Always On is configured. If the target does not use Availability Groups, no additional setup is needed for this area.

## Data Collected

Depending on enabled collectors and granted visibility, Logstag can collect:

- Session activity, requests, blocking, waits, connection metadata, and current SQL text.
- Database activity, file and storage signals, and performance counters.
- Query performance statistics from Query Store, with reduced coverage when only DMV-based visibility is available.
- Instance configuration, server runtime state, memory signals, and system-level metadata exposed by SQL Server.
- Schema metadata, including schemas, tables, columns, indexes, views, procedures, functions, and object definitions visible to the monitoring user.
- Security metadata, including logins, users, roles, role membership, permission grants, disabled login indicators, and sysadmin membership visibility.
- Index usage and partition or row estimate metadata.
- Availability Group, replica, and synchronization metadata where Always On is configured.

Logstag does not copy table rows as database content. SQL text, object definitions, login names, client host metadata, schema names, object names, role names, and permission metadata can still be sensitive and should be treated as operational metadata.

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
| Connection fails | Confirm host, port, database name, login, password, firewall rules, and SQL Server authentication policy. |
| Session or performance metrics are missing | Confirm server-level state visibility for the monitoring login. |
| Query performance history is incomplete | Confirm Query Store is enabled on the monitored database and the user has database state visibility. |
| Schema or security metadata is incomplete | Confirm the mapped database user can see the relevant metadata, users, roles, objects, and permission grants. |
| Availability Group data is missing | Confirm Always On is configured and the monitoring login can read Availability Group metadata. |
| No metrics arrive after configuration changes | Validate the configuration, restart the agent, and review local agent logs. |
