import type {
  AffectedRelationship,
  Customer,
  DependsOnRelationship,
  Deployment,
  Engineer,
  IdRelationship,
  Incident,
  Runbook,
  Service,
  Team,
  UsesRelationship,
} from "@/types/graph";

export const services: Service[] = [
  { id: "svc-api-gateway", name: "API Gateway", description: "Public entry point and request routing layer.", language: "TypeScript", criticality: "CRITICAL", environment: "production" },
  { id: "svc-auth", name: "Authentication Service", description: "Identity, sessions, and access token validation.", language: "Go", criticality: "CRITICAL", environment: "production" },
  { id: "svc-user", name: "User Service", description: "Customer profiles and account preferences.", language: "TypeScript", criticality: "HIGH", environment: "production" },
  { id: "svc-checkout", name: "Checkout Service", description: "Coordinates the customer checkout workflow.", language: "Kotlin", criticality: "CRITICAL", environment: "production" },
  { id: "svc-payment", name: "Payment Service", description: "Processes payment authorizations and captures.", language: "Java", criticality: "CRITICAL", environment: "production" },
  { id: "svc-order", name: "Order Service", description: "Creates and manages customer orders.", language: "Kotlin", criticality: "CRITICAL", environment: "production" },
  { id: "svc-inventory", name: "Inventory Service", description: "Tracks stock and reserves sellable inventory.", language: "Go", criticality: "HIGH", environment: "production" },
  { id: "svc-catalog", name: "Catalog Service", description: "Maintains product catalog information.", language: "TypeScript", criticality: "HIGH", environment: "production" },
  { id: "svc-pricing", name: "Pricing Service", description: "Calculates prices, promotions, and discounts.", language: "Python", criticality: "HIGH", environment: "production" },
  { id: "svc-notification", name: "Notification Service", description: "Orchestrates transactional customer notifications.", language: "TypeScript", criticality: "MEDIUM", environment: "production" },
  { id: "svc-email", name: "Email Service", description: "Delivers transactional email through external providers.", language: "Python", criticality: "MEDIUM", environment: "production" },
  { id: "svc-fraud", name: "Fraud Detection Service", description: "Scores transactions for fraud risk.", language: "Python", criticality: "HIGH", environment: "production" },
  { id: "svc-shipping", name: "Shipping Service", description: "Rates shipments and coordinates fulfilment.", language: "Java", criticality: "HIGH", environment: "production" },
  { id: "svc-search", name: "Search Service", description: "Indexes and retrieves product search results.", language: "Go", criticality: "HIGH", environment: "production" },
  { id: "svc-recommendation", name: "Recommendation Service", description: "Generates personalized product recommendations.", language: "Python", criticality: "MEDIUM", environment: "production" },
  { id: "svc-analytics", name: "Analytics Service", description: "Processes behavioral and operational events.", language: "Python", criticality: "MEDIUM", environment: "production" },
  { id: "svc-audit", name: "Audit Service", description: "Records security and compliance activity.", language: "Go", criticality: "HIGH", environment: "production" },
  { id: "svc-postgres", name: "PostgreSQL Cluster", description: "Shared durable relational data platform.", language: "PostgreSQL", criticality: "CRITICAL", environment: "production" },
  { id: "svc-redis", name: "Redis Cache", description: "Shared cache and low-latency session store.", language: "Redis", criticality: "CRITICAL", environment: "production" },
  { id: "svc-broker", name: "Message Broker", description: "Shared asynchronous event transport.", language: "Kafka", criticality: "CRITICAL", environment: "production" },
];

export const teams: Team[] = [
  { id: "team-platform", name: "Platform Reliability", domain: "Edge, identity, and shared infrastructure" },
  { id: "team-commerce", name: "Commerce Core", domain: "Checkout, orders, and pricing" },
  { id: "team-payments", name: "Payments & Risk", domain: "Payments and fraud prevention" },
  { id: "team-fulfilment", name: "Fulfilment", domain: "Inventory, shipping, and notifications" },
  { id: "team-discovery", name: "Product Discovery", domain: "Catalog, search, and recommendations" },
  { id: "team-data", name: "Data Systems", domain: "Analytics, audit, and data platforms" },
];

