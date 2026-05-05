---
sidebar_position: 4
---

# Data Collection and Privacy

Logstag collects operational metadata and database statistics for monitoring, alerting, health checks, and explorer views.

This page will define the data boundary for each supported engine:

- What Logstag collects.
- What Logstag does not collect.
- Which metadata may be sensitive.
- Which product areas use each data category.
- How operators should review access and retention expectations.

Logstag does not read or copy application table rows. It can collect operational metadata such as query text, object names, usernames, roles, permissions, configuration values, and runtime activity depending on the database engine and enabled collectors.
