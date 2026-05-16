package com.systemforge.workflow.service.validation;

import com.systemforge.workflow.dto.SaveWorkflowRequest;
import com.systemforge.workflow.dto.ValidationIssue;
import com.systemforge.workflow.dto.ValidationReport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ValidationEngineService {

    private final List<GraphValidationRule> validationRules;

    public ValidationReport analyzeGraph(SaveWorkflowRequest graph) {
        log.info("Running Architecture Validation against {} nodes and {} edges", graph.getNodes().size(), graph.getEdges().size());
        
        ValidationReport report = new ValidationReport();

        for (GraphValidationRule rule : validationRules) {
            try {
                List<ValidationIssue> issues = rule.evaluate(graph);
                report.addIssues(issues);
            } catch (Exception e) {
                log.error("Validation Rule {} failed during execution", rule.getClass().getSimpleName(), e);
            }
        }

        return report;
    }
}
