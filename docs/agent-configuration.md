---
sidebar_position: 4
---

# Agent Configuration

The Logstag agent uses a TOML configuration file. The file has one global `[agent]` section and one `[targets.name]` section for each monitored database target.

Use the service URL and API key provided for your Logstag organization. Shared examples should use masked URLs and placeholder credentials.

## Configuration Structure

```toml
[agent]
# Global agent settings

[targets.production-db]
# Database target settings
```

Each target name must be unique in the configuration file. Use stable names that identify the environment and target clearly, such as `production-postgres` or `analytics-mssql`.

## Agent Section

```toml
[agent]
api_base_url = "https://<logstag-agent-api-base-url>"
api_key = "<your-logstag-agent-api-key>"
log_level = "info"

high_frequency_interval = 10      # 10 seconds
medium_frequency_interval = 60    # 1 minute
low_frequency_interval = 600      # 10 minutes
schema_frequency_interval = 14400 # 240 minutes
```

| Field | Required | Default | Description |
| --- | --- | ---: | --- |
| `api_base_url` | Yes | None | Logstag agent service URL for your organization. |
| `api_key` | Yes | None | API key used to authenticate the agent. |
| `log_level` | No | `info` | Logging level. Common values are `debug`, `info`, `warn`, and `error`. |
| `high_frequency_interval` | No | 10 seconds | Runtime activity and high-frequency operational signals. |
| `medium_frequency_interval` | No | 1 minute | Workload, query, replication, and similar operational signals. |
| `low_frequency_interval` | No | 10 minutes | Configuration and less frequently changing operational data. |
| `schema_frequency_interval` | No | 240 minutes | Schema, index, and other heavier metadata collection. |

Intervals are configured as seconds in TOML. Setting an interval to `0` disables that collection tier. Disable tiers only when you understand which product areas depend on them.

## Optional Agent Settings

| Field | Default | Description |
| --- | ---: | --- |
| `startup_warmup_delay` | 0 seconds | Delay before monitoring starts after agent startup. |
| `compress_request_payload` | `true` | Compress outbound monitoring payloads. |
| `update_check_enabled` | `true` | Allow the agent to check for available updates. |
| `update_channel` | `main` | Release channel used for update checks. Use the production channel unless Logstag support instructs otherwise. |
| `update_check_interval` | 1440 minutes | Interval between update checks. |
| `auto_install_updates` | `true` | Allow automatic installation of available updates. |
| `export_to_file` | `false` | Debug-only payload export. Keep disabled in production unless Logstag support directs otherwise. |
| `export_path` | Current directory | Directory used when debug payload export is enabled. |
| `mock_mode` | `false` | Local development mode that disables normal Logstag submission. |

Debug payload export can contain operational metadata, query text, object names, or security posture information depending on the enabled engines. Treat exported files as sensitive.

## Target Section

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

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | Target platform, such as `self-hosted`, `aws-rds`, or `huawei-rds`. |
| `db_engine` | Yes | Database engine identifier. |
| `db_host` | Yes | Database hostname or IP address reachable from the agent host. |
| `db_port` | Yes | Database listener port. |
| `db_username` | Yes | Dedicated monitoring user. |
| `db_password` | Yes | Monitoring user password. Empty values are valid only where the engine and deployment intentionally allow unauthenticated access. |
| `db_name` | Yes | Database name, Redis/Valkey database number, or Oracle service/PDB identifier depending on the engine. |

Use a dedicated monitoring identity for each target instead of personal administrator accounts or application users.

## Engine Values

The `db_engine` value must be lowercase.

| Engine | `db_engine` value | Default Port |
| --- | --- | ---: |
| PostgreSQL | `postgresql` | 5432 |
| Microsoft SQL Server | `mssql` | 1433 |
| MongoDB | `mongodb` | 27017 |
| Redis | `redis` | 6379 |
| Valkey | `valkey` | 6379 |
| Oracle | `oracle` | 1521 |

Engine-specific behavior:

- PostgreSQL, Microsoft SQL Server, MongoDB, and Oracle use `db_name` as the target database, service, or PDB identifier.
- Redis and Valkey use `db_name` as the database number string, such as `"0"`.
- MongoDB and Redis/Valkey can technically be configured with empty credentials only when the target deployment intentionally allows unauthenticated access. Production deployments should use authentication.
- Current Oracle connectivity does not require Oracle Instant Client for standard monitoring.

## Platform Values

| Platform | `platform` value | Notes |
| --- | --- | --- |
| Self-hosted | `self-hosted` | Standard deployment for customer-managed database targets. |
| AWS RDS | `aws-rds` | Requires cloud metadata and cloud credentials when cloud metrics are enabled. |
| Huawei Cloud RDS | `huawei-rds` | Requires cloud metadata, cloud credentials, and project ID when cloud metrics are enabled. |

Use only the managed platform values listed here unless Logstag support confirms another value for your environment.

## Managed Platform Fields

Managed targets can require additional cloud metadata and credentials.

| Field | Required when | Description |
| --- | --- | --- |
| `cloud_region` | Managed platform | Cloud region. |
| `cloud_instance_id` | Managed platform | Cloud database instance identifier. |
| `cloud_access_key` | Managed platform | Cloud access key. |
| `cloud_secret_key` | Managed platform | Cloud secret key. |
| `cloud_project_id` | Huawei Cloud RDS | Huawei project ID. |

Cloud access should be scoped to the metrics required by the managed platform integration. Store cloud secrets using encrypted local values where available.

## Sensitive Values

The agent supports encrypted local values for sensitive fields:

- `api_key`
- `db_password`
- `cloud_secret_key`

Encrypted values are machine-specific and should be generated on the host that runs the agent. Copying encrypted values between hosts will not produce a portable secret.

Use plain text values only for local testing or controlled troubleshooting. Production configurations should use encrypted local values where available and should be readable only by the agent service account and administrators.

## Multiple Targets

A single agent configuration can define multiple targets:

```toml
[targets.production-postgres]
platform = "self-hosted"
db_engine = "postgresql"
db_host = "postgres.example.internal"
db_port = 5432
db_username = "logstag_monitor"
db_password = "<postgres-monitor-password>"
db_name = "postgres"

[targets.analytics-redis]
platform = "self-hosted"
db_engine = "redis"
db_host = "redis.example.internal"
db_port = 6379
db_username = "logstag_monitor"
db_password = "<redis-monitor-password>"
db_name = "0"
```

Configure only targets that the agent host can reach. If targets live in separate network zones, deploy separate agents closer to those databases.

## Validate Configuration

Validate the configuration before starting or restarting the service.

Linux:

```bash
/opt/logstag-agent/bin/logstag-agent --check-config
sudo systemctl restart logstag-agent
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" --check-config
Restart-Service "Logstag Agent"
```

After restart, check the agent logs for configuration, authentication, connectivity, and permission errors.

## Configuration Guidance

- Keep production API keys, passwords, and cloud secrets out of tickets, screenshots, and shared documentation.
- Use one dedicated monitoring user per engine or target group.
- Keep target names stable; changing names may affect how operators recognize assets.
- Keep debug payload export disabled in production unless Logstag support directs otherwise.
- Prefer the default intervals unless there is a specific operational reason to tune them.
- Use engine setup pages to prepare database permissions before expecting full product coverage.
