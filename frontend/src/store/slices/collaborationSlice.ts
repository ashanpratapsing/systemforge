import { StoreSlice, CollaborationSlice } from '../types';
import { wsManager, GraphPatch } from '@/api/websocketManager';
import { recalculateGraphState } from '@/components/graph/utils/workflowEngine';

export const createCollaborationSlice: StoreSlice<CollaborationSlice> = (set, get) => ({
  isConnected: false,
  
  connectToProject: (projectId: string) => {
    wsManager.connect(
      projectId, 
      (patch) => get().receivePatch(patch),
      (connected) => set((state) => { state.isConnected = connected; })
    );
  },

  disconnectFromProject: () => {
    wsManager.disconnect();
    set((state) => { state.isConnected = false; });
  },

  receivePatch: (patch: GraphPatch) => {
    set((state) => {
      // Apply optimistic update from another user
      if (patch.type === 'NODE_MOVED') {
        const node = state.nodes.find(n => n.id === patch.payload.id);
        if (node) {
          node.position = patch.payload.position;
        }
      } 
      else if (patch.type === 'NODE_STATUS_CHANGED') {
        const node = state.nodes.find(n => n.id === patch.payload.id);
        if (node) {
          node.data.status = patch.payload.status;
          recalculateGraphState(state.nodes, state.edges);
        }
      }
      else if (patch.type === 'NODE_ADDED') {
        // Simple append. We assume full node object is in payload.
        if (!state.nodes.find(n => n.id === patch.payload.id)) {
          state.nodes.push(patch.payload as any);
          recalculateGraphState(state.nodes, state.edges);
        }
      }
      else if (patch.type === 'EDGE_ADDED') {
        if (!state.edges.find(e => e.id === patch.payload.id)) {
          state.edges.push(patch.payload as any);
          recalculateGraphState(state.nodes, state.edges);
        }
      }
    });
  }
});
