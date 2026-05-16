package com.systemforge.workflow.repository;

import com.systemforge.workflow.entity.OutboxEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutboxRepository extends JpaRepository<OutboxEventEntity, String> {
    List<OutboxEventEntity> findByStatusOrderByCreatedAtAsc(String status);
}
