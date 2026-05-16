package com.systemforge.workflow.service.validation;

import com.systemforge.workflow.dto.SaveWorkflowRequest;
import com.systemforge.workflow.dto.ValidationIssue;

import java.util.List;

public interface GraphValidationRule {
    
    /**
     * Executes the architectural validation rule against the current graph topology.
     * 
     * @param graph The full mathematical graph payload
     * @return A list of ValidationIssues found by this specific rule
     */
    List<ValidationIssue> evaluate(SaveWorkflowRequest graph);
    
}
