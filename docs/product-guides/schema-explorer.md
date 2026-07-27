---
sidebar_position: 5
---

# Schema Explorer

Schema Explorer shows structural metadata for monitored databases.

It is designed for operators who need to understand schema size, object inventory, schema changes, permissions, and schema-related alerts without directly browsing application data.

## Purpose

Schema Explorer helps answer operational questions such as:

1. Which schemas exist across monitored databases?
2. Which schemas are large or growing?
3. Which objects exist inside a schema?
4. Which schema objects changed recently?
5. Which users or roles have access to a schema?
6. Which schema-related alerts need attention?

The page focuses on database structure and access metadata. It is not a table data browser, SQL editor, or migration tool. Database-level inventory belongs in Database Explorer, runtime activity belongs in Activity Explorer, and query behavior belongs in Query Explorer.

## Supported Engines

Schema Explorer currently provides schema inventory and detail views for:

| Engine | Schema scope |
| --- | --- |
| PostgreSQL | Schemas, tables, indexes, views, functions, sequences, object sizes, permissions, changes, health indicators, and schema-related alerts. |
| Microsoft SQL Server | Schemas, tables, indexes, views, procedures, functions, triggers, sequences where available, object sizes, permissions, changes, health indicators, and schema-related alerts. |
| MongoDB | The MongoDB database is represented as the schema scope. Collections, views, indexes, collection size, schema changes, and database-level alert context can be shown where collected. |
| Oracle | Oracle schema and owner metadata, object counts, tables, indexes, views, procedures, functions, sequences, triggers, permissions, changes, health indicators, and schema-related alerts where collected. |

Redis and Valkey continue to be covered by their supported monitoring, alerting, health, and Database Explorer workflows, but they are not part of the current Schema Explorer list model.

## Schema List

The Schema Explorer list is the entry point for structural inventory. Each row represents a schema-like scope inside a monitored database.

The list includes:

- Schema name.
- Hosting instance.
- Database name.
- Database engine.
- Schema size where available.
- Active alert counts by severity.
- Navigation to the schema detail view.

For PostgreSQL and Microsoft SQL Server, rows represent database schemas. For MongoDB, the database itself is used as the schema scope. Oracle schema visibility depends on collected owner and object metadata.

## Filtering, Sorting, And Pagination

Schema Explorer supports server-side pagination for the schema list.

The shared explorer filters affect the schema list:

- Time window.
- Instance selection.

The schema list also supports:

- Search by schema name.
- Column visibility control.
- Manual refresh.
- Page size changes.

Sortable list fields include:

- Schema name.
- Instance name.
- Database name.
- Size.

The default Schema Explorer time window is a recent multi-day window. Shorter windows are useful when reviewing recent structural changes, while longer windows are useful for growth and inventory review.

## Schema Detail

Selecting a schema opens the Schema Detail view.

The detail view currently uses four tabs:

| Tab | Purpose |
| --- | --- |
| Overview | Schema identity, object metrics, size breakdown, object list, and schema health indicators. |
| Changes | Schema change history for the selected time window. |
| Permissions | User and role permissions plus permission change history where the engine supports it. |
| Alerts | Schema-related alert context and recommendations where available. |

Each tab uses the selected time window. Detail tabs reload when the shared time window changes.

## Overview

The Overview tab summarizes the selected schema.

The identity area shows:

- Engine.
- Hosting instance.
- Database.
- Schema.
- Last updated time.

Object metrics adapt to the engine:

| Engine | Object metrics |
| --- | --- |
| PostgreSQL | Tables, indexes, views, functions, and sequences. |
| Microsoft SQL Server | Tables, indexes, views, procedures, functions, triggers, and sequences where available. |
| MongoDB | Collections, views, and indexes. |
| Oracle | Tables, indexes, views, procedures, functions, sequences, and triggers where available. |

Each metric can include a count, trend direction, and change percentage when comparable data exists for the selected time window.

