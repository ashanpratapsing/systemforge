package com.systemforge.workflow.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "workflow_edges")
@Data
public class WorkflowEdge {
    @Id
    private String id; // use string id from react flow

    private Long projectId;

    private String sourceNode;
    private String targetNode;
}
