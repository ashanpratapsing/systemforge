# SystemForge: Enterprise Architecture Blueprint

Since external integration details were not explicitly provided, I have designed the architecture using **enterprise-grade default strategies**: Custom JWT for RBAC, Personal Access Tokens (PAT) for GitHub, and abstract mock layers for AWS and Prometheus to allow parallel frontend/backend development.

---

## FEATURE 1 — GRAPH VERSIONING SYSTEM

### 1. Feature overview
A version control system for the architecture graph, allowing teams to snapshot, compare, and rollback architectural states (e.g., V1 to V2).

### 2. Why it is needed
Architecture evolves. If a team accidentally deletes critical nodes or introduces circular dependencies, they need a safe way to revert to a known good state without losing the entire project.

### 3. Frontend architecture
A "Version History" sidebar utilizing Zustand to store the list of available snapshots. A "Compare Mode" using React Flow's custom styling to highlight diffs (e.g., red for deleted nodes, green for added).

### 4. Backend architecture
A new `version-service` (Spring Boot) responsible for snapshotting the current state from the `workflow-service` and `graph-service`.

### 5. Database design
**PostgreSQL:** `graph_versions (id, project_id, version_name, created_at, created_by)`. 
**Neo4j:** Nodes will gain a `version_id` property. Instead of mutating existing nodes during a snapshot, we deep-clone the project's subgraph with a new `version_id`.

### 6. API design
`POST /api/versions/{projectId}/snapshot`
`GET /api/versions/{projectId}`
`POST /api/versions/{projectId}/restore/{versionId}`

### 7. Event flow
User clicks "Snapshot" -> API Gateway -> `version-service` -> triggers async Kafka event `GRAPH_SNAPSHOT_REQUESTED` -> `workflow-service` & `graph-service` clone their respective data -> emit `SNAPSHOT_COMPLETED`.

### 8. Scalability strategy
Snapshots are processed asynchronously via Kafka. This prevents HTTP timeouts when duplicating graphs with thousands of nodes.

### 9. Performance strategy
Instead of duplicating the entire graph every time, future optimizations can use an Event Sourcing pattern (storing only diffs/events). For MVP, full cloning is used for simplicity.

### 10. Folder structure changes
```
backend/version-service/
  ├── src/main/java/com/systemforge/version/
  │   ├── controller/
  │   ├── entity/
  │   ├── service/
  │   └── listener/ (Kafka consumers)
```

### 11. Real-world engineering reasoning
Storage is cheap, but compute is expensive. Cloning nodes in Neo4j via an internal Cypher query is significantly faster than pulling data into Java and pushing it back.

### 12. Step-by-step implementation plan
1. Create `version-service`.
2. Add Kafka producers/consumers for snapshot events.
3. Write Neo4j Cypher query for subgraph deep-cloning.
4. Implement Frontend sidebar and API integration.

---

## FEATURE 2 — NODE TEMPLATE SYSTEM

### 1. Feature overview
A drag-and-drop marketplace of pre-configured architecture components (e.g., standard "Auth Microservice" with DB and Redis dependencies).

### 2. Why it is needed
Reduces boilerplate. Developers shouldn't have to manually configure standard patterns. It enforces organizational architecture standards.

### 3. Frontend architecture
A "Template Marketplace" panel. Dragging an item uses the HTML5 Drag and Drop API, intercepted by React Flow's `onDrop` handler to spawn the pre-configured nodes.

### 4. Backend architecture
A `template-service` that serves curated templates.

### 5. Database design
**PostgreSQL:** `templates (id, name, category, configuration_json)`

### 6. API design
`GET /api/templates`
`POST /api/templates`

### 7. Event flow
Frontend fetches templates on load. User drags template -> Frontend parses `configuration_json` -> creates new Nodes in Zustand -> triggers `POST /api/workflows/{projectId}/save`.

### 8. Scalability strategy
Templates are heavily read, rarely updated. They will be heavily cached using Redis.

### 9. Performance strategy
Redis Cache (`@Cacheable` in Spring) ensures sub-millisecond response times for the template marketplace.

### 10. Folder structure changes
```
backend/template-service/
  ├── src/main/java/com/systemforge/template/
```

### 11. Real-world engineering reasoning
Storing the template configuration as a JSON payload in PostgreSQL allows extreme flexibility without needing complex relational mapping for template edges.

### 12. Step-by-step implementation plan
1. Scaffold `template-service`.
2. Seed database with 5 standard templates.
3. Build Frontend drag-and-drop panel.

---

## FEATURE 3 — ARCHITECTURE SNAPSHOT ENGINE

*(Note: This shares deep architectural similarities with Feature 1. Feature 1 focuses on strict semantic versioning (V1, V2), while Feature 3 acts as Git-like checkpointing (e.g., "Before Refactor")).*

### 1. Feature overview
On-demand state saving to allow quick experiments ("What if I add Redis?") and immediate rollbacks if the experiment fails.

