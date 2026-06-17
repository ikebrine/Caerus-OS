# CAERUS OS

CAERUS OS is an AI-native enterprise operating platform for people, money, assets, operations, documents, decisions, and automation.

It includes CaerusChat for realtime team messaging and CaeruSign for auditable document signing.

This repository is structured as a production-oriented modular monolith that is ready to split into services when scale or ownership boundaries demand it.

## Architecture

- `apps/web`: Next.js 15 App Router command center, module workspaces, AI command surface, analytics, and workflow UI.
- `apps/api`: NestJS API with authentication, tenant isolation, RBAC, audit logging, modules, AI orchestration, and workflow automation.
- `packages/database`: Prisma schema for multi-tenant enterprise data, soft deletes, audit fields, policies, workflows, and module entities.
- `packages/shared`: Shared domain constants and typed module metadata.

## Local Development

```bash
npm install
npm run db:generate
npm run dev:web
npm run dev:api
```

Copy `.env.example` to `.env` and provide PostgreSQL, Redis, JWT, SMTP, and AI provider values.

Demo seed:

```bash
npm run db:seed --workspace @caerus/database
```

The seed creates tenant `caerus-demo` with `admin@caerus.local` / `CaerusDemo!2026`.

## Production Principles

- Tenant isolation is enforced by API guards and database tenant identifiers.
- All mutable entities include `tenantId`, audit fields, and soft-delete support.
- Permissions are policy-based, support temporary grants and delegation, and are checked at the API boundary.
- Audit events are written for security, workflow, and business actions.
- AI is implemented as an intelligence layer that can analyze, forecast, detect risk, and initiate approved workflows.
