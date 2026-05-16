import React from 'react';
import { 
  Server, 
  Database, 
  Layout, 
  Cloud, 
  Layers,
  Box
} from 'lucide-react';
import { NodeType, SystemNodeData } from '@/types/graph.types';

interface SidebarItemProps {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  defaultData: Partial<SystemNodeData>;
}

const nodeTypes: SidebarItemProps[] = [
  {
    type: 'frontend',
    label: 'Frontend UI',
    icon: <Layout size={18} />,
    defaultData: { technology: 'React/Next.js', status: 'pending' },
  },
  {
    type: 'api',
    label: 'API Gateway',
    icon: <Layers size={18} />,
    defaultData: { technology: 'Spring Cloud Gateway', status: 'pending' },
  },
  {
    type: 'backend',
    label: 'Microservice',
    icon: <Server size={18} />,
    defaultData: { technology: 'Spring Boot', status: 'pending' },
  },
  {
    type: 'database',
    label: 'Database',
    icon: <Database size={18} />,
    defaultData: { technology: 'PostgreSQL', status: 'pending' },
  },
  {
    type: 'cache',
    label: 'Cache',
    icon: <Box size={18} />,
    defaultData: { technology: 'Redis', status: 'pending' },
  },
  {
    type: 'queue',
    label: 'Message Queue',
    icon: <Layers size={18} />,
    defaultData: { technology: 'Kafka', status: 'pending' },
  },
  {
    type: 'deployment',
    label: 'Deployment',
    icon: <Cloud size={18} />,
    defaultData: { technology: 'Kubernetes', status: 'pending' },
  },
];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: SidebarItemProps) => {
    // Stringify the initial data payload to transfer it via the drag event
    const payload = JSON.stringify({
      type: nodeType.type,
      title: `New ${nodeType.label}`,
      description: `Description for ${nodeType.label}`,
      ...nodeType.defaultData
    });
    event.dataTransfer.setData('application/reactflow', payload);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-900 p-4 flex flex-col gap-4 overflow-y-auto z-10">
      <div>
        <h2 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">Node Palette</h2>
        <p className="text-xs text-neutral-500 mb-4">Drag nodes onto the canvas to build your architecture.</p>
      </div>

      <div className="flex flex-col gap-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-700 cursor-grab active:cursor-grabbing transition-colors"
            onDragStart={(event) => onDragStart(event, node)}
            draggable
          >
            <div className="text-neutral-400">
              {node.icon}
            </div>
            <span className="text-sm font-medium text-neutral-200">{node.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
