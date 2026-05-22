import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'priority',
  category: 'os',
  label: "Priority Scheduling",
  emoji: '🏆',
  difficulty: 'intermediate',
  preemptive: "Non-Preemptive",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "The CPU always executes the highest priority available process. Lower number = higher priority. Non-preemptive variant.",
  visualStyle: 'cpu-sched',
  keyInsight: "Higher priority processes always run first. Can cause starvation — low-priority processes may never execute if high-priority ones keep arriving.",
  useCases: ['Real-time systems', 'OS kernels', 'Embedded systems'],
};
export default meta;

