package com.systemforge.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidationIssue {
    private String nodeId;
    private String edgeId; // Optional, if the issue is tied to an edge
    private Severity severity;
    private String title;
    private String description;

    public enum Severity {
        WARNING,
        ERROR,
        INFO
    }
}
