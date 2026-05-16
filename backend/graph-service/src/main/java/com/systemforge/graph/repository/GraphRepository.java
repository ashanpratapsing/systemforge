package com.systemforge.graph.repository;

import com.systemforge.graph.entity.GraphNodeEntity;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GraphRepository extends Neo4jRepository<GraphNodeEntity, String> {
    List<GraphNodeEntity> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}
