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

> The full graph data model, Cypher query documentation, architecture diagrams, screenshots, deployment instructions, and assignment rationale will be added as the project evolves.
