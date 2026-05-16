package com.systemforge.workflow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class GraphPatch {
    private String projectId;
    private String senderId;
    private PatchType type;
    private Map<String, Object> payload;

    public enum PatchType {
        NODE_MOVED,
        NODE_ADDED,
        NODE_STATUS_CHANGED,
        EDGE_ADDED,
        NODE_DELETED,
        EDGE_DELETED
    }
}
