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
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'delegation' | 'flow' | 'feedback';
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  constraints: string[];
}

export interface MMSSSchema {
  AGENT_ROLES: Record<string, any>;
  PATTERN_LIBRARY: Record<string, any>;
  ORCHESTRATION_GRAPH: {
    nodes: any[];
    edges: any[];
  };
  RUNTIME_BINDINGS: Record<string, any>;
  UI_LAYOUT: any;
  METRIC_AND_OBJECTIVE_LAYER: any;
}
