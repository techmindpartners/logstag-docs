---
sidebar_position: 6
---

# Product Areas

Logstag groups database observability workflows into focused product areas. Each area is defined by what it shows, what data it depends on, and which engines support it.

## Overview

Overview is a monitoring dashboard surface. It is designed to summarize instances, databases, connections, alerts, trends, system health, and database inventory in a single operational view.

These signals are available through explorer pages, Alerts, and Assets rather than a single Overview page.

## Insights

Insights is an analytics surface. It is intended to combine health scoring, optimization opportunities, change impact, security posture, data inventory, and forecasting into a higher-level operational intelligence view.

Operational decisions currently rely on explorer pages, Alerts, Assets, and Integrations. Audit Logs remain an Account Owner-only governance view.

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

Jira Cloud is the supported integration today. The broader integration catalog will expand as additional integrations become available in the setup flow.

## Audit Logs

Audit Logs show administrative and organization-level activity. They are an Account Owner-only governance view intended for accountability, security review, and operational traceability.

## Users

Users is an administration surface for organization member management, roles, and permissions. It is available to administrative roles where enabled.

User management and Audit Logs should be documented as governance surfaces, not as database monitoring collectors. Audit Logs should also remain clearly separated from normal operator workflows because access is limited to the Account Owner.
