# SystemForge: Architecture & Engineering Blueprint

As a Principal Software Architect, I have designed the complete production-grade architecture for **SystemForge**. This document strictly follows the FAANG-level principles to ensure that the platform is scalable, maintainable, and guarantees that developers never feel lost.

---

## 1. Product Understanding

**What we are building:**
SystemForge is an AI-powered Software Architecture & Workflow Intelligence Platform. It is an interactive, graph-based operating system for software engineering that visually maps frontend, backend, database, and devops dependencies.

**Why we are building it:**
Developers often suffer from "engineering confusion"—losing track of what to build next, misunderstanding dependency chains, and making architectural mistakes that lead to cascading failures. Existing tools are either static diagrams (like Draw.io) or disconnected task managers (like Jira). SystemForge merges system design with active engineering execution.

**The Core Philosophy:**
*Developers never feel lost while building scalable systems.*
By making the architecture a living, stateful graph, developers are explicitly guided on what to build, what it depends on, and when it is safe to proceed.

---

## 2. System Architecture Explanation

**Architecture Style:** Event-Driven Microservices Architecture.

**How it works:**
The platform is divided into decoupled layers:
1.  **Frontend Experience Layer:** Renders the interactive graph and dashboards.
2.  **API Gateway Layer:** Routes traffic, handles rate limiting, and manages authentication.
3.  **Core Microservices:** Specialized Spring Boot services for distinct domains (Projects, Workflows, Graphs).
4.  **Data Layer:** Polyglot persistence using PostgreSQL (relational metadata) and Neo4j (graph traversals).
5.  **Real-Time Event Bus:** Kafka and WebSockets ensure that changes made by one user are instantly reflected globally.

**Why this architecture:**
It prevents a monolithic bottleneck. If the graph-rendering engine experiences high load, the graph service can scale independently of the project metadata service. This isolation ensures fault tolerance and massive scalability.

---

## 3. Frontend Explanation

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, React Flow, Zustand.

**Architecture:**
-   **React Flow:** Handles the heavy lifting of rendering nodes and edges on an HTML5 canvas. It provides the drag-and-drop primitives.
-   **Zustand:** Provides a lightweight, unopinionated global state store for the graph state, ensuring high-performance re-renders compared to Redux.
-   **Next.js:** Ensures fast initial load times via Server-Side Rendering (SSR) for dashboards, while the canvas itself runs entirely client-side.

**Why React Flow is used:**
Building a drag-and-drop canvas from scratch is error-prone and non-performant for thousands of nodes. React Flow uses customized DOM nodes with optimized transformation matrices, allowing smooth zooming and panning even with massive architectures.

**How it prevents confusion:**
The frontend uses strict visual cues—color-coded nodes, animated edges, and distinct iconography—to immediately communicate the state of the system (Pending, In Progress, Done, Error, Blocked).

---

## 4. Backend Explanation

**Stack:** Spring Boot 3, Java 21, Spring Cloud Gateway.

**Architecture:**
We use a domain-driven microservice pattern.
-   **Project Service:** Manages workspaces and user associations.
-   **Workflow Service:** Manages the state machine of the architecture (Pending -> In Progress -> Done).
-   **Graph Service:** Manages the actual dependency chains and performs cyclic dependency detection.

**Why Spring Boot & Java 21:**
Java 21's Virtual Threads provide massive concurrency improvements for IO-heavy operations (like querying multiple databases and Kafka topics) without the memory overhead of traditional OS threads. Spring Boot provides battle-tested enterprise routing, security, and dependency injection.

---

## 5. Database Explanation

We utilize Polyglot Persistence because no single database is perfect for this product.

**PostgreSQL (Relational):**
-   **Why:** Perfect for ACID-compliant structured data like User Profiles, Project Metadata, and basic Workflow states.
-   **Problem solved:** Ensures transactional integrity when updating billing, user roles, or project details.

**Neo4j (Graph Database):**
-   **Why:** SystemForge *is* a graph. Storing dependency chains (A depends on B, which depends on C) in SQL requires expensive, slow recursive `JOIN` queries.
-   **Problem solved:** Neo4j traverses relationships in constant time. It easily answers queries like: "If the Auth Service crashes, which frontend components are impacted?"

**Redis (In-Memory Cache):**
-   **Why:** The frontend will frequently poll or request graph states.
-   **Problem solved:** Redis caches the most frequently accessed graphs, achieving sub-millisecond response times and protecting PostgreSQL/Neo4j from read-heavy traffic.

---

## 6. Workflow Engine Design

**How it works:**
The Workflow Engine is a state machine. Every node has an explicit state: `pending`, `in_progress`, `done`, `error`, or `blocked`.

