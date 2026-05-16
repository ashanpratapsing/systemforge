package com.systemforge.graph.controller;

import com.systemforge.graph.dto.GraphPayload;
import com.systemforge.graph.entity.GraphNodeEntity;
import com.systemforge.graph.repository.GraphRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/graph")
@RequiredArgsConstructor
@Slf4j
public class GraphController {

    private final GraphRepository graphRepository;

    @PostMapping("/{projectId}/sync")
    @Transactional
    public ResponseEntity<Void> syncGraph(
            @PathVariable UUID projectId,
            @RequestBody GraphPayload payload) {

        log.info("Syncing graph relationships in Neo4j for project {}", projectId);

        // 1. Delete existing graph for this project
        graphRepository.deleteByProjectId(projectId);

        // 2. Create Node Entities Map
        Map<String, GraphNodeEntity> nodeMap = new HashMap<>();
        payload.getNodes().forEach(n -> {
            GraphNodeEntity entity = new GraphNodeEntity();
            entity.setId(n.getId());
            entity.setProjectId(projectId);
            nodeMap.put(n.getId(), entity);
        });

        // 3. Establish Relationships (DEPENDS_ON)
        // In our system, an edge from A -> B means B depends on A.
        // Or A -> B means A executes before B.
        // We will store it as A -> DEPENDS_ON -> B
        payload.getEdges().forEach(e -> {
            GraphNodeEntity source = nodeMap.get(e.getSource());
            GraphNodeEntity target = nodeMap.get(e.getTarget());
            if (source != null && target != null) {
                source.getDependencies().add(target);
            }
        });

        // 4. Save to Neo4j
        // Saving the collection of nodes will recursively save the relationships
        graphRepository.saveAll(nodeMap.values());

        return ResponseEntity.ok().build();
    }
}
