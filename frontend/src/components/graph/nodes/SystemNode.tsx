import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Server, 
  Database, 
  Layout, 
  Cloud, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Layers,
  Box,
  Play,
  ShieldAlert
} from 'lucide-react';
import { SystemNodeData, NodeType, NodeStatus } from '@/types/graph.types';
import { useStore } from '@/store';

const iconMap: Record<NodeType, any> = {
  frontend: Layout,
  backend: Server,
  api: Layers,
  database: Database,
  cache: Box,
  queue: Layers,
  deployment: Cloud,
};

const statusColors: Record<NodeStatus, string> = {
  pending: 'border-neutral-600 bg-neutral-800',
  ready: 'border-blue-400 bg-blue-900/30',
  in_progress: 'border-purple-500 bg-purple-900/30',
  done: 'border-emerald-500 bg-emerald-900/20',
  error: 'border-red-500 bg-red-900/20',
  blocked: 'border-orange-500 bg-orange-900/20',
};

const statusIcons: Record<NodeStatus, any> = {
  pending: <Clock size={16} className="text-neutral-400" />,
  ready: <Play size={16} className="text-blue-400" />,
  in_progress: <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />,
  done: <CheckCircle2 size={16} className="text-emerald-500" />,
  error: <AlertCircle size={16} className="text-red-500" />,
  blocked: <AlertCircle size={16} className="text-orange-500" />,
};

function SystemNode({ id, data, selected }: NodeProps<SystemNodeData>) {
  const updateNodeStatus = useStore(state => state.updateNodeStatus);
  const issues = useStore(state => state.issues.filter(i => i.nodeId === id));
  const hasError = issues.some(i => i.severity === 'ERROR');
  const hasWarning = issues.some(i => i.severity === 'WARNING');

  const Icon = iconMap[data.type] || Server;
  const statusClass = statusColors[data.status] || statusColors.pending;
  
  let selectionClass = selected ? 'ring-2 ring-white shadow-xl' : '';
  if (hasError) selectionClass += ' ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  else if (hasWarning) selectionClass += ' ring-2 ring-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]';

  const handleActionClick = () => {
    if (data.status === 'ready' || data.status === 'pending') {
      updateNodeStatus(id, 'in_progress');
    } else if (data.status === 'in_progress') {
      updateNodeStatus(id, 'done');
    } else if (data.status === 'done') {
      updateNodeStatus(id, 'pending');
    }
  };

  return (
    <div className={`px-4 py-3 rounded-xl border-2 w-[280px] transition-all duration-200 ${statusClass} ${selectionClass}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-neutral-500" />
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-neutral-700/50 p-1.5 rounded-md">
            <Icon size={16} className="text-neutral-300" />
          </div>
          <h3 className="font-semibold text-sm text-white">{data.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {issues.length > 0 && (
            <div className="group relative">
              <ShieldAlert size={16} className={hasError ? "text-red-500" : "text-orange-500"} />
              <div className="absolute right-0 top-6 w-64 bg-neutral-800 border border-neutral-700 rounded shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                {issues.map((issue, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <h4 className={`text-xs font-bold ${issue.severity === 'ERROR' ? 'text-red-400' : 'text-orange-400'}`}>
                      {issue.title}
                    </h4>
                    <p className="text-[10px] text-neutral-300 leading-tight mt-1">
                      {issue.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div 
            onClick={handleActionClick}
            className="cursor-pointer hover:bg-white/10 p-1 rounded transition-colors"
            title="Click to advance status"
          >
            {statusIcons[data.status]}
          </div>
        </div>
      </div>

      <div className="text-xs text-neutral-400 mb-3">{data.description}</div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded">
          <span className="text-neutral-500">Tech</span>
          <span className="font-mono text-blue-300">{data.technology}</span>
        </div>
        
        {data.errors && (
          <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-2 py-1.5 rounded border border-red-500/20">
            <AlertCircle size={12} />
            <span>{data.errors}</span>
          </div>
        )}
        
        {data.connectedApis && (
          <div className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded">
            <span className="text-neutral-500">API</span>
            <span className="font-mono text-purple-300 truncate w-32 text-right">{data.connectedApis}</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-neutral-500" />
    </div>
  );
}

export default memo(SystemNode);
