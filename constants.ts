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
    defaultTools: ['delegation_protocol', 'state_manager'],
    patterns: ['PATTERN_ORCHESTRATOR_WORKERS', 'PATTERN_DELEGATION']
  },
  {
    id: 'MMSS_ARCHITECT',
    roleName: 'System Architect',
    description: 'Designs hierarchy, optimizes V/N/S/D_f metrics.',
    runtime: 'Gemini',
    defaultTools: ['design_tool', 'optimizer'],
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
    id: 'GENETIC_MIXER',
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
    id: 'COMPLIANCE_AGENT',
    roleName: 'Auto-compliance & Cloning',
    description: 'Enforces regulatory standards and clones successful nodes.',
    runtime: 'Mistral',
    defaultTools: ['policy_enforcer', 'cloning_vat'],
    patterns: ['PATTERN_EVALUATOR_OPTIMIZER']
  },
  {
    id: 'DNA_INGESTION',
    roleName: 'DNA Ingestion Lab',
    description: 'Ingests external modules and data into the MMSS context.',
    runtime: 'Mistral',
    defaultTools: ['parser', 'vector_store'],
    patterns: ['PATTERN_ROUTING']
  },
  {
    id: 'NODE_VAULT',
    roleName: 'Node Vault Agent',
    description: 'Manages repository of saved agent states and modules.',
    runtime: 'Mistral',
    defaultTools: ['db_connector', 'version_control'],
    patterns: ['PATTERN_ROUTING']
  },
  {
    id: 'SEQUENCER_AGENT',
    roleName: '4D Sequencer',
    description: 'Manages temporal execution and dependencies.',
    runtime: 'Gemini',
    defaultTools: ['scheduler', 'timeline_manager'],
    patterns: ['PATTERN_ORCHESTRATOR_WORKERS']
  },
  {
    id: 'MUTATION_AGENT',
    roleName: 'Mutation Stream',
    description: 'Injects controlled randomness into agent prompts.',
    runtime: 'Gemini',
    defaultTools: ['randomizer', 'prompt_injector'],
    patterns: ['PATTERN_PARALLELIZATION']
  },
  {
    id: 'THEME_INJECTOR',
    roleName: 'Theme Injector',
    description: 'Applies semantic themes and styles across the pipeline.',
    runtime: 'Gemini',
    defaultTools: ['style_guide', 'theme_api'],
    patterns: ['PATTERN_CONTEXT_AUGMENTATION']
  },
  {
    id: 'GLOBAL_RECODE',
    roleName: 'Global DNA Recode',
    description: 'Refactors entire pipeline structure based on performance.',
    runtime: 'Gemini',
    defaultTools: ['refactor_engine', 'meta_analyzer'],
    patterns: ['PATTERN_EVALUATOR_OPTIMIZER']
  }
];

export const PATTERNS_DB: Pattern[] = [
  {
    id: 'PATTERN_DELEGATION',
    name: 'Hierarchical Delegation',
    description: 'Root agent delegates subtasks to specialists.',
    constraints: ['Clear JSON contract', 'Handoff protocol'],
    coordinationType: 'delegation'
  },
  {
    id: 'PATTERN_DEBATE',
    name: 'Multi-Agent Debate',
    description: 'Agents argue for different solutions, Judge decides.',
    constraints: ['Divergent prompts', 'Round limit'],
    coordinationType: 'debate'
  },
  {
    id: 'PATTERN_EVALUATOR_OPTIMIZER',
    name: 'Evaluator-Optimizer',
    description: 'Generator produces, Evaluator critiques, Generator refines.',
    constraints: ['Feedback loop limit', 'Metric-driven'],
    coordinationType: 'evaluator_optimizer'
  },
  {
    id: 'PATTERN_ORCHESTRATOR_WORKERS',
    name: 'Orchestrator-Workers',
    description: 'Central node manages a dynamic pool of workers.',
    constraints: ['State centralization', 'Worker statelesness'],
    coordinationType: 'orchestrator_workers'
  },
  {
    id: 'PATTERN_PARALLELIZATION',
    name: 'Parallel Execution',
    description: 'Multiple agents work on subtasks simultaneously.',
    constraints: ['Independence', 'Aggregation step'],
    coordinationType: 'parallel'
  },
  {
    id: 'PATTERN_ROUTING',
    name: 'Intelligent Routing',
    description: 'Router agent classifies input and directs to specific handler.',
    constraints: ['Classification accuracy', 'Route map'],
    coordinationType: 'routing'
  }
];