**Workflow Unlocking:**
1. Node A (Auth API) is marked `done`.
2. The Workflow Engine checks Neo4j for nodes depending on Node A (e.g., Node B - Login UI).
3. If all dependencies for Node B are `done`, the Engine transitions Node B from `blocked` to `pending`.
4. A Kafka event is fired, and WebSockets push the update to the frontend, visually "unlocking" Node B.

**Why:**
This enforces the core philosophy. A developer cannot start building the Login UI if the Auth API is still `blocked` or `in_progress`. It prevents out-of-order engineering.

---

## 7. Graph Engine Design

**How it works:**
The Graph Engine runs on top of Neo4j. It parses the visual nodes and translates them into a mathematical Directed Acyclic Graph (DAG).

**Why:**
It is responsible for **Architecture Validation**. If a developer connects the "Frontend UI" directly to the "PostgreSQL Database", the Graph Engine detects this anti-pattern (violating layered architecture) and flags it as an Error, suggesting an API Gateway instead.

---

## 8. Scalability Explanation

**How it scales:**
-   **Stateless Services:** All Spring Boot services are stateless. Session data is stored in Redis. This allows Kubernetes to horizontally autoscale instances based on CPU load.
-   **Event-Driven (Kafka):** Heavy operations (like analyzing an architecture for security flaws) are pushed to a Kafka queue and processed asynchronously by worker nodes, keeping the UI instantly responsive.
-   **Database Read Replicas:** PostgreSQL and Neo4j reads are routed to read-replicas to handle heavy traffic.

---

## 9. Folder Structure Explanation

```text
systemforge/
├── frontend/                     # Next.js App
│   ├── src/app/                  # App Router pages (Dashboard, Canvas)
│   ├── src/components/graph/     # React Flow custom nodes/edges
│   ├── src/store/                # Zustand global state
│   └── src/services/             # API clients
├── backend/                      # Spring Boot Microservices
│   ├── project-service/          # SQL entities, repos, controllers
│   ├── workflow-service/         # State machine logic
│   ├── graph-service/            # Neo4j integration
│   └── infrastructure/           # Docker compose, SQL/Cypher init scripts
```
**Why:**
Separation of concerns. A frontend engineer can work purely in `frontend/` without needing to compile Java. Backend teams can deploy `project-service` independently of `graph-service`.

---

## 10. API Architecture

**Design:** RESTful APIs behind a Spring Cloud API Gateway.

-   `GET /api/projects` - Retrieves metadata from PostgreSQL.
-   `GET /api/workflows/{id}/load` - Aggregates SQL state and Neo4j edges to return a unified `GraphDataDTO`.
-   `PATCH /api/workflows/nodes/{id}/status` - Updates a node's execution state.

**Why:**
REST is highly cacheable, universally understood, and integrates perfectly with Next.js Server Components.

---

## 11. Engineering Flow Explanation

**Step-by-Step Execution:**
1.  **Design Phase:** The Architect drags and drops nodes (Frontend -> API -> DB).
2.  **Save/Persistence:** The graph is parsed. Nodes go to PostgreSQL, relationships go to Neo4j.
3.  **Execution Phase:** The graph is locked. Developers look at the graph. All UI components are `blocked`. Only the Database node is `pending`.
4.  **Development:** DevOps provisions the DB and clicks "Done".
5.  **Smart Unlock:** Kafka fires an event. The API node unlocks and becomes `pending`. The backend team builds the API, clicks "Done".
6.  **Completion:** The UI node unlocks. The frontend team builds it.

**Error Tracing:**
If the API team reports an error, they mark the API node as `error`. The Graph Engine traces the dependency chain backward and automatically marks the UI node as `blocked` with the warning: "Dependency API Gateway has failed."

---

## 12. Development Roadmap

*   **Phase 1: MVP Foundation (COMPLETED)**
    *   Interactive React Flow Canvas.
    *   Basic Spring Boot Microservices.
    *   PostgreSQL + Neo4j Docker integration.
    *   Manual Save/Load functionality.
*   **Phase 2: Smart Workflow Engine**
    *   Implement Kafka for async event propagation.
    *   Build the strict node unlocking logic.
*   **Phase 3: Real-Time Collaboration**
    *   Integrate WebSockets/Redis PubSub.
    *   Multiplayer cursors (Figma-style).
*   **Phase 4: AI Architecture Generator**
    *   Integrate LLM.
    *   Prompt-to-Architecture functionality.

---

## 13. Code Structure Generation

> **Architect's Note:** 
> The code structure corresponding to **Phase 1: MVP Foundation** of this architecture blueprint has *already been fully scaffolded and generated* in the current workspace under the `frontend/` and `backend/` directories. 
>
> The setup includes the complete Next.js/React Flow frontend, the Maven parent POM, the three distinct Spring Boot microservices, and the Docker infrastructure as strictly defined in this document.
