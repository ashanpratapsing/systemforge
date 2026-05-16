package com.systemforge.workflow.service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemforge.workflow.config.KafkaTopicConfig;
import com.systemforge.workflow.dto.GraphPatch;
import com.systemforge.workflow.dto.WorkflowEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = KafkaTopicConfig.WORKFLOW_EVENTS_TOPIC, groupId = "workflow-execution-group")
    public void consumeWorkflowEvent(String message) {
        try {
            WorkflowEvent event = objectMapper.readValue(message, WorkflowEvent.class);
            log.info("Consumed WorkflowEvent: {} for Node: {}", event.getEventType(), event.getNodeId());

            if ("NODE_EXECUTION_REQUESTED".equals(event.getEventType())) {
                simulateExternalExecution(event);
            }
        } catch (Exception e) {
            log.error("Failed to process Kafka message", e);
        }
    }

    private void simulateExternalExecution(WorkflowEvent event) {
        log.info("Simulating CI/CD external execution for Node: {}...", event.getNodeId());
        
        try {
            // Simulate a 3-second build/deployment process
            Thread.sleep(3000);
            
            log.info("Execution complete for Node: {}. Broadcasting 'done' patch to STOMP topic...", event.getNodeId());
            
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", event.getNodeId());
            payload.put("status", "done");

            GraphPatch completionPatch = new GraphPatch();
            completionPatch.setProjectId(event.getProjectId());
            completionPatch.setSenderId("SYSTEM_EXECUTION_WORKER_" + UUID.randomUUID().toString().substring(0, 8));
            completionPatch.setType(GraphPatch.PatchType.NODE_STATUS_CHANGED);
            completionPatch.setPayload(payload);

            messagingTemplate.convertAndSend("/topic/project/" + event.getProjectId(), completionPatch);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
