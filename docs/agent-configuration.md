---
sidebar_position: 4
---

# Agent Configuration

The Logstag agent uses a TOML configuration file with one global `[agent]` section and one `[targets.name]` section for each database target.

## Agent Section

```toml
[agent]
api_base_url = "https://api.logstag.com/agent-api/v1"
api_key = "your_api_key_here"
log_level = "info"

high_frequency_interval = 10
medium_frequency_interval = 60
low_frequency_interval = 600
schema_frequency_interval = 14400
```

| Field | Required | Default | Description |
| --- | --- | ---: | --- |
| `api_base_url` | Yes | None | Logstag agent API endpoint. Use the `/agent-api/v1` base path. |
| `api_key` | Yes | None | API key used to authenticate the agent. |
| `log_level` | No | `info` | Logging level. Common values are `debug`, `info`, `warn`, and `error`. |
| `high_frequency_interval` | No | `10` | Runtime metrics that need frequent visibility. |
| `medium_frequency_interval` | No | `60` | Workload, query, replication, and similar metrics. |
| `low_frequency_interval` | No | `600` | Configuration and less frequently changing operational data. |
| `schema_frequency_interval` | No | `14400` | Schema and index metadata collection. |

## Target Section

```toml
[targets.production-db]
platform = "self-hosted"
db_engine = "postgresql"
db_host = "db.example.internal"
db_port = 5432
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "postgres"
```

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | Target platform, such as `self-hosted`, `aws-rds`, or `huawei-rds`. |
| `db_engine` | Yes | One of `postgresql`, `mssql`, `mongodb`, `redis`, `valkey`, or `oracle`. |
| `db_host` | Yes | Database hostname or IP address. |
| `db_port` | Yes | Database listener port. |
| `db_username` | Yes | Monitoring user. |
| `db_password` | Yes | Monitoring user password. Empty values are valid only where the engine and deployment allow unauthenticated access. |
| `db_name` | Yes | Database name, Redis/Valkey database number, or Oracle service/PDB identifier depending on the engine. |

## Managed Platform Fields

Managed targets such as `aws-rds` and `huawei-rds` require cloud metadata and credentials.

| Field | Required when | Description |
| --- | --- | --- |
| `cloud_region` | Managed platform | Cloud region. |
| `cloud_instance_id` | Managed platform | Cloud database instance identifier. |
| `cloud_access_key` | Managed platform | Cloud access key. |
| `cloud_secret_key` | Managed platform | Cloud secret key. |
| `cloud_project_id` | Huawei RDS | Huawei project ID. |

## Sensitive Values

The agent supports encrypted values for sensitive fields such as `api_key`, `db_password`, and cloud secret keys. Encrypted values are derived from host-specific system properties and should be generated on the same machine that runs the agent.

Plain text values can be useful during local development, but production configurations should use encrypted values where possible.