Schema size includes total size and a breakdown by object type where available. Some engines expose full table and index size; others expose only partial size information. For example, Oracle may expose index size while table data size is unavailable in the current collected view.

## Database Objects

The Overview tab includes a database object list for the selected schema.

Object rows can include:

- Object name.
- Object type.
- Schema.
- Size.
- Last modified time.
- Object detail action.

Object details can include additional metadata such as row count, description, parent object, index type, included columns, or object definition where the engine exposes them.

The object list supports client-side search, sorting, pagination, and object detail dialogs.

## Health Indicators

Schema Explorer can show schema health indicators computed from collected metrics and related alert context.

Health dimensions follow a shared model:

- Performance.
- Security.
- Configuration.
- Schema.
- Maintenance.

Health indicators are shown when a completed health assessment is available for the related database and instance. If no health assessment has completed yet, schema metadata can still appear while health indicators remain unavailable.

## Changes

The Changes tab shows detected structural changes for the selected schema and time window.

Change records can include:

- Timestamp.
- Object name.
- Object type.
- Change type.
- Description.
- Owner or schema context where available.
- Property-level changes for modified objects.
- Additional metadata where available.

Change types include additions, removals, and modifications. The exact object types depend on the engine and collected metadata. PostgreSQL and Microsoft SQL Server commonly expose table, index, view, procedure, function, trigger, and sequence changes. MongoDB exposes collection-level changes. Oracle exposes owner and object metadata where available.

For large change windows, results can be capped to keep the view responsive. When a time window is too broad for exact review, narrow the window to inspect a more precise change set.

## Permissions

The Permissions tab shows schema access metadata where the engine supports it in the current product surface.

Current Permissions tab support:

| Engine | Permissions tab behavior |
| --- | --- |
| PostgreSQL | Users, roles, privilege flags, role inheritance, and permission history where collected. |
| Microsoft SQL Server | Users, roles, database role context, permission flags, and permission history where collected. |
| Oracle | Users, roles, privilege flags, role membership, admin or grant options where collected, and permission history where available. |
| MongoDB | Not shown in the current Permissions tab. |

Permission summary metrics include:

- Users.
- Roles.
- Full Access Roles.
- Read-only Roles.

Permission rows can include principal name, principal type, privilege level, and privilege flags such as Select, Insert, Update, Delete, and Execute. Engine-specific privileges can also be collected, but the UI emphasizes the common privilege model for comparison.

Permission change history can include timestamp, principal, principal type, change description, changed-by context, action, privilege, and reason where available.

## Alerts

The Alerts tab shows schema-related alert context for the selected schema.

Alert data can include:

- Alert title and description.
- Severity.
- Category.
- Status.
- Created and last detected times.
- Affected objects.
- Relevant metrics.
- Recommended actions.
- Related resources where available.

MongoDB alert context is database-level in the current model, so alerts can be shown without strict schema filtering. Redis and Valkey do not have schema-based alert views in Schema Explorer.

## Data Freshness

Schema Explorer uses collected schema and object metadata for the selected time window. Schema and permission data usually changes less frequently than runtime activity, so it can update on a different cadence than Activity Explorer or Query Explorer.

If schema data is unavailable, common causes include no collected schema sample for the selected time window, insufficient monitoring permissions, unsupported engine metadata, collector delay, or an inactive database target.

## Data Boundaries

Schema Explorer displays structural and access metadata. This can include schema names, database names, object names, object types, object sizes, row counts, object definitions, comments, role names, user names, privilege flags, permission history, alert context, and structural change metadata.

Logstag does not copy application table rows, MongoDB documents, or Redis key values through Schema Explorer.

Schema metadata can still be sensitive. Object names, role names, comments, definitions, and permission history can reveal business structure or security posture. Access to Schema Explorer should be limited to users who are allowed to inspect database structure and access metadata.
