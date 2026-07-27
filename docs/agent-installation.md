---
sidebar_position: 3
---

# Agent Installation

Install the Logstag agent on a host that can reach the monitored database targets and the Logstag service. The agent can run as a Linux systemd service, a Windows Service, a container, or a foreground process for testing.

Use production installation packages for long-running environments. Foreground and locally built container runs are better suited for validation, troubleshooting, and controlled test environments.

## Before Installation

Confirm these requirements before installing the agent:

- The host can reach each database target over the required database port.
- The host has outbound HTTPS access to the Logstag service.
- You have a Logstag agent API key for the target organization.
- A dedicated database monitoring user has been prepared or can be created after installation.
- You have administrator or root-equivalent access on the agent host.

Keep the Logstag service URL and API key out of shared installation notes. Use the values provided for your organization.

## Supported Deployment Modes

| Mode | Use When |
| --- | --- |
| Linux package | The agent should run as a managed service on a Linux host. |
| Windows MSI | The agent should run as a Windows Service. |
| Docker | The agent should run in a containerized environment with an external configuration file. |
| Foreground process | You need a short-lived validation or troubleshooting run. |

## Linux Package Installation

The Linux installer detects the distribution, installs the matching package, creates the `logstag-agent` service, and places the default configuration file on the host.

Use the installer URL provided by Logstag:

```bash
curl -sSL "https://<logstag-agent-linux-install-script-url>" | bash
```

To install without starting the service immediately:

```bash
curl -sSL "https://<logstag-agent-linux-install-script-url>" | bash -s -- --no-start-service
```

For automated deployments, pass configuration through environment variables:

```bash
export LOGSTAG_INSTALL_NONINTERACTIVE=1
export LOGSTAG_API_BASE_URL="https://<logstag-agent-api-base-url>"
export LOGSTAG_API_KEY="<your-logstag-agent-api-key>"

curl -sSL "https://<logstag-agent-linux-install-script-url>" | bash
```

The Linux installer accepts these environment variables:

| Variable | Description |
| --- | --- |
| `LOGSTAG_INSTALL_NONINTERACTIVE` | Run the installer without interactive prompts. |
| `LOGSTAG_API_BASE_URL` | Logstag service URL used to configure the agent. |
| `LOGSTAG_API_KEY` | Agent API key used to configure the agent. |
| `LOGSTAG_CHANNEL` | Release channel used for installation. |
| `LOGSTAG_VERSION` | Specific agent version to install instead of the latest. |
| `LOGSTAG_START_SERVICE` | Start the service after successful configuration (default: `true`). |
| `LOGSTAG_ENCRYPT_API_KEY` | Set to `false` to store the API key as plain text instead of encrypted. |

When `LOGSTAG_API_KEY` is provided, the installer encrypts it by default using `logstag-agent encrypt` before writing it to the configuration file, unless `LOGSTAG_ENCRYPT_API_KEY=false`.

The installer supports release channels. Use the production channel unless Logstag support instructs otherwise.

## Linux Defaults

| Item | Default |
| --- | --- |
| Installation path | `/opt/logstag-agent` |
| Configuration file | `/etc/logstag-agent.toml` |
| Log directory | `/var/log/logstag-agent` |
| Primary log file | `/var/log/logstag-agent/agent.log` |
| Fallback log file | `/tmp/logstag-agent/agent.log` |
| Service name | `logstag-agent` |
| Service user | `logstag` |

The service is managed by systemd.

```bash
sudo systemctl status logstag-agent
sudo systemctl start logstag-agent
sudo systemctl stop logstag-agent
sudo systemctl restart logstag-agent
sudo systemctl enable logstag-agent
```

View service lifecycle events with systemd:

```bash
sudo journalctl -u logstag-agent -f
```

View application logs from the agent log file:

```bash
sudo tail -f /var/log/logstag-agent/agent.log
```

## Windows MSI Installation

The Windows installer installs the agent binaries, creates a Windows Service, and stores configuration and logs under `ProgramData`.

Run PowerShell as Administrator, then use the installer URL provided by Logstag:

```powershell
iwr -UseBasicParsing "https://<logstag-agent-windows-install-script-url>" -OutFile agent-install.ps1
.\agent-install.ps1
```

