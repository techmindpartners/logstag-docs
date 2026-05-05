---
sidebar_position: 6
---

# Managed Targets

Managed targets are database targets where Logstag needs cloud provider metadata in addition to normal database connection settings.

Use `self-hosted` for databases where the agent should rely on direct database monitoring and, when applicable, local host system metrics. Use a managed platform value when the database runs on a supported cloud database service and Logstag should collect cloud-side system metrics for that instance.

## Platform Model

Each target has a `platform` value:

| Platform | Value | Use When |
| --- | --- | --- |
| Self-hosted | `self-hosted` | The database is self-managed or should be monitored through direct database access only. |
| AWS RDS | `aws-rds` | The target is an Amazon RDS instance and cloud system metrics should be collected. |
| Huawei Cloud RDS | `huawei-rds` | The target is a Huawei Cloud RDS instance and cloud system metrics should be collected. |

Do not configure undocumented platform values unless Logstag support confirms them for your environment.

## What Changes for Managed Targets

For managed targets, the agent still connects to the database using the configured database host, port, username, password, and database name.

The difference is that the agent also uses cloud metadata and cloud credentials to collect provider-side system metrics such as CPU, memory, and network signals. This helps avoid misleading local host metrics when the agent runs outside the managed database host.

When any target is remote or managed, local agent-host system metrics may not represent the database server. In that case, the managed platform integration is the preferred source for server-level system signals.

## Required Fields

All targets require the standard database fields:

```toml
[targets.production-rds]
platform = "aws-rds"
db_engine = "postgresql"
db_host = "production-db.example.cloud"
db_port = 5432
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "postgres"
```

Managed targets also require cloud fields.

| Field | AWS RDS | Huawei Cloud RDS | Description |
| --- | --- | --- | --- |
| `cloud_region` | Required | Required | Cloud region where the managed database instance runs. |
| `cloud_instance_id` | Required | Required | Managed database instance identifier. |
| `cloud_access_key` | Required | Required | Cloud access key used for metric collection. |
| `cloud_secret_key` | Required | Required | Cloud secret key used for metric collection. |
| `cloud_project_id` | Not used | Required | Huawei Cloud project identifier. |

## AWS RDS Example

```toml
[targets.production-postgres-rds]
platform = "aws-rds"
db_engine = "postgresql"
db_host = "production-postgres.example.cloud"
db_port = 5432
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "postgres"

cloud_region = "<aws-region>"
cloud_instance_id = "<rds-instance-id>"
cloud_access_key = "<cloud-access-key>"
cloud_secret_key = "<cloud-secret-key>"
```

AWS RDS system metric collection requires Enhanced Monitoring to be enabled for the target instance. Use a monitoring interval that provides enough resolution for your operational needs.

The cloud identity should have only the permissions required to describe the RDS instance and read the Enhanced Monitoring metric stream for that instance.

## Huawei Cloud RDS Example

```toml
[targets.production-postgres-huawei]
platform = "huawei-rds"
db_engine = "postgresql"
db_host = "production-postgres.example.cloud"
db_port = 5432
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "postgres"

cloud_region = "<huawei-region>"
cloud_project_id = "<huawei-project-id>"
cloud_instance_id = "<rds-instance-id>"
cloud_access_key = "<cloud-access-key>"
cloud_secret_key = "<cloud-secret-key>"
```

Huawei Cloud RDS targets require the project identifier in addition to region, instance ID, and cloud credentials.

## Database Name and Discovery

For managed targets, enter the database name explicitly. Automatic database discovery may not be available for cloud platform flows.

Use the same `db_name` conventions as other targets:

- PostgreSQL, Microsoft SQL Server, MongoDB, and Oracle use the target database, service, or PDB identifier.
- Redis and Valkey use the database number as a string, such as `"0"`.

## Credential Handling

Managed targets include two credential sets:

| Credential Type | Purpose |
| --- | --- |
| Database credentials | Connect to the monitored database and collect database-level metadata and runtime signals. |
| Cloud credentials | Collect provider-side system metrics for the managed database instance. |

Store `db_password` and `cloud_secret_key` using encrypted local values where available. Cloud credentials should be scoped to the monitored instances and rotated according to your internal credential policy.

Do not use broad personal cloud credentials for agent deployments. Prefer a dedicated cloud identity with the minimum permissions required for monitoring.

## Verification

After configuring a managed target:

1. Validate the agent configuration.
2. Restart the agent.
3. Confirm the database target appears in Logstag.
4. Confirm database-level metrics are arriving.
5. Confirm cloud system metrics are arriving for the managed instance.
6. Check the agent logs for cloud authentication, region, instance ID, or permission errors.

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

If database metrics arrive but cloud system metrics do not:

- Confirm the target uses `aws-rds` or `huawei-rds`.
- Confirm `cloud_region` matches the instance region.
- Confirm `cloud_instance_id` matches the managed database instance identifier.
- For Huawei Cloud RDS, confirm `cloud_project_id` is correct.
- Confirm the cloud access key and secret key are valid.
- Confirm the cloud identity has the required monitoring permissions.
- For AWS RDS, confirm Enhanced Monitoring is enabled for the instance.

If cloud system metrics arrive but database metrics do not, troubleshoot the database host, port, database credentials, and engine-specific permissions.
