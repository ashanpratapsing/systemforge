package com.systemforge.workflow.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemforge.workflow.dto.SaveWorkflowRequest;
import com.systemforge.workflow.entity.WorkflowEdgeEntity;
import com.systemforge.workflow.entity.WorkflowNodeEntity;
import com.systemforge.workflow.repository.WorkflowEdgeRepository;
import com.systemforge.workflow.repository.WorkflowNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workflows")
@RequiredArgsConstructor
@Slf4j
public class WorkflowController {

    private final WorkflowNodeRepository nodeRepository;
    private final WorkflowEdgeRepository edgeRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @PostMapping("/{projectId}/save")
    @Transactional
    public ResponseEntity<Void> saveWorkflow(
            @PathVariable UUID projectId,
            @RequestBody SaveWorkflowRequest request) {

        log.info("Saving workflow for project {}", projectId);

        // 1. Delete existing graph in PostgreSQL (Soft delete in future, hard delete for MVP)
        nodeRepository.deleteByProjectId(projectId);
        edgeRepository.deleteByProjectId(projectId);

        // 2. Persist Nodes to PostgreSQL
        List<WorkflowNodeEntity> nodeEntities = request.getNodes().stream().map(nodeDto -> {
            WorkflowNodeEntity entity = new WorkflowNodeEntity();
            entity.setId(nodeDto.getId());
            entity.setProjectId(projectId);
            entity.setType(nodeDto.getType());
            entity.setPositionX(nodeDto.getPosition().getX());
            entity.setPositionY(nodeDto.getPosition().getY());
            try {
                entity.setData(objectMapper.writeValueAsString(nodeDto.getData()));
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize node data", e);
            }
            return entity;
        }).collect(Collectors.toList());

        nodeRepository.saveAll(nodeEntities);

        // 3. Persist Visual Edges to PostgreSQL
        List<WorkflowEdgeEntity> edgeEntities = request.getEdges().stream().map(edgeDto -> {
            WorkflowEdgeEntity entity = new WorkflowEdgeEntity();
            entity.setId(edgeDto.getId());
            entity.setProjectId(projectId);
            entity.setSource(edgeDto.getSource());
            entity.setTarget(edgeDto.getTarget());
            entity.setSourceHandle(edgeDto.getSourceHandle());
            entity.setTargetHandle(edgeDto.getTargetHandle());
            try {
                entity.setData(objectMapper.writeValueAsString(edgeDto.getData()));
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize edge data", e);
            }
            return entity;
        }).collect(Collectors.toList());

        edgeRepository.saveAll(edgeEntities);

        // 4. Synchronously push to Neo4j graph-service
        try {
            // In a real distributed system, we use Kafka or WebClient. RestTemplate for MVP.
            restTemplate.postForEntity(
                    "http://localhost:8083/api/graph/" + projectId + "/sync", 
                    request, 
                    Void.class
            );
        } catch (Exception e) {
            log.error("Failed to sync with Neo4j Graph Service. Postgres will commit, Graph is desynced.", e);
            // In production, throw exception to trigger @Transactional rollback of Postgres
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{projectId}/load")
    public ResponseEntity<SaveWorkflowRequest> loadWorkflow(@PathVariable UUID projectId) {
        log.info("Loading workflow for project {}", projectId);
        
        SaveWorkflowRequest response = new SaveWorkflowRequest();

        List<SaveWorkflowRequest.NodeDTO> nodes = nodeRepository.findByProjectId(projectId).stream()
                .map(entity -> {
                    SaveWorkflowRequest.NodeDTO dto = new SaveWorkflowRequest.NodeDTO();
                    dto.setId(entity.getId());
                    dto.setType(entity.getType());
                    SaveWorkflowRequest.PositionDTO pos = new SaveWorkflowRequest.PositionDTO();
                    pos.setX(entity.getPositionX());
                    pos.setY(entity.getPositionY());
                    dto.setPosition(pos);
                    try {
                        // Suppressing generic type warning for MVP
                        dto.setData(objectMapper.readValue(entity.getData(), java.util.Map.class));
                    } catch (JsonProcessingException e) {
                        log.error("Failed to deserialize node data", e);
                    }
                    return dto;
                }).collect(Collectors.toList());

        List<SaveWorkflowRequest.EdgeDTO> edges = edgeRepository.findByProjectId(projectId).stream()
                .map(entity -> {
                    SaveWorkflowRequest.EdgeDTO dto = new SaveWorkflowRequest.EdgeDTO();
                    dto.setId(entity.getId());
                    dto.setSource(entity.getSource());
                    dto.setTarget(entity.getTarget());
                    dto.setSourceHandle(entity.getSourceHandle());
                    dto.setTargetHandle(entity.getTargetHandle());
                    try {
                        dto.setData(objectMapper.readValue(entity.getData(), java.util.Map.class));
                    } catch (JsonProcessingException e) {
                        log.error("Failed to deserialize edge data", e);
                    }
                    return dto;
                }).collect(Collectors.toList());

        response.setNodes(nodes);
        response.setEdges(edges);

        return ResponseEntity.ok(response);
    }
}
