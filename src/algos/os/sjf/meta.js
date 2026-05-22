import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'sjf',
  category: 'os',
  label: "SJF Scheduling",
  emoji: '⚡',
  difficulty: 'intermediate',
  preemptive: "Non-Preemptive",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "Selects the process with the smallest burst time. Minimizes average waiting time but requires knowing burst times in advance.",
  visualStyle: 'cpu-sched',
  keyInsight: "Mathematically optimal for minimizing average waiting time among non-preemptive algorithms, but can cause starvation for long processes.",
  useCases: ['Batch systems', 'Job scheduling', 'Systems with predictable burst times'],
};
export default meta;

