// Create basic node structure for a project architecture
MERGE (frontend:WorkflowNode {id: 'frontend', projectId: 1, title: 'Signup Page', technology: 'Next.js'})
MERGE (api:WorkflowNode {id: 'api-gateway', projectId: 1, title: 'API Gateway', technology: 'Spring Cloud'})
MERGE (auth:WorkflowNode {id: 'auth-service', projectId: 1, title: 'Auth Service', technology: 'Spring Boot'})
MERGE (db:WorkflowNode {id: 'db', projectId: 1, title: 'PostgreSQL', technology: 'PostgreSQL'})

// Create dependency relationships
MERGE (frontend)-[:DEPENDS_ON]->(api)
MERGE (api)-[:DEPENDS_ON]->(auth)
MERGE (auth)-[:DEPENDS_ON]->(db)
