---
sidebar_position: 6
---

# Product Areas

Logstag's web application organizes database observability, alerting, and administration into the areas below, listed in the order they appear in the sidebar navigation.

## Overview

Overview is the dashboard landing page. It consolidates health and activity across monitored databases into a single summary view.

**Where:** top of the sidebar, first item in the navigation.

## Alerts

Alerts applies template-based alerting across all six supported engines, evaluating engine-specific performance, security, configuration, schema, and maintenance signals. Each alert carries a Critical, High, Medium, or Low severity, and operators can acknowledge, assign, or mute it as part of its lifecycle. SLA tracking measures response time against expected windows, and alerts can escalate to Jira through the Integrations settings in Workspace.

**Where:** top of the sidebar.

## Insights (Beta)

Insights (Beta) runs background analysis over metrics Logstag has already collected, rather than querying monitored databases directly. It produces findings such as query performance regressions and workload anomalies for operators to review.

**Where:** top of the sidebar.

**Engine scope:** currently strongest for PostgreSQL, Microsoft SQL Server, and Oracle.

## Data Inventory (Beta)

Data Inventory (Beta) applies identifier-based classification to schema metadata rather than table contents. It flags sensitive-data categories such as PII, financial data, and credentials based on column and field names collected from monitored schemas.

**Where:** top of the sidebar.

**Engine scope:** classification currently runs for PostgreSQL and Microsoft SQL Server.

## Databases

Databases (the Database Explorer) is the inventory and detail view for monitored database targets. Each database has an Overview tab, a Schema tab, and an Alerts tab, with health indicators computed from collected metrics alongside active database and instance alert counts.

**Where:** Monitoring group in the sidebar.

**Engine scope:** the Schema tab is hidden for Redis and Valkey.

## Schemas

Schemas (the Schema Explorer) shows structural metadata for monitored databases, including schema and object inventory, permissions, and recent schema changes. Its detail view has Overview, Changes, Permissions, and Alerts tabs.

**Where:** Monitoring group in the sidebar.

**Engine scope:** covers PostgreSQL, Microsoft SQL Server, MongoDB, and Oracle. Redis and Valkey are not part of the schema model.

## Activities

Activities (the Activity Explorer) focuses on runtime database activity, including connections, wait events, and blocking chains. Its detail view has Overview, Connections, Wait Events, and Blocking Chains tabs.

**Where:** Monitoring group in the sidebar.

**Engine scope:** detailed activity views are available for PostgreSQL, Microsoft SQL Server, and Oracle.

## Queries

Queries (the Query Explorer) shows query-level performance history for monitored databases, including execution time, call counts, and query-level alerts. Its detail view has Overview, Statistics, and Alerts tabs.

**Where:** Monitoring group in the sidebar.

**Engine scope:** available for PostgreSQL, Microsoft SQL Server, and Oracle only.

## Asset Management

Asset Management registers and tracks the lifecycle of monitored database instances for administrators and DBAs. It covers the add-asset wizard, agent registration, and connection testing for each instance.

**Where:** Resources group in the sidebar.

## Users

Users is an administrator-only surface for managing organization members and their roles. Available roles are SuperAdmin, Admin, DBA, Dev, and Billing, each scoping what a member can see and do across the application.

**Where:** Resources group in the sidebar.

## Audit Logs

Audit Logs are available to Admin and SuperAdmin roles, recording activity inside Logstag for security review and operational traceability. Entries can include who performed an action, when, the affected product area and entity, status, duration, and IP address where available.

**Where:** Resources group in the sidebar.

## Workspace

Workspace holds organization-level settings: General, Integrations, Alert Policy, and Billing. Jira Cloud is the integration configured under Integrations, used to route alert escalations to external tickets.

**Where:** Resources group in the sidebar.
