---
sidebar_position: 4
---

# Performance and Interval Tuning

The Logstag agent groups monitoring work into frequency tiers. These tiers control how often different categories of database and infrastructure signals are collected.

Use the default intervals for production unless there is a clear operational reason to tune them. Shorter intervals improve freshness but increase database, network, and Logstag ingestion load. Longer intervals reduce load but can make product views, alerts, and monitoring reports less current.

## Default Intervals

| Tier | Default | Typical Signals |
| --- | ---: | --- |
| High frequency | 10 seconds | Runtime activity, sessions, connections, waits, replication state, and other fast-changing signals. |
| Medium frequency | 1 minute | Query performance, workload counters, command statistics, persistence, latency, memory, replication, and cloud metrics. |
| Low frequency | 10 minutes | Configuration, security posture, static information, role or ACL metadata, and slower operational signals. |
| Schema frequency | 240 minutes | Schema, table, index, collection, object, permission, and structural metadata where supported. |

Intervals are configured as seconds in the TOML file. In this page, longer intervals are described in minutes because that is how operators usually reason about collection cadence.

## Configuration

```toml
[agent]
high_frequency_interval = 10
medium_frequency_interval = 60
low_frequency_interval = 600
schema_frequency_interval = 14400
```

Setting a tier to `0` disables that tier.

```toml
[agent]
schema_frequency_interval = 0
```

Disabling a tier should be treated as a product coverage decision. It can remove data from product views, alerts, and monitoring reports.

## Product Area Impact

| Product Area | Interval Dependency |
| --- | --- |
| Activity Explorer | Mostly high-frequency runtime signals. |
| Query Explorer | Mostly medium-frequency query and workload signals. |
| Database Explorer | Mix of high, medium, and low frequency signals depending on engine and metric. |
| Schema Explorer | Mostly schema-frequency metadata, with related alert and health context. |
| Alerts | Depends on the interval that collects the underlying signal. |
| Assets | Depends on registration and target state, with freshness affected by ongoing collection. |

If a product view is empty or stale, identify which interval tier feeds that view before changing configuration.

## When To Tune

Tune intervals only when the current behavior creates a measurable operational problem.

Common reasons:

- A large schema collection is creating avoidable load.
- A high-volume database needs less frequent runtime sampling.
- A short proof of concept needs faster validation.
- A restricted environment needs lower outbound traffic.
- A database owner requests a lower monitoring footprint during peak workload.
- A support investigation needs temporary higher fidelity.

Keep tuning changes time-bounded and documented. After the investigation or rollout is complete, return to the standard interval policy unless the new values are intentionally adopted.

## High Frequency Tuning

High frequency controls the freshest runtime signals.

Lower values can improve visibility into short-lived activity, but they increase:

- Database metadata query frequency.
- Agent CPU and memory use.
- Network traffic.
- Ingestion volume.
- Noise in logs during failure conditions.

Increase the high-frequency interval when:

- The database is extremely busy and runtime sampling adds measurable overhead.
- The agent monitors many targets from one host.
- Runtime views are useful but do not require near-real-time freshness.

Keep high-frequency collection enabled for production monitoring unless runtime activity is intentionally out of scope.

## Medium Frequency Tuning

Medium frequency commonly affects query and workload views.

Increase it when:

- Query statistics are expensive on the target.
- Managed database API calls or cloud metrics need lower request volume.
- The environment values lower overhead over minute-level freshness.

Decrease it temporarily when:

- Validating a new deployment.
- Investigating query behavior with a known short time window.
- Confirming that query, command, or replication data is being collected correctly.

Medium frequency is often the best tuning point for balancing product freshness and monitoring overhead.

## Low Frequency Tuning

Low frequency covers slower-changing operational data such as configuration, security posture, role or ACL visibility, and static information.

Increase it when:

- Configuration and security posture do not need frequent refresh.
- The engine exposes low-frequency metadata through expensive views.
- Database owners request a lower monitoring footprint.

Keep it enabled if Alerts or monitoring reports depend on configuration or security evidence.

## Schema Frequency Tuning

Schema frequency is intentionally much longer than runtime intervals because schema and object metadata can be heavier to collect.

Tune schema frequency carefully for:

- Very large databases.
- Databases with many schemas, tables, indexes, collections, procedures, or permissions.
- Environments where schema metadata access is slow.
- Shared database hosts where metadata collection competes with production workload.

Increase schema frequency when collection load is too high. Decrease it only when there is a clear need for fresher schema change visibility.

If schema frequency is disabled, Schema Explorer, schema-related reporting evidence, schema-related alerts, and permission/change visibility can become unavailable or stale.

