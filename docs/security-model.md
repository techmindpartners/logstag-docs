---
sidebar_position: 5
---

# Security Model

Logstag is designed around an outbound agent model. The agent runs in the customer environment, connects to configured database targets, and sends monitoring payloads to the Logstag agent API.

This page will cover:

- Agent API key handling.
- Local configuration encryption.
- Database credential handling.
- Outbound-only network behavior.
- Least-privilege database access.
- Organization, role, and user access controls.
- Sensitive metadata considerations.

The security model should be read together with the engine-specific permission pages before production rollout.
