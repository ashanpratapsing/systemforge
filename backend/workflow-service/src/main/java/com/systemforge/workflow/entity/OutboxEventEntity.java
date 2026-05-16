package com.systemforge.workflow.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.Instant;

@Entity
@Table(name = "outbox_events")
@Getter
@Setter
public class OutboxEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String aggregateId; // Project ID
    
    private String aggregateType; // "WorkflowProject"
    
    private String eventType; // e.g. "NODE_EXECUTION_REQUESTED"
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String payload; // JSON serialized WorkflowEvent
    
    private Instant createdAt = Instant.now();
    
    // Status can be PENDING, PROCESSED, ERROR
    private String status = "PENDING";
}
