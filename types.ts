export type RuntimeType = 'Gemini' | 'Mistral' | 'Hybrid';

export interface MMSSMetric {
  id: 'V' | 'N' | 'S' | 'D_f';
  name: string;
  value: number;
  target: number;
  formula: string;
}

export interface AgentRole {
  id: string;
  roleName: string;
  description: string;
  runtime: RuntimeType;
  defaultTools: string[];
  patterns: string[];
}

export interface AgentNodeData {
  id: string;
  x: number;
  y: number;
  roleId: string;
  customName?: string;
  runtimeConfig: {
    model: string;
    temperature: number;
  };
  tools?: string[];
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'delegation' | 'flow' | 'feedback' | 'handoff' | 'conditional' | 'loop';
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  constraints: string[];
  coordinationType: 'delegation' | 'parallel' | 'debate' | 'routing' | 'orchestrator_workers' | 'evaluator_optimizer';
}

export interface GlobalSettings {
  objectiveFunction: string;
  semanticInjection: string;
  promptInfluence: {
    prompt: number;
    tools: number;
    schema: number;
  };
}

export interface MMSSSchema {
  AGENT_ROLES: Record<string, any>;
  PATTERN_LIBRARY: Record<string, any>;
  ORCHESTRATION_GRAPH_TEMPLATE: {
    nodes: any[];
    edges: any[];
    allowed_edge_types: string[];
  };
  RUNTIME_BINDINGS_TEMPLATE: {
    GOOGLE_ADK_CONFIG: any;
    MISTRAL_AGENTS_CONFIG: any;
  };
  UI_LAYOUT_MODEL: any;
  METRIC_AND_OBJECTIVE_MODEL: any;
}