For non-interactive installation:

```powershell
$env:LOGSTAG_INSTALL_NONINTERACTIVE = "1"
$env:LOGSTAG_API_BASE_URL = "https://<logstag-agent-api-base-url>"
$env:LOGSTAG_API_KEY = "<your-logstag-agent-api-key>"

iwr -UseBasicParsing "https://<logstag-agent-windows-install-script-url>" -OutFile agent-install.ps1
.\agent-install.ps1 -NonInteractive -StartService
```

If PowerShell script execution is restricted, use your organization's approved execution policy process or download and inspect the installer before running it.

## Windows Defaults

| Item | Default |
| --- | --- |
| Installation path | `C:\Program Files\Logstag Agent` |
| Configuration file | `C:\ProgramData\Logstag Agent\logstag-agent.toml` |
| Log directory | `C:\ProgramData\Logstag Agent\logs` |
| Primary log file | `C:\ProgramData\Logstag Agent\logs\agent.log` |
| Service name | `Logstag Agent` |
| Service account | `LocalSystem` |

Manage the service with PowerShell:

```powershell
Get-Service "Logstag Agent"
Start-Service "Logstag Agent"
Stop-Service "Logstag Agent"
Restart-Service "Logstag Agent"
```

Enable automatic startup:

```powershell
sc.exe config "Logstag Agent" start= auto
```

View recent file logs:

```powershell
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Tail 50
```

View Windows service events:

```powershell
Get-EventLog -LogName Application -Source "Logstag Agent" -Newest 20
```

## Docker Deployment

Use Docker when the agent should run as part of a containerized deployment. Mount the configuration file from the host or your secret/config management system.

```bash
docker run -d \
  --name logstag-agent \
  --restart unless-stopped \
  -e CONFIG_FILE="/app/config/logstag-agent.toml" \
  -v /secure/logstag-agent.toml:/app/config/logstag-agent.toml:ro \
  <logstag-agent-image>
```

The container must be able to reach the configured database targets and the Logstag service. Store secrets outside the image and inject configuration at runtime.

## Configure After Installation

The quickest way to configure the agent is the interactive `configure` command, which is what the installers invoke:

```bash
/opt/logstag-agent/bin/logstag-agent configure
```

Add `--channel <channel>` to set the release channel during configuration. The command walks through the Logstag service URL, API key, and target setup interactively.

Manual configuration is also available:

1. Open the agent configuration file for your deployment mode.
2. Set the masked Logstag service URL to the organization-specific value.
3. Set the agent API key directly, or encrypt it first with `logstag-agent encrypt <api-key>`.
4. Add one or more database targets.
5. Start or restart the service.

On Linux:

```bash
sudo systemctl restart logstag-agent
```

On Windows:

```powershell
Restart-Service "Logstag Agent"
```

Use the Agent Configuration page for field-level configuration details.

## Upgrades

The agent includes update management settings, and package-based deployments can also be updated through the operating system package manager or the approved Logstag release process.

For production environments:

- Review the release notes before upgrading.
- Keep configuration backups before replacing packages.
- Restart the agent during an approved maintenance window when required.
- Verify service status and logs after the upgrade.

Use the main release channel for production unless Logstag support directs you to another channel.

## Verification

After installation and configuration:

1. Confirm the service is running.
2. Confirm the agent log shows no configuration errors after startup.
3. Check the agent log for authentication, registration, connection, or permission errors.
4. Confirm the database target appears in Logstag.
5. Confirm expected metrics begin appearing for the target engine.

Runtime metrics can appear quickly. Schema, index, configuration, and security posture metadata may take longer because those signals are collected less frequently.

## Troubleshooting

Start with these checks:

- The agent service is installed and running.
- The configuration file exists at the expected path.
- The Logstag service URL uses the organization-provided value.
- The API key belongs to the expected organization.
- The agent host can reach the database host and port.
- The agent host can reach the Logstag service over HTTPS.
- The monitoring database user can connect and has the required engine-specific visibility.
- File permissions allow the agent service account to read configuration and write logs.

Use the Operations troubleshooting and agent logs pages for deeper diagnostics.
