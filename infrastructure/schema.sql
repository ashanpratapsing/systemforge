-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workflow_nodes table
CREATE TABLE IF NOT EXISTS workflow_nodes (
    id VARCHAR(255) PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technology VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    position_x DOUBLE PRECISION NOT NULL,
    position_y DOUBLE PRECISION NOT NULL,
    next_step VARCHAR(255),
    deployment_state VARCHAR(255),
    errors TEXT,
    connected_apis TEXT
);

-- Create workflow_edges table
CREATE TABLE IF NOT EXISTS workflow_edges (
    id VARCHAR(255) PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    source_node VARCHAR(255) NOT NULL REFERENCES workflow_nodes(id) ON DELETE CASCADE,
    target_node VARCHAR(255) NOT NULL REFERENCES workflow_nodes(id) ON DELETE CASCADE
);

-- Insert sample project for MVP
INSERT INTO projects (name) VALUES ('E-Commerce Architecture'), ('FinTech Microservices');
