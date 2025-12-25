import { AgentNodeData, Connection, MMSSSchema } from '../types';
import { AGENT_ROLES_DB, PATTERNS_DB, INITIAL_METRICS } from '../constants';

export const generateMMSSJson = (
  nodes: AgentNodeData[],
  connections: Connection[],
  objectiveFunction: string
): MMSSSchema => {
  
  // 1. Construct AGENT_ROLES
  const agentRoles: Record<string, any> = {};
  nodes.forEach(node => {
    const roleDef = AGENT_ROLES_DB.find(r => r.id === node.roleId);
    agentRoles[node.id] = {
      role_ref: node.roleId,
      custom_name: node.customName || roleDef?.roleName,
      runtime: node.runtimeConfig.model.includes('gemini') ? 'Gemini' : 'Mistral',
      model_id: node.runtimeConfig.model,
      temperature: node.runtimeConfig.temperature,
      tools: roleDef?.defaultTools || [],
      patterns_used: roleDef?.patterns || []
    };
  });

  // 2. Pattern Library
  const patternLib: Record<string, any> = {};
  PATTERNS_DB.forEach(p => {
    patternLib[p.id] = {
      name: p.name,
      constraints: p.constraints,
      flow_type: 'standard_mmss_v1'
    };
  });

  // 3. Orchestration Graph
  const graph = {
    nodes: nodes.map(n => n.id),
    edges: connections.map(c => ({
      from: c.source,
      to: c.target,
      type: c.type,
      protocol: 'JSON-RPC/MCP'
    })),
    topology: 'Graph/Hierarchical'
  };

  // 4. Runtime Bindings
  const bindings: Record<string, any> = {
    GOOGLE_AI_STUDIO: {
      agents: nodes.filter(n => n.runtimeConfig.model.includes('gemini')).map(n => n.id),
      api_endpoint: 'https://generativelanguage.googleapis.com'
    },
    MISTRAL_AGENTS_API: {
      agents: nodes.filter(n => !n.runtimeConfig.model.includes('gemini')).map(n => n.id),
      api_endpoint: 'https://api.mistral.ai/v1/agents'
    }
  };

  return {
    AGENT_ROLES: agentRoles,
    PATTERN_LIBRARY: patternLib,
    ORCHESTRATION_GRAPH: graph,
    RUNTIME_BINDINGS: bindings,
    UI_LAYOUT: {
      panels: ['Orchestrator', 'Architect', 'Metric_Dashboard'],
      theme: 'MMSS_Dark_Cybernetics'
    },
    METRIC_AND_OBJECTIVE_LAYER: {
      objective_function: objectiveFunction,
      current_metrics: INITIAL_METRICS.reduce((acc, m) => ({...acc, [m.id]: m.value}), {})
    }
  };
};