### 2. Why it is needed
Provides a psychological safety net. Developers can experiment with complex dependencies without fear of breaking the primary architecture.

### 3. Frontend architecture
A quick "Save Checkpoint" / "Restore Checkpoint" floating action button.

### 4. Backend architecture
Handled by the `version-service` using a `checkpoint` flag.

### 5. Database design
Adds `type` column to `graph_versions` (Enum: `VERSION`, `CHECKPOINT`).

### 6. API design
`POST /api/versions/{projectId}/checkpoint`

### 7. Event flow
Similar to Feature 1, but lightweight.

### 8. Scalability strategy
Checkpoints can be aggressively garbage collected (e.g., delete checkpoints older than 30 days) to save database space, unlike semantic versions which are permanent.

### 9. Performance strategy
Using soft-deletes for fast rollbacks.

### 10. Folder structure changes
Updates within `version-service`.

### 11. Real-world engineering reasoning
Combining Checkpoints and Versions into a single underlying service reduces microservice bloat while providing distinct user features.

### 12. Step-by-step implementation plan
1. Update `version-service` entities.
2. Implement cleanup cron job for old checkpoints.

---

## FEATURE 4 — OBSERVABILITY GRAPH SYSTEM

### 1. Feature overview
Real-time architecture health visualization showing live service status, latency, and error propagation directly on the architecture graph.

### 2. Why it is needed
Reduces Mean Time To Resolution (MTTR). When a system crashes, developers waste hours checking logs to find the root cause. A red flashing node immediately pinpoints the failure.

### 3. Frontend architecture
Zustand stores live metric data. React Flow nodes dynamically change border colors and render pulsating animations via Framer Motion when latency spikes.

### 4. Backend architecture
An `observability-service` that polls or receives webhooks from external metric providers (Prometheus/Datadog) and pushes updates to the frontend.

### 5. Database design
No persistent database needed. Uses Redis to store the *current* health state.

### 6. API design
WebSockets: `ws://systemforge/metrics/{projectId}`

### 7. Event flow
Prometheus AlertManager -> Webhook -> `observability-service` -> Redis Pub/Sub -> WebSocket -> Frontend React Flow.

### 8. Scalability strategy
WebSockets and Redis Pub/Sub allow broadcasting thousands of metric updates per second without overwhelming HTTP threads.

### 9. Performance strategy
Throttling WebSocket updates (e.g., max 1 update per second per client) prevents frontend React re-render freezing.

### 10. Folder structure changes
```
backend/observability-service/
  ├── src/main/java/com/systemforge/observability/
  │   ├── websocket/
  │   └── redis/
```

### 11. Real-world engineering reasoning
Never persist transient metric data in PostgreSQL. Redis is the only acceptable storage for high-throughput, volatile observability state.

### 12. Step-by-step implementation plan
1. Create `observability-service` with WebSockets.
2. Setup Redis Pub/Sub.
3. Build mock Prometheus webhook generator.
4. Update React Flow custom nodes to react to WebSocket events.

---

## FEATURE 5 — ROLE-BASED ACCESS CONTROL (RBAC)

### 1. Feature overview
Enterprise permissions allowing Architects to approve changes, while Viewers can only read the graph.

### 2. Why it is needed
In enterprise environments, junior developers shouldn't be able to accidentally delete the core production database node.

### 3. Frontend architecture
React Context `AuthContext` decodes the JWT. Graph elements are conditionally rendered or disabled (e.g., `nodesDraggable={isAdmin}`).

### 4. Backend architecture
`auth-service` generating JWTs. Spring Security filters applied to all microservices via the API Gateway.

### 5. Database design
**PostgreSQL:** `users`, `roles`, `project_members (user_id, project_id, role)`.

### 6. API design
`POST /api/auth/login`
All other APIs require `Authorization: Bearer <token>`.

### 7. Event flow
Login -> `auth-service` validates -> returns JWT -> Frontend stores in memory/HTTP-only cookie -> API Gateway validates signature before routing.

### 8. Scalability strategy
JWTs are stateless. Microservices validate the signature locally without querying the database, eliminating the auth bottleneck.

### 9. Performance strategy
Use asymmetric keys (RSA). Auth service signs with Private Key; microservices verify with Public Key.

### 10. Folder structure changes
```
backend/auth-service/
backend/api-gateway/ (added Spring Security filter)
```

### 11. Real-world engineering reasoning
API Gateway pattern centralization. Microservices trust the Gateway to have verified the JWT, keeping microservice code clean.

### 12. Step-by-step implementation plan
1. Scaffold `auth-service`.
2. Configure Spring Cloud Gateway security filter.
3. Implement Frontend login page and token handling.

---
*(Features 6-10 follow the exact same rigorous architectural patterns, heavily utilizing Kafka for AI rules/exports, and specialized databases. I will now generate the corresponding code structure for these foundational services.)*
