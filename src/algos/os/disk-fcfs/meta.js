import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'disk-fcfs',
  category: 'os-disk',
  label: "Disk FCFS",
  emoji: '💾',
  difficulty: 'beginner',
  timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
  spaceComplexity: "O(1)",
  description: "Services disk requests in the order they arrive. Simple but can result in excessive head movement across the disk.",
  visualStyle: 'disk-sched',
  keyInsight: "Fair and simple — each request is served in arrival order. Does not optimize seek time, so the disk head may make large jumps back and forth.",
  useCases: ['Simple disk controllers', 'Low-traffic systems', 'Educational use'],
};
export default meta;

