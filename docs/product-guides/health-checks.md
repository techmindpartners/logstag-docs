---
sidebar_position: 1
---

# Health Checks

## Product Direction

Health Check is the first live entry point for Logstag. In Phase 1, it is used as a focused assessment workflow for customer onboarding, proof-of-concept work, and database health reviews.

This positioning will change as Monitoring becomes generally available. In Phase 2, Health Check will be embedded into the Monitoring experience and presented as a report section under Reports. The underlying value remains the same: Logstag will continue to generate engine-specific health findings from collected metrics and metadata. The product surface will become part of the broader monitoring workflow instead of a standalone entry point.

## Reports Roadmap

Reports is visible as a coming-soon monitoring surface in the broader product direction.

| Surface | Status | Expected role |
| --- | --- | --- |
| Health Check report | Supported | Current report output for database health assessment and proof-of-concept reviews. |
| Reports page | Coming soon | Future monitoring area for generated reports, including Health Check output. |
| Scheduled reports | Roadmap | Planned workflow for recurring operational summaries and stakeholder-ready report delivery. |
| Report comparison center | Roadmap | Planned workflow for comparing report history across time, environments, and remediation cycles. |

Until Reports is available as a supported surface, Health Check remains the report entry point for generated database assessment output.

## Purpose

Health Checks generate engine-specific reports from collected metrics, alerts, schema metadata, database metadata, and previously collected operational signals.

A health check is not a synthetic probe and is not a replacement for continuous monitoring. It is a structured report generated from observable database signals that Logstag can access for a target.

## Primary Users

Health Checks are designed for:

- Engineering leaders reviewing the state of a production database.
- Database administrators validating configuration, security posture, and maintenance signals.
- Platform and SRE teams preparing operational reviews.
- Logstag onboarding and solution teams running proof-of-concept assessments.

## Report Model

A Health Check report should answer four questions:

1. What is the current state of the database?
2. Which findings need attention?
3. Why does each finding matter?
4. What should the operator review or change next?

Reports are evidence-led. Recommendations are connected to observed metrics, configuration values, permission states, schema signals, alerts, or engine-specific conditions.

## Report Tabs

Health Check uses a fixed tab model in the report structure.

| Tab | Scope |
| --- | --- |
| Overview | Cross-tab summary generated from the other report tabs. It is not an independent check category. |
| Configuration | Engine configuration, memory settings, version or compatibility signals, startup state, and operational limits. |
| Schema | Schema objects, indexes, collections, object counts, invalid objects, storage shape, and schema-level findings where supported. |
| Performance | Query, session, wait, connection, memory, CPU, I/O, latency, blocking, and workload-related findings. |
| Security | Authentication, users, roles, grants, ACLs, elevated permissions, profile settings, audit settings, TLS/SSL, and policy signals where supported. |
| Maintenance | Backup, vacuum, checkpoints, persistence, index maintenance, storage growth, queue health, Data Guard, and cleanup-related signals where supported. |

Availability-related signals are reported inside the tab that owns the underlying evidence. For example, connection pressure and replication lag are usually evaluated under Performance, while backup and recovery posture are evaluated under Maintenance.

## Engine Scope

| Engine | Generated report tabs |
| --- | --- |
| PostgreSQL | Configuration, Schema, Performance, Security, Maintenance |
| Microsoft SQL Server | Configuration, Schema, Performance, Security, Maintenance |
| MongoDB | Configuration, Schema, Performance, Security, Maintenance |
| Oracle | Configuration, Schema, Performance, Security, Maintenance |
| Redis and Valkey | Configuration, Performance, Schema |

Redis and Valkey Health Checks currently focus on Configuration, Performance, and Schema. Engine differences are expected because each database exposes a different operational model.

## Report Information

Each generated report includes:

- Health Check info: instance id, instance name, version, platform, execution status, duration, start time, completion time, generated time, database engine, overall health score, result, and aggregated attention/critical counts.
- System health: overall score plus per-tab health items for tabs that have checks.
- Tab data: Overview, Configuration, Schema, Performance, Security, and Maintenance where generated for the engine.
- Charts: performance trends for the Health Check time window and alert history.
- Recommendations: Critical, Optimization, and Strategic recommendation groups, generated only when evidence supports them.
- Scope: schema objects and database metadata where the engine generator provides them.

