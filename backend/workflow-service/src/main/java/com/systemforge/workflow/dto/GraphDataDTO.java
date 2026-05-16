package com.systemforge.workflow.dto;

import com.systemforge.workflow.entity.WorkflowEdge;
import com.systemforge.workflow.entity.WorkflowNode;
import lombok.Data;
import java.util.List;

@Data
public class GraphDataDTO {
    private List<WorkflowNode> nodes;
    private List<WorkflowEdge> edges;
}
