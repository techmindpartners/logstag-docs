---
sidebar_position: 6
---

# Product Areas

Logstag groups database observability workflows into focused product areas. Each area should be documented in terms of what it shows, what data it depends on, and which engines support it.

## Health Check

Health Check creates engine-specific reports for performance, security, configuration, schema, and maintenance signals. Reports are generated from previously ingested metrics and metadata.

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

Integrations connect Logstag workflows to external tools. Documentation for each integration should explain required credentials, scopes, supported events, and operational behavior.

## Audit Logs

Audit Logs show administrative and organization-level activity. They are intended for accountability, security review, and operational traceability.
