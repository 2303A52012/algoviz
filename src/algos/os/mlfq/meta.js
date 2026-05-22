import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'mlfq',
  category: 'os',
  label: "Multilevel Feedback Queue",
  emoji: '🔀',
  difficulty: 'advanced',
  preemptive: "Preemptive",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "Processes can move between queues. New processes start at the highest priority; if they use their full quantum, they are demoted.",
  visualStyle: 'cpu-sched',
  keyInsight: "Adapts to process behavior. CPU-bound processes get demoted while I/O-bound ones stay at high priority. Used in most modern operating systems.",
  useCases: ['Windows NT', 'Linux scheduling', 'Modern desktop OS'],
};
export default meta;