Report information is derived from the collected data and generated report sections for the Health Check window.

## Scoring Method

Each tab score is calculated from its check summary.

```text
base_score = healthy_count / total_checks * 100
final_score = base_score - (critical_count * 30) - (attention_count * 10)
```

The final section score is clamped between `0` and `100`. A section without generated checks does not reduce the overall score in the current report model.

The overall health score is weighted across the five main report sections:

| Section | Weight |
| --- | --- |
| Performance | 30% |
| Security | 25% |
| Configuration | 20% |
| Schema | 15% |
| Maintenance | 10% |

The current overall result is `Healthy` when the overall score is `60` or higher, and `Unhealthy` when it is below `60`.

## System Health

System health is a high-level summary built from the generated tab summaries. A tab appears in System Health only when that tab exists and has checks.

The tab health percentage is:

```text
healthy_count / total_checks * 100
```

System Health UI status uses these thresholds:

| Percentage | UI status |
| --- | --- |
| 90% and above | success |
| 70% to 89% | warn |
| Below 70% | critical |

System Health UI status is separate from the Health Check finding status shown inside report details.

## Report Statuses

A report finding has one of three statuses.

| Status | Meaning |
| --- | --- |
| Healthy | The observed signal is within the expected range or no issue was detected. |
| Attention | The signal requires operator review but is not classified as critical. |
| Critical | The signal indicates a high-priority risk that can affect availability, data safety, security posture, or workload stability. |

Health Check execution has a separate lifecycle status for the run itself: Pending, Collecting, Generating Report, Completed, Failure, Cancelled, Timeout, and Stopping.

When Logstag cannot evaluate a signal because of missing permissions, unsupported engine behavior, disabled database features, or provider restrictions, the report treats it as a coverage or evidence availability limitation rather than a finding status.

## Finding Structure

Each finding can include:

- Title: short, specific, and tied to the observed issue.
- Status: Healthy, Attention, or Critical.
- Result: the current value or outcome for the check.
- Evidence: the metric, metadata, alert, or configuration value that triggered the finding.
- Insight: why the finding matters operationally.
- Threshold: the expected or configured threshold where applicable.
- Delta: change from the previous comparable Health Check where available.
- Result table: structured details for checks that need row-level context.
- Remediation effort: estimated person-days for Attention and Critical findings where available.
- Actions: recommended actions sourced from the alert template or generated guidance.
- Scope: the affected database, schema, collection, index, user, role, query, or subsystem where applicable.

Recommendations are written for database operators and focus on actions they can evaluate from the reported evidence.

## Scope And Comparison

Health Check scope is report context used for comparison and review.

Scope can include:

- Schema objects across monitored databases, capped at `5000` objects.
- Total schema object count when the stored list is truncated.
- Engine-specific database metadata such as compatibility level, collation, settings, database properties, collection counts, index counts, and storage metadata where supported.

Scope comparison can identify added objects, removed objects, modified objects, and changed database metadata between two Health Checks.

PostgreSQL, Microsoft SQL Server, and MongoDB generate schema object and database metadata scope. Oracle scope comparison is not populated in the current Phase 1 report output. Redis and Valkey return an empty schema-object scope because they do not have traditional schema objects.

## Charts

Health Check charts currently include:

- Performance Trends: system performance data sampled across the Health Check time window.
- Alert History: alert counts by severity over the recent history window used by the alert history service.

Chart labels are generated from the Health Check duration. Shorter checks use fewer points; longer checks use wider intervals.

## Recommendations

Recommendations are generated after tab data is populated. If no server or database alerts exist for the Health Check window, the recommendation section is empty.

When recommendations are generated, they are grouped as:

| Group | Meaning |
| --- | --- |
| Critical | Immediate action items supported by Critical or high-impact findings. |
| Optimization | Performance, efficiency, or configuration improvements supported by evidence. |
| Strategic | Longer-term architecture, capacity, or maintenance recommendations supported by evidence. |

Empty recommendation groups are valid when the report evidence does not support a recommendation.
