---
sidebar_position: 1
---

# Troubleshooting

Use this page when the Logstag agent is not registering, data is missing, product views look stale, or a monitored target is not behaving as expected.

Troubleshooting should be evidence-driven. Start with the smallest safe check, avoid changing multiple variables at once, and keep secrets out of tickets, screenshots, shell history, and shared logs.

## First Response Checklist

Before changing configuration or restarting services, confirm:

1. Which target is affected.
2. Which product area is affected.
3. When the issue started.
4. Whether all targets are affected or only one engine, host, database, or environment.
5. Whether there was a recent change to the agent, network, API key, database credentials, permissions, firewall rules, or database version.
6. Whether the issue is data freshness, missing data, authentication failure, connectivity failure, or a product view issue.

If the issue affects production monitoring, record the current state before applying changes. Logs and timestamps are more useful before a restart removes recent context.

## Safe Diagnostic Order

Follow this order for most incidents:

1. Check the agent service state.
2. Check recent agent logs.
3. Validate the agent configuration.
4. Confirm Logstag service connectivity.
5. Confirm database connectivity from the agent host.
6. Confirm database monitoring permissions.
7. Confirm whether the affected product area depends on a slower collection tier.
8. Restart the agent only after the checks above point to a restartable state issue or after a configuration change.

This order helps avoid masking the original failure. A restart can be useful, but it should not be the first diagnostic step unless the service is clearly stopped or unhealthy.

## Agent Service Is Not Running

### Linux

Check service state:

```bash
sudo systemctl status logstag-agent
```

Check recent service events:

```bash
sudo journalctl -u logstag-agent -n 100 --no-pager
```

Start or restart only after reviewing the recent error:

```bash
sudo systemctl start logstag-agent
sudo systemctl restart logstag-agent
```

### Windows

Check service state:

```powershell
Get-Service "Logstag Agent"
```

Check recent application events:

```powershell
Get-EventLog -LogName Application -Source "Logstag Agent" -Newest 20
```

Restart after reviewing the recent error:

```powershell
Restart-Service "Logstag Agent"
```

### What To Check

Common causes:

- Configuration file is missing or unreadable.
- API key or database password was changed but the service was not restarted.
- File permissions prevent the agent service account from reading configuration or writing logs.
- The host was rebooted and the service was not enabled for automatic startup.
- A previous upgrade left the service in a failed state.

## Configuration Does Not Validate

Validate the configuration before starting the service.

Linux:

```bash
/opt/logstag-agent/bin/logstag-agent --check-config
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" --check-config
```

Review:

- The configuration file is in the expected path for the deployment mode.
- The Logstag service URL is the organization-provided value.
- The API key is present and belongs to the expected organization.
- Each target name is unique.
- Each target has `platform`, `db_engine`, `db_host`, `db_port`, `db_username`, `db_password`, and `db_name`.
- Sensitive encrypted values were generated on the same host that runs the agent.
- Intervals use seconds in the configuration file.

Keep real API keys, database passwords, cloud secrets, and full service URLs out of tickets and shared chat.

## Agent Cannot Authenticate

Authentication failures usually involve the API key, organization scope, service URL, or local secret handling.

Check:

- The API key has not been revoked.
- The API key belongs to the organization where the target should appear.
- The configured service URL is the correct organization-provided value.
- The key was copied without extra whitespace or truncation.
- Encrypted key values were generated locally on the agent host.
- The service was restarted after the key changed.
- The agent host can reach the Logstag service over HTTPS.

Recommended fix path:

1. Validate the configuration.
2. Confirm outbound HTTPS connectivity to the Logstag service.
3. Replace the key with a known-good key if revocation or exposure is suspected.
4. Restart the agent.
5. Confirm authentication errors disappear from the logs.
6. Revoke the old key only after the replacement is confirmed.

## Agent Cannot Reach Logstag

When the agent cannot send data to Logstag, check network path before changing credentials.

From the agent host, confirm:

- DNS resolves the organization-provided Logstag service hostname.
- Outbound HTTPS is allowed by firewall, proxy, and egress policy.
- TLS inspection or proxy policy does not block the connection.
- The host time is synchronized. Large clock drift can break TLS or authentication behavior.
- The configured service URL is masked correctly in shared notes but set correctly on the host.

If the environment uses a proxy, confirm whether the agent service account inherits the required proxy configuration. Interactive shell connectivity can differ from service runtime connectivity.

## Agent Cannot Reach The Database

Database connectivity should be tested from the agent host or container network, not from an operator laptop.

Check:

- The database hostname resolves from the agent runtime environment.
- The database port is reachable from the agent host.
- Security groups, firewall rules, Kubernetes network policies, or private routing allow the connection.
- The configured database name, service name, PDB, or Redis/Valkey database number matches the engine.
- The monitoring user can authenticate from the agent host.
- TLS, certificate, or managed database access rules match the database policy.

For Docker deployments, test from inside a temporary container attached to the same network when possible. A host-level test can pass while the container network path fails.

## Permission Errors

Permission errors mean the agent can connect but cannot read one or more required monitoring surfaces.

