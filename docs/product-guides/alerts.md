---
sidebar_position: 6
---

# Alerts

Alerts highlight conditions that require operational attention across monitored database engines.

They are generated from engine-specific alert templates and checks that run after Logstag receives fresh monitoring data.

## Purpose

Alerts help operators answer questions such as:

1. Which database, instance, object, workload, or cluster needs attention?
2. How severe is the condition?
3. What changed since the alert was first detected?
4. What is the expected impact?
5. Which action should be taken next?
6. Has the alert been acknowledged, assigned, escalated, or resolved?

Alerts are not a replacement for the monitoring explorers. Database Explorer, Schema Explorer, Query Explorer, and Activity Explorer give ongoing operational visibility across major dimensions. Alerts are event-like signals that keep active and recently detected issues visible across Logstag.

## Supported Engines

Alerts are available for the engines supported by Logstag monitoring.

| Engine | Alert coverage |
| --- | --- |
| PostgreSQL | Query statistics, activity, configuration, schema, and security signals. |
| Microsoft SQL Server | Query statistics, session activity, database activity, performance counters, schema, index, configuration, and security signals. |
| MongoDB | Operation performance, collections, configuration, connection management, memory/cache, maintenance, security, and storage capacity signals. |
| Redis and Valkey | Performance, process activity, schema/keyspace, server settings, maintenance, and replication or availability signals. |
| Oracle | Query statistics, session activity, locks, performance counters, memory management, schema, index, configuration, security, maintenance, Data Guard, redo, tablespace, and queue-related signals where collected. |

Valkey uses the Redis-compatible alert model where the monitored signal is shared with Redis.

## Alert Sources

Alert checks use collected monitoring data rather than direct user-triggered queries from the Alerts page.

Alert sources include:

- Query statistics.
- Runtime activity and sessions.
- Database activity and workload counters.
- Schema and index metadata.
- Server and engine configuration.
- Security posture.
- Replication, availability, and cluster state.
- Maintenance and capacity signals.

Most alert checks run after data ingestion. Some checks can also be scheduled or event-driven depending on the alert template.

## Alert Templates

Each alert is based on an alert template.

Templates define:

- Alert code.
- Display name.
- Description.
- Impact.
- Common causes.
- Recommended actions.
- Database engine.
- Category.
- Scope.
- Check trigger.
- Thresholds.
- Optional remediation effort.
- Optional pending-resolution TTL.

Template content is used to enrich alert list and detail views. This is why alerts can show guidance even when the raw triggering data is a compact metric or context payload.

## Alert Policies

Alert policies control which templates are enabled and how thresholds are applied.

Policy behavior includes:

- Default alert policies per engine.
- Organization-defined policies.
- Engine-specific policy settings.
- Per-template enablement.
- Per-template threshold settings.

When a database has no custom policy, Logstag can use the default policy for that engine. Custom policies are used to tune alert sensitivity for different operational environments.

## Severity

Alerts use severity to communicate urgency.

| Severity | Meaning |
| --- | --- |
| Critical | Requires immediate review because service health, availability, data safety, or severe performance may be affected. |
| High | Requires prompt attention because the condition can materially affect reliability, security, or performance. |
| Medium | Should be reviewed and planned into operational work. |
| Low | Informational or lower-risk signal that can help with tuning, hygiene, or future prevention. |

Informational and best-practice findings can be presented as low-priority alerts in product views.

## Scope

Alert scope describes what the alert applies to.

| Scope | Meaning |
| --- | --- |
| Instance | The alert applies to a database server or managed database instance. |
| Database | The alert applies to a specific database. |
| Database Object | The alert applies to an object such as a table, index, or collection. |
| Workload | The alert applies to workload activity such as sessions, queries, waits, or processes. |
| Cluster | The alert applies to replication, availability group, or cluster context. |
| Organization | The alert applies at organization level where supported. |

The same alert can appear in multiple product areas when its scope is relevant. For example, a schema alert can appear in Schema Explorer, while a query alert can also influence Query Explorer status.

## Alert List

The organization-level Alerts view is designed to provide a consolidated queue of alert items.

