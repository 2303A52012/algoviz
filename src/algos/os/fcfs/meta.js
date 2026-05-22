import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'fcfs',
  category: 'os',
  label: "FCFS Scheduling",
  emoji: '📋',
  difficulty: 'beginner',
  preemptive: "Non-Preemptive",
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  description: "Simplest scheduling algorithm. Processes execute in the order they arrive. Non-preemptive — once a process starts, it runs to completion.",
  visualStyle: 'cpu-sched',
  keyInsight: "The first process always runs first. Simple and fair but can cause the convoy effect where short processes wait behind long ones.",
  useCases: ['Batch systems', 'Print spoolers', 'Simple OS environments'],
};
export default meta;

