package com.systemforge.workflow.controller;

import com.systemforge.workflow.dto.GraphPatch;
import com.systemforge.workflow.dto.WorkflowEvent;
import com.systemforge.workflow.entity.OutboxEventEntity;
import com.systemforge.workflow.repository.OutboxRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CollaborationController {

    private final OutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    /**
     * Intercepts messages sent to /app/project/{projectId}/patch
     * and broadcasts them to /topic/project/{projectId}
     */
    @MessageMapping("/project/{projectId}/patch")
    @SendTo("/topic/project/{projectId}")
    @Transactional
    public GraphPatch broadcastPatch(
            @DestinationVariable String projectId,
            @Payload GraphPatch patch) {
        
        log.debug("Received {} patch for project {} from {}", patch.getType(), projectId, patch.getSenderId());
        
        // MVP Execution Interceptor: If a node status changes to 'in_progress', queue an Outbox event
        if (patch.getType() == GraphPatch.PatchType.NODE_STATUS_CHANGED) {
            String status = (String) patch.getPayload().get("status");
            String nodeId = (String) patch.getPayload().get("id");
            
            if ("in_progress".equals(status)) {
                try {
                    WorkflowEvent event = WorkflowEvent.builder()
                            .eventId(UUID.randomUUID().toString())
                            .projectId(projectId)
                            .nodeId(nodeId)
                            .eventType("NODE_EXECUTION_REQUESTED")
                            .payload(patch.getPayload())
                            .timestamp(Instant.now())
                            .build();

                    OutboxEventEntity outboxEntity = new OutboxEventEntity();
                    outboxEntity.setAggregateId(projectId);
                    outboxEntity.setAggregateType("WorkflowProject");
                    outboxEntity.setEventType(event.getEventType());
                    outboxEntity.setPayload(objectMapper.writeValueAsString(event));
                    outboxEntity.setStatus("PENDING");
                    
                    outboxRepository.save(outboxEntity);
                    log.info("Saved execution outbox event for Node {}", nodeId);
                } catch (Exception e) {
                    log.error("Failed to serialize outbox event", e);
                }
            }
        }
        
        return patch;
    }
}
