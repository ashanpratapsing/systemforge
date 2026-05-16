import { SystemNode, SystemEdge } from '@/types/graph.types';

export interface GraphPayload {
  nodes: SystemNode[];
  edges: SystemEdge[];
}

export const workflowApi = {
  saveWorkflow: async (projectId: string, nodes: SystemNode[], edges: SystemEdge[]): Promise<void> => {
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

    const response = await fetch(`/api/workflows/${projectId}/save`, {
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
      throw new Error(`Failed to save workflow: ${response.statusText}`);
    }
  },

  loadWorkflow: async (projectId: string): Promise<GraphPayload> => {
    const response = await fetch(`/api/workflows/${projectId}/load`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load workflow: ${response.statusText}`);
    }

    const data = await response.json();
    return data as GraphPayload;
  }
};
