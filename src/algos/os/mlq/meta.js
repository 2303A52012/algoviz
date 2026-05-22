import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'mlq',
  category: 'os',
  label: "Multilevel Queue",
  emoji: '📊',
  difficulty: 'advanced',
  preemptive: "Mixed",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "Partitions the ready queue into multiple queues by priority. Each queue has its own algorithm. High-priority queues always served first.",
  visualStyle: 'cpu-sched',
  keyInsight: "Processes are permanently assigned to a queue. System processes in Q0 (Round Robin) always preempt interactive processes in lower queues.",
  useCases: ['Unix/Linux OS', 'Kernel process management', 'Mixed workload systems'],
};
export default meta;

