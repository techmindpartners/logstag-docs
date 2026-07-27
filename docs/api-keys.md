---
sidebar_position: 5
---

# API Keys

Logstag agent API keys authenticate agents to a Logstag organization. An agent uses the key in its local configuration when registering, sending monitoring payloads, and checking service-side access.

Treat agent API keys as production secrets. Anyone with a valid key and network access to the Logstag service may be able to submit monitoring data for the associated organization.

## Key Scope

Agent API keys are organization-scoped. Use a key that belongs to the same Logstag organization where the monitored targets should appear.

Recommended practice:

- Use separate keys for production, staging, and test environments.
- Use separate keys for materially different deployment groups when rotation boundaries differ.
- Use separate keys for unrelated customers, organizations, or network zones.
- Remove unused keys after an agent is decommissioned.

## Configuration

Set the key in the agent configuration file:

```toml
[agent]
api_base_url = "https://<logstag-agent-api-base-url>"
api_key = "<your-logstag-agent-api-key>"
```

Use the Logstag service URL provided for your organization. Shared documentation, tickets, screenshots, and chat messages should use masked keys and masked service URLs.

The agent sends the key in the `x-logstag-api-key` request header on each call to the Logstag service.

## Local Storage

The agent supports encrypted local values for sensitive fields, including `api_key`. Encrypted values are produced with `logstag-agent encrypt <api-key>`.

Encrypted values are machine-specific. Generate the encrypted value on the host that runs the agent because encrypted values are not portable between hosts.

For production:

- Store the key using the encrypted local format where available.
- Restrict read access to the agent configuration file.
- Limit administrator access on the agent host.
- Keep the key out of shell history, process arguments, logs, and deployment templates.

Plain text keys may be useful during local validation. Long-running production deployments should use encrypted local values where available.

## Rotation

Rotate an agent API key when:

- A team member with access to the key leaves the operational group.
- The key may have been exposed in logs, tickets, screenshots, source control, or shell history.
- The agent host is rebuilt or ownership changes.
- Your internal credential policy requires scheduled rotation.
- You are splitting one shared key into smaller deployment scopes.

Recommended rotation flow:

1. Create a new key in Logstag.
2. Update the agent configuration on the target host.
3. Encrypt the new value locally where available.
4. Restart the agent.
5. Verify that the target reports successfully.
6. Revoke the old key after the replacement is confirmed.

For targets that must remain continuously visible, revoke the old key only after confirming the replacement.

## Revocation

Revoke a key when it is no longer used or when exposure is suspected.

After revocation:

- Agents using the revoked key should stop authenticating successfully.
- Existing local configuration files may still contain the old value and should be updated or removed.
- Logs should be checked for authentication errors after the replacement key is deployed.

Revocation does not remove database credentials from the agent host. Review database and cloud credentials separately when decommissioning an agent.

## Validation

After adding or changing a key:

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

Confirm that:

- The configuration validates.
- The agent service starts successfully.
- The agent can reach the Logstag service over HTTPS.
- Authentication errors no longer appear in the agent logs.
- The expected target appears in Logstag.

## Troubleshooting

If the agent does not authenticate:

- Confirm the key belongs to the expected Logstag organization.
- Confirm the key has not been revoked.
- Confirm the configured service URL is the organization-provided value.
- Confirm the configuration file was saved on the host where the agent runs.
- Confirm the agent service was restarted after the key changed.
- Confirm encrypted values were generated on the same host that runs the agent.
- Check for copy/paste errors, extra whitespace, or truncated key values.

If authentication succeeds but target data does not appear, continue with database connectivity and permission checks in the relevant engine setup page.
