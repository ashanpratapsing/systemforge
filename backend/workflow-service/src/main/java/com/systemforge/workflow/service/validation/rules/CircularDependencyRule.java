package com.systemforge.workflow.service.validation.rules;

import com.systemforge.workflow.dto.SaveWorkflowRequest;
import com.systemforge.workflow.dto.ValidationIssue;
import com.systemforge.workflow.service.validation.GraphValidationRule;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CircularDependencyRule implements GraphValidationRule {

    @Override
    public List<ValidationIssue> evaluate(SaveWorkflowRequest graph) {
        List<ValidationIssue> issues = new ArrayList<>();
        Map<String, List<String>> adjacencyList = new HashMap<>();

        for (SaveWorkflowRequest.NodeDTO node : graph.getNodes()) {
            adjacencyList.put(node.getId(), new ArrayList<>());
        }

        for (SaveWorkflowRequest.EdgeDTO edge : graph.getEdges()) {
            if (adjacencyList.containsKey(edge.getSource())) {
                adjacencyList.get(edge.getSource()).add(edge.getTarget());
            }
        }

        Set<String> visited = new HashSet<>();
        Set<String> recStack = new HashSet<>();

        for (SaveWorkflowRequest.NodeDTO node : graph.getNodes()) {
            if (hasCycle(node.getId(), adjacencyList, visited, recStack)) {
                issues.add(new ValidationIssue(
                        node.getId(),
                        null,
                        ValidationIssue.Severity.ERROR,
                        "Circular Dependency Detected",
                        "This node is part of a circular dependency chain. Execution engines cannot resolve this DAG."
                ));
            }
        }

        return issues;
    }

    private boolean hasCycle(String node, Map<String, List<String>> adj, Set<String> visited, Set<String> recStack) {
        if (recStack.contains(node)) return true;
        if (visited.contains(node)) return false;

        visited.add(node);
        recStack.add(node);

        List<String> children = adj.getOrDefault(node, new ArrayList<>());
        for (String child : children) {
            if (hasCycle(child, adj, visited, recStack)) {
                return true;
            }
        }

        recStack.remove(node);
        return false;
    }
}
