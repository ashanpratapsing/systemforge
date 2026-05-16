package com.systemforge.workflow.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.UUID;

@Entity
@Table(name = "workflow_nodes")
@Data
@NoArgsConstructor
public class WorkflowNodeEntity {

    @Id
    private String id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "node_type", nullable = false)
    private String type;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String data; // Stores SystemNodeData as JSON String or Map

    @Column(name = "position_x", nullable = false)
    private Double positionX;

    @Column(name = "position_y", nullable = false)
    private Double positionY;
}
