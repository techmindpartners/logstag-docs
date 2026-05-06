---
sidebar_position: 5
---

# Oracle Setup

Logstag monitors Oracle Database through dynamic performance views, data dictionary metadata, session and wait statistics, SQL performance metadata, tablespace I/O, memory statistics, Data Guard metadata, backup metadata, Advanced Queuing metadata, redo log metadata, profile settings, schema metadata, permission metadata, and index metadata.

Use a dedicated monitoring user with read-only visibility into Oracle operational metadata and dictionary views. Keep this account separate from application schemas and application writes.

## Supported Deployment Scope

| Area | Support |
| --- | --- |
| Oracle version | Oracle Database 19c and later is recommended. |
| Single instance | Supported. |
| Multitenant | Supported by connecting the agent directly to the monitored PDB. |
| Data Guard | Supported where the required Data Guard metadata is visible. |
| Oracle RAC | Requires separate deployment validation. |
| AWR | Not used as a required monitoring source. |

For multitenant deployments, configure one target per monitored PDB. Connect to the CDB root only when that is an explicit operational decision for your environment.

## Target Configuration

Add an Oracle target entry to the agent configuration.

```toml
[targets.production-oracle]
platform = "self-hosted"
db_engine = "oracle"
db_host = "oracle.example.internal"
db_port = 1521
db_username = "logstag_monitor"
db_password = "<your-database-password>"
db_name = "YourServiceName"
```

Use `db_name` for the Oracle service name the agent should connect to. In a PDB deployment, this should be the service name for the monitored PDB.

## Oracle Client

Oracle monitoring requires the agent runtime to initialize Oracle client connectivity. If your installation uses an external Oracle client library path, configure it in the agent settings according to your deployment standard.

Validate the client setup before enabling continuous monitoring. Oracle connection errors are often caused by missing client libraries, an incorrect service name, listener reachability, or authentication policy.

## Access Model

| Access area | Required for |
| --- | --- |
| `CREATE SESSION` | Connecting to the Oracle database. |
| Data dictionary visibility | Schema, users, roles, privileges, object metadata, index metadata, profile settings, backup metadata, and AQ metadata. |
| Dynamic performance view visibility | Sessions, wait events, locks, memory, SQL performance, Data Guard, redo log, and runtime database state. |
| `SELECT ANY DICTIONARY` | Recommended standard grant for complete Oracle monitoring coverage. |
| `SELECT_CATALOG_ROLE` | Optional catalog access enhancement in environments that require it. |
| ASH visibility | Optional Active Session History metrics, subject to Oracle licensing and DBA approval. |

Oracle dictionary access can expose sensitive operational metadata. Review grants with the DBA team and align them with the monitoring scope you want Logstag to report.

## Create a Monitoring User

Create the monitoring user in the database or PDB being monitored.

```sql
CREATE USER logstag_monitor IDENTIFIED BY "<strong-password>"
  DEFAULT TABLESPACE USERS
  TEMPORARY TABLESPACE TEMP;

GRANT CREATE SESSION TO logstag_monitor;
```

For multitenant deployments, create the user in the monitored PDB, or use an approved common-user pattern managed by the DBA team.

## Grant Monitoring Visibility

The most reliable standard setup is to grant dictionary visibility to the monitoring user.

```sql
GRANT SELECT ANY DICTIONARY TO logstag_monitor;
```

Some environments also use catalog role access.

```sql
GRANT SELECT_CATALOG_ROLE TO logstag_monitor;
```

These grants are for read-only metadata visibility, without application table ownership or write access to application data.

If your organization requires a narrower permission set, the DBA team can grant read access only to the required Oracle performance views and dictionary views. Validate that reduced grant set with the agent before rollout because partial visibility can reduce metric coverage.

## Active Session History

Logstag can collect ASH-based session samples when the database exposes the required view and the organization is licensed to use it.

