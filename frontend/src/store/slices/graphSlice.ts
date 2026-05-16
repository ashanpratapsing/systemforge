import { Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { StoreSlice, GraphSlice } from '../types';
import { SystemEdge, SystemNode } from '@/types/graph.types';
import { recalculateGraphState } from '@/components/graph/utils/workflowEngine';
import { workflowApi } from '@/api/workflowApi';
import { wsManager } from '@/api/websocketManager';

export const createGraphSlice: StoreSlice<GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set((state) => {
      state.nodes = applyNodeChanges(changes, state.nodes);
    });
    
    // Broadcast position changes (throttled by React Flow drag stops usually, or just emit raw for MVP)
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        wsManager.broadcastPatch('NODE_MOVED', { id: change.id, position: change.position });
      }
    });
  },
  
  onEdgesChange: (changes) => {
    set((state) => {
      state.edges = applyEdgeChanges(changes, state.edges);
    });
  },
  
  onConnect: (connection: Connection | Edge) => {
    const newEdge: SystemEdge = {
      ...connection,
      id: `edge_${connection.source}_${connection.target}`,
      type: 'system',
      data: {
        type: 'dependency',
        validationState: 'valid',
      },
    } as SystemEdge;
    
    set((state) => {
      state.edges = addEdge(newEdge, state.edges);
      recalculateGraphState(state.nodes, state.edges);
    });
    
    wsManager.broadcastPatch('EDGE_ADDED', newEdge);
  },
  
  addNode: (node) => {
    set((state) => {
      state.nodes.push(node);
      recalculateGraphState(state.nodes, state.edges);
    });
    
    wsManager.broadcastPatch('NODE_ADDED', node);
  },
  
  updateNodeStatus: (id, status) => {
    set((state) => {
      const node = state.nodes.find((n) => n.id === id);
      if (node) {
        node.data.status = status;
        // Status change might unblock downstream nodes, so we recalculate
        recalculateGraphState(state.nodes, state.edges);
      }
    });
    
    wsManager.broadcastPatch('NODE_STATUS_CHANGED', { id, status });
  },
  
  setNodes: (nodes) => {
    set((state) => {
      state.nodes = nodes;
    });
  },
  
  setEdges: (edges) => {
    set((state) => {
      state.edges = edges;
    });
  },
  
  saveWorkflowToServer: async (projectId: string) => {
    const { nodes, edges } = get();
    set((state) => { state.isSaving = true; });
    try {
      await workflowApi.saveWorkflow(projectId, nodes as SystemNode[], edges as SystemEdge[]);
    } catch (error) {
      console.error("Failed to save workflow", error);
      // In a real app, dispatch a toast notification here
    } finally {
      set((state) => { state.isSaving = false; });
    }
  },

  loadWorkflowFromServer: async (projectId: string) => {
    set((state) => { state.isLoading = true; });
    try {
      const payload = await workflowApi.loadWorkflow(projectId);
      set((state) => {
        state.nodes = payload.nodes as SystemNode[];
        state.edges = payload.edges as SystemEdge[];
      });
    } catch (error) {
      console.error("Failed to load workflow", error);
    } finally {
      set((state) => { state.isLoading = false; });
    }
  },
});
