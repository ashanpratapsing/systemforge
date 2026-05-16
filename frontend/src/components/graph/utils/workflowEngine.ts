import { SystemNode, SystemEdge, NodeStatus } from '@/types/graph.types';

/**
 * Returns true if a node has no dependencies, or if ALL its dependencies are marked 'done'.
 */
export const checkNodeReadiness = (
  nodeId: string, 
  nodes: SystemNode[], 
  edges: SystemEdge[]
): boolean => {
  // Find all edges pointing TO this node (dependencies)
  const incomingEdges = edges.filter(e => e.target === nodeId && e.data?.type === 'dependency');
  
  if (incomingEdges.length === 0) {
    return true; // No dependencies -> Ready
  }

  // Find the actual parent nodes
  const parentNodeIds = incomingEdges.map(e => e.source);
  const parentNodes = nodes.filter(n => parentNodeIds.includes(n.id));

  // If any parent is NOT done, this node is not ready
  return parentNodes.every(n => n.data.status === 'done');
};

/**
 * Determines the correct mathematical state of a node based on its current state and graph topology.
 * Note: We don't downgrade a node from 'in_progress' or 'done' just because a dependency changed,
 * unless explicitly requested, to prevent losing user work. 
 */
export const calculateExpectedNodeStatus = (
  node: SystemNode, 
  nodes: SystemNode[], 
  edges: SystemEdge[]
): NodeStatus => {
  const currentStatus = node.data.status;
  
  // If the node is already actively being worked on or finished, leave it alone.
  if (currentStatus === 'done' || currentStatus === 'in_progress' || currentStatus === 'error') {
    return currentStatus;
  }

  const isReady = checkNodeReadiness(node.id, nodes, edges);
  
  if (isReady) {
    return 'ready';
  } else {
    return 'blocked';
  }
};

/**
 * A pure BFS traversal function to recalculate the status of the entire graph.
 * Mutates the passed `draftNodes` array directly (designed to be used inside Immer).
 */
export const recalculateGraphState = (
  draftNodes: SystemNode[],
  draftEdges: SystemEdge[]
) => {
  // A simple pass through all nodes to evaluate readiness.
  // In a massive graph, Topological Sort is better, but since readiness only looks one level up,
  // iterating all nodes is perfectly safe and resolves O(N*E).
  
  for (const node of draftNodes) {
    node.data.status = calculateExpectedNodeStatus(node, draftNodes, draftEdges);
  }
};