export const engineers: Engineer[] = [
  { id: "eng-maya", name: "Maya Patel", role: "Staff SRE", email: "maya.patel@tracegraph.dev" },
  { id: "eng-liam", name: "Liam Chen", role: "Senior Platform Engineer", email: "liam.chen@tracegraph.dev" },
  { id: "eng-sofia", name: "Sofia Martinez", role: "Senior Software Engineer", email: "sofia.martinez@tracegraph.dev" },
  { id: "eng-noah", name: "Noah Williams", role: "Software Engineer", email: "noah.williams@tracegraph.dev" },
  { id: "eng-aisha", name: "Aisha Khan", role: "Staff Payments Engineer", email: "aisha.khan@tracegraph.dev" },
  { id: "eng-ethan", name: "Ethan Brown", role: "Risk Systems Engineer", email: "ethan.brown@tracegraph.dev" },
  { id: "eng-priya", name: "Priya Nair", role: "Senior Backend Engineer", email: "priya.nair@tracegraph.dev" },
  { id: "eng-lucas", name: "Lucas Silva", role: "Site Reliability Engineer", email: "lucas.silva@tracegraph.dev" },
  { id: "eng-emma", name: "Emma Wilson", role: "Search Engineer", email: "emma.wilson@tracegraph.dev" },
  { id: "eng-oliver", name: "Oliver Smith", role: "Machine Learning Engineer", email: "oliver.smith@tracegraph.dev" },
  { id: "eng-grace", name: "Grace Lee", role: "Data Platform Engineer", email: "grace.lee@tracegraph.dev" },
  { id: "eng-daniel", name: "Daniel Okafor", role: "Database Reliability Engineer", email: "daniel.okafor@tracegraph.dev" },
];

