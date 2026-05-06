---
sidebar_position: 3
---

# Upgrades

This page describes how to plan, perform, verify, and recover from Logstag agent upgrades.

Treat agent upgrades as operational changes. The agent is not in the application transaction path, but upgrade issues can temporarily affect monitoring freshness, alert generation, Health Check evidence, and product views that depend on recently collected data.

## Upgrade Model

The Logstag agent supports two upgrade models:

| Model | Use When |
| --- | --- |
| Automatic updates | The environment allows the agent to check for and install approved releases from the configured release channel. |
| Manual upgrades | Change windows, regulated environments, pinned versions, or internal package management require operator-controlled rollout. |

Production environments should use the main release channel unless Logstag support instructs otherwise.

## Update Configuration

Update behavior is controlled in the `[agent]` section.

```toml
[agent]
update_check_enabled = true
update_channel = "main"
update_check_interval = 86400
auto_install_updates = true
```

| Field | Default | Description |
| --- | ---: | --- |
| `update_check_enabled` | `true` | Allows the agent to check for available releases. |
| `update_channel` | `main` | Release channel used for update checks. |
| `update_check_interval` | 1440 minutes | Interval between update checks. |
| `auto_install_updates` | `true` | Allows the agent to install an available release automatically. |

Use `update_check_enabled = false` when updates are fully managed by an internal package process. Use `auto_install_updates = false` when the agent may check for updates but installation must wait for an approved change window.

## Channels

| Channel | Intended Use |
| --- | --- |
| `main` | Production and standard customer environments. |
| Non-production channel | Validation, preview, or support-directed testing. Use only when Logstag support asks for it. |

Keep production and non-production agents on separate operational policies. A test channel should not be used as a shortcut for production rollout.

## Before Upgrading

Before changing a production agent:

1. Confirm the current agent version.
2. Confirm the deployment mode: Linux service, Windows Service, Docker, or foreground test process.
3. Review release notes or Logstag support guidance for the target version.
4. Confirm the agent configuration validates.
5. Capture recent sanitized logs.
6. Confirm the monitored target is currently reporting.
7. Confirm the affected product views have recent data.
8. Confirm the maintenance window and rollback owner.
9. Confirm credentials and configuration backups are available.

For multi-agent environments, upgrade a small representative group first. Include at least one agent per operating system, database engine, network zone, or managed platform pattern used in production.

## Version And Service Checks

Linux:

```bash
/opt/logstag-agent/bin/logstag-agent --version
sudo systemctl status logstag-agent
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" --version
Get-Service "Logstag Agent"
```

Check recent logs before making the change:

Linux:

```bash
sudo tail -n 100 /var/log/logstag-agent/agent.log
```

Windows:

```powershell
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Tail 100
```

## Automatic Updates

When automatic updates are enabled, the agent periodically checks the configured release channel. If a newer release is available and `auto_install_updates` is enabled, the agent downloads, validates, stages, and installs the update through the platform updater.

The update flow includes:

1. Check the configured release channel.
2. Compare the available version with the current agent version.
3. Download the platform-specific agent package.
4. Validate the downloaded file when checksum information is available.
5. Stage the new binary in the agent data area.
6. Use the updater process to replace the agent binary.
7. Restart or require restart depending on the platform update path.
8. Clean up staged files during startup.

If update checks fail repeatedly, the scheduler backs off and eventually stops retrying in that process to avoid unnecessary resource usage. Review agent logs for update-related errors before changing update configuration.

## Manual Upgrade Flow

Use manual upgrades when change control requires a controlled rollout.

Recommended flow:

1. Capture current version, configuration validation result, and recent logs.
2. Back up the agent configuration file.
3. Install the approved agent version using the Logstag-provided installer or your internal package process.
4. Restart the agent service if the installer does not restart it automatically.
5. Confirm the installed version.
6. Confirm the service is running.
7. Confirm logs show startup, authentication, target registration, and collection activity.
8. Confirm product views receive fresh data.

Linux restart:

```bash
sudo systemctl restart logstag-agent
sudo systemctl status logstag-agent
```

Windows restart:

```powershell
Restart-Service "Logstag Agent"
Get-Service "Logstag Agent"
```

Use the installer URLs and packages provided for your organization. Shared documentation should keep installer URLs masked.

## Docker Upgrade Flow

For Docker deployments:

