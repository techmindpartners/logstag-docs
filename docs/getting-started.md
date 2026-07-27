---
sidebar_position: 2
---

# Getting Started

This page describes the minimum setup path for a Logstag agent. Use it to understand the flow before moving to installation, configuration, and engine-specific setup pages.

## Before You Start

You need:

- A Logstag workspace with permission to create or obtain an agent API key.
- A host that can reach the monitored database targets.
- Outbound HTTPS access from the agent host to the Logstag service.
- A dedicated monitoring user for each database target where the engine supports user-based access control.
- The engine-specific prerequisites required for the signals you want to collect.

Some product areas depend on database features or permissions that may not be enabled by default. For example, query performance history and security posture signals often require additional engine-level visibility.

## Setup Flow

1. Create or obtain a Logstag agent API key.
2. Choose an installation method for the agent.
3. Prepare a dedicated monitoring user for the database engine.
4. Configure the agent with the Logstag service URL, API key, and one or more targets.
5. Start the agent.
6. Verify that the target appears in Logstag and begins reporting data.

## Choose an Installation Method

Logstag agent installation can be handled through the supported deployment mode for your environment:

- Linux package installation.
- Windows service installation.
- Docker-based deployment.
- Foreground execution for testing or controlled validation.

Use the Agent Installation page for deployment-specific commands and service management details.

## Prepare Database Access

Create a dedicated monitoring identity for each database target instead of using personal administrator accounts or application users for monitoring.

At a high level, the monitoring identity needs read-oriented access to the engine metadata and runtime signals used by Logstag:

| Engine | Access Focus |
| --- | --- |
| PostgreSQL | Statistics views, catalog metadata, schema metadata, and query statistics when enabled. |
| Microsoft SQL Server | Database and server state visibility, query performance metadata, schema metadata, and role metadata. |
| MongoDB | Server, database, collection, index, operation, and security metadata where permitted. |
| Redis / Valkey | Runtime information, client metadata, replication state, slow log entries, configuration metadata, and ACL metadata where permitted. |
| Oracle | Dictionary metadata, performance views, session visibility, schema metadata, and security posture settings. |

Use the engine-specific setup pages for concrete permissions. The required scope can vary by database version, deployment model, and enabled Logstag capabilities.

## Configure the Agent

The quickest way to configure the agent is the interactive `logstag-agent configure` command. It walks through the Logstag service URL, API key, and target setup, and is what the installers invoke automatically.

The agent uses a TOML configuration file with one global `[agent]` section and one `[targets.name]` section for each monitored target. This is the same configuration that `logstag-agent configure` writes, and it can also be edited manually.

Use the Logstag agent service URL provided for your organization. Shared examples should use masked URLs and placeholder credentials.

```toml
[agent]
api_base_url = "https://<logstag-agent-api-base-url>"
api_key = "<your-logstag-agent-api-key>"
log_level = "info"

[targets.production-postgres]
platform = "self-hosted"
db_engine = "postgresql"
db_host = "postgres.example.internal"
db_port = 5432
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "postgres"
```

For production environments, store sensitive values using the agent's encrypted local format where available. Encrypted values are machine-specific and should be generated on the host that runs the agent.

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

Managed platform support exists for cloud-specific flows such as AWS RDS and Huawei Cloud RDS. These targets require additional cloud fields, including region, instance ID, access key, secret key, and Huawei project ID where applicable.

## Start and Verify

After configuration:

1. Start or restart the agent.
2. Check the agent logs for configuration, registration, connection, and ingestion errors.
3. Open Logstag and confirm that the database appears in Database Explorer or the relevant inventory view.
4. Confirm that metrics begin appearing for the expected product areas.

The first visible data depends on the configured interval and engine. Runtime activity can appear quickly; schema and index metadata can take longer because it is collected less frequently.

## Troubleshooting Checklist

Check these items first:

- The Logstag agent service URL is configured correctly.
- The API key belongs to the expected Logstag organization.
- The agent host can resolve and reach the Logstag service over HTTPS.
- The agent host can reach the database host and port.
- The database user can connect to the target database.
- Required database views, commands, extensions, or features are enabled.
- The configured `db_engine` value matches the actual database engine.
- The target name under `[targets.name]` is unique in the config file.

For deeper troubleshooting, use the relevant engine setup page and the agent log location for your deployment mode.
