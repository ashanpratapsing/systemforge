import { StateCreator } from 'zustand';
import { NodeChange, EdgeChange, Connection, Edge } from '@xyflow/react';
import { SystemNode, SystemEdge } from '@/types/graph.types';
import { ValidationIssue } from '@/api/validationApi';

export interface GraphSlice {
  nodes: SystemNode[];
  edges: SystemEdge[];
  onNodesChange: (changes: NodeChange<SystemNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<SystemEdge>[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  addNode: (node: SystemNode) => void;
  updateNodeStatus: (id: string, status: SystemNode['data']['status']) => void;
  setNodes: (nodes: SystemNode[]) => void;
  setEdges: (edges: SystemEdge[]) => void;
  saveWorkflowToServer: (projectId: string) => Promise<void>;
  loadWorkflowFromServer: (projectId: string) => Promise<void>;
}

export interface UiSlice {
  selectedNodeId: string | null;
  isSidebarOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
  setSelectedNodeId: (id: string | null) => void;
  toggleSidebar: () => void;
  setSaving: (saving: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export interface WorkflowSlice {
  isSimulating: boolean;
  simulationStep: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  nextSimulationStep: () => void;
export interface ValidationSlice {
  issues: ValidationIssue[];
  isValidating: boolean;
  runValidation: () => Promise<void>;
  clearValidation: () => void;
export interface CollaborationSlice {
  isConnected: boolean;
  connectToProject: (projectId: string) => void;
  disconnectFromProject: () => void;
  receivePatch: (patch: any) => void; // Using any for type simplicity in MVP
}

export type StoreState = GraphSlice & UiSlice & WorkflowSlice & ValidationSlice & CollaborationSlice;

export type StoreSlice<T> = StateCreator<
  StoreState,
  [['zustand/immer', never]],
  [],
  T
>;
