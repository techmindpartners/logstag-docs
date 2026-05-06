---
sidebar_position: 8
---

# Integrations

Integrations connect Logstag operational workflows to external systems.

The currently supported integration is Jira Cloud. It is used to route database alerts and database-specific workflow context into the right Jira project.

## Purpose

Integrations help teams answer questions such as:

1. Which external workflow system is connected to Logstag?
2. Which database should route alerts to which project?
3. Can an alert be escalated into an external ticket?
4. Which external ticket is linked to an alert?
5. Has the external ticket moved to a resolved state?

Integrations are not used for monitoring collection. The Logstag agent still collects database telemetry. Integrations are used after collection, mainly for workflow routing and escalation.

## Supported Integrations

| Integration | Status | Primary use |
| --- | --- | --- |
| Jira Cloud | Supported | Alert escalation, ticket linking, and database-to-project routing. |

Additional integration categories are planned. Jira Cloud is the active supported integration for operational workflows today.

## Integration Catalog

Logstag also includes a preview catalog that shows the broader integration direction.

The catalog is a product preview, not a supported setup surface for every listed tool. It helps teams understand where Logstag intends to connect database operations with surrounding engineering and operations workflows.

| Category | Integration | Status | Planned use |
| --- | --- | --- | --- |
| Application Performance Monitoring | New Relic | Coming soon | Correlate database findings with application performance signals. |
| Application Performance Monitoring | Datadog | Coming soon | Connect database health and alert context with full-stack observability workflows. |
| Application Performance Monitoring | Elastic APM | Coming soon | Relate database behavior to application traces and service performance. |
| CI/CD | Jenkins | Coming soon | Associate database risk and deployment activity with pipeline workflows. |
| CI/CD | GitHub Actions | Coming soon | Connect database operational checks with repository automation and deployment pipelines. |
| CI/CD | GitLab CI | Coming soon | Bring database context into GitLab-based CI/CD workflows. |
| Project Management | Jira Cloud | Supported | Create and track external tickets for database alerts. |
| Project Management | Linear | Coming soon | Route database findings into issue tracking for product and engineering teams. |
| Project Management | ClickUp | Coming soon | Connect database operational work with task and project management workflows. |
| Source Control | GitHub | Coming soon | Relate database changes and operational findings to repository activity. |
| Source Control | GitLab | Coming soon | Connect database operations with source control and DevOps workflows. |
| Source Control | Bitbucket | Coming soon | Link database operational context with repository and code review workflows. |

Additional catalog candidates include AWS CloudWatch, Azure Monitor, Google Cloud Monitoring, Prometheus, PagerDuty, Opsgenie, ServiceNow, Jaeger, OpenTelemetry, and Grafana. These are roadmap candidates and should be treated as planned integrations until they are available in the supported integration flow.

## Catalog Status

The catalog uses two documentation statuses:

| Status | Meaning |
| --- | --- |
| Supported | Available in the operational integration flow and backed by Logstag workflow behavior. |
| Coming soon | Visible in product direction or preview catalog, but not yet available for production configuration. |

## Permissions

Integration management is an administrative action.

Users need integration management permission to create, update, or remove integration configuration. Alert escalation requires alert management permission because it changes the alert lifecycle and can create an external ticket.

## Jira Configuration

Jira configuration stores the connection information Logstag needs to create and update Jira issues.

The configuration includes:

- Integration name.
- Jira Cloud site URL.
- Jira account email.
- Jira API token.
- Optional webhook secret.
- Active or inactive state.
- Created and updated timestamps.

Jira Cloud site URLs must use HTTPS and must point to a Jira Cloud domain. Self-hosted Jira and arbitrary external domains are not part of the current Jira integration scope.

The API token is treated as a secret. Existing token values are not displayed in full in the UI. When editing an existing integration, leaving the token field blank keeps the current token.

## Creating A Jira Integration

The basic setup flow is:

1. Open Integrations.
2. Select Jira.
3. Enter the Jira Cloud site URL.
4. Enter the Jira account email.
5. Enter a Jira API token.
6. Optionally enter a webhook secret.
7. Save the configuration.

After saving, the Jira integration appears as connected in the Integrations area.