export const incidents: Incident[] = [
  { id: "inc-001", title: "PostgreSQL connection pool saturation", severity: "SEV1", status: "RESOLVED", startedAt: "2026-01-08T09:14:00Z", resolvedAt: "2026-01-08T10:02:00Z", summary: "Shared database connections exhausted during a traffic spike, degrading payments, orders, and inventory." },
  { id: "inc-002", title: "Redis regional outage", severity: "SEV1", status: "RESOLVED", startedAt: "2026-01-19T14:20:00Z", resolvedAt: "2026-01-19T15:07:00Z", summary: "Cache node failure invalidated sessions and increased payment latency." },
  { id: "inc-003", title: "Payment authorization regression", severity: "SEV1", status: "RESOLVED", startedAt: "2026-02-03T16:42:00Z", resolvedAt: "2026-02-03T17:31:00Z", summary: "A payment rollout increased authorization failures and was rolled back." },
  { id: "inc-004", title: "Inventory reservation timeouts", severity: "SEV2", status: "RESOLVED", startedAt: "2026-02-14T11:05:00Z", resolvedAt: "2026-02-14T12:18:00Z", summary: "Slow inventory reservations caused intermittent checkout failures." },
  { id: "inc-005", title: "Message broker consumer lag", severity: "SEV2", status: "RESOLVED", startedAt: "2026-02-27T07:48:00Z", resolvedAt: "2026-02-27T09:22:00Z", summary: "A broker partition imbalance delayed notifications and audit events." },
  { id: "inc-006", title: "Search relevance rollout degradation", severity: "SEV2", status: "RESOLVED", startedAt: "2026-03-06T18:10:00Z", resolvedAt: "2026-03-06T19:04:00Z", summary: "A ranking configuration rollout returned low-quality search results." },
  { id: "inc-007", title: "Fraud scoring latency spike", severity: "SEV2", status: "RESOLVED", startedAt: "2026-03-18T13:28:00Z", resolvedAt: "2026-03-18T14:46:00Z", summary: "Model feature lookups delayed fraud decisions and payment responses." },
  { id: "inc-008", title: "API gateway rate-limit misconfiguration", severity: "SEV2", status: "RESOLVED", startedAt: "2026-04-02T08:31:00Z", resolvedAt: "2026-04-02T09:03:00Z", summary: "Incorrect limits rejected valid checkout and authentication traffic." },
  { id: "inc-009", title: "Email provider delivery failures", severity: "SEV3", status: "RESOLVED", startedAt: "2026-04-17T20:12:00Z", resolvedAt: "2026-04-17T21:40:00Z", summary: "Provider errors delayed order confirmations and password resets." },
  { id: "inc-010", title: "Catalog replication lag", severity: "SEV3", status: "RESOLVED", startedAt: "2026-05-01T05:55:00Z", resolvedAt: "2026-05-01T07:16:00Z", summary: "Product updates were slow to reach catalog and search consumers." },
  { id: "inc-011", title: "Shipping rate provider timeout", severity: "SEV3", status: "RESOLVED", startedAt: "2026-05-22T15:19:00Z", resolvedAt: "2026-05-22T16:07:00Z", summary: "External carrier timeouts prevented shipping rate calculation." },
  { id: "inc-012", title: "Recommendation model memory pressure", severity: "SEV3", status: "RESOLVED", startedAt: "2026-06-09T10:44:00Z", resolvedAt: "2026-06-09T12:11:00Z", summary: "A model release exhausted worker memory and reduced recommendations." },
  { id: "inc-013", title: "Authentication token validation errors", severity: "SEV2", status: "RESOLVED", startedAt: "2026-06-28T22:06:00Z", resolvedAt: "2026-06-28T22:52:00Z", summary: "Key rotation propagation caused intermittent token validation errors." },
  { id: "inc-014", title: "Analytics event backlog", severity: "SEV3", status: "MONITORING", startedAt: "2026-07-21T06:33:00Z", summary: "Increased event volume created a processing backlog in analytics." },
  { id: "inc-015", title: "Order audit write latency", severity: "SEV3", status: "INVESTIGATING", startedAt: "2026-08-10T12:17:00Z", summary: "Slow audit writes are increasing order processing latency." },
];

