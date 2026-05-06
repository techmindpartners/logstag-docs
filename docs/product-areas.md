---
sidebar_position: 6
---

# Product Areas

Logstag groups database observability workflows into focused product areas. Each area is defined by what it shows, what data it depends on, and which engines support it.

## Product Status Language

Logstag documentation uses these status labels when a product surface appears in preview mode but is not fully available in the supported operational flow.

| Status | Meaning |
| --- | --- |
| Supported | Available in the active Logstag workflow and documented with operational behavior. |
| Coming soon | Visible in product direction or preview mode, but not yet available for production configuration or customer workflow ownership. |
| Roadmap | Planned product direction. Scope, workflow, and availability can change before release. |

## Health Check

Health Check creates engine-specific reports for performance, security, configuration, schema, and maintenance signals. Reports are generated from previously ingested metrics and metadata.

Reports is a coming-soon surface for the broader monitoring experience. Health Check reports will move into that area as Monitoring becomes the primary entry point.

## Overview

Overview is a coming-soon monitoring dashboard surface. It is designed to summarize instances, databases, connections, alerts, trends, system health, and database inventory in a single operational view.

In the current supported flow, these signals are available through Health Check, explorer pages, Alerts, and Assets rather than a single production Overview page.

## Insights

Insights is a roadmap analytics surface. It is intended to combine health scoring, optimization opportunities, change impact, security posture, data inventory, and forecasting into a higher-level operational intelligence view.

The preview experience shows the intended direction for Insights. Until this surface becomes part of the supported workflow, operational decisions should continue to rely on Health Check, explorer pages, Alerts, Assets, and Integrations. Audit Logs remain an Account Owner-only governance view.

## Database Explorer

Database Explorer is the inventory and overview surface for monitored databases. It shows database status, engine, metrics, alerts, and links into deeper views.

## Schema Explorer

Schema Explorer shows schema and object metadata where supported by the engine. Depending on the engine, this can include tables, indexes, collections, object counts, permissions, schema changes, and related alerts.

## Activity Explorer

Activity Explorer focuses on runtime database activity. It covers active sessions, connections, waits, blocking, transactions, and engine-specific activity signals.

## Query Explorer

Query Explorer shows query performance where the database engine exposes query statistics. The available metrics vary by engine and database feature configuration.

## Alerts

Alerts are generated from engine-specific templates and post-ingestion checks. They help operators identify performance, security, configuration, schema, maintenance, and availability signals that need review.

## Assets

Assets represent monitored infrastructure and database resources. They help teams track what is connected to Logstag and how those resources relate to monitored databases.

## Integrations

Integrations connect Logstag workflows to external tools. Each integration defines the required credentials, scopes, supported events, and operational behavior.

Jira Cloud is the supported integration today. The broader integration catalog is roadmap and should be described as coming soon until each integration is available in the supported setup flow.

## Audit Logs

Audit Logs show administrative and organization-level activity. They are an Account Owner-only governance view intended for accountability, security review, and operational traceability.

## Users

Users is an administration surface for organization member management, roles, and permissions. It is available to administrative roles where enabled.

Preview mode also shows Users as part of the wider administration direction. User management and Audit Logs should be documented as governance surfaces, not as database monitoring collectors. Audit Logs should also remain clearly separated from normal operator workflows because access is limited to the Account Owner.
