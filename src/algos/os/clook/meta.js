import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'clook',
  category: 'os-disk',
  label: "Disk C-LOOK",
  emoji: '🔁',
  difficulty: 'advanced',
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  description: "Circular LOOK — after the last request in one direction, the arm jumps to the first request in the opposite direction.",
  visualStyle: 'disk-sched',
  keyInsight: "Combines best of C-SCAN and LOOK. Circular movement plus no wasted travel to disk ends. Most uniform wait time of all disk scheduling algorithms.",
  useCases: ['High-performance storage', 'Enterprise SAN', 'NVMe SSDs'],
};
export default meta;

