---
sidebar_position: 9
---

# Audit Logs

Audit Logs provide an Account Owner-only record of activity inside Logstag. The page is designed for security review, operational traceability, and administrative accountability.

Audit Logs are not a general operator page. They are intended for the Account Owner because they can expose user activity, administrative actions, access context, and sensitive operational metadata about how the organization uses Logstag.

Audit Logs answer questions such as:

- Who performed an action?
- When did it happen?
- Which product area or entity was involved?
- Did the action complete successfully?
- How long did the request take?
- Was the action performed through an impersonation session?

## Preview And Roadmap

| Area | Status | What it means |
| --- | --- | --- |
| Audit Logs | Account Owner only | Organization activity can be reviewed from a dedicated governance page restricted to the Account Owner. |
| Users | Supported where enabled | User and role management is part of the administration surface. |
| Insights governance signals | Roadmap | Audit activity will contribute to broader security and governance analysis. |
| Governance dashboards | Roadmap | Audit trends, access changes, and administrative activity will be summarized in higher-level views. |

Audit Logs remain the detailed evidence view. Roadmap governance surfaces are intended to summarize patterns, not replace the raw activity trail.

## Access Model

Audit Logs are available only to the Account Owner.

This restriction keeps the audit trail independent from normal operational workflows. Database operators, developers, billing users, and regular administrative users should use the product areas relevant to their work without receiving direct access to the organization audit trail.

Account Owner access is appropriate because Audit Logs can include:

- User identity and role context.
- Administrative activity.
- Product area and action names.
- Entity identifiers.
- Status and timing information.
- Client IP address where available.
- Impersonation indicators.
- Sanitized request details where available.

## What Audit Logs Capture

Each audit entry may include:

| Field | Description |
| --- | --- |
| Time | When the activity was recorded. |
| User | The user associated with the action. |
| Role | The user's role at the time of the activity. |
| Method | The type of product operation performed. |
| Area | The Logstag product area that handled the action. |
| Action | The specific operation name shown in the audit table. |
| Entity Type | The type of object affected, when available. |
| Entity ID | The affected object identifier, when available. |
| Status | The response outcome for the action. |
| Duration | The action duration. Durations under one second are shown in milliseconds; longer durations are shown in seconds. |
| IP Address | The client IP address associated with the activity, when available. |
| Request Body | A sanitized summary of submitted values, when available and permitted for display. |

Audit Logs focus on Logstag application activity. They do not collect database row contents, query result sets, or application payloads from monitored databases.

## Default View

The page opens with recent activity for the last 24 hours.

The table shows the most important columns by default:

- Time
- User
- Method
- Area
- Action
- Entity Type
- Status

The Account Owner can enable additional columns when a deeper review is needed.

## Filters

Audit Logs can be filtered by:

- Start and end time.
- Operation method.
- Entity type.
- Product area.

Filters apply to the audit trail shown in the table. Pagination remains available so teams can review large activity windows without loading the full history at once.

## Column Management

The column selector lets the Account Owner choose which audit fields are visible.

Always-visible columns keep the core timeline readable. Optional columns are useful during deeper investigations, support review, or security analysis.

## Impersonation Visibility

When an action is performed through an impersonation session, Audit Logs mark the entry accordingly.

This helps distinguish direct user activity from authorized support or administrative access. Impersonation visibility is important for Account Owner review, regulated environments, and post-incident analysis.

## Sanitized Request Details

Some audit entries can include a request summary.

Sensitive values are sanitized before they are stored or displayed. Request details are intended to explain what type of change was made, not to expose secrets or monitored database content.

## Retention

Audit Logs are retained for a limited operational window. The default retention window is 30 days unless the deployment is configured differently.

For long-term compliance retention, export or archival workflows should be planned outside the interactive Audit Logs page.

## Security Review Workflow

A typical Account Owner review flow is:

1. Select the time window for the investigation.
2. Filter by product area, entity type, or operation method.
3. Check the user, role, status, and timing of the action.
4. Open optional columns when request context, duration, IP address, or entity identifiers are needed.
5. Correlate the result with alerts, assets, integrations, or Health Check reports when the activity relates to an operational change.

## Data Boundaries

Audit Logs are a Logstag governance feature. They describe activity inside the Logstag application and administration surfaces.

Audit Logs do not provide a database-native audit trail for every action performed directly inside a monitored database. Database-native auditing, compliance logs, and privileged access monitoring should continue to be managed according to the customer's database and security policies.

Because Audit Logs are Account Owner-only, they should not be used as the primary collaboration surface for incident response. When an operational issue needs team follow-up, the Account Owner can correlate audit evidence with Alerts, Assets, Integrations, Health Check reports, or explorer pages and share only the necessary operational context through the appropriate workflow.
