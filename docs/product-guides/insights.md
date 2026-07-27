---
sidebar_position: 8
---

# Insights

Insights is in Beta. It runs scheduled background analysis over metrics Logstag has already collected, rather than querying monitored databases directly.

## Purpose

Insights help operators answer questions such as:

1. Which queries are getting slower over time, compared to their own recent baseline?
2. Which databases show query call patterns consistent with N+1 access?
3. Which databases are behaving differently from their own recent workload pattern?
4. How confident is Logstag in a given finding?
5. What is the recommended next step?

Insights is not a replacement for Alerts. Alerts evaluate fresh monitoring data against thresholds as it arrives. Insights re-examines already-collected metrics on a recurring schedule to surface slower-forming patterns — regressions, repetitive query patterns, and workload shifts — that a single threshold check would not catch.

## What Insights Analyzes

Insights groups findings into three families:

- **Query performance regressions** — a query's performance has drifted from its own recent baseline.
- **N+1-style query patterns** — a high rate of similar, small queries consistent with row-by-row access instead of a batched query.
- **Workload anomalies** — a database's overall workload shape, such as its read/write mix, connection counts, and cache behavior, has deviated from its own recent baseline.

Findings are computed per database and compared against that database's own recent history rather than a fixed global threshold.

## Reading Findings

The Insights page opens with a KPI summary of current findings, followed by a list of findings that can be filtered by status (Active, Dismissed, Expired, or Resolved), severity, or confidence, and sorted by recency, severity, or recurrence.

Each finding shows a title, the affected database and instance, a severity level (Critical, High, Medium, or Low), a confidence level (Very High, High, Medium, or Low), and how many times the same condition has recurred. Selecting a finding expands it to show what changed relative to baseline, contributing factors where available, and an ordered list of recommended remediation steps. A finding can be dismissed from its row, optionally with a reason. Dismissing a finding does not change anything in the monitored database.

## Engine Scope

| Engine | Coverage |
| --- | --- |
| PostgreSQL | Query regression, N+1 pattern detection, and workload anomaly detection. |
| Microsoft SQL Server | Query regression, N+1 pattern detection, and workload anomaly detection. |
| Oracle | Query regression, N+1 pattern detection, and workload anomaly detection. |
| MongoDB | Collection-operation regression and workload anomaly detection. N+1 pattern detection is not available. |
| Redis | Command-level regression and workload anomaly detection. N+1 pattern detection is not available. |
| Valkey | Command-level regression and workload anomaly detection, using the Redis-compatible detection path. N+1 pattern detection is not available. |

N+1 pattern detection is currently available for PostgreSQL, Microsoft SQL Server, and Oracle only.

## Data Boundaries

Insights re-analyzes metrics and metadata that Logstag has already collected through its normal monitoring path. It does not open new connections to monitored databases, and it does not read table rows, MongoDB documents, or Redis key values to produce a finding.

Findings can still reference operational details such as query text snippets, database and instance names, and metric values. Access to Insights should be limited to users who are allowed to inspect this kind of monitoring detail.
