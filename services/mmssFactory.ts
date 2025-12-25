import { AgentNodeData, Connection, MMSSSchema, GlobalSettings } from '../types';
import { AGENT_ROLES_DB, PATTERNS_DB, INITIAL_METRICS } from '../constants';

export const generateMMSSJson = (
  nodes: AgentNodeData[],
  connections: Connection[],
  settings: GlobalSettings,
  currentMetrics: Record<string, number>
): MMSSSchema => {
  
  // 1. AGENT_ROLES
  const agentRoles: Record<string, any> = {};
  AGENT_ROLES_DB.forEach(role => {
    agentRoles[role.id] = {
      id: role.id,
      display_name: role.roleName,
      description: role.description,
      default_runtime: role.runtime === 'Gemini' ? 'Google_ADK' : 'Mistral_API',
      allowed_patterns: role.patterns,
      suggested_tools: role.defaultTools
    };
  });

  // 2. PATTERN_LIBRARY
  const patternLib: Record<string, any> = {};
  PATTERNS_DB.forEach(p => {
    patternLib[p.id] = {
      id: p.id,
      name: p.name,
      description: p.description,
      coordination_type: p.coordinationType,
      constraints: p.constraints,
      applicable_roles: AGENT_ROLES_DB.filter(r => r.patterns.includes(p.id)).map(r => r.id),
      typical_flows: ["sequential", "hierarchical"]
    };
  });

  // 3. ORCHESTRATION_GRAPH_TEMPLATE
  const graphTemplate = {
    nodes: nodes.map(n => {
      const roleDef = AGENT_ROLES_DB.find(r => r.id === n.roleId);
      return {
        id: n.id,
        role_ref: n.roleId,
        instance_name: n.customName || roleDef?.roleName,
        runtime_config: {
          runtime: n.runtimeConfig.model.includes('gemini') ? 'Google_ADK' : 'Mistral_API',
          model: n.runtimeConfig.model,
          temperature: n.runtimeConfig.temperature,
          tools: n.tools || roleDef?.defaultTools || []
        },
        position: { x: n.x, y: n.y }
      };
    }),
    edges: connections.map(c => ({
      from: c.source,
      to: c.target,
      type: c.type,
      protocol: 'JSON-RPC/MCP'
    })),
    allowed_edge_types: ["sequential", "parallel", "conditional", "loop", "handoff"]
  };

  // 4. RUNTIME_BINDINGS_TEMPLATE
  const geminiNodes = nodes.filter(n => n.runtimeConfig.model.includes('gemini'));
  const mistralNodes = nodes.filter(n => !n.runtimeConfig.model.includes('gemini'));

  const bindings = {
    GOOGLE_ADK_CONFIG: {
        project_id: "${GOOGLE_CLOUD_PROJECT}",
        location: "us-central1",
        agents: geminiNodes.map(n => ({
            display_name: n.customName,
            model_id: n.runtimeConfig.model,
            instructions: `You are a ${n.roleId}. ${AGENT_ROLES_DB.find(r => r.id === n.roleId)?.description}`,
            tools: AGENT_ROLES_DB.find(r => r.id === n.roleId)?.defaultTools
        }))
    },
    MISTRAL_AGENTS_CONFIG: {
        agents: mistralNodes.map(n => ({
            name: (n.customName || "agent").replace(/\s+/g, '_').toLowerCase(),
            description: AGENT_ROLES_DB.find(r => r.id === n.roleId)?.description,
            model: n.runtimeConfig.model,
            temperature: n.runtimeConfig.temperature,
            instructions: `You are a ${n.roleId}.`,
            tools: AGENT_ROLES_DB.find(r => r.id === n.roleId)?.defaultTools
        })),
        handoffs: connections.filter(c => c.type === 'handoff').map(c => ({
            from_agent: nodes.find(n => n.id === c.source)?.customName,
            to_agent: nodes.find(n => n.id === c.target)?.customName
        }))
    }
  };

  // 5. UI_LAYOUT_MODEL
  const uiLayout = {
    panels: [
        {
            id: "orchestrator_panel",
            title: "Orchestrator Panel",
            description: "Edit root agent and global pipeline settings",
            bound_data_paths: ["ORCHESTRATION_GRAPH_TEMPLATE.nodes[role_ref='MMSS_ORCHESTRATOR']"]
        },
        {
            id: "architect_panel",
            title: "Architect Panel",
            description: "Module hierarchy viewer",
            bound_data_paths: ["ORCHESTRATION_GRAPH_TEMPLATE"]
        },
        {
            id: "constructor_panel",
            title: "Constructor Panel",
            description: "Visual graph editor",
            bound_data_paths: ["ORCHESTRATION_GRAPH_TEMPLATE"]
        },
        {
            id: "pattern_library_panel",
            title: "Pattern Library",
            description: "Drag and drop patterns",
            bound_data_paths: ["PATTERN_LIBRARY"]
        },
        {
            id: "node_vault_panel",
            title: "Node Vault Panel",
            description: "Saved MMSS modules",
            bound_data_paths: ["AGENT_ROLES"]
        },
        {
            id: "ingestion_lab_panel",
            title: "Ingestion Lab",
            description: "Data ingestion configuration",
            bound_data_paths: ["RUNTIME_BINDINGS_TEMPLATE"]
        },
        {
            id: "wcag_audit_panel",
            title: "WCAG Audit Panel",
            description: "Accessibility compliance reports",
            bound_data_paths: ["METRIC_AND_OBJECTIVE_MODEL.metrics.accessibility"]
        },
        {
            id: "settings_panel",
            title: "Settings Panel",
            description: "Global objective function and parameters",
            bound_data_paths: ["METRIC_AND_OBJECTIVE_MODEL"]
        }
    ]
  };

  // 6. METRIC_AND_OBJECTIVE_MODEL
  const metricModel = {
    metrics: {
        V: { description: "Solution Value", current: currentMetrics['V'] },
        N: { description: "Structural Order", current: currentMetrics['N'] },
        S: { description: "Workflow Entropy", current: currentMetrics['S'] },
        D_f: { description: "Fractal Complexity", current: currentMetrics['D_f'] }
    },
    objective_function: settings.objectiveFunction,
    extra_settings: {
        semantic_injection: settings.semanticInjection,
        prompt_influence: settings.promptInfluence,
        current_formulas: INITIAL_METRICS.reduce((acc, m) => ({...acc, [m.id]: m.formula}), {})
    }
  };

  return {
    AGENT_ROLES: agentRoles,
    PATTERN_LIBRARY: patternLib,
    ORCHESTRATION_GRAPH_TEMPLATE: graphTemplate,
    RUNTIME_BINDINGS_TEMPLATE: bindings,
    UI_LAYOUT_MODEL: uiLayout,
    METRIC_AND_OBJECTIVE_MODEL: metricModel
  };
};