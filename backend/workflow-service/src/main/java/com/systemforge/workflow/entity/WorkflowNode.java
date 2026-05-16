package com.systemforge.workflow.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "workflow_nodes")
@Data
public class WorkflowNode {
    @Id
    private String id; // use string id from react flow

    private Long projectId;

    private String title;
    private String description;
    private String technology;
    private String status; // pending, in_progress, done, error, blocked
    
    private Double positionX;
    private Double positionY;
    
    private String nextStep;
    private String deploymentState;
    private String errors;
    private String connectedApis;
}
