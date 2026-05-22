import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'srtf',
  category: 'os',
  label: "SRTF Scheduling",
  emoji: '🔄',
  difficulty: 'advanced',
  preemptive: "Preemptive",
  timeComplexity: { best: "O(n log n)", average: "O(n^2)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "Preemptive SJF. When a new process arrives with a shorter remaining time than the current process, the CPU preempts and switches.",
  visualStyle: 'cpu-sched',
  keyInsight: "Achieves optimal average waiting time among all preemptive algorithms. The running process is interrupted whenever a shorter job arrives.",
  useCases: ['Interactive systems', 'Real-time systems', 'Time-sharing OS'],
};
export default meta;