Alert rows can include:

- Title.
- Severity.
- Lifecycle state.
- Instance name.
- Database name.
- Object type and object name where applicable.
- Engine.
- Category.
- Scope.
- Assigned user.
- SLA status.
- Breach status.
- First triggered time.
- Last triggered time.
- External ticket information where escalation is enabled.

The alert list supports pagination and filtering by severity, lifecycle state, instance name, database name, assigned user, and SLA breach status. Sorting is supported by timestamp, severity, and title.

## Alert Detail

Alert detail combines template guidance with alert-specific context.

Detail content can include:

- Description.
- Impact.
- Common causes.
- Recommended actions.
- Threshold that triggered the alert.
- Check frequency.
- Context values captured when the alert was detected.
- Related resources.
- Assignment and lifecycle state.
- External ticket reference where available.

Alert context varies by template. It can include values such as query text snippets, table or index names, database names, setting names, metric names, collection names, threshold values, percentages, counts, durations, or sizes.

## Lifecycle

Alerts use both a detailed state and a simplified lifecycle state.

| State | Lifecycle view | Meaning |
| --- | --- | --- |
| New | Active | The alert has been detected and has not been acknowledged or escalated. |
| Acknowledged | Active | A user has acknowledged the alert, but it is not resolved. |
| Escalated | Escalated | The alert has been escalated, usually to an external workflow such as a ticket. |
| PendingResolution | PendingResolution | The external workflow was resolved and Logstag is waiting for the pending-resolution period before closing the alert. |
| Resolved | Resolved | The alert was resolved. |
| AutoResolved | Resolved | Logstag resolved the alert automatically. |

When an active alert is detected again, Logstag updates the existing alert instead of creating a duplicate. If a pending-resolution alert is detected again, it can return to an active or escalated lifecycle state.

## Assignment And Acknowledgement

Alerts can be assigned to users where user assignment is enabled.

Assignment helps teams clarify ownership. Acknowledgement indicates that a user has seen the alert and accepted that it needs review. Acknowledgement does not mean the underlying condition is resolved.

When an alert is acknowledged or escalated, active SLA breach records can be deactivated where SLA breach tracking is enabled.

## SLA Tracking

Alert SLA rules define expected response windows for matching alerts.

SLA rules can match by:

- Alert template.
- Severity.
- Instance.
- Database.
- Object name.

An alert can show:

- SLA status.
- Whether it has an active breach.
- Number of breached SLA rules.
- Breach details where available.

SLA rules are organization-scoped. Updating SLA rules can change how alert list items are classified on the next alert query or background check cycle.

## Escalation

Alerts can be escalated to an external workflow where integration is configured.

Escalated alert data can include:

- Whether the alert is escalated.
- External ticket identifier.
- External ticket URL.
- Integration reference.

When an external ticket is resolved, the alert can move to PendingResolution. If the same condition is detected again before the pending-resolution period completes, Logstag can reactivate the alert and reopen the external workflow where supported by the integration.

## Alert History

Alert history is used to show alert frequency and resolution patterns over time.

History views can include:

- Alert counts grouped into time buckets.
- Severity distribution.
- Average resolution time.
- Median resolution time.
- 90th percentile resolution time.

Supported bucket sizes are hour, day, week, and month. Instance filtering can be applied to history views when reviewing a specific environment.

## Data Freshness

Alerts are time-sensitive and use short-lived cached list data. New or updated alerts can appear after the relevant collector runs and the alert check evaluates the collected data.

If an expected alert is missing, common causes include disabled alert templates, tuned thresholds, missing monitoring permissions, no matching collected data, unsupported engine metadata, collector delay, or an already resolved lifecycle state outside the selected filter.

## Data Boundaries

Alerts display operational metadata and alert context. This can include database names, instance names, object names, query text snippets, setting names, metric values, thresholds, role or user names, external ticket references, and remediation guidance.

Logstag does not copy application table rows, MongoDB documents, or Redis key values through Alerts.

Alert context can still reveal sensitive operational behavior or schema details. Access to Alerts should be limited to users who are allowed to inspect database operational metadata and incident context.
