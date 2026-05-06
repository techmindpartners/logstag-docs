---
sidebar_position: 4
---

# Query Explorer

Query Explorer shows query-level performance history for monitored databases.

It is designed for operators who need to find expensive, frequently executed, or degrading queries without switching between engine-native tools.

## Purpose

Query Explorer helps answer operational questions such as:

1. Which queries ran most recently?
2. Which queries are slow or trending slower than the previous period?
3. Which queries are called most often?
4. Which queries return or affect the most rows?
5. Which queries have active alert signals?
6. Which database and instance does a query belong to?

The page focuses on query performance metadata. It is not a SQL editor, query execution console, or data browsing surface. Database inventory belongs in Database Explorer, runtime session activity belongs in Activity Explorer, and broader diagnostic reporting belongs in Health Check.

## Preview And Roadmap

Preview mode can show Query Explorer as part of the broader Monitoring menu.

| Surface | Status | Direction |
| --- | --- | --- |
| Query Explorer | Supported | Query performance investigation for engines that expose query statistics. |
| Overview query trend summary | Coming soon | Planned roll-up of query pressure and alert signals in the consolidated monitoring dashboard. |
| Optimization insights | Roadmap | Planned recommendations that connect query behavior, schema shape, and workload change impact. |

The supported Query Explorer page remains the detailed source for query statistics and query-level alert triage.

## Supported Engines

Query Explorer currently supports query statistics for:

| Engine | Query scope |
| --- | --- |
| PostgreSQL | Query fingerprints, query text, calls, execution time, rows, cache and block I/O statistics, charts, and explain plan when available. |
| Microsoft SQL Server | Query fingerprints, query text, executions, elapsed time, CPU-related timing, rows, logical and physical read context, buffer hit ratio, and charts. |
| Oracle | SQL identifiers, query text preview, executions, elapsed time, rows processed, logical and physical read context, buffer hit ratio, and charts. |

MongoDB, Redis, and Valkey continue to be covered by their supported monitoring, alerting, health, and explorer workflows, but they are not part of the current Query Explorer query-statistics model.

## Query List

The Query Explorer list shows recent monitored queries for the selected time window.

The list includes:

- Query text or query text preview.
- Database name.
- Query status.
- Average execution time.
- Execution-time trend compared with the previous comparable period.
- Row count where the engine exposes it.
- Call or execution count.
- Alert counts by severity.
- Last executed time.
- Navigation to the query detail view.

Query status is currently based on query alert pressure:

| Status | Meaning |
| --- | --- |
| Healthy | No critical or high query alert is associated with the query in the selected context. |
| Slow | At least one critical or high query alert is associated with the query in the selected context. |

The status should be treated as a triage signal, not as a full query quality score. A query can be healthy and still deserve tuning if its workload impact is high.

## Filtering, Sorting, And Pagination

Query Explorer supports server-side pagination for the query list. Operators can change the page size and move through the result set without loading all query history into the browser.

The shared explorer filters affect the query list:

- Time window.
- Instance selection.
- Database selection.

The query list also supports:

- Search within the currently loaded page by query text, database name, or status.
- Database filtering through the database selector.
- Column visibility control.
- Manual refresh.

Sortable list fields include:

- Last executed time.
- Execution time.
- Calls.
- Status.
- Critical alerts.
- Rows.

The default Query Explorer time window is a recent multi-day window. Shorter windows are useful during active incidents, while longer windows are better for workload review and trend comparison.

## Query Detail

Selecting a query opens the Query Detail view.

The detail view currently uses two tabs:

| Tab | Purpose |
| --- | --- |
| Overview | Query identity, summary metrics, query text, explain plan where available, and performance charts. |
| Statistics | Detailed execution, row, timing, cache, and block I/O statistics where the engine exposes them. |

Each tab uses the selected time window and compares metrics with the previous comparable period when enough historical data exists.

## Overview

The Overview tab summarizes query behavior.

Top-level metrics include:

- Total Calls.
- Mean Execution Time.
- Total Rows.
- Cache Hit Rate.

Each metric can include:

- Current value.
- Change percentage.
- Trend direction.
- Chart data for the selected time window.

Overview charts can show:

- Total calls over time.
- Mean execution time over time.
- Total rows over time.
- Cache hit rate over time.

PostgreSQL can show an explain plan when Logstag has collected one for the query. Microsoft SQL Server and Oracle may show query text and metrics without an explain plan in the current product surface.

## Statistics

The Statistics tab provides a deeper breakdown of query performance.

Detailed query statistics can include:

- Mean time.
- Calls.
- Total time.
- Maximum time where available.
- Minimum time where available.
- Rows.
- Block I/O total time where available.
- Measurement timestamp.

Block statistics can include:

- Block read time.
- Block write time.

Local block statistics can include:

- Local blocks dirtied.
- Local block cache hits.
- Local blocks hit percentage.
- Local blocks read.
- Local blocks written.

Shared block statistics can include:

- Shared blocks dirtied where available.
- Shared block cache hits.
- Shared blocks hit percentage.
- Shared blocks read.
- Shared blocks written where available.

Not every engine exposes every statistic. When a metric is unavailable, it usually means the selected engine does not provide that signal, the required engine feature is not enabled, or the selected time window does not contain enough collected samples.

## Alert Signals

Query Explorer surfaces alert counts on the query list to help prioritize review.

Alert counts are grouped by severity:

- Critical.
- High.
- Medium.
- Low.

Critical and high query alerts affect the current query status. Medium and low alerts provide additional context but do not by themselves change the list status to Slow.

Query alerts can come from engine-specific checks such as high duration, high execution frequency, high CPU consumption, excessive reads, wait-related query pressure, or similar query-statistics findings where supported by the engine.

## Engine Data Requirements

Query Explorer depends on query-statistics visibility from the monitored engine.

| Engine | Requirement |
| --- | --- |
| PostgreSQL | Query statistics collection must be available for the monitored database. Enabling query-statistics extensions improves query visibility and trend quality. |
| Microsoft SQL Server | Query performance metadata must be available from the SQL Server workload surfaces Logstag monitors. Query Store improves historical query visibility. |
| Oracle | SQL performance metadata must be visible to the monitoring user for the monitored database or pluggable database. |

If query data is missing, common causes include insufficient monitoring permissions, disabled query-statistics features, no query activity in the selected time window, collector delay, or an inactive database target.

## Data Freshness

Query Explorer uses collected query statistics for the selected time window. Some metrics are collected from cumulative engine counters and are converted into interval-based values before being shown.

Trend values compare the selected period with the previous comparable period. If the previous period has no usable data, the trend can be empty even when the current value is present.

The query list can be refreshed manually. Detail tabs reload when the shared time window changes.

## Data Boundaries

Query Explorer displays operational query metadata. This can include SQL text or SQL text previews, normalized query identifiers, database names, instance names, execution counts, row counts, timing data, cache statistics, block I/O statistics, alert context, and explain plans where available.

Logstag does not execute queries from Query Explorer and does not copy application table rows through this product surface.

Query text can still contain sensitive business terms, object names, literals, comments, or workload patterns depending on how the database engine exposes query statistics. Access to Query Explorer should be limited to users who are allowed to inspect database performance metadata and SQL text.
