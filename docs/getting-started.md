---
sidebar_position: 2
---

# Getting Started

Start monitoring your databases in minutes with Logstag.

## Prerequisites

- **Supported OS**: Linux (Ubuntu, Debian, RHEL, CentOS, Amazon Linux) or Windows Server.
- **Access**: Root or Administrator privileges on the host machine.
- **Network**: Outbound internet access to communicate with Logstag Cloud.

## Installation

### 1. Install the Agent

Logstag uses a lightweight agent to collect performance metrics using read-only queries.

**Linux (Debian/Ubuntu):**
```bash
curl -L https://downloads.logstag.com/agent/install.sh | sudo bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://downloads.logstag.com/agent/install.ps1 | iex
```

### 2. Configure Database Connection

After installation, configure the agent to connect to your database instance.

```bash
logstag config add --type postgres --host localhost --user logstag_user --password <YOUR_PASSWORD>
```

> **Note**: We recommend creating a dedicated read-only user for Logstag.

### 3. Verify Connection

Check the status of the agent and connection:

```bash
logstag status
```

If successful, you should see data appearing in your [Logstag Dashboard](https://app.logstag.com) within a few minutes.

## Next Steps

- [Configure Smart Alerts](./intro.md#smart-alerts)
- [Set up Integrations](./intro.md) (Slack, PagerDuty, etc.)
