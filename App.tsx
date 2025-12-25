import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { INITIAL_METRICS, AGENT_ROLES_DB } from './constants';
import { AgentNodeData, Connection, MMSSMetric } from './types';
import { MetricDisplay } from './components/MetricDisplay';
import { PropertiesPanel } from './components/PropertiesPanel';
import { generateMMSSJson } from './services/mmssFactory';

function App() {
  const [activeTab, setActiveTab] = useState<'designer' | 'json' | 'settings'>('designer');
  const [metrics, setMetrics] = useState<MMSSMetric[]>(INITIAL_METRICS);
  const [objectiveFunction, setObjectiveFunction] = useState("J = Ψ(Quality, Robustness, Cost, Latency, Accessibility, Reusability)");
  
  // Graph State
  const [nodes, setNodes] = useState<AgentNodeData[]>([
    { 
      id: 'agent_root', 
      x: 300, 
      y: 100, 
      roleId: 'MMSS_ORCHESTRATOR', 
      customName: 'Main Brain',
      runtimeConfig: { model: 'gemini-3-pro-preview', temperature: 0.7 }
    },
    { 
      id: 'agent_arch', 
      x: 100, 
      y: 300, 
      roleId: 'MMSS_ARCHITECT', 
      runtimeConfig: { model: 'gemini-3-flash-preview', temperature: 0.2 }
    },
    { 
      id: 'agent_mixer', 
      x: 500, 
      y: 300, 
      roleId: 'MIXER_AGENT', 
      runtimeConfig: { model: 'mistral-large-latest', temperature: 0.9 }
    }
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', source: 'agent_root', target: 'agent_arch', type: 'delegation' },
    { id: 'c2', source: 'agent_root', target: 'agent_mixer', type: 'flow' }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Dragging State
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Node Management
  const handleAddNode = (roleId: string) => {
    const newNode: AgentNodeData = {
      id: `agent_${Date.now()}`,
      x: Math.random() * 400 + 100,
      y: Math.random() * 400 + 100,
      roleId,
      runtimeConfig: { model: 'gemini-3-flash-preview', temperature: 0.5 }
    };
    setNodes([...nodes, newNode]);
    // Small metric simulation
    setMetrics(prev => prev.map(m => 
      m.id === 'D_f' ? { ...m, value: m.value + 0.001 } : m
    ));
  };

  const handleUpdateNode = (id: string, data: Partial<AgentNodeData>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.source !== id && c.target !== id));
    setSelectedNodeId(null);
  };

  // Interaction Handlers
  const onMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === id);
    if (node && svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        setOffset({
          x: (e.clientX - CTM.e) / CTM.a - node.x,
          y: (e.clientY - CTM.f) / CTM.d - node.y
        });
        setDraggingNode(id);
        setSelectedNodeId(id);
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      e.preventDefault();
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        const x = (e.clientX - CTM.e) / CTM.a - offset.x;
        const y = (e.clientY - CTM.f) / CTM.d - offset.y;
        setNodes(nodes.map(n => n.id === draggingNode ? { ...n, x, y } : n));
      }
    }
  };

  const onMouseUp = () => {
    setDraggingNode(null);
  };

  // JSON Generation
  const jsonOutput = useMemo(() => {
    return generateMMSSJson(nodes, connections, objectiveFunction);
  }, [nodes, connections, objectiveFunction]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonOutput, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mmss_agentic_pipeline.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col h-screen bg-mmss-dark text-mmss-text font-sans overflow-hidden">
      
      {/* Header */}
      <header className="h-16 border-b border-mmss-border flex items-center justify-between px-6 bg-mmss-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-mmss-purple to-mmss-accent flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MMSS <span className="text-mmss-accent">AGENTIC</span> STUDIO</h1>
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">Meta-Synthesis System v1.0</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <nav className="flex bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('designer')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'designer' ? 'bg-mmss-purple text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Orchestrator UI
            </button>
            <button 
               onClick={() => setActiveTab('json')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'json' ? 'bg-mmss-purple text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              JSON Source
            </button>
            <button 
               onClick={() => setActiveTab('settings')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-mmss-purple text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Settings
            </button>
          </nav>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-mmss-accent/10 text-mmss-accent border border-mmss-accent/50 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-mmss-accent/20 transition-colors"
          >
            EXPORT MMSS
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Toolbox) - Only visible in Designer */}
        {activeTab === 'designer' && (
          <aside className="w-64 bg-mmss-panel border-r border-mmss-border flex flex-col">
            <div className="p-4 border-b border-mmss-border">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Constructor Palette</h2>
              <div className="space-y-2">
                {AGENT_ROLES_DB.map(role => (
                  <div 
                    key={role.id}
                    onClick={() => handleAddNode(role.id)}
                    className="p-3 bg-slate-800 border border-slate-700 rounded cursor-pointer hover:border-mmss-accent hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
                  >
                    <div className="text-xs font-bold text-gray-200 group-hover:text-mmss-accent">{role.roleName}</div>
                    <div className="text-[10px] text-gray-500 mt-1 truncate">{role.runtime}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 p-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Metrics Context</h2>
               <div className="text-[10px] text-gray-500 leading-relaxed">
                  Optimizing for Fractal Dimension (D_f) ~ 9.0 and Semantic Value (V) > 0.999.
               </div>
            </div>
          </aside>
        )}

        {/* Center Canvas / Content */}
        <main className="flex-1 bg-[#0b1120] relative flex flex-col overflow-hidden">
          
          {/* Top Bar Metrics */}
          <div className="p-4 bg-[#0b1120]/90 backdrop-blur z-10 border-b border-mmss-border/50">
            <MetricDisplay metrics={metrics} />
          </div>

          {activeTab === 'designer' ? (
            <div className="flex-1 relative overflow-hidden cursor-crosshair" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ 
                     backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                   }} 
              />
              
              <svg ref={svgRef} className="w-full h-full absolute inset-0">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                
                {/* Connections */}
                {connections.map(conn => {
                  const source = nodes.find(n => n.id === conn.source);
                  const target = nodes.find(n => n.id === conn.target);
                  if (!source || !target) return null;
                  
                  return (
                    <g key={conn.id}>
                      <line 
                        x1={source.x + 60} y1={source.y + 30} 
                        x2={target.x + 60} y2={target.y + 30} 
                        stroke="#475569" strokeWidth="2" 
                        markerEnd="url(#arrowhead)" 
                      />
                      <circle cx={(source.x+target.x)/2 + 60} cy={(source.y+target.y)/2 + 30} r="3" fill="#8b5cf6" />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                  const isSelected = selectedNodeId === node.id;
                  const role = AGENT_ROLES_DB.find(r => r.id === node.roleId);
                  const isGemini = node.runtimeConfig.model.includes('gemini');
                  
                  return (
                    <g 
                      key={node.id} 
                      transform={`translate(${node.x},${node.y})`}
                      onMouseDown={(e) => onMouseDown(e, node.id)}
                      className="cursor-move"
                      onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                    >
                      {/* Node Body */}
                      <rect 
                        width="120" height="60" rx="6" 
                        fill="#1e293b" 
                        stroke={isSelected ? '#06b6d4' : (isGemini ? '#8b5cf6' : '#f59e0b')} 
                        strokeWidth={isSelected ? 2 : 1}
                        className="transition-colors duration-200"
                      />
                      
                      {/* Header bar */}
                      <rect width="120" height="20" rx="6" fill={isGemini ? '#8b5cf6' : '#f59e0b'} fillOpacity="0.2" />
                      
                      {/* Text */}
                      <text x="60" y="14" textAnchor="middle" fill={isGemini ? '#c4b5fd' : '#fcd34d'} fontSize="9" fontWeight="bold" fontFamily="monospace">
                        {role?.roleName}
                      </text>
                      <text x="60" y="38" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                        {node.customName}
                      </text>
                      <text x="60" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                        {node.runtimeConfig.model.split('-')[0]}
                      </text>

                      {/* Ports */}
                      <circle cx="60" cy="0" r="4" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                      <circle cx="60" cy="60" r="4" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : activeTab === 'json' ? (
             <div className="flex-1 overflow-auto p-6">
                <div className="bg-slate-900 rounded-lg border border-mmss-border p-4 shadow-xl">
                  <pre className="text-xs font-mono text-cyan-400 overflow-x-auto">
                    {JSON.stringify(jsonOutput, null, 2)}
                  </pre>
                </div>
             </div>
          ) : (
            <div className="flex-1 p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-mmss-accent">Global Objective Function</h2>
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Primary Objective Formula (J)</label>
                    <textarea 
                      value={objectiveFunction}
                      onChange={(e) => setObjectiveFunction(e.target.value)}
                      className="w-full h-32 bg-slate-800 border border-mmss-border rounded p-4 text-gray-200 font-mono focus:border-mmss-accent focus:outline-none"
                    />
                 </div>
                 <div className="p-4 bg-slate-800/50 rounded border border-mmss-border">
                    <h3 className="text-mmss-purple font-bold mb-2">API Configuration</h3>
                    <p className="text-xs text-gray-500 mb-4">Keys are loaded from process.env.API_KEY. Configure specific endpoints here if using custom proxies.</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="opacity-50">
                          <label className="text-xs">Google AI Studio Endpoint</label>
                          <input disabled value="https://generativelanguage.googleapis.com" className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-xs text-gray-500" />
                       </div>
                       <div className="opacity-50">
                          <label className="text-xs">Mistral API Endpoint</label>
                          <input disabled value="https://api.mistral.ai/v1/agents" className="w-full bg-slate-900 border border-gray-700 rounded p-2 text-xs text-gray-500" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar (Properties) - Only visible in Designer */}
        {activeTab === 'designer' && (
           <PropertiesPanel 
             selectedNodeId={selectedNodeId} 
             nodes={nodes} 
             onUpdateNode={handleUpdateNode}
             onDeleteNode={handleDeleteNode}
           />
        )}

      </div>
    </div>
  );
}

export default App;