export const deployments: Deployment[] = [
  { id: "dep-001", version: "api-gateway@4.18.0", deployedAt: "2026-01-05T08:00:00Z", status: "SUCCESS" },
  { id: "dep-002", version: "auth@3.9.2", deployedAt: "2026-01-17T10:30:00Z", status: "SUCCESS" },
  { id: "dep-003", version: "payment@8.14.0", deployedAt: "2026-02-03T16:30:00Z", status: "ROLLED_BACK" },
  { id: "dep-004", version: "inventory@5.7.1", deployedAt: "2026-02-14T10:45:00Z", status: "ROLLED_BACK" },
  { id: "dep-005", version: "notification@2.16.0", deployedAt: "2026-02-25T09:10:00Z", status: "SUCCESS" },
  { id: "dep-006", version: "search@6.4.0", deployedAt: "2026-03-06T18:00:00Z", status: "ROLLED_BACK" },
  { id: "dep-007", version: "fraud@7.2.0", deployedAt: "2026-03-18T13:05:00Z", status: "ROLLED_BACK" },
  { id: "dep-008", version: "api-gateway@4.19.1", deployedAt: "2026-04-02T08:15:00Z", status: "ROLLED_BACK" },
  { id: "dep-009", version: "email@2.8.4", deployedAt: "2026-04-15T12:00:00Z", status: "SUCCESS" },
  { id: "dep-010", version: "catalog@5.11.0", deployedAt: "2026-05-01T05:40:00Z", status: "ROLLED_BACK" },
  { id: "dep-011", version: "shipping@3.12.2", deployedAt: "2026-05-20T11:25:00Z", status: "SUCCESS" },
  { id: "dep-012", version: "recommendation@9.1.0", deployedAt: "2026-06-09T10:30:00Z", status: "ROLLED_BACK" },
  { id: "dep-013", version: "auth@3.10.0", deployedAt: "2026-06-28T21:50:00Z", status: "ROLLED_BACK" },
  { id: "dep-014", version: "analytics@4.6.0", deployedAt: "2026-07-21T06:10:00Z", status: "SUCCESS" },
  { id: "dep-015", version: "audit@2.5.1", deployedAt: "2026-08-10T12:00:00Z", status: "SUCCESS" },
  { id: "dep-016", version: "checkout@7.3.2", deployedAt: "2026-02-21T07:35:00Z", status: "SUCCESS" },
  { id: "dep-017", version: "order@6.8.0", deployedAt: "2026-03-12T14:20:00Z", status: "SUCCESS" },
  { id: "dep-018", version: "pricing@3.4.1", deployedAt: "2026-03-25T09:45:00Z", status: "SUCCESS" },
  { id: "dep-019", version: "user@4.7.0", deployedAt: "2026-04-09T13:10:00Z", status: "SUCCESS" },
  { id: "dep-020", version: "postgres@15.6-p3", deployedAt: "2026-04-24T03:00:00Z", status: "SUCCESS" },
  { id: "dep-021", version: "redis@7.2-p5", deployedAt: "2026-05-08T03:30:00Z", status: "SUCCESS" },
  { id: "dep-022", version: "broker@3.7-p2", deployedAt: "2026-05-29T04:00:00Z", status: "SUCCESS" },
  { id: "dep-023", version: "checkout@7.4.0", deployedAt: "2026-06-18T08:40:00Z", status: "SUCCESS" },
  { id: "dep-024", version: "payment@8.15.3", deployedAt: "2026-07-07T16:15:00Z", status: "SUCCESS" },
  { id: "dep-025", version: "order@6.9.1", deployedAt: "2026-07-30T10:05:00Z", status: "SUCCESS" },
];

export const customers: Customer[] = [
  { id: "cust-northstar", name: "Northstar Retail", tier: "ENTERPRISE" },
  { id: "cust-acme", name: "Acme Marketplace", tier: "ENTERPRISE" },
  { id: "cust-globex", name: "Globex Commerce", tier: "ENTERPRISE" },
  { id: "cust-vertex", name: "Vertex Outfitters", tier: "PRO" },
  { id: "cust-lumina", name: "Lumina Home", tier: "PRO" },
  { id: "cust-cedar", name: "Cedar & Co.", tier: "PRO" },
  { id: "cust-nimbus", name: "Nimbus Goods", tier: "PRO" },
  { id: "cust-pixel", name: "Pixel Pantry", tier: "FREE" },
  { id: "cust-harbor", name: "Harbor Supply", tier: "FREE" },
  { id: "cust-summit", name: "Summit Sports", tier: "FREE" },
];

export const runbooks: Runbook[] = [
  { id: "rb-database", title: "Database Saturation Response", description: "Diagnose connection exhaustion, slow queries, and database failover." },
  { id: "rb-cache", title: "Redis Failure Recovery", description: "Fail over cache nodes and protect downstream data stores." },
  { id: "rb-payment", title: "Payment Failure Mitigation", description: "Triage authorization failures and safely roll back payment releases." },
  { id: "rb-inventory", title: "Inventory Timeout Mitigation", description: "Restore reservation throughput and protect checkout availability." },
  { id: "rb-messaging", title: "Message Broker Lag Recovery", description: "Identify hot partitions and recover delayed consumers." },
  { id: "rb-search", title: "Search Quality Rollback", description: "Validate search health and revert ranking or index changes." },
  { id: "rb-edge", title: "Edge Traffic Recovery", description: "Correct gateway, rate-limit, and authentication failures." },
  { id: "rb-delivery", title: "Customer Delivery Degradation", description: "Mitigate email, notification, and shipping provider failures." },
];

