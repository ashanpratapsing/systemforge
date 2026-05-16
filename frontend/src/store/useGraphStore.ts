import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { SystemNode, SystemEdge } from '../types/graph.types';

export interface GraphState {
  nodes: SystemNode[];
  edges: SystemEdge[];
  onNodesChange: OnNodesChange<SystemNode>;
  onEdgesChange: OnEdgesChange<SystemEdge>;
  onConnect: OnConnect;
  addNode: (node: SystemNode) => void;
  setNodes: (nodes: SystemNode[]) => void;
  setEdges: (edges: SystemEdge[]) => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange<SystemNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange<SystemEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
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
    
    set({
      edges: addEdge(newEdge, get().edges),
    });
  },
  addNode: (node: SystemNode) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  setNodes: (nodes: SystemNode[]) => {
    set({ nodes });
  },
  setEdges: (edges: SystemEdge[]) => {
    set({ edges });
  },
}));
