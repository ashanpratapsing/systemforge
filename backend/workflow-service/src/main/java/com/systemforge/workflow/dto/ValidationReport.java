package com.systemforge.workflow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ValidationReport {
    private List<ValidationIssue> issues = new ArrayList<>();
    
    public void addIssue(ValidationIssue issue) {
        this.issues.add(issue);
    }
    
    public void addIssues(List<ValidationIssue> newIssues) {
        this.issues.addAll(newIssues);
    }
}
