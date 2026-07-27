---
sidebar_position: 7
---

# Assets

Assets are the monitored database instances registered in Logstag.

The Assets area, called Asset Management in the navigation, is used to create an instance record, complete agent setup, review connection state, manage ownership metadata, and connect the instance to external workflows where integrations are configured.

## Purpose

Assets help administrators answer questions such as:

1. Which database instances are registered in this organization?
2. Which engine and environment does each instance belong to?
3. Has the Logstag agent completed setup for this instance?
4. Who owns the instance operationally?
5. When was the instance last checked?
6. Which databases on the instance are mapped to external workflows?

Assets are not a replacement for Database Explorer. Database Explorer focuses on database-level operational data. Assets focus on instance lifecycle, setup, ownership, and integration mapping.

## Supported Engines

The Assets flow supports the database engines that can be registered as monitored instances in Logstag.

| Engine | Asset registration |
| --- | --- |
| PostgreSQL | Supported. |
| Microsoft SQL Server | Supported. |
| MongoDB | Supported. |
| Redis | Supported. |
| Valkey | Supported. |
| Oracle | Supported. |

Redis and Valkey are represented as instance assets, even though some explorer views use Redis-compatible behavior for both engines.

## Asset List

The Assets list gives administrators a compact inventory of registered instances.

Asset cards can show:

- Instance name.
- Engine.
- Server or platform value.
- Port.
- Version, when the agent has reported it.
- Environment type.
- Owner.
- Last check time.
- Health score, once available.
- Connection status.

The list supports search by instance name, server value, and engine type. It can also be filtered by status and environment.

## Status

Asset status is derived from whether the instance has an active agent connection.

| Status | Meaning |
| --- | --- |
| Connected | The asset has an active agent connection and can be used by monitoring workflows. |
| Disconnected | The asset has not completed setup or the agent is not active. |
| Issues | Reserved for warning-style presentation where the product has enough context to show a degraded state. |

Health score is shown separately from connection status. A connected asset can still have a low health score if the most recent assessment found operational risks.

## Creating An Asset

Creating an asset starts the instance registration flow.

The user selects:

- Database engine.
- Instance name.
- Environment type.
- Optional owner.

Instance names must be unique within the organization. If no owner is selected, Logstag assigns ownership to the user who created the instance.

After the asset record is created, Logstag guides the user through platform selection, agent installation, authentication token generation, and connection testing.

## Environment And Ownership

Environment type helps teams separate production, staging, test, and development instances in operational views.

Supported environment labels include:

- Production.
- Pre-Production.
- UAT.
- Staging.
- Test.
- Development.

Owner is an operational ownership field. It helps teams identify who is responsible for the instance inside Logstag. Owner assignment does not change database permissions on the monitored engine.

## Agent Setup Flow

An asset can exist before the agent is connected. This allows administrators to prepare instance metadata first and complete installation afterwards.

The setup flow includes:

- Platform selection.
- Connection type selection.
- Operating system selection.
- Install command generation.
- Registration token generation.
- Connection test.

Direct connection is the active connection type. Bridged connection is planned as a future setup option for teams that want one deployment to manage multiple reachable instances.

Self-hosted setup is available for Windows and Linux environments. Cloud setup supports provider-specific guidance where available; AWS and Huawei Cloud are active cloud provider paths in the current setup flow.

## Registration Token

The agent setup flow generates a temporary registration token for the selected asset.

The token is used during installation so the agent can bind itself to the correct organization and instance. It should be copied only into the intended agent installation command and treated as a secret.

Registration tokens expire after 1 day and are intended for setup-time use. If setup is not completed in time, generate a new token from the asset detail flow.

## Asset Detail

The asset detail view combines instance metadata, setup state, connection management, and integrations.

Detail information can include:

- Instance name.
- Environment type.
- Owner.
- Asset identifier.
- Server and port.
- Engine type.
- Version.
- Health score.
- Last check timestamp.

Instance name, environment type, and owner can be edited from the detail view. Engine type, server, port, version, and health score information are reported by the system or derived from the connected agent.

## Connection Management

For a connected asset, users can run a connection test from the asset detail view.

Connection testing verifies whether the agent can communicate with the monitored target and can report prerequisite checks where the engine exposes them.

Connection test output can include:

- Success or failure result.
- Target database name.
- Engine.
- Host and port.
- Agent version.
- Prerequisite check status.
- Configuration issue details.
- Fix suggestions where available.

Connection testing is focused on setup validation. It is separate from the report-style assessment that covers configuration, performance, security, maintenance, and availability-related findings.

## Integrations

Asset detail can show integration mapping for external workflows.

In the current product flow, Jira integration mapping is available when a Jira integration is configured. Users can map databases from the selected instance to Jira projects.

Mapping rows can include:

- Database name.
- Jira project.
- Edit action.
- Add row action.

These mappings help Logstag route database-related findings or workflow context to the correct external project. They do not change database monitoring permissions.

## Delete Behavior

Deleting an asset removes the instance record from Logstag after confirmation.

This action is intended for assets that should no longer be managed in Logstag. It does not delete the source database. Agent cleanup on the monitored host should be handled according to the installation method used for that environment.

## Data Freshness

Asset list data is cached briefly for responsiveness and refreshed when the page is loaded or when the user refreshes the list.

Fields reported by the agent, such as platform, port, version, activity state, and last check information, become meaningful after the agent connects and sends data. Before that, the asset can show placeholder or unknown values.

## Data Boundaries

Assets display operational metadata about monitored instances. This can include instance names, environment labels, owner names, platform values, ports, engine type, version, health score, last check timestamp, setup state, and integration mappings.

Assets do not copy application table rows, MongoDB documents, Redis key values, or user payload data.

Operational metadata can still reveal infrastructure structure. Access to Assets should be limited to users who are allowed to manage monitored instances, agent setup, and integration mapping.