The Jira account should have permission to browse the target projects, read project issue types, create issues, view transitions, add comments, and transition issues where escalation workflows require it.

## Database To Project Mapping

Jira routing is configured per database, not only per organization.

Mappings are managed from the asset detail view. For a selected asset, users can choose a Jira integration and map databases on that asset to Jira projects.

Mapping rows include:

- Database name.
- Jira project.
- Edit action.
- Add row action.

Only mapped databases can be escalated automatically to a Jira project. If an alert belongs to a database with no Jira mapping, escalation cannot determine the target project.

## Alert Escalation

When a user escalates an alert, Logstag creates a Jira issue using the mapped Jira project for the alert's database.

Escalation is available for alerts in active states that have not already completed their lifecycle. The alert must have a database context so Logstag can resolve the database-to-project mapping.

The Jira issue includes alert context such as:

- Alert title.
- Severity.
- Status.
- Category.
- Engine.
- Scope.
- Instance name.
- Database name.
- Subject where available.
- Threshold where available.
- First triggered time.
- Description.
- Impact.
- Common causes.
- Recommended actions.
- Additional resources.
- Captured alert context, truncated when needed.

After the Jira issue is created successfully, Logstag stores the external ticket reference and moves the alert into the escalated lifecycle state.

If Jira issue creation fails, Logstag does not mark the alert as escalated.

## Issue Type Selection

When escalating an alert, Logstag resolves the Jira issue type from the mapped project.

The preferred issue type is Task. If the project uses a localized Task label, Logstag can use that equivalent. If no Task-like issue type is available, Logstag can use the first issue type returned by Jira for the project.

If Logstag cannot resolve an issue type for the project, escalation fails and the alert remains in its previous lifecycle state.

## External Ticket Link

Escalated alerts can show the external ticket identifier and link.

If the alert already has an external ticket link, selecting the escalation action opens the existing ticket instead of creating another one.

Logstag keeps one active escalation reference for an alert. When a new escalation is created for the same alert, previous escalation references are deactivated.

## Jira Status Updates

Jira can notify Logstag when an external ticket changes state.

When the Jira ticket moves to a done, resolved, or closed-style status, Logstag can move the linked alert into PendingResolution. PendingResolution gives Logstag time to verify whether the same condition appears again before fully closing the alert.

If the same alert condition is detected again while the alert is pending resolution, Logstag can reactivate the alert and reopen the linked Jira issue where Jira supports the required transition.

Jira status updates require the webhook secret configured in the integration. The webhook secret is masked in the UI.

## Rate Limiting

Logstag throttles Jira calls per integration to avoid sending bursts of requests to Jira.

This affects actions such as creating issues, reading issue types, reading transitions, adding comments, reopening issues, and checking issue status. If many alerts are escalated at once, ticket creation can take longer.

## Removing An Integration

Removing a Jira integration deletes the integration configuration from Logstag.

Existing Jira issues are not deleted. Historical alert references may still contain external ticket identifiers, but future escalations require a valid active Jira integration and database mapping.

Before removing an integration, review database mappings and alert escalation workflows that depend on it.

## Data Freshness

Integration list state is loaded from Logstag when the Integrations page opens.

Database mappings depend on the selected asset and the databases known for that asset. Newly discovered databases can become available for mapping after the agent reports them and Logstag updates the asset's database inventory.

Jira project and issue type data is read from Jira when needed. If Jira permissions, project access, or project configuration changes, Logstag may not reflect the change until the next request.

## Data Boundaries

Integrations store operational workflow metadata and credentials needed for the external system.

This can include:

- Jira Cloud site URL.
- Jira account email.
- Jira API token.
- Optional webhook secret.
- Integration name.
- Database-to-project mappings.
- External ticket identifiers.
- External ticket status.
- Alert context sent during escalation.

Alert escalation can send database operational metadata to Jira. This can include database names, instance names, object names, engine names, alert descriptions, thresholds, metric values, and captured alert context.

Logstag does not send application table rows, MongoDB documents, Redis key values, or user payload data through the integration workflow.

Because escalation can expose operational metadata in Jira, configure Jira access according to the same sensitivity level as Logstag alert access.
