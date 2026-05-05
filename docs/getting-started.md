---
sidebar_position: 2
---

# Getting Started

This page describes the minimum setup path for a Logstag agent. Use it to understand the flow before moving to engine-specific configuration.

## Setup Flow

1. Create or obtain a Logstag API key.
2. Install the Logstag agent on a host that can reach the monitored database and the Logstag API.
3. Create a database user with the required monitoring permissions.
4. Configure one or more database targets in the agent TOML file.
5. Start the agent and verify that the database appears in Logstag.

## Prerequisites

The agent host needs:

- Network access to each monitored database target.
- Outbound HTTPS access to the Logstag agent API.
- Permission to run the agent as a service, container, or foreground process.
- A Logstag API key for the organization.

Each database target needs:

- A dedicated monitoring user where the engine supports user-based access control.
- Read-only access to the engine views, catalogs, statistics, or commands required by the relevant collectors.
- Engine-specific extensions or features when required, such as `pg_stat_statements` for PostgreSQL query statistics or Query Store for Microsoft SQL Server query history.

## Agent API Endpoint

Use the agent API endpoint as the base URL:

```toml
[agent]
api_base_url = "https://api.logstag.com/agent-api/v1"
api_key = "your_api_key_here"
```

The agent sends the API key in request headers and uses the endpoint paths under `/agent-api/v1` for registration and metric ingestion.

## Basic Agent Configuration

The agent uses TOML configuration. A minimal configuration looks like this:

```toml
[agent]
api_base_url = "https://api.logstag.com/agent-api/v1"
api_key = "your_api_key_here"
log_level = "info"

high_frequency_interval = 10
medium_frequency_interval = 60
low_frequency_interval = 600
schema_frequency_interval = 14400

[targets.production-postgres]
platform = "self-hosted"
db_engine = "postgresql"
db_host = "postgres.example.internal"
db_port = 5432
db_username = "logstag_monitor"
db_password = "your_database_password"
db_name = "postgres"
```

For production environments, prefer encrypted values for sensitive fields after the agent is installed on the target host. Encrypted values are machine-specific and should not be copied between hosts.

## Supported Target Engines

The `db_engine` value must match one of the supported agent engines:

| Engine | `db_engine` value |
| --- | --- |
| PostgreSQL | `postgresql` |
| Microsoft SQL Server | `mssql` |
| MongoDB | `mongodb` |
| Redis | `redis` |
| Valkey | `valkey` |
| Oracle | `oracle` |

For Redis and Valkey, `db_name` is the database number as a string, such as `"0"`. For Oracle, `db_name` identifies the service or pluggable database depending on the deployment.

## Platform Values

Use `self-hosted` for standard self-managed targets.

Managed platform support exists for cloud-specific flows such as `aws-rds` and `huawei-rds`. These targets require additional cloud fields, including region, instance ID, access key, secret key, and Huawei project ID where applicable.

## Install the Agent

The agent repository includes packaging assets for Linux, Windows, and Docker-based deployment. Public package distribution URLs should be verified against the current release process before publishing end-user installation commands.

Until the release channel is finalized, documentation should describe the supported installation modes without promising package URLs that are not part of the verified release workflow.

## Create a Monitoring User

Create a dedicated monitoring user per database engine. The exact permissions differ by engine:

- PostgreSQL needs access to statistics views and catalog metadata. `pg_monitor` is the usual starting point for supported PostgreSQL versions.
- Microsoft SQL Server needs server and database state visibility for DMVs, Query Store, schema, and performance counters.
- MongoDB needs cluster, server, database, collection, operation, and security metadata visibility.
- Redis and Valkey need access to monitoring commands such as `INFO`, command statistics, slowlog, latency, and ACL metadata where configured.
- Oracle needs access to dynamic performance views and dictionary metadata required by the selected collectors.

Use the engine-specific setup pages before publishing final permission snippets. Permission examples should be tested against the current collectors.

## Start and Verify

After configuration:

1. Start or restart the agent.
2. Check the agent logs for configuration, registration, connection, and ingestion errors.
3. Open Logstag and confirm that the database appears in Database Explorer or the relevant inventory view.
4. Confirm that metrics begin appearing for the expected product areas.

The first visible data depends on the configured interval and engine. Runtime activity can appear quickly; schema and index metadata can take longer because it is collected on the schema interval.

## Troubleshooting Checklist

Check these items first:

- `api_base_url` includes `/agent-api/v1`.
- The API key belongs to the expected Logstag organization.
- The agent host can resolve and reach the Logstag API over HTTPS.
- The agent host can reach the database host and port.
- The database user can connect to the target database.
- Required database views, commands, extensions, or features are enabled.
- The configured `db_engine` value matches the actual database engine.
- The target name under `[targets.name]` is unique in the config file.

For deeper troubleshooting, use the relevant engine setup page and the agent log location for your deployment mode.