export const dependencies: DependsOnRelationship[] = [
  { from: "svc-api-gateway", to: "svc-auth", dependencyType: "SYNC", critical: true },
  { from: "svc-api-gateway", to: "svc-user", dependencyType: "SYNC", critical: true },
  { from: "svc-api-gateway", to: "svc-checkout", dependencyType: "SYNC", critical: true },
  { from: "svc-api-gateway", to: "svc-catalog", dependencyType: "SYNC", critical: false },
  { from: "svc-auth", to: "svc-user", dependencyType: "SYNC", critical: true },
  { from: "svc-auth", to: "svc-redis", dependencyType: "DATA", critical: true },
  { from: "svc-auth", to: "svc-audit", dependencyType: "ASYNC", critical: false },
  { from: "svc-user", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-user", to: "svc-audit", dependencyType: "ASYNC", critical: false },
  { from: "svc-checkout", to: "svc-payment", dependencyType: "SYNC", critical: true },
  { from: "svc-checkout", to: "svc-order", dependencyType: "SYNC", critical: true },
  { from: "svc-checkout", to: "svc-inventory", dependencyType: "SYNC", critical: true },
  { from: "svc-checkout", to: "svc-pricing", dependencyType: "SYNC", critical: true },
  { from: "svc-payment", to: "svc-fraud", dependencyType: "SYNC", critical: true },
  { from: "svc-payment", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-payment", to: "svc-redis", dependencyType: "DATA", critical: true },
  { from: "svc-payment", to: "svc-broker", dependencyType: "ASYNC", critical: false },
  { from: "svc-order", to: "svc-inventory", dependencyType: "SYNC", critical: true },
  { from: "svc-order", to: "svc-shipping", dependencyType: "SYNC", critical: false },
  { from: "svc-order", to: "svc-notification", dependencyType: "ASYNC", critical: false },
  { from: "svc-order", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-order", to: "svc-broker", dependencyType: "ASYNC", critical: true },
  { from: "svc-inventory", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-inventory", to: "svc-redis", dependencyType: "DATA", critical: false },
  { from: "svc-inventory", to: "svc-broker", dependencyType: "ASYNC", critical: false },
  { from: "svc-catalog", to: "svc-pricing", dependencyType: "SYNC", critical: true },
  { from: "svc-catalog", to: "svc-search", dependencyType: "ASYNC", critical: false },
  { from: "svc-catalog", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-pricing", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-pricing", to: "svc-redis", dependencyType: "DATA", critical: false },
  { from: "svc-notification", to: "svc-email", dependencyType: "SYNC", critical: true },
  { from: "svc-notification", to: "svc-broker", dependencyType: "ASYNC", critical: true },
  { from: "svc-email", to: "svc-broker", dependencyType: "ASYNC", critical: false },
  { from: "svc-fraud", to: "svc-analytics", dependencyType: "SYNC", critical: false },
  { from: "svc-fraud", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-shipping", to: "svc-broker", dependencyType: "ASYNC", critical: false },
  { from: "svc-shipping", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-search", to: "svc-postgres", dependencyType: "DATA", critical: true },
  { from: "svc-search", to: "svc-analytics", dependencyType: "ASYNC", critical: false },
  { from: "svc-recommendation", to: "svc-catalog", dependencyType: "SYNC", critical: true },
  { from: "svc-recommendation", to: "svc-analytics", dependencyType: "DATA", critical: true },
  { from: "svc-recommendation", to: "svc-redis", dependencyType: "DATA", critical: false },
  { from: "svc-analytics", to: "svc-broker", dependencyType: "ASYNC", critical: true },
  { from: "svc-audit", to: "svc-broker", dependencyType: "ASYNC", critical: true },
];

export const teamOwnerships: IdRelationship[] = [
  ["team-platform", "svc-api-gateway"], ["team-platform", "svc-auth"], ["team-platform", "svc-user"], ["team-platform", "svc-redis"],
  ["team-commerce", "svc-checkout"], ["team-commerce", "svc-order"], ["team-commerce", "svc-pricing"],
  ["team-payments", "svc-payment"], ["team-payments", "svc-fraud"],
  ["team-fulfilment", "svc-inventory"], ["team-fulfilment", "svc-shipping"], ["team-fulfilment", "svc-notification"], ["team-fulfilment", "svc-email"],
  ["team-discovery", "svc-catalog"], ["team-discovery", "svc-search"], ["team-discovery", "svc-recommendation"],
  ["team-data", "svc-analytics"], ["team-data", "svc-audit"], ["team-data", "svc-postgres"], ["team-data", "svc-broker"],
].map(([from, to]) => ({ from, to }));

export const teamMemberships: IdRelationship[] = [
  ["eng-maya", "team-platform"], ["eng-liam", "team-platform"],
  ["eng-sofia", "team-commerce"], ["eng-noah", "team-commerce"],
  ["eng-aisha", "team-payments"], ["eng-ethan", "team-payments"],
  ["eng-priya", "team-fulfilment"], ["eng-lucas", "team-fulfilment"],
  ["eng-emma", "team-discovery"], ["eng-oliver", "team-discovery"],
  ["eng-grace", "team-data"], ["eng-daniel", "team-data"],
].map(([from, to]) => ({ from, to }));

const deploymentServiceIds = [
  "svc-api-gateway", "svc-auth", "svc-payment", "svc-inventory", "svc-notification",
  "svc-search", "svc-fraud", "svc-api-gateway", "svc-email", "svc-catalog",
  "svc-shipping", "svc-recommendation", "svc-auth", "svc-analytics", "svc-audit",
  "svc-checkout", "svc-order", "svc-pricing", "svc-user", "svc-postgres",
  "svc-redis", "svc-broker", "svc-checkout", "svc-payment", "svc-order",
];

export const deploymentTargets: IdRelationship[] = deployments.map((deployment, index) => ({ from: deployment.id, to: deploymentServiceIds[index] }));

export const deploymentTriggers: IdRelationship[] = [
  { from: "dep-003", to: "inc-003" }, { from: "dep-004", to: "inc-004" },
  { from: "dep-006", to: "inc-006" }, { from: "dep-007", to: "inc-007" },
  { from: "dep-008", to: "inc-008" }, { from: "dep-010", to: "inc-010" },
  { from: "dep-012", to: "inc-012" }, { from: "dep-013", to: "inc-013" },
];

export const incidentEffects: AffectedRelationship[] = [
  ["inc-001", "svc-postgres", "FULL_OUTAGE"], ["inc-001", "svc-payment", "DEGRADED"], ["inc-001", "svc-order", "DEGRADED"], ["inc-001", "svc-inventory", "DEGRADED"],
  ["inc-002", "svc-redis", "FULL_OUTAGE"], ["inc-002", "svc-auth", "PARTIAL_OUTAGE"], ["inc-002", "svc-payment", "DEGRADED"],
  ["inc-003", "svc-payment", "PARTIAL_OUTAGE"], ["inc-003", "svc-checkout", "DEGRADED"],
  ["inc-004", "svc-inventory", "PARTIAL_OUTAGE"], ["inc-004", "svc-checkout", "DEGRADED"],
  ["inc-005", "svc-broker", "PARTIAL_OUTAGE"], ["inc-005", "svc-notification", "DEGRADED"], ["inc-005", "svc-audit", "DEGRADED"],
  ["inc-006", "svc-search", "DEGRADED"], ["inc-006", "svc-catalog", "DEGRADED"],
  ["inc-007", "svc-fraud", "DEGRADED"], ["inc-007", "svc-payment", "DEGRADED"],
  ["inc-008", "svc-api-gateway", "PARTIAL_OUTAGE"], ["inc-008", "svc-auth", "DEGRADED"], ["inc-008", "svc-checkout", "DEGRADED"],
  ["inc-009", "svc-email", "PARTIAL_OUTAGE"], ["inc-009", "svc-notification", "DEGRADED"],
  ["inc-010", "svc-catalog", "DEGRADED"], ["inc-010", "svc-search", "DEGRADED"],
  ["inc-011", "svc-shipping", "PARTIAL_OUTAGE"], ["inc-011", "svc-checkout", "DEGRADED"],
  ["inc-012", "svc-recommendation", "DEGRADED"],
  ["inc-013", "svc-auth", "PARTIAL_OUTAGE"], ["inc-013", "svc-api-gateway", "DEGRADED"],
  ["inc-014", "svc-analytics", "DEGRADED"], ["inc-014", "svc-broker", "DEGRADED"],
  ["inc-015", "svc-audit", "DEGRADED"], ["inc-015", "svc-order", "DEGRADED"],
].map(([incidentId, serviceId, impact]) => ({ incidentId, serviceId, impact })) as AffectedRelationship[];

export const incidentResolvers: IdRelationship[] = [
  ["eng-daniel", "inc-001"], ["eng-maya", "inc-002"], ["eng-aisha", "inc-003"],
  ["eng-priya", "inc-004"], ["eng-grace", "inc-005"], ["eng-emma", "inc-006"],
  ["eng-ethan", "inc-007"], ["eng-liam", "inc-008"], ["eng-lucas", "inc-009"],
  ["eng-emma", "inc-010"], ["eng-priya", "inc-011"], ["eng-oliver", "inc-012"],
  ["eng-maya", "inc-013"], ["eng-grace", "inc-014"], ["eng-daniel", "inc-015"],
].map(([from, to]) => ({ from, to }));

export const customerUsage: UsesRelationship[] = [
  ["cust-northstar", "svc-api-gateway", "HIGH"], ["cust-northstar", "svc-checkout", "HIGH"], ["cust-northstar", "svc-search", "HIGH"],
  ["cust-acme", "svc-api-gateway", "HIGH"], ["cust-acme", "svc-payment", "HIGH"], ["cust-acme", "svc-order", "HIGH"],
  ["cust-globex", "svc-checkout", "HIGH"], ["cust-globex", "svc-catalog", "HIGH"], ["cust-globex", "svc-recommendation", "MEDIUM"],
  ["cust-vertex", "svc-checkout", "MEDIUM"], ["cust-vertex", "svc-shipping", "HIGH"],
  ["cust-lumina", "svc-catalog", "HIGH"], ["cust-lumina", "svc-search", "HIGH"],
  ["cust-cedar", "svc-api-gateway", "MEDIUM"], ["cust-cedar", "svc-payment", "MEDIUM"],
  ["cust-nimbus", "svc-order", "HIGH"], ["cust-nimbus", "svc-notification", "MEDIUM"],
  ["cust-pixel", "svc-api-gateway", "LOW"], ["cust-pixel", "svc-catalog", "MEDIUM"],
  ["cust-harbor", "svc-checkout", "LOW"], ["cust-harbor", "svc-search", "MEDIUM"],
  ["cust-summit", "svc-catalog", "MEDIUM"], ["cust-summit", "svc-recommendation", "LOW"],
].map(([customerId, serviceId, usageLevel]) => ({ customerId, serviceId, usageLevel })) as UsesRelationship[];

export const incidentRunbooks: IdRelationship[] = [
  ["inc-001", "rb-database"], ["inc-002", "rb-cache"], ["inc-003", "rb-payment"],
  ["inc-004", "rb-inventory"], ["inc-005", "rb-messaging"], ["inc-006", "rb-search"],
  ["inc-007", "rb-payment"], ["inc-008", "rb-edge"], ["inc-009", "rb-delivery"],
  ["inc-010", "rb-search"], ["inc-011", "rb-delivery"], ["inc-012", "rb-search"],
  ["inc-013", "rb-edge"], ["inc-014", "rb-messaging"], ["inc-015", "rb-database"],
].map(([from, to]) => ({ from, to }));
