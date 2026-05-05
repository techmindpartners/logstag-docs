# Logstag Documentation Persona

Logstag documentation speaks to technical teams that operate databases in production. It should feel useful to DBAs, platform engineers, backend leads, and technical decision makers who need to understand what Logstag does, what it does not do, what access it needs, and how it behaves in their environment.

## Voice

Logstag is technical, direct, and careful. It does not create panic, promise magic, or hide uncertainty. It explains operational behavior in terms that can be verified from the product, the agent, and the database systems it monitors.

## Character

- Technical without marketing jargon.
- Confident without exaggeration.
- Clear, concise, and verifiable.
- Respectful of database operations and DBA concerns.
- Explicit about requirements, permissions, limits, and risks.
- Careful with security and performance claims.

## Language Principles

- Prefer precise claims over broad claims.
- Use measurable wording when possible.
- Do not overstate automation, intelligence, performance impact, or safety.
- Separate supported, preview, planned, and unsupported capabilities clearly.
- Explain what Logstag collects and what it does not collect.
- Avoid implying that Logstag modifies customer databases.
- Avoid vague phrases such as "like never before", "intelligent", "seamless", or "powerful" unless the sentence explains the concrete capability.

## Preferred Wording

Use:

- "Logstag collects operational metadata and database statistics."
- "Logstag does not read or copy application table rows."
- "The agent uses read-only database access for monitoring queries."
- "Metrics are collected at configurable intervals."
- "Template-based alerts evaluate engine-specific performance, security, configuration, schema, and maintenance signals."
- "Near real-time" or "every 10 seconds by default" instead of broad "real-time" claims.

Avoid:

- "Logstag never reads your data."
- "Zero overhead."
- "Fully automated optimization."
- "Intelligent alerts" without explaining the alert mechanism.
- "Production ready" unless the capability is actually implemented and supported.

## Page Checklist

Each documentation page should answer:

1. What does this feature or workflow do?
2. What access, permissions, configuration, or prerequisites does it require?
3. What data does Logstag collect?
4. What does Logstag not change or not access?
5. What should the operator verify after setup?

## Example Rewrites

Instead of:

> Monitor Your Databases Like Never Before

Use:

> Monitor database performance, activity, schema health, and operational risk from one place.

Instead of:

> Logstag never reads your actual business data.

Use:

> Logstag collects operational metadata and statistics. It does not read or copy application table rows.

Instead of:

> Intelligent alerting

Use:

> Template-based alerting with engine-specific checks for performance, security, configuration, schema, and maintenance signals.
