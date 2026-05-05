---
sidebar_position: 1
---

# PostgreSQL Setup

Logstag monitors PostgreSQL through system statistics views, catalog metadata, role metadata, replication metadata, and query statistics when `pg_stat_statements` is enabled.

Use a dedicated monitoring user. Do not use a personal administrator account or an application user for the agent.

## Supported Target Configuration

```toml
[targets.production-postgres]
platform = "self-hosted"
db_engine = "postgresql"
db_host = "postgres.example.internal"
db_port = 5432
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "postgres"
```

For AWS RDS or Huawei Cloud RDS, set `platform` to the relevant managed platform value and add the cloud fields described in Managed Targets.

## Access Model

For PostgreSQL 10 and later, `pg_monitor` is the recommended starting point. It gives the monitoring user read access to PostgreSQL statistics and settings without requiring superuser privileges.

Logstag also needs schema visibility for the schemas you want represented in schema, table, index, function, sequence, and permission views.

| Access | Purpose |
| --- | --- |
| `CONNECT` on the monitored database | Allows the agent to connect. |
| `pg_monitor` | Allows access to PostgreSQL monitoring views and settings. |
| `USAGE` on monitored schemas | Allows schema metadata collection for user-defined objects. |
| `pg_stat_statements` | Enables query performance statistics when installed and loaded. |

## Create the Monitoring User

Run as a PostgreSQL administrator:

```sql
CREATE USER logstag_monitor WITH PASSWORD '<strong-password>';
```

Grant connection access to each monitored database:

```sql
GRANT CONNECT ON DATABASE <database_name> TO logstag_monitor;
```

Grant the monitoring role:

```sql
GRANT pg_monitor TO logstag_monitor;
```

Grant schema visibility for each application schema that should appear in Logstag:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO logstag_monitor;
```

Repeat the schema grant for each schema you want monitored.

## Enable Query Statistics

Logstag uses `pg_stat_statements` for query performance metrics. Without it, PostgreSQL monitoring still works, but query statistics are unavailable.

Enable the extension in PostgreSQL configuration:

```conf
shared_preload_libraries = 'pg_stat_statements'
```

This setting requires a PostgreSQL restart when it is changed.

Create the extension in each monitored database where query statistics should be collected:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

The extension records normalized query text and execution statistics. Treat query statistics as sensitive operational metadata.

## Optional PostgreSQL Settings

Some PostgreSQL settings improve metric quality:

| Setting | Effect |
| --- | --- |
| `track_io_timing` | Enables block read/write timing metrics where PostgreSQL exposes them. |
| `track_activity_query_size` | Controls how much active query text PostgreSQL keeps visible in activity views. |

Review these settings with the database owner before changing them. They affect PostgreSQL behavior outside Logstag.

## Data Collected

Depending on server role, PostgreSQL version, enabled extensions, and permissions, Logstag can collect:

- Active sessions, wait events, blocking relationships, and client metadata.
- Database activity counters, deadlocks, temporary file usage, buffer activity, and transaction counters.
- Query performance statistics from `pg_stat_statements`.
- Replication lag on primary servers.
- Recovery conflict statistics on replica servers.
- Schema, table, column, index, view, function, sequence, foreign key, and constraint metadata.
- Role, membership, schema privilege, table privilege, and function privilege metadata.
- PostgreSQL settings and vacuum activity.

Query text, role names, schema names, object names, client addresses, and application names can be sensitive. Review Data Collection and Privacy before enabling production monitoring.

## Primary and Replica Behavior

Logstag adjusts PostgreSQL collection based on server role:

| Server Role | Collection Notes |
| --- | --- |
| Primary | Collects runtime activity, query statistics, database activity, schema metadata, settings, roles, and replication lag for connected replicas. |
| Replica | Collects runtime activity, database activity, schema metadata, settings, roles, and recovery conflict statistics. |

Query statistics depend on `pg_stat_statements` availability in the monitored database.

## Managed PostgreSQL

For managed PostgreSQL services such as AWS RDS or Huawei Cloud RDS:

- Use the managed platform value only when cloud-side system metrics should be collected.
- Confirm the database user has the PostgreSQL permissions described above.
- Confirm cloud credentials and instance metadata are configured for managed platform metrics.
- Confirm provider-side monitoring prerequisites are enabled where required.

Database-level PostgreSQL permissions and cloud-provider permissions are separate. Both must be correct for full coverage.

## Validate Setup

After updating the database and agent configuration:

1. Validate the agent configuration.
2. Restart the agent.
3. Check the agent logs for connection, authentication, permission, or extension errors.
4. Confirm the PostgreSQL target appears in Logstag.
5. Confirm runtime metrics appear.
6. Confirm query statistics appear if `pg_stat_statements` was enabled.
7. Confirm schema and index metadata appear after the schema collection interval.

Linux:

```bash
/opt/logstag-agent/bin/logstag-agent --check-config
sudo systemctl restart logstag-agent
sudo journalctl -u logstag-agent -f
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" --check-config
Restart-Service "Logstag Agent"
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Tail 50
```

## Troubleshooting

If PostgreSQL data does not appear:

- Confirm the agent host can reach `db_host` and `db_port`.
- Confirm `db_engine` is set to `postgresql`.
- Confirm `db_name` matches the monitored database.
- Confirm the monitoring user can connect to the database.
- Confirm the monitoring user has `pg_monitor`.
- Confirm the monitoring user has `USAGE` on the schemas you expect to monitor.
- Confirm `pg_stat_statements` is installed and loaded if query statistics are expected.
- Confirm the agent was restarted after configuration changes.

If only query statistics are missing, focus on `pg_stat_statements` installation, `shared_preload_libraries`, database-level extension creation, and PostgreSQL restart status.
