"use client";

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStore } from '@/store';
import SystemNode from '@/components/graph/nodes/SystemNode';
import SystemEdge from '@/components/graph/edges/SystemEdge';
import { SystemNodeData } from '@/types/graph.types';
import Sidebar from './Sidebar';
import { isValidSystemConnection } from './utils/connectionRules';

const nodeTypes = {
  system: SystemNode,
};

const edgeTypes = {
  system: SystemEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function CanvasWrapper() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const payloadString = event.dataTransfer.getData('application/reactflow');

      if (!payloadString || !reactFlowBounds) {
        return;
      }

      let payloadData: Partial<SystemNodeData>;
      try {
        payloadData = JSON.parse(payloadString);
      } catch (e) {
        console.error("Failed to parse dropped node data", e);
        return;
      }

      // Calculate the drop position relative to the React Flow pane
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: 'system',
        position,
        data: payloadData as SystemNodeData,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          isValidConnection={isValidSystemConnection}
          onDragOver={onDragOver}
          onDrop={onDrop}
          colorMode="dark"
          fitView
          className="bg-neutral-950"
        >
          <Background color="#333" gap={16} />
          <Controls className="bg-neutral-800 border-neutral-700 fill-white" />
          <MiniMap 
            nodeColor={(node) => {
              const status = (node.data as SystemNodeData).status;
              switch (status) {
                case 'done': return '#10b981';
                case 'in_progress': return '#3b82f6';
                case 'error': return '#ef4444';
                case 'blocked': return '#f97316';
                default: return '#525252';
              }
            }}
            maskColor="rgba(0,0,0,0.7)"
            className="bg-neutral-900 border-neutral-800"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasWrapper />
    </ReactFlowProvider>
  );
}
