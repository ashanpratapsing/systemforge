"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Save, Loader2, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import WorkflowCanvas from '@/components/graph/WorkflowCanvas';
import { useStore } from '@/store';

export default function CanvasPage({ params }: { params: { id: string } }) {
  const { 
    loadWorkflowFromServer, saveWorkflowToServer, isSaving, isLoading, 
    isValidating, runValidation, clearValidation, 
    connectToProject, disconnectFromProject, isConnected 
  } = useStore();

  useEffect(() => {
    // Phase 2 Persistence Testing: Re-enabling REST API loading
    // Attempt to load the graph state on mount
    loadWorkflowFromServer(params.id);
    
    // Connect to real-time collaboration
    // connectToProject(params.id);

    return () => {
      // disconnectFromProject();
    };
  }, [params.id, loadWorkflowFromServer, connectToProject, disconnectFromProject]);

  const handleSave = () => {
    saveWorkflowToServer(params.id);
  };

  const handleValidate = () => {
    clearValidation();
    runValidation();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-900">
      <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-900/80 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-4 w-[1px] bg-neutral-700" />
          <h1 className="font-semibold text-sm">Project {params.id} Canvas</h1>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Loader2 size={12} className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-2 px-2 py-1 bg-neutral-800 rounded-md border border-neutral-700">
            {isConnected ? (
              <>
                <Wifi size={12} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400/80 font-medium tracking-wide">LIVE</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide">OFFLINE</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleValidate}
            disabled={isValidating || isLoading}
            className="flex items-center gap-2 text-xs font-medium bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 px-3 py-1.5 rounded border border-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            Validate Architecture
          </button>
          <button className="flex items-center gap-2 text-xs font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-1.5 rounded border border-emerald-500/20 transition-colors">
            <Play size={14} />
            Simulate Flow
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 text-xs font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded border border-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save State'}
          </button>
        </div>
      </header>
      
      <div className="flex-1 relative overflow-hidden">
        <WorkflowCanvas />
      </div>
    </div>
  );
}
