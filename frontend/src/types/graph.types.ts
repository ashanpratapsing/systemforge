import type { Node, Edge } from '@xyflow/react';

export type NodeType = 'frontend' | 'backend' | 'api' | 'database' | 'cache' | 'queue' | 'deployment';
export type NodeStatus = 'pending' | 'ready' | 'in_progress' | 'done' | 'error' | 'blocked';
export type EdgeType = 'dependency' | 'execution' | 'api' | 'infrastructure' | 'deployment';
export type EdgeValidationState = 'valid' | 'invalid' | 'warning';

export interface SystemNodeData extends Record<string, unknown> {
  title: string;
  description: string;
  type: NodeType;
  status: NodeStatus;
  technology: string;
  connectedApis?: string;
  errors?: string;
  metadata?: Record<string, any>;
}

export interface SystemEdgeData extends Record<string, unknown> {
  type: EdgeType;
  validationState: EdgeValidationState;
  metadata?: Record<string, any>;
}

export type SystemNode = Node<SystemNodeData>;
export type SystemEdge = Edge<SystemEdgeData>;
