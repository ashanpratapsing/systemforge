package com.systemforge.workflow.service.validation.rules;

import com.systemforge.workflow.dto.SaveWorkflowRequest;
import com.systemforge.workflow.dto.ValidationIssue;
import com.systemforge.workflow.service.validation.GraphValidationRule;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MissingApiLayerRule implements GraphValidationRule {

    @Override
    public List<ValidationIssue> evaluate(SaveWorkflowRequest graph) {
        List<ValidationIssue> issues = new ArrayList<>();

        for (SaveWorkflowRequest.EdgeDTO edge : graph.getEdges()) {
            SaveWorkflowRequest.NodeDTO source = findNode(graph.getNodes(), edge.getSource());
            SaveWorkflowRequest.NodeDTO target = findNode(graph.getNodes(), edge.getTarget());

            if (source != null && target != null) {
                if ("frontend".equalsIgnoreCase(source.getType()) && "backend".equalsIgnoreCase(target.getType())) {
                    issues.add(new ValidationIssue(
                            source.getId(),
                            edge.getId(),
                            ValidationIssue.Severity.WARNING,
                            "Missing API Layer",
                            "Frontend directly connected to a Backend service. Consider introducing an API Gateway or Load Balancer for scaling."
                    ));
                }
            }
        }

        return issues;
    }

    private SaveWorkflowRequest.NodeDTO findNode(List<SaveWorkflowRequest.NodeDTO> nodes, String id) {
        return nodes.stream().filter(n -> n.getId().equals(id)).findFirst().orElse(null);
    }
}
