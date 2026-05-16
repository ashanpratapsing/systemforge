package com.systemforge.workflow.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.UUID;

@Entity
@Table(name = "workflow_edges")
@Data
@NoArgsConstructor
public class WorkflowEdgeEntity {

    @Id
    private String id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "source_node", nullable = false)
    private String source;

    @Column(name = "target_node", nullable = false)
    private String target;

    @Column(name = "source_handle")
    private String sourceHandle;

    @Column(name = "target_handle")
    private String targetHandle;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String data; // Stores SystemEdgeData as JSON
}
