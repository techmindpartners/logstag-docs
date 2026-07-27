---
sidebar_position: 2
---

# Database Explorer

Database Explorer is the main inventory and overview view for monitored databases.

It helps operators answer three questions:

1. Which databases are connected to Logstag?
2. Are the database and its hosting instance currently reporting?
3. Which database needs attention because of workload, resource pressure, schema shape, health score, or alerts?

## Database List

The database list is the entry point for database inventory. Each row represents a monitored database target and shows the database together with its hosting instance.

The list includes:

- Database name.
- Hosting instance name.
- Database engine.
- Online or offline status.
- Transaction or operation rate where available.
- Instance-level CPU and memory usage where system metrics are available.
- Active alert counts by severity.
- Navigation to the database detail page.

Database status is based on both the database and the hosting instance. A database is shown as online when both are active. If either the database or the instance is inactive, the row is shown as offline.

CPU and memory values are instance-level measurements. When multiple databases run on the same instance, the same instance resource value can appear for more than one database. These values are useful for understanding host pressure, not for attributing CPU or memory to a single database.

## Filtering And Sorting

Operators can use Database Explorer to narrow the inventory by database and instance context.

Supported list behavior includes:

- Pagination.
- Search by database name.
- Filtering by instance name.
- Sorting by database name, instance name, engine, status, alert count, transaction rate, CPU usage, and memory usage where available.
- Time window selection for metric aggregation.

The default list view uses a recent time window for workload and resource summaries. Custom time ranges are supported up to 31 days.

## Database Detail

Selecting a database opens its detail view. The detail page combines identity, health, workload, schema, resource, and alert context for the selected database.

The header shows:

- Database name.
- Online or offline status.
- Engine and engine version.
- Hosting instance name.
- Last updated time.

The detail page currently has these tabs:

| Tab | Purpose |
| --- | --- |
| Overview | Summary metrics, health indicators, key metric trends, engine-specific charts, and instance resource trends. |
| Schema | Object counts, schema objects, object sizes, and object detail where the engine supports schema metadata. |
| Alerts | Active and historical alerts for the selected database and related instance context. |

Redis and Valkey do not show the Schema tab in the current Database Explorer detail view.

## Overview Metrics

Overview metrics adapt to the database engine. Logstag keeps the layout consistent while changing the metric names and charts to match the engine model.

| Engine | Summary metrics |
| --- | --- |
| PostgreSQL | Database Size, Objects, Connections, Transactions/sec |
| Microsoft SQL Server | Database Size, Objects, Connections, Transactions/sec |
| Oracle | Database Size, Objects, Connections, Executions/sec |
| MongoDB | Database Size, Collections & Indexes, Server Connections, Operations/sec |
| Redis and Valkey | Memory Usage, Total Keys, Connections, Operations/sec, Keyspace Hit Rate |

Each summary metric can include a value, trend direction, and percentage change when comparable data exists for the selected time window.

## Charts

Database Explorer uses two chart groups in the Overview tab.

Key metric charts track the primary summary metrics over time, such as size, connections, transactions, operations, or key count.

Engine-specific charts show deeper operational signals:

| Engine | Charts |
| --- | --- |
| PostgreSQL | Query Latency, Disk IO, Lock Wait & Deadlock, Table Scans, Index Scans |
| Microsoft SQL Server | Query Latency, Disk IO, Lock Wait & Deadlock, Table Scans, Index Scans |
| Oracle | Query Latency, Disk IO, Wait Events, Blocking Locks |
| MongoDB | Server Operations, Data vs Index Size |
| Redis and Valkey | Operations/sec, Keyspace Hit Rate |

Charts may appear with empty data when Logstag knows the chart is applicable but has not collected enough samples for the selected time window.

## Health Indicators

Database Explorer can show a database health summary computed from collected metrics for the hosting instance, combined with active database and instance alert counts.

Health dimensions follow a shared model:

- Performance.
- Security.
- Configuration.
- Schema.
- Maintenance.

Redis and Valkey use the applicable dimensions for their current health-scoring model: Performance, Configuration, and Schema. Security and Maintenance are treated as not applicable for those engines in Database Explorer health indicators.

Overall health is calculated from the available section scores. The standard weights are:

| Dimension | Weight |
| --- | --- |
| Performance | 30% |
| Security | 25% |
| Configuration | 20% |
| Schema | 15% |
| Maintenance | 10% |

When a dimension is not applicable for an engine, the remaining dimensions are re-weighted for the overall score.

Health score status uses these bands:

| Score | Status |
| --- | --- |
| 80 to 100 | Healthy |
| 60 to 79 | Warning |
| 0 to 59 | Critical |

If no health score has been computed yet, health scores can appear as pending or unavailable while other Database Explorer metrics continue to display.

## Alerts

Database Explorer combines database-scoped and instance-scoped alerts for quick triage.

Alert counts are grouped by severity:

- Critical.
- High.
- Medium.
- Low.

The list view shows alert counts as compact severity badges. The database detail view provides alert context for the selected database, including severity, status, category, scope, assignment, escalation state, and related guidance where available.

## Schema View

The Schema tab provides database object context where the engine supports schema metadata.

It can include:

- Object counts.
- Table, index, view, procedure, function, trigger, sequence, or collection counts where applicable.
- Object size and storage context.
- Paginated object lists.
- Object detail views for supported object types.

Schema availability depends on the engine, granted permissions, and whether schema collectors have completed for the selected time window.

## Data Freshness

Database Explorer uses collected metrics and metadata. Values reflect the selected time window and the most recent data available to Logstag.

Runtime and workload signals can update quickly when high-frequency collectors are enabled. Schema and heavier metadata can take longer because they are collected less frequently. If a metric is unavailable, it usually means the relevant collector has not reported data for the selected time window, the engine does not expose that signal, or the monitoring user does not have the required visibility.

## Data Boundaries

Database Explorer is an observability surface. It shows operational metadata, metric summaries, schema metadata, alert context, and health indicators. It does not copy application table rows, MongoDB documents, or Redis key values into the product view.

Some displayed metadata can still be sensitive, including query text snippets, object names, usernames, role names, client addresses, configuration values, and alert context. Access to Database Explorer should be limited to users who are allowed to inspect database operational metadata.
