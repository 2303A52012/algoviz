import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'sstf',
  category: 'os-disk',
  label: "Disk SSTF",
  emoji: '🎯',
  difficulty: 'intermediate',
  timeComplexity: { best: "O(n log n)", average: "O(n^2)", worst: "O(n^2)" },
  spaceComplexity: "O(n)",
  description: "Selects the pending request closest to the current head position. Reduces average seek time but can cause starvation.",
  visualStyle: 'disk-sched',
  keyInsight: "Greedy approach — always picks the nearest request. Risk of starvation for requests far from the current head position.",
  useCases: ['High-traffic disk systems', 'RAID controllers', 'Database storage'],
};
export default meta;

