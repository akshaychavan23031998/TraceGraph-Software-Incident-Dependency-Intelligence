# TraceGraph — Software Incident & Dependency Intelligence

TraceGraph is a graph-powered application for exploring software service dependencies, investigating incidents, and understanding system blast radius. This initial foundation connects a Next.js application to CognoDB through the official Neo4j JavaScript driver.

## Technology stack

- Next.js (App Router) and React
- TypeScript
- Tailwind CSS
- Neo4j JavaScript driver for CognoDB over Bolt
- ESLint
- npm

## Local setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and provide your CognoDB connection details:

```env
COGNODB_URI=bolt+s://<instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-password>
```

These values are read only when database functionality is used. Never commit `.env.local`.

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test the health endpoint

With the development server running, request:

```bash
curl http://localhost:3000/api/health
```

A configured, reachable database returns `200` with `{"status":"ok","database":"connected"}`. A missing or unavailable database returns `503` with a safe degraded response.

## Graph Data Model

TraceGraph uses seven focused node types:

- `Service` represents application components and shared infrastructure.
- `Team` represents the groups responsible for operating services.
- `Engineer` represents team members and incident responders.
- `Incident` records operational events, impact, severity, and status.
- `Deployment` records version releases and their outcomes.
- `Customer` represents consumers of production services.
- `Runbook` captures documented incident-response guidance.

Stable `id` properties have uniqueness constraints and are used for idempotent imports. The model deliberately keeps operational connections as relationships so dependency traversal, blast-radius analysis, and responder discovery remain graph-native.

## Relationships

- `Service-[:DEPENDS_ON]->Service` models synchronous, asynchronous, and data dependencies, including whether they are critical.
- `Team-[:OWNS]->Service` and `Engineer-[:MEMBER_OF]->Team` connect ownership and expertise.
- `Deployment-[:DEPLOYED_TO]->Service` and `Deployment-[:TRIGGERED]->Incident` connect releases to operational outcomes.
- `Incident-[:AFFECTED]->Service`, `Engineer-[:RESOLVED]->Incident`, and `Incident-[:HAS_RUNBOOK]->Runbook` describe incident impact and response.
- `Customer-[:USES]->Service` supports customer-impact traversal.

## Seed Data

Load the deterministic, idempotent sample graph and verify its counts and multi-hop dependency paths:

```bash
npm run db:seed
npm run db:verify
```

The seed script also creates uniqueness constraints for every node label. It can be run repeatedly without duplicating nodes or relationships.

## Reset Database

To explicitly remove all nodes and relationships from the configured TraceGraph database:

```bash
npm run db:clear
```

This command is destructive and is never called during application startup or seeding.

## Main Graph Queries

- **Service detail** (`GET /api/services/:id`) returns ownership plus direct dependencies and dependents, showing how operational context connects around one service.
- **Multi-hop dependencies** (`GET /api/services/:id/dependencies?maxDepth=4`) traverses `DEPENDS_ON` paths up to a validated depth. Cypher path bounds cannot be query parameters, so `maxDepth` is accepted only as the typed set `1 | 2 | 3 | 4 | 5 | 6` before that internal value is inserted into query syntax; service IDs remain parameters.
- **Blast radius** (`GET /api/services/:id/blast-radius`) reverses dependency traversal to find every upstream service that can be affected by a failed dependency, returning the nearest hop distance.
- **Dependency path** (`GET /api/paths?from=:serviceId&to=:serviceId`) searches paths up to eight hops and returns the shortest result. The application uses bounded portable openCypher rather than APOC or graph plugins.
- **Incident investigation** (`GET /api/incidents/:id`) connects an incident to affected services and owners, its triggering deployment, resolvers, and runbooks.
- **Expert finder** (`GET /api/services/:id/experts`) traverses nearby services, their incidents, and resolving engineers, ranking responders by relevant incident count.

Blast-radius analysis is graph-native because dependency impact expands recursively through an unknown number of upstream services. Expert discovery similarly crosses services, incidents, responders, and nearby dependencies; both would require recursive queries and several joins in a relational model.

All endpoints return plain JSON in either `{ "data": ... }` or `{ "error": { "code": ..., "message": ... } }` form. Example checks with the seeded IDs:

```bash
curl http://localhost:3000/api/services
curl http://localhost:3000/api/services/svc-api-gateway/dependencies?maxDepth=4
curl http://localhost:3000/api/services/svc-postgres/blast-radius
curl "http://localhost:3000/api/paths?from=svc-api-gateway&to=svc-postgres"
curl http://localhost:3000/api/incidents/inc-003
curl http://localhost:3000/api/services/svc-payment/experts
```

## Current UI

TraceGraph now includes a responsive application shell with desktop sidebar and compact mobile navigation. The Overview dashboard loads real service, incident, and CognoDB health data from the existing API routes to display service criticality metrics, current incident status, critical services, recent incidents, and graph-intelligence capabilities. Reusable skeleton loading, empty, retryable error, severity, status, and criticality components provide consistent states across the interface. Service Explorer, Incident Investigator, and Path Finder routes are reserved with small placeholders for later phases.

> The full graph data model, Cypher query documentation, architecture diagrams, screenshots, deployment instructions, and assignment rationale will be added as the project evolves.
