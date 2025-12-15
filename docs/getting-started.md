---
sidebar_position: 2
---

# Getting Started

Start monitoring your databases in minutes with Logstag.

## Prerequisites

### System Requirements
- **Operating System**: 
  - Linux: Ubuntu 18.04+, Debian 9+, RHEL/CentOS 7+, Amazon Linux 2
  - Windows: Windows Server 2016+
- **Privileges**: Root (Linux) or Administrator (Windows)
- **Network**: Outbound HTTPS access to `api.logstag.com`

### Database Requirements
- **Supported Versions**:
  - PostgreSQL: 11+
  - Microsoft SQL Server: 2016+
  - MongoDB: 4.0+
- **Permissions**: Read-only access to system views/statistics

## Step 1: Get Your API Key

1. Sign up at [https://app.logstag.com](https://app.logstag.com)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key and copy it (you'll need this for agent configuration)

## Step 2: Install the Agent

Logstag uses a lightweight agent written in Rust that runs on your infrastructure and collects metrics using read-only queries.

### Linux Installation

**Debian/Ubuntu (using .deb package):**
```bash
# Download the latest agent
curl -O https://downloads.logstag.com/agent/latest/logstag-agent_amd64.deb

# Install the package
sudo dpkg -i logstag-agent_amd64.deb

# Enable and start the service
sudo systemctl enable logstag-agent
sudo systemctl start logstag-agent
```

**RHEL/CentOS (using .rpm package):**
```bash
# Download the latest agent
curl -O https://downloads.logstag.com/agent/latest/logstag-agent.x86_64.rpm

# Install the package
sudo rpm -i logstag-agent.x86_64.rpm

# Enable and start the service
sudo systemctl enable logstag-agent
sudo systemctl start logstag-agent
```

**Docker:**
```bash
docker run -d \
  --name logstag-agent \
  -v /path/to/config.toml:/etc/logstag/config.toml:ro \
  logstag/agent:latest
```

### Windows Installation

**Using Windows Installer:**
1. Download `logstag-agent-setup.exe` from [downloads.logstag.com](https://downloads.logstag.com)
2. Run the installer as Administrator
3. Follow the installation wizard
4. The agent will be installed as a Windows Service

**Using PowerShell:**
```powershell
# Download installer
Invoke-WebRequest -Uri "https://downloads.logstag.com/agent/latest/logstag-agent-setup.exe" -OutFile "logstag-agent-setup.exe"

# Run installer silently
Start-Process -FilePath ".\logstag-agent-setup.exe" -ArgumentList "/S" -Wait
```

## Step 3: Create Read-Only Database User

For security best practices, create a dedicated monitoring user with read-only permissions.

### PostgreSQL

```sql
-- Create monitoring user
CREATE USER logstag_monitor WITH PASSWORD 'your_secure_password';

-- Grant pg_monitor role (PostgreSQL 10+)
GRANT pg_monitor TO logstag_monitor;

-- For PostgreSQL 9.6 and earlier:
GRANT pg_read_all_stats TO logstag_monitor;

-- Allow connection to databases you want to monitor
GRANT CONNECT ON DATABASE your_database TO logstag_monitor;

-- Enable pg_stat_statements extension (recommended)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Microsoft SQL Server

```sql
-- Create monitoring login
CREATE LOGIN logstag_monitor WITH PASSWORD = 'your_secure_password';

-- Create user in each database you want to monitor
USE your_database;
CREATE USER logstag_monitor FOR LOGIN logstag_monitor;

-- Grant required permissions
GRANT VIEW SERVER STATE TO logstag_monitor;
GRANT VIEW DATABASE STATE TO logstag_monitor;
GRANT VIEW ANY DEFINITION TO logstag_monitor;

-- Enable Query Store (recommended for SQL Server 2016+)
ALTER DATABASE your_database SET QUERY_STORE = ON;
```

### MongoDB

```javascript
// Connect to admin database
use admin

// Create read-only monitoring user
db.createUser({
  user: "logstag_monitor",
  pwd: "your_secure_password",
  roles: [
    { role: "clusterMonitor", db: "admin" },
    { role: "read", db: "admin" }
  ]
})
```

## Step 4: Configure the Agent

Create or edit the configuration file at:
- **Linux**: `/etc/logstag/config.toml`
- **Windows**: `C:\Program Files\Logstag\config.toml`

### Basic Configuration Example

```toml
[agent]
api_base_url = "https://api.logstag.com"
api_key = "your_api_key_here"
log_level = "info"

# Metric collection intervals (in seconds)
high_frequency_interval = 10    # Active sessions, critical metrics
medium_frequency_interval = 60  # Query performance, replication
low_frequency_interval = 600    # Schema stats, configuration

# Target database configuration
[targets.production-db]
platform = "aws"  # or "gcp", "azure", "onprem"
db_engine = "postgresql"  # or "mssql", "mongodb"
db_host = "prod-db-01.example.com"
db_port = 5432
db_username = "logstag_monitor"
db_password = "your_secure_password"
db_name = "postgres"  # Connection database

# Optional: Add multiple databases
[targets.analytics-db]
platform = "onprem"
db_engine = "mssql"
db_host = "analytics-sql.internal"
db_port = 1433
db_username = "logstag_monitor"
db_password = "your_secure_password"
db_name = "master"
```

### Configuration Reference

| Parameter | Description | Default |
|-----------|-------------|---------|
| `api_base_url` | Logstag API endpoint | `https://api.logstag.com` |
| `api_key` | Your API key from Logstag dashboard | Required |
| `log_level` | Logging verbosity (debug, info, warn, error) | `info` |
| `high_frequency_interval` | High-frequency metrics interval (seconds) | `10` |
| `medium_frequency_interval` | Medium-frequency metrics interval (seconds) | `60` |
| `low_frequency_interval` | Low-frequency metrics interval (seconds) | `600` |

### Target Configuration

Each `[targets.name]` section defines a database to monitor:

| Parameter | Description | Required |
|-----------|-------------|----------|
| `platform` | Deployment platform (aws, gcp, azure, onprem) | Yes |
| `db_engine` | Database type (postgresql, mssql, mongodb) | Yes |
| `db_host` | Database hostname or IP | Yes |
| `db_port` | Database port | Yes |
| `db_username` | Monitoring user username | Yes |
| `db_password` | Monitoring user password | Yes |
| `db_name` | Connection database | Yes |

## Step 5: Start the Agent

### Linux
```bash
# Start the agent
sudo systemctl start logstag-agent

# Check status
sudo systemctl status logstag-agent

# View logs
sudo journalctl -u logstag-agent -f
```

### Windows
```powershell
# Start the service
Start-Service LogstagAgent

# Check status
Get-Service LogstagAgent

# View logs
Get-EventLog -LogName Application -Source "Logstag Agent" -Newest 50
```

## Step 6: Verify in Dashboard

1. Log in to [https://app.logstag.com](https://app.logstag.com)
2. Navigate to **Database Explorer**
3. You should see your database(s) listed with status "Online"
4. Click on a database to view metrics

Metrics should start appearing within 1-2 minutes after starting the agent.

## Troubleshooting

### Agent Not Connecting

**Check API key:**
```bash
# Linux
sudo grep api_key /etc/logstag/config.toml

# Windows
Get-Content "C:\Program Files\Logstag\config.toml" | Select-String "api_key"
```

**Check network connectivity:**
```bash
curl -I https://api.logstag.com/health
```

### Database Connection Issues

**Test database connection manually:**

**PostgreSQL:**
```bash
psql -h prod-db-01.example.com -U logstag_monitor -d postgres -c "SELECT 1;"
```

**SQL Server:**
```bash
sqlcmd -S analytics-sql.internal -U logstag_monitor -P password -Q "SELECT 1;"
```

**MongoDB:**
```bash
mongosh --host localhost --port 27017 -u logstag_monitor -p password --authenticationDatabase admin
```

### Check Agent Logs

**Linux:**
```bash
# SystemD service logs
sudo journalctl -u logstag-agent -n 100

# Or check log file directly
sudo tail -f /var/log/logstag/agent.log
```

**Windows:**
```powershell
# Event Viewer logs
Get-EventLog -LogName Application -Source "Logstag Agent" -Newest 100

# Or check log file
Get-Content "C:\ProgramData\Logstag\agent.log" -Tail 100 -Wait
```

## Performance Impact

The Logstag agent is designed for minimal performance impact:

- **CPU Usage**: Less than 0.1% on average
- **Memory Usage**: Approximately 50-100 MB
- **Network**: Approximately 10-50 KB/s (compressed JSON)
- **Database Load**: Read-only queries optimized for system views

## Security Considerations

### Network Security
- Agent uses HTTPS/TLS for all communication
- API keys are encrypted at rest using PBKDF2 + AES-GCM
- No inbound connections required (agent initiates all connections)

### Database Security
- Read-only permissions prevent any data modification
- Only accesses system views and statistics
- Never reads your actual business data
- Credentials stored securely in configuration file

### Recommended Firewall Rules
```bash
# Allow outbound HTTPS to Logstag API
iptables -A OUTPUT -p tcp --dport 443 -d api.logstag.com -j ACCEPT
```

## Next Steps

Now that your agent is running, explore these features:

- **[Alerts](/)**: Set up automated alerts for performance issues
- **[Query Explorer](/)**: Analyze slow queries and optimization opportunities
- **[Health Checks](/)**: Review comprehensive database health reports
- **[Schema Explorer](/)**: Explore your database schema and relationships

## Support

Need help? We're here for you:

- **Documentation**: [https://docs.logstag.com](https://docs.logstag.com)
- **Email**: support@logstag.com
- **GitHub Issues**: [https://github.com/techmindpartners/logstag-agent/issues](https://github.com/techmindpartners/logstag-agent/issues)