## Large Database Guidance

For large or sensitive production targets:

1. Start with default intervals.
2. Observe agent logs and database load.
3. Check product data freshness.
4. Identify the specific interval causing pressure.
5. Change one interval at a time.
6. Validate for at least one full cycle of the changed tier.
7. Document the final interval policy.

Tune one interval at a time. Multiple simultaneous changes make it hard to tell which change improved or degraded behavior.

## Multi-Target Agents

A single agent can monitor multiple targets. Each target adds collection work.

Consider separate agents when:

- Targets live in different network zones.
- One target is much larger or more sensitive than the others.
- One target needs a different interval policy.
- The agent host shows sustained CPU, memory, disk, or network pressure.
- Database owners require separate change windows or operational ownership.

Deploying agents closer to their database targets often improves reliability more than aggressive interval tuning.

## Startup Warmup

`startup_warmup_delay` delays monitoring after the agent starts.

Use it when the host, network, container platform, or database needs time to become ready after boot or deployment.

```toml
[agent]
startup_warmup_delay = 30
```

This value is configured in seconds. A short warmup can reduce noisy startup failures in environments where services come online in sequence.

## Payload Compression

`compress_request_payload` is enabled by default.

Keep compression enabled for production because it reduces outbound payload size. Disable it only for controlled troubleshooting when Logstag support asks for uncompressed payload behavior.

```toml
[agent]
compress_request_payload = true
```

Compression affects network usage, not the collection interval itself.

## Disabling A Tier

Setting an interval to `0` skips that tier.

Use this only when:

- The product area depending on that tier is intentionally out of scope.
- A temporary incident response requires reducing agent activity.
- Logstag support recommends it during a controlled investigation.
- A database owner approves the reduced monitoring coverage.

Before disabling a tier, record:

- Which product views will lose data.
- Which alerts can stop firing.
- Which monitoring report sections can become incomplete.
- When the tier will be re-enabled.

## Change Procedure

Use this sequence for production tuning:

1. Define the goal: reduce load, improve freshness, isolate a collector issue, or support a validation window.
2. Capture current interval values.
3. Capture recent agent logs and current product freshness.
4. Change one interval.
5. Validate the configuration.
6. Restart the agent.
7. Watch logs for one full interval cycle.
8. Verify the affected product view.
9. Record the outcome.

Linux:

```bash
/opt/logstag-agent/bin/logstag-agent --check-config
sudo systemctl restart logstag-agent
sudo tail -f /var/log/logstag-agent/agent.log
```

Windows:

```powershell
& "C:\Program Files\Logstag Agent\bin\logstag-agent.exe" --check-config
Restart-Service "Logstag Agent"
Get-Content "C:\ProgramData\Logstag Agent\logs\agent.log" -Wait
```

## Verification

After tuning, verify:

| Check | Expected Result |
| --- | --- |
| Configuration | Validation succeeds. |
| Service | Agent starts and remains running. |
| Authentication | No new API key or service URL errors appear. |
| Connectivity | Target connections still succeed. |
| Collection | Logs show the expected tier running or being intentionally skipped. |
| Product freshness | The affected product area updates according to the new interval. |
| Database impact | Database owners do not see unacceptable monitoring overhead. |
| Alerts | Alerts based on the changed tier still behave as expected. |
| Monitoring reports | Reports have the required evidence after enough collection time. |

Validate slower tiers over the correct time horizon. A schema interval change cannot be confirmed from only a few minutes of observation unless the interval was intentionally shortened for validation.

## Troubleshooting Tuning Issues

| Symptom | Check |
| --- | --- |
| Product view is stale | Confirm the relevant interval is enabled and enough time has passed. |
| Product view is empty | Check engine support, permissions, and collector errors before lowering intervals. |
| Database load increased | Identify which tier changed and review logs by timestamp. |
| Logs show skipped monitor | Confirm whether the interval was set to `0`. |
| A monitoring report is incomplete | Confirm all required evidence tiers are enabled and have completed at least one cycle. |
| Alerts changed unexpectedly | Confirm the alert depends on a tier that was changed or disabled. |

Use the Troubleshooting and Agent Logs pages for deeper investigation.

## Recommended Defaults

For most production environments:

- Keep high frequency at 10 seconds.
- Keep medium frequency at 1 minute.
- Keep low frequency at 10 minutes.
- Keep schema frequency at 240 minutes.
- Keep payload compression enabled.
- Keep debug payload export disabled.
- Tune only after observing a specific load, freshness, or coverage issue.

The defaults are designed to provide useful operational visibility without requiring every customer environment to tune the agent before rollout.
