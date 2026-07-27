---
sidebar_position: 2
---

# Agent Logs

Agent logs are the primary evidence source when registration, authentication, database connectivity, permission checks, metric collection, or update behavior needs investigation.

Use logs to understand what the agent observed. Keep them sanitized, time-bounded, and tied to a clear troubleshooting question.

## When To Check Agent Logs

Check agent logs when:

- The agent service does not start.
- The target does not appear in Logstag.
- Authentication fails.
- A database target cannot be reached.
- A product area has missing or stale data.
- A collector reports permission-limited data.
- A monitoring report is incomplete.
- Agent upgrade or update behavior is unclear.
- Logstag support asks for recent sanitized evidence.

For production issues, capture recent logs before restarting the service. A restart can remove useful timing context from the active investigation.

## Log Locations

| Deployment | Primary Location | Fallback / Related Source |
| --- | --- | --- |
| Linux service | `/var/log/logstag-agent/agent.log` | `/tmp/logstag-agent/agent.log` if the primary path is not writable. |
| Windows Service | `C:\ProgramData\Logstag Agent\logs\agent.log` | `C:\Windows\Temp\Logstag Agent\agent.log` or the system temp directory if the primary path is not writable. |
| Docker | Container stdout/stderr and mounted log files, depending on deployment. | `docker logs` for the container. |
| Foreground process | Terminal stdout/stderr. | Redirect output to a controlled file for short troubleshooting sessions. |

On Linux and Windows service deployments, the agent writes file-based logs. On other platforms or foreground runs, logs may be written to stdout/stderr instead.

## Linux Log Access

View the current application log:

```bash
sudo tail -n 100 /var/log/logstag-agent/agent.log
```

Follow new log lines:

```bash
sudo tail -f /var/log/logstag-agent/agent.log
```

Check the fallback log path if the primary file is missing:

```bash
sudo tail -n 100 /tmp/logstag-agent/agent.log
```

Check systemd service events:

```bash
sudo journalctl -u logstag-agent -n 100 --no-pager
```

Follow service events during a restart:

```bash
sudo journalctl -u logstag-agent -f
```

Use file logs for agent application behavior. Use systemd logs for service lifecycle, startup, restart, permission, and host-level service issues.

## Windows Log Access

View recent file logs:

```powershell
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Tail 100
```

Follow new log lines:

```powershell
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Wait
```

Check recent Windows service events:

```powershell
Get-EventLog -LogName Application -Source "Logstag Agent" -Newest 20
```

If the primary log file is missing, check whether the agent created logs under a fallback temporary path. This usually indicates the service account could not write to the primary log directory.

## Docker Log Access

For container deployments, start with container logs:

```bash
docker logs --tail 100 logstag-agent
```

Follow container logs:

```bash
docker logs -f logstag-agent
```

If the deployment mounts a host log directory, also inspect the mounted file. Confirm the container user can write to the mounted path.

Container troubleshooting should be performed from the same network and runtime context as the agent container. Host-level connectivity can differ from container connectivity.

## Log Level

The agent log level is configured in the `[agent]` section:

```toml
[agent]
log_level = "info"
```

Common levels:

| Level | Use When |
| --- | --- |
| `error` | You only need failures. |
| `warn` | You need failures and warnings with less noise. |
| `info` | Default production level for normal operations and support evidence. |
| `debug` | Short troubleshooting sessions where more detail is needed. |
| `trace` | Deep diagnostics under Logstag guidance. |

Use `info` for normal production operation. Increase to `debug` only for a time-bounded investigation, then return to `info`.

After changing `log_level`, validate the configuration and restart the service:

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

## Log Rotation And Cleanup

The agent manages log size and retention for service deployments.

| Behavior | Detail |
| --- | --- |
| Size-based rotation | The active log file is rotated when it grows beyond 50 MB. |
| Rotated file naming | Rotated files use a timestamped filename in the same log directory. |
| Cleanup window | Old log files are cleaned up after roughly 3 days. |
| Fallback directories | Used when the primary log directory cannot be created or written. |

