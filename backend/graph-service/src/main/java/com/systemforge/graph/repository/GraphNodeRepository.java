package com.systemforge.graph.repository;

import com.systemforge.graph.entity.GraphNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GraphNodeRepository extends Neo4jRepository<GraphNode, String> {
    List<GraphNode> findByProjectId(Long projectId);
}
