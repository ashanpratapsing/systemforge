package com.systemforge.workflow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class SaveWorkflowRequest {
    private List<NodeDTO> nodes;
    private List<EdgeDTO> edges;

    @Data
    @NoArgsConstructor
    public static class NodeDTO {
        private String id;
        private String type;
        private PositionDTO position;
        private Map<String, Object> data;
    }

    @Data
    @NoArgsConstructor
    public static class PositionDTO {
        private Double x;
        private Double y;
    }

    @Data
    @NoArgsConstructor
    public static class EdgeDTO {
        private String id;
        private String source;
        private String target;
        private String sourceHandle;
        private String targetHandle;
        private Map<String, Object> data;
    }
}
