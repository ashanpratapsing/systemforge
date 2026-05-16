import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Server, Database, Layout, Cloud, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const iconMap: Record<string, any> = {
  frontend: Layout,
  backend: Server,
  database: Database,
  devops: Cloud,
};

const statusColors: Record<string, string> = {
  pending: 'border-neutral-600 bg-neutral-800',
  in_progress: 'border-blue-500 bg-blue-900/20',
  done: 'border-emerald-500 bg-emerald-900/20',
  error: 'border-red-500 bg-red-900/20',
  blocked: 'border-orange-500 bg-orange-900/20',
};

const statusIcons: Record<string, any> = {
  pending: <Clock size={16} className="text-neutral-400" />,
  in_progress: <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />,
  done: <CheckCircle2 size={16} className="text-emerald-500" />,
  error: <AlertCircle size={16} className="text-red-500" />,
  blocked: <AlertCircle size={16} className="text-orange-500" />,
};

function WorkflowNode({ data }: { data: any }) {
  const Icon = iconMap[data.type] || Server;
  const statusClass = statusColors[data.status] || statusColors.pending;

  return (
    <div className={`px-4 py-3 rounded-xl border-2 w-[280px] shadow-lg transition-colors ${statusClass}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-neutral-500" />
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-neutral-700/50 p-1.5 rounded-md">
            <Icon size={16} className="text-neutral-300" />
          </div>
          <h3 className="font-semibold text-sm">{data.title}</h3>
        </div>
        <div>
          {statusIcons[data.status]}
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

export default memo(WorkflowNode);