1. Pull or promote the approved image through your internal registry process.
2. Keep the configuration file mounted from outside the image.
3. Stop and replace the container.
4. Confirm the new container can read the configuration.
5. Confirm container logs show startup and collection.
6. Confirm the target reports in Logstag.

Example:

```bash
docker stop logstag-agent
docker rm logstag-agent
docker run -d \
  --name logstag-agent \
  --restart unless-stopped \
  -e CONFIG_FILE="/app/config/logstag-agent.toml" \
  -v /secure/logstag-agent.toml:/app/config/logstag-agent.toml:ro \
  <approved-logstag-agent-image>
```

Use your organization's approved image tag policy. Prefer pinned image tags for production when your deployment process requires version control.

## Verification After Upgrade

After any upgrade, verify:

| Check | Expected Result |
| --- | --- |
| Version | The agent reports the expected version. |
| Service state | The service is running and remains stable after restart. |
| Configuration | Configuration validation passes. |
| Authentication | Logs do not show API key or service URL errors. |
| Database connectivity | Logs do not show target connection failures. |
| Permissions | Logs do not show new permission-limited collector failures. |
| Collection | Runtime metrics appear first; slower metadata can follow later. |
| Product views | Assets, explorers, Alerts, and Health Check evidence remain current for the affected target. |

Runtime data may recover before schema, index, configuration, or security metadata. Use the relevant interval and product area before declaring the upgrade incomplete.

## Rollback

The agent keeps backups from previous update activity where supported. Rollback restores the most recent available backup.

List available backups:

Linux:

```bash
/opt/logstag-agent/bin/logstag-agent list-backups
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" list-backups
```

Rollback to the most recent backup:

Linux:

```bash
sudo /opt/logstag-agent/bin/logstag-agent rollback
sudo systemctl restart logstag-agent
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" rollback
Restart-Service "Logstag Agent"
```

Use rollback when the new agent version causes startup failure, repeated collection failure, or a regression confirmed by logs and product behavior.

After rollback:

1. Confirm the restored version.
2. Confirm the service is running.
3. Confirm authentication and target collection.
4. Capture sanitized logs from the failed version and the rollback.
5. Pause further rollout until the failure is understood.

Rollback depends on available backups. If no backup is available, use the approved installer or package process to reinstall a known-good version.

## Compatibility Checks

Before upgrading at scale, confirm:

- The operating system and architecture are supported by the release.
- The agent package matches the platform.
- The service account can read configuration and write logs.
- The updater binary is present in package-based deployments.
- The agent host has enough disk space for download, staging, backup, and logs.
- The agent can reach the configured release source if automatic updates are enabled.
- Database drivers and engine compatibility are covered by the release notes.
- The deployment does not depend on a non-production channel in production.

For regulated environments, keep release approval, rollout time, validation result, and rollback decision in the change record.

## Troubleshooting Upgrade Issues

| Symptom | Check |
| --- | --- |
| Update check fails | Release channel, outbound HTTPS access, proxy policy, DNS, rate limiting, and agent logs. |
| Download fails | Network path, disk space, release availability, and proxy/TLS behavior. |
| Checksum fails | Discard the downloaded file and retry from the approved release source. |
| Service does not restart | Service manager logs, file permissions, binary path, and updater logs. |
| Version did not change | Installer result, staged files, service restart, and whether the old process is still running. |
| Product views are stale | Agent logs, target connectivity, collector permissions, and relevant collection intervals. |
| Rollback fails | Backup availability, updater binary, permissions, and service manager logs. |

Use the Agent Logs page for log collection and redaction guidance.

## Operational Guidance

- Keep production agents on the main release channel.
- Use canary rollout before broad production rollout.
- Keep configuration backups before upgrade.
- Keep raw logs inside the customer-controlled environment unless sharing is approved.
- Change one variable at a time during upgrade troubleshooting.
- Roll back quickly when monitoring coverage is materially degraded and the cause is not immediately clear.
- Resume rollout only after the failure mode is understood.

## Escalation Package

When escalating an upgrade issue, include:

- Current and target agent versions.
- Deployment mode and operating system.
- Release channel.
- Whether automatic or manual upgrade was used.
- Approximate upgrade time and timezone.
- Sanitized logs before, during, and after the upgrade.
- Configuration validation result without secrets.
- Whether rollback was attempted.
- Whether the issue affects one target, one agent, or multiple agents.
- Affected product areas.

Send sanitized evidence instead of raw configuration files, unredacted logs, API keys, database passwords, cloud secrets, or full service URLs in escalation notes.
