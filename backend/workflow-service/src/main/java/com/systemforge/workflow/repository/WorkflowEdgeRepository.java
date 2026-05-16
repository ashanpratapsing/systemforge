package com.systemforge.workflow.repository;

import com.systemforge.workflow.entity.WorkflowEdgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowEdgeRepository extends JpaRepository<WorkflowEdgeEntity, String> {
    List<WorkflowEdgeEntity> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}
