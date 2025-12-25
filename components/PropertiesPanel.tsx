import React from 'react';
import { AgentNodeData, AgentRole } from '../types';
import { AGENT_ROLES_DB } from '../constants';

interface PropertiesPanelProps {
  selectedNodeId: string | null;
  nodes: AgentNodeData[];
  onUpdateNode: (id: string, data: Partial<AgentNodeData>) => void;
  onDeleteNode: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNodeId, nodes, onUpdateNode, onDeleteNode }) => {
  const node = nodes.find(n => n.id === selectedNodeId);
  
  if (!node) {
    return (
      <div className="w-80 border-l border-mmss-border bg-mmss-panel p-4 flex flex-col items-center justify-center text-gray-500">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <p className="text-sm">Select an agent node to configure its MMSS DNA.</p>
      </div>
    );
  }

  const roleDef = AGENT_ROLES_DB.find(r => r.id === node.roleId);

  return (
    <div className="w-80 border-l border-mmss-border bg-mmss-panel flex flex-col h-full">
      <div className="p-4 border-b border-mmss-border">
        <h2 className="text-lg font-bold text-mmss-accent font-mono">Agent Properties</h2>
        <div className="text-xs text-gray-500 font-mono mt-1">ID: {node.id}</div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-gray-400 font-bold">Role Assignment</label>
          <select 
            className="w-full bg-slate-800 border border-mmss-border rounded p-2 text-sm text-gray-200 focus:border-mmss-accent focus:outline-none"
            value={node.roleId}
            onChange={(e) => onUpdateNode(node.id, { roleId: e.target.value })}
          >
            {AGENT_ROLES_DB.map(r => (
              <option key={r.id} value={r.id}>{r.roleName}</option>
            ))}
          </select>
          <div className="text-xs text-gray-500 italic p-2 bg-slate-900/50 rounded border border-slate-800">
            {roleDef?.description}
          </div>
        </div>

        {/* Custom Name */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-gray-400 font-bold">Instance Name</label>
          <input 
            type="text"
            className="w-full bg-slate-800 border border-mmss-border rounded p-2 text-sm text-gray-200 focus:border-mmss-accent focus:outline-none"
            value={node.customName || ''}
            placeholder={roleDef?.roleName}
            onChange={(e) => onUpdateNode(node.id, { customName: e.target.value })}
          />
        </div>

        {/* Runtime Config */}
        <div className="space-y-4 border-t border-mmss-border pt-4">
          <label className="text-xs uppercase text-mmss-purple font-bold">Runtime Binding</label>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Model ID</label>
            <select 
              className="w-full bg-slate-800 border border-mmss-border rounded p-2 text-sm text-gray-200 focus:border-mmss-accent focus:outline-none"
              value={node.runtimeConfig.model}
              onChange={(e) => onUpdateNode(node.id, { 
                runtimeConfig: { ...node.runtimeConfig, model: e.target.value }
              })}
            >
              <optgroup label="Google AI Studio (Gemini)">
                <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
                <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
                <option value="gemini-2.5-flash-latest">gemini-2.5-flash-latest</option>
              </optgroup>
              <optgroup label="Mistral Agents API">
                <option value="mistral-large-latest">mistral-large-latest</option>
                <option value="mistral-medium-latest">mistral-medium-latest</option>
                <option value="pixtral-12b-2409">pixtral-12b</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400">Temperature: {node.runtimeConfig.temperature}</label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full accent-mmss-accent"
              value={node.runtimeConfig.temperature}
              onChange={(e) => onUpdateNode(node.id, { 
                runtimeConfig: { ...node.runtimeConfig, temperature: parseFloat(e.target.value) }
              })}
            />
          </div>
        </div>

        {/* Patterns */}
        <div className="space-y-2 border-t border-mmss-border pt-4">
          <label className="text-xs uppercase text-gray-400 font-bold">Applied Patterns</label>
          <div className="flex flex-wrap gap-2">
            {roleDef?.patterns.map(p => (
              <span key={p} className="text-[10px] bg-mmss-purple/20 text-mmss-purple border border-mmss-purple/40 px-2 py-1 rounded">
                {p.replace('PATTERN_', '')}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-mmss-border bg-slate-900/50">
        <button 
          onClick={() => onDeleteNode(node.id)}
          className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-bold py-2 px-4 rounded border border-red-900/50 transition-colors"
        >
          DELETE NODE
        </button>
      </div>
    </div>
  );
};