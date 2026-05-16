package com.systemforge.graph.entity;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Node("SystemNode")
public class GraphNodeEntity {

    @Id
    private String id;

    private UUID projectId;

    @Relationship(type = "DEPENDS_ON", direction = Relationship.Direction.OUTGOING)
    private Set<GraphNodeEntity> dependencies = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public Set<GraphNodeEntity> getDependencies() {
        return dependencies;
    }

    public void setDependencies(Set<GraphNodeEntity> dependencies) {
        this.dependencies = dependencies;
    }
}
