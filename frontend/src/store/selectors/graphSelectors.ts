import { StoreState } from '../types';
import { SystemNode, SystemEdge } from '@/types/graph.types';

/**
 * Returns all nodes that are targets of edges originating from the given nodeId.
 * Complexity: O(E) where E is number of edges.
 */
export const selectOutgoers = (nodeId: string) => (state: StoreState): SystemNode[] => {
  const outgoerIds = state.edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target);
  
  return state.nodes.filter((n) => outgoerIds.includes(n.id));
};

/**
 * Returns all nodes that are sources of edges targeting the given nodeId.
 * Complexity: O(E) where E is number of edges.
 */
export const selectIncomers = (nodeId: string) => (state: StoreState): SystemNode[] => {
  const incomerIds = state.edges
    .filter((e) => e.target === nodeId)
    .map((e) => e.source);
    
  return state.nodes.filter((n) => incomerIds.includes(n.id));
};

/**
 * Checks if a specific node has all its dependencies (incomers) marked as 'done'.
 * Useful for the workflow engine to determine if a node should be unblocked.
 */
export const selectIsNodeReadyToExecute = (nodeId: string) => (state: StoreState): boolean => {
  const incomers = selectIncomers(nodeId)(state);
  if (incomers.length === 0) return true; // No dependencies means it's ready
  
  return incomers.every((node) => node.data.status === 'done');
};
