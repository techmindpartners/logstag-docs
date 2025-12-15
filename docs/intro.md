---
sidebar_position: 1
slug: /
---

# Introduction

Welcome to the **Logstag** documentation!

## What is Logstag?

**Logstag** is a comprehensive database performance monitoring platform that helps teams optimize and troubleshoot database performance issues in real-time.

Logstag operates as a lightweight agent-based monitoring solution that collects metrics from your database systems using **read-only queries** with minimal performance impact (less than 0.1% resource usage).

## Core Components

### 1. Logstag Agent (Rust)
A high-performance monitoring client that runs on your infrastructure:
- Lightweight and efficient (written in Rust)
- Read-only database access
- Collects metrics at configurable intervals
- Supports Linux, Windows, and Docker deployments
- Secure HTTPS communication with the backend

### 2. Logstag Backend (Cloud)
A robust cloud platform that processes and analyzes your database metrics:
- Real-time data ingestion and processing
- Event-driven alert system
- Time-series data storage (PostgreSQL + TimescaleDB)
- RESTful API for frontend integration
- Multi-tenant architecture with role-based access control

## Key Features

### 🔍 Real-Time Monitoring
Three-tier frequency monitoring system:
- **High Frequency (10s)**: Active sessions, critical metrics
- **Medium Frequency (1m)**: Query performance, replication status
- **Low Frequency (10m)**: Schema stats, configuration changes

### 📊 Performance Analysis
- Query performance tracking with execution statistics
- Slow query detection and optimization recommendations
- Connection pool monitoring
- Wait event analysis
- Database size and growth tracking

### 🚨 Intelligent Alerting
- YAML-based alert template system
- Event-driven alert checking
- Customizable thresholds per database
- Automated alert policies for common issues

### 🏥 Health Checks
Comprehensive health reports covering 5 critical areas:
- Security configuration
- Performance metrics
- Database configuration
- Schema design
- Maintenance status

### 🔒 Security & Compliance
- Read-only database permissions
- API key encryption at rest (PBKDF2 + AES-GCM)
- TLS-only network communication
- No data access - only metadata and statistics

## Supported Database Engines

### Production Ready
- **PostgreSQL**: Full support with pg_stat_statements integration
- **Microsoft SQL Server**: Query Store metrics, Availability Groups
- **MongoDB**: Server status, collection metrics, operation performance

### Coming Soon
- **Redis & Valkey**: Real-time cache monitoring
- **MySQL**: Query performance and replication monitoring
- **Oracle Database**: Enterprise-grade monitoring

## What Logstag IS

✅ **A Performance Monitoring Platform**: Tracks and analyzes database performance metrics in real-time

✅ **Read-Only & Safe**: Uses only read-only queries, never modifies your data or schema

✅ **Lightweight & Efficient**: Minimal resource footprint (less than 0.1% overhead)

✅ **Multi-Database Support**: Monitors multiple database engines from a single platform

✅ **Cloud-Native**: Designed for modern cloud infrastructure (AWS, GCP, Azure)

✅ **Alert-Driven**: Proactively notifies you of performance issues

✅ **Historical Analysis**: Stores metrics for trend analysis and capacity planning

## What Logstag IS NOT

❌ **Not a Database Manager**: Logstag does not modify your database schema, data, or configuration

❌ **Not a Backup Solution**: Logstag does not backup your data

❌ **Not a Query Builder**: Logstag monitors queries but does not help you write them

❌ **Not a Data Migration Tool**: Logstag does not move data between databases

❌ **Not an ETL Tool**: Logstag does not transform or load your business data

❌ **Not a Database Proxy**: Logstag does not sit between your application and database

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     Customer Infrastructure             │
│                                         │
│  ┌──────────┐     ┌──────────────┐     │
│  │ Database │◄────│ Logstag Agent│     │
│  │  (PG/MS  │     │    (Rust)    │     │
│  │  SQL/etc)│     └──────┬───────┘     │
│  └──────────┘            │             │
└──────────────────────────┼─────────────┘
                           │ HTTPS/JSON
                           │ + API Key
                           ▼
┌─────────────────────────────────────────┐
│       Logstag Cloud Platform            │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ Backend API  │◄──►│  PostgreSQL  │  │
│  │  (C#/.NET)   │    │ +TimescaleDB │  │
│  └──────┬───────┘    └──────────────┘  │
│         │                               │
│         ├─► Alerting & Health Checks   │
│         └─► Web Dashboard               │
└─────────────────────────────────────────┘
```

## Use Cases

### Database Performance Optimization
Identify slow queries, missing indexes, and bottlenecks affecting your application performance.

### Capacity Planning
Track historical trends to predict when you'll need to scale your database resources.

### Troubleshooting
Quickly diagnose issues with real-time connection monitoring, wait event analysis, and query statistics.

### Compliance & Security
Monitor database configuration changes, track access patterns, and ensure security best practices.

### Multi-Team Collaboration
Share insights across development, operations, and DBA teams with role-based access control.

## Getting Started

Ready to start monitoring? Follow our [Getting Started Guide](./getting-started.md) to install the agent and configure your first database.

## Support

- **Documentation**: [https://docs.logstag.com](https://docs.logstag.com)
- **GitHub**: [https://github.com/techmindpartners](https://github.com/techmindpartners)
- **Email**: support@logstag.com
