package com.systemforge.workflow.controller;

import com.systemforge.workflow.dto.SaveWorkflowRequest;
import com.systemforge.workflow.dto.ValidationReport;
import com.systemforge.workflow.service.validation.ValidationEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/validation")
@RequiredArgsConstructor
public class ValidationController {

    private final ValidationEngineService validationEngineService;

    @PostMapping("/analyze")
    public ResponseEntity<ValidationReport> analyzeArchitecture(@RequestBody SaveWorkflowRequest graphPayload) {
        ValidationReport report = validationEngineService.analyzeGraph(graphPayload);
        return ResponseEntity.ok(report);
    }
}
