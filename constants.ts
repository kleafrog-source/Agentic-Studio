import { AgentRole, MMSSMetric, Pattern } from './types';

export const INITIAL_METRICS: MMSSMetric[] = [
  { id: 'V', name: 'Solution Value', value: 0.9992, target: 0.999, formula: 'V = 1 - C_val / (G_S * R_T)' },
  { id: 'N', name: 'Structural Order', value: 0.9981, target: 0.998, formula: 'N = 1 - S' },
  { id: 'S', name: 'Workflow Entropy', value: 0.0012, target: 0.001, formula: 'S = -∑(p_i * log(p_i))' },
  { id: 'D_f', name: 'Fractal Complexity', value: 9.0003, target: 9.000, formula: 'D_f = lim(ε→0) log(N(ε))/log(1/ε)' },
];

export const AGENT_ROLES_DB: AgentRole[] = [
  {
    id: 'MMSS_ORCHESTRATOR',
    roleName: 'Root Orchestrator',
    description: 'Decomposes tasks, assigns sub-agents, manages global state.',
    runtime: 'Hybrid',
    defaultTools: ['schema_tool', 'metrics_tool', 'delegation_protocol'],
    patterns: ['PATTERN_ORCHESTRATOR_WORKERS', 'PATTERN_DELEGATION']
  },
  {
    id: 'MMSS_ARCHITECT',
    roleName: 'System Architect',
    description: 'Designs hierarchy, optimizes V/N/S/D_f metrics.',
    runtime: 'Gemini',
    defaultTools: ['design_tool', 'graph_tool', 'optimizer'],
    patterns: ['PATTERN_SPECIALIZATION', 'PATTERN_EVALUATOR_OPTIMIZER']
  },
  {
    id: 'INTERFACE_SYNTHESIS',
    roleName: 'Interface Synthesis Engine',
    description: 'Generates JSON-Schemas for inter-agent communication.',
    runtime: 'Gemini',
    defaultTools: ['schema_editor', 'validator'],
    patterns: ['PATTERN_CONTEXT_AUGMENTATION']
  },
  {
    id: 'MIXER_AGENT',
    roleName: 'Genetic Mixer',
    description: 'Applies crossover and mutation to agent configurations.',
    runtime: 'Mistral',
    defaultTools: ['mutation_engine', 'trait_equalizer'],
    patterns: ['PATTERN_PARALLELIZATION']
  },
  {
    id: 'WCAG_AUDITOR',
    roleName: 'WCAG & Compliance',
    description: 'Ensures accessibility and policy compliance.',
    runtime: 'Gemini',
    defaultTools: ['wcag_checker', 'ui_analyzer'],
    patterns: ['PATTERN_TOOL_SUITE_EXPERTS']
  },
  {
    id: 'DNA_INGESTION',
    roleName: 'DNA Ingestion Lab',
    description: 'Ingests external modules and data into the MMSS context.',
    runtime: 'Mistral',
    defaultTools: ['parser', 'vector_store'],
    patterns: ['PATTERN_ROUTING']
  }
];

export const PATTERNS_DB: Pattern[] = [
  {
    id: 'PATTERN_DELEGATION',
    name: 'Hierarchical Delegation',
    description: 'Root agent delegates subtasks to specialists.',
    constraints: ['Clear JSON contract', 'Handoff protocol']
  },
  {
    id: 'PATTERN_DEBATE',
    name: 'Multi-Agent Debate',
    description: 'Agents argue for different solutions, Judge decides.',
    constraints: ['Divergent prompts', 'Round limit']
  },
  {
    id: 'PATTERN_EVALUATOR_OPTIMIZER',
    name: 'Evaluator-Optimizer',
    description: 'Generator produces, Evaluator critiques, Generator refines.',
    constraints: ['Feedback loop limit', 'Metric-driven']
  },
  {
    id: 'PATTERN_ORCHESTRATOR_WORKERS',
    name: 'Orchestrator-Workers',
    description: 'Central node manages a dynamic pool of workers.',
    constraints: ['State centralization', 'Worker statelesness']
  }
];
