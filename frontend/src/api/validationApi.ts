import { SystemNode, SystemEdge } from '@/types/graph.types';

export interface ValidationIssue {
  nodeId: string;
  edgeId?: string;
  severity: 'WARNING' | 'ERROR' | 'INFO';
  title: string;
  description: string;
}

export interface ValidationReport {
  issues: ValidationIssue[];
}

export const validationApi = {
  analyzeArchitecture: async (nodes: SystemNode[], edges: SystemEdge[]): Promise<ValidationReport> => {
    // Strip ephemeral React Flow state before sending to backend
    const sanitizedNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));

    const sanitizedEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      data: edge.data,
    }));

    const response = await fetch(`/api/validation/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes: sanitizedNodes,
        edges: sanitizedEdges,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to run validation: ${response.statusText}`);
    }

    return await response.json();
  }
};
