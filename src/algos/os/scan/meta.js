import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'scan',
  category: 'os-disk',
  label: "Disk SCAN",
  emoji: '🔃',
  difficulty: 'intermediate',
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  description: "The disk arm moves in one direction servicing requests until it reaches the end, then reverses. Like an elevator algorithm.",
  visualStyle: 'disk-sched',
  keyInsight: "Eliminates starvation and provides more uniform wait time than SSTF. Requests near the middle are served more frequently than those at the ends.",
  useCases: ['Hard disk drives', 'Enterprise storage', 'General-purpose OS'],
};
export default meta;

