package com.systemforge.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowEvent {
    private String eventId;
    private String projectId;
    private String nodeId;
    private String eventType; // e.g., NODE_EXECUTION_REQUESTED
    private Object payload;
    private Instant timestamp;
}
