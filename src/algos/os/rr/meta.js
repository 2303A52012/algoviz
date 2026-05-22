import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'rr',
  category: 'os',
  label: "Round Robin",
  emoji: '🔁',
  difficulty: 'intermediate',
  preemptive: "Preemptive",
  timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
  spaceComplexity: "O(n)",
  description: "Each process gets a fixed time quantum. After expiry the process moves to the back of the ready queue. Highly fair and responsive.",
  visualStyle: 'cpu-sched',
  keyInsight: "Quantum size is critical. Too small causes excessive context switches; too large degrades to FCFS. Balance between fairness and efficiency.",
  useCases: ['Time-sharing systems', 'Interactive OS', 'Multitasking environments'],
};
export default meta;

