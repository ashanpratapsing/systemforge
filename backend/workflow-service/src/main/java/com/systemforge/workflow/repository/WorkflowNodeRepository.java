package com.systemforge.workflow.repository;

import com.systemforge.workflow.entity.WorkflowNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowNodeRepository extends JpaRepository<WorkflowNodeEntity, String> {
    List<WorkflowNodeEntity> findByProjectId(UUID projectId);
    void deleteByProjectId(UUID projectId);
}
