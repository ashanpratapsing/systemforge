package com.systemforge.graph.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Set;

@Node("WorkflowNode")
@Data
public class GraphNode {
    @Id
    private String id;
    private Long projectId;
    private String title;
    private String technology;

    @Relationship(type = "DEPENDS_ON")
    private Set<GraphNode> dependencies = new HashSet<>();
}
