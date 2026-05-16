import { memo } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { SystemEdgeData, EdgeValidationState } from '@/types/graph.types';
import { AlertCircle } from 'lucide-react';

const validationColors: Record<EdgeValidationState, string> = {
  valid: '#52525b', // neutral-600
  warning: '#f59e0b', // amber-500
  invalid: '#ef4444', // red-500
};

function SystemEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}: EdgeProps<SystemEdgeData>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const validationState = data?.validationState || 'valid';
  const color = selected ? '#3b82f6' : validationColors[validationState];
  const strokeWidth = selected ? 3 : 2;

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: color,
          strokeWidth,
          animation: data?.type === 'execution' ? 'dashdraw 0.5s linear infinite' : 'none',
          strokeDasharray: data?.type === 'execution' ? '5,5' : 'none'
        }} 
      />
      
      {validationState === 'invalid' && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-red-950 border border-red-500 text-red-400 p-1 rounded-full shadow-lg flex items-center justify-center">
              <AlertCircle size={14} />
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
      
      {data?.type === 'dependency' && validationState === 'valid' && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
          >
            <div className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded border border-neutral-700 shadow-sm font-medium uppercase tracking-wider">
              Depends On
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(SystemEdge);