ASH visibility is optional. If the required access or license is not available, leave ASH collection disabled for that target. Other Oracle metrics can still be collected from sessions, wait events, locks, memory, tablespace I/O, SQL performance metadata, configuration, schema metadata, and index metadata.

Confirm Oracle Diagnostics Pack licensing with the DBA or licensing owner before enabling ASH-based monitoring.

## Data Guard

Data Guard metrics are relevant only when the Oracle deployment uses Data Guard and the connected database role exposes the required metadata.

For standby environments, some collectors may be skipped or return reduced data depending on database role, open mode, and view visibility. This is expected and should be validated per target.

## Data Collected

Depending on enabled collectors and granted visibility, Logstag can collect:

- Session counts, session state, database usernames, client program metadata, machine metadata, OS user metadata, logon time, current SQL identifiers, blocking session metadata, wait events, logical reads, and physical reads.
- Wait event names, wait classes, total waits, time waited, foreground waits, and timeout counters.
- Lock details, blocking chains, locked object metadata, lock mode, lock duration, and SQL identifiers associated with blocking.
- Tablespace and file I/O metadata, data file and temp file names, file sizes, autoextend settings, read and write counters, and I/O timing.
- SGA and PGA memory component sizes and memory-related statistics.
- SQL performance metadata, including SQL identifiers, plan hash values, execution counts, elapsed time, CPU time, logical reads, physical reads, parse calls, rows processed, and limited SQL text.
- ASH samples where enabled and licensed, including session identifiers, wait event metadata, SQL identifiers, program/module metadata, and blocking session metadata.
- Data Guard lag and status metadata where Data Guard is configured.
- RMAN backup job metadata, including job status, timing, input/output size, throughput, compression ratio, and device type.
- Advanced Queuing metadata, including queue names, owners, queue table names, queue state, message counts, and wait measurements.
- Redo log switch metadata, sequence information, and timing of recent log switches.
- Instance parameters, database open mode, memory settings, session/process limits, logging settings, optimizer settings, and security-related parameters.
- Profile security settings, including failed login policy, password lifetime, password reuse, lock time, grace time, and password verification function metadata.
- Schema object counts, users, roles, role memberships, object privileges, system privileges, role hierarchy, administrative grant flags, and computed privilege levels.
- Index metadata, usage indicators, table association, tablespace, row estimates, distinct key estimates, leaf blocks, clustering factor, access count, and last-used metadata where available.

Logstag does not copy Oracle table rows as dataset content. SQL text, object names, file names, usernames, machine names, OS usernames, role names, privilege grants, queue names, profile settings, and configuration values can still be sensitive and should be treated as operational metadata.

## Validate Setup

After updating the target configuration, validate the agent configuration before restarting the service.

```bash
logstag-agent --config /etc/logstag-agent/config.toml --check-config
```

Restart the agent after validation.

```bash
sudo systemctl restart logstag-agent
sudo systemctl status logstag-agent
```

On Windows, restart the Logstag Agent service from the Services console or with the approved service management command used in your environment.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Connection fails | Confirm listener reachability, service name, port, credentials, Oracle client setup, firewall rules, and database authentication policy. |
| PDB metrics look incomplete | Confirm the target connects to the monitored PDB service, not the CDB root. |
| Dictionary or schema metrics are missing | Confirm dictionary visibility for the monitoring user. |
| Session, wait, lock, memory, or SQL metrics are missing | Confirm dynamic performance view visibility for the monitoring user. |
| ASH metrics are missing | Confirm ASH access and Oracle Diagnostics Pack licensing approval. If not approved, this area should remain disabled or unavailable. |
| Data Guard metrics are missing | Confirm the deployment uses Data Guard and the connected role exposes the required metadata. |
| Backup or AQ metrics are missing | Confirm the database exposes the relevant catalog metadata and the monitoring user can read it. |
| No metrics arrive after configuration changes | Validate the configuration, restart the agent, and review local agent logs. |