Rotation protects the host from unbounded log growth. For long-term audit or support retention, copy sanitized logs to an approved internal evidence store before the cleanup window expires.

## What To Look For

Use the symptom to guide the search.

| Symptom | Look For |
| --- | --- |
| Service does not start | Configuration parse errors, file permission errors, missing configuration, logging initialization failure. |
| Agent does not authenticate | API key rejection, organization mismatch, service URL problems, TLS or network errors. |
| Target does not appear | Registration errors, target configuration errors, unsupported engine value, database connection failures. |
| Database connection fails | Hostname, port, TLS, credential, database name, service name, or network path errors. |
| Product area is empty | Collector errors, missing engine permissions, disabled interval tier, no activity in the selected time range. |
| Schema data is delayed | Schema interval timing, schema collector errors, object metadata permissions. |
| Query data is missing | Query-statistics feature availability, Query Store, SQL performance view permissions, selected time range. |
| A monitoring report is incomplete | Missing collected evidence, permission-limited sections, unsupported engine capability, stale target data. |
| Upgrade issue | Update check, download, install, restart, or version compatibility messages. |

Search by timestamp first, then by the affected target name or engine. Keep the search window narrow so unrelated targets and time ranges do not obscure the signal.

## Collect A Time-Bounded Sample

For most support cases, collect:

- The last 100 to 300 lines around the failure.
- The timestamp of the attempted action.
- The affected target name.
- The agent version.
- The operating system and deployment mode.
- Whether the issue affects one target or all targets.

Linux example:

```bash
sudo tail -n 300 /var/log/logstag-agent/agent.log > logstag-agent-sample.log
```

Windows example:

```powershell
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Tail 300 | Out-File logstag-agent-sample.log
```

Sanitize the sample before sharing it outside the operational team.

## Redaction

Agent logs can contain operational metadata. Depending on the issue and enabled engine, this can include hostnames, database names, object names, user names, query text fragments, IP addresses, service URLs, and error messages from database drivers.

Redact:

- API keys.
- Database passwords.
- Cloud access keys and secret keys.
- Full service URLs when treated as sensitive by the organization.
- Internal hostnames and private IP addresses when not required for diagnosis.
- Usernames, database names, schema names, object names, and query text when they reveal sensitive business context.
- Customer names, tenant identifiers, and environment names if the evidence will leave the customer environment.

Keep enough context to diagnose:

- Timestamp.
- Severity.
- Agent version.
- Deployment mode.
- Database engine.
- Sanitized target name.
- Sanitized error class or error message.
- Whether the error affects registration, authentication, connectivity, permissions, collection, or submission.

## Debug Payload Export

The agent also has a debug-only payload export setting in configuration.

This is separate from normal agent logs. Payload export can include operational metadata, query text, object names, and security posture information depending on the enabled collectors.

Keep payload export disabled in production unless Logstag support explicitly asks for it during a controlled investigation. If enabled, use a short time window, protect the export directory, and remove the exported files after the investigation is complete.

## Best Practices

- Capture logs before restarting a failing service.
- Keep log samples time-bounded.
- Change only one variable at a time during troubleshooting.
- Return `log_level` to `info` after debug investigation.
- Store sanitized evidence in the incident record.
- Keep raw logs inside the customer-controlled environment unless sharing is approved.
- Rotate exposed API keys or credentials if a log sample was shared without proper redaction.

## Escalation Package

When escalating an agent issue, include:

- A short summary of the symptom.
- Affected target name, engine, and environment.
- Agent version and deployment mode.
- Operating system.
- Approximate start time and timezone.
- Recent sanitized agent logs.
- Whether configuration validation passed.
- Whether Logstag service connectivity was checked.
- Whether database connectivity from the agent host was checked.
- Whether engine permissions were reviewed.
- Any recent changes to agent version, configuration, credentials, network policy, database version, or database permissions.

Good log evidence is specific, recent, and sanitized. It should let the next reviewer understand what failed without exposing secrets or unrelated customer metadata.
