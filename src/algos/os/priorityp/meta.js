import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'priorityp',
  category: 'os',
  label: "Priority (Preemptive)",
  emoji: '⚠️',
  difficulty: 'advanced',
  preemptive: "Preemptive",
  timeComplexity: { best: "O(n log n)", average: "O(n^2)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "Preemptive Priority Scheduling. A newly arrived higher-priority process immediately preempts the currently running process.",
  visualStyle: 'cpu-sched',
  keyInsight: "Aging technique prevents starvation — gradually increasing priority of waiting processes ensures they eventually execute.",
  useCases: ['Real-time OS', 'Safety-critical systems', 'Kernel scheduling'],
};
export default meta;