Use the engine setup page for the affected engine and verify the monitoring user grants. Focus on the product area that is missing data:

| Product Area | Common Permission Dependency |
| --- | --- |
| Database Explorer | Database inventory, instance metrics, database status, and engine metadata. |
| Activity Explorer | Session, connection, wait, blocking, or current operation visibility. |
| Query Explorer | Query statistics, Query Store, SQL performance views, or query-statistics extensions. |
| Schema Explorer | Schema, object, index, collection, permission, and change metadata. |
| Alerts | The underlying metric or metadata required by the alert template. |

Unavailable data is not the same as a healthy zero value. If a signal is permission-limited, Logstag may show missing, stale, or partial data for the related product area.

## Target Does Not Appear In Logstag

If a newly configured target does not appear:

1. Confirm the agent service is running.
2. Confirm the configuration validates.
3. Confirm the agent authenticates successfully.
4. Confirm the agent can connect to the target database.
5. Check whether the target name is unique and stable.
6. Confirm the database engine value is supported and spelled correctly.
7. Review agent logs for registration, connectivity, or permission errors.

Runtime signals can appear before slower metadata. If schema or index data has not appeared yet, verify the schema interval and permissions before treating the target as broken.

## Metrics Are Missing Or Stale

First identify the missing metric category:

| Missing Data | Likely Area To Check |
| --- | --- |
| Runtime activity | High-frequency interval, activity permissions, active workload, database connectivity. |
| Query statistics | Medium-frequency interval, query-statistics feature, Query Store, SQL performance permissions. |
| Configuration or security posture | Low-frequency interval and engine-specific metadata permissions. |
| Schema, index, object, or permission metadata | Schema interval and schema metadata permissions. |
| Cloud platform metrics | Managed target cloud metadata, region, instance ID, cloud credentials, and provider permissions. |

Then check:

- The relevant interval has not been set to `0`.
- The selected time range in the UI includes the latest collected data.
- The database target is active.
- The monitoring user has access to the relevant engine metadata.
- The agent logs do not show collector-specific failures.
- The system clock on the agent host is accurate.

Schema and security metadata can update less frequently than runtime metrics. A recently fixed permission issue may need one full collection cycle before the related product view fills in.

## Product View Looks Empty

If the agent is healthy but a Logstag page looks empty:

1. Refresh the page.
2. Check the selected organization and environment.
3. Check the selected time range.
4. Clear filters or search terms.
5. Confirm the target engine is supported for that product area.
6. Confirm the relevant collector tier is enabled.
7. Confirm the target has data in another product area.

For example, a database can appear in Assets while Query Explorer is empty if query statistics are not available. That is a data coverage issue, not necessarily an agent registration issue.

## Alerts Are Not Generated

If expected alerts do not appear:

- Confirm the underlying metric or metadata is available.
- Confirm the selected time window includes the condition.
- Confirm the alert applies to the affected engine and scope.
- Confirm the alert was not already resolved, acknowledged, or filtered out.
- Confirm the target has recent data.

Alerts depend on collected evidence. If the agent cannot collect a signal, the related alert may not be generated.

## Integrations Do Not Create External Tickets

For Jira Cloud or other supported integrations:

- Confirm the integration is enabled.
- Confirm credentials or tokens have not expired.
- Confirm the target database is mapped to the expected external project.
- Confirm the external project allows the configured issue type.
- Confirm outbound access to the external system is allowed.
- Check whether rate limits or permission changes occurred in the external system.

Rotate integration credentials only after confirming whether the failure is authentication, project mapping, issue type, or external availability.

## Safe Restart Guidance

Restart the agent when:

- The configuration changed.
- Credentials changed.
- The service is stopped or unhealthy.
- A transient network or database outage has been resolved.
- Logstag support asks for a restart after reviewing evidence.

Before restarting in production:

1. Capture recent logs.
2. Note the current time.
3. Note the affected target and product area.
4. Restart once.
5. Confirm the service remains running.
6. Confirm new logs show successful authentication and target collection.

Repeated restarts without new evidence can hide the original failure and delay collection.

## What To Redact Before Sharing

Redact:

- API keys.
- Database passwords.
- Cloud access keys and secret keys.
- Full service URLs if your organization treats them as sensitive.
- Customer names, internal hostnames, private IP addresses, and usernames when not required for diagnosis.
- Query text, object names, or request summaries that contain sensitive business context.

Keep:

- Timestamp.
- Agent version.
- Operating system.
- Deployment mode.
- Database engine and version.
- Target platform.
- Error class or sanitized error message.
- Whether the failure affects one target or many targets.

## Escalation Package

When escalating to Logstag support, include:

- A short incident summary.
- Affected organization, environment, and target name.
- Database engine and deployment platform.
- Approximate start time and timezone.
- Recent sanitized agent logs.
- Configuration validation result without secrets.
- Whether authentication, Logstag connectivity, database connectivity, and database permissions were checked.
- The affected product area.
- Screenshots with secrets, hostnames, and sensitive metadata redacted where required.

Good escalation notes describe what was observed and what was already checked. Send sanitized evidence instead of raw configuration files, unredacted logs, or database credentials.
