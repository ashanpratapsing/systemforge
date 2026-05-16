# SystemForge MVP

SystemForge is an AI-powered Software Architecture and Workflow Intelligence Platform.

This project implements the MVP foundation including a visual graph engine, microservices, and persistent database layer.

## Architecture

* **Frontend:** Next.js 14, Tailwind CSS, React Flow, Zustand
* **Backend:** Spring Boot, Java 21, Spring Data JPA, Spring Data Neo4j
* **Database:** PostgreSQL (Projects & Workflow metadata), Neo4j (Graph traversal & Dependencies)

## Prerequisites

* Docker & Docker Compose
* Node.js 20+
* Java 21+
* Maven

## Setup Instructions

### 1. Start Infrastructure (Databases)

```bash
docker-compose up -d
```
This will start:
* PostgreSQL on `localhost:5432` (user: postgres, password: password, db: systemforge)
* Neo4j on `localhost:7474` and `localhost:7687` (user: neo4j, password: password)

### 2. Start Backend Microservices

We have three microservices. Open separate terminal windows and run:

```bash
cd backend/project-service
mvn spring-boot:run
```
(Runs on port 8081)

```bash
cd backend/workflow-service
mvn spring-boot:run
```
(Runs on port 8082)

```bash
cd backend/graph-service
mvn spring-boot:run
```
(Runs on port 8083)

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```
(Runs on port 3000)

## Usage

1. Open `http://localhost:3000`
2. View the Dashboard with sample projects.
3. Click a project to enter the Canvas View.
4. Interact with the React Flow graph. Use the "Simulate Flow" button to see the workflow state progression.
