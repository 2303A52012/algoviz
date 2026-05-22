import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'look',
  category: 'os-disk',
  label: "Disk LOOK",
  emoji: '👁️',
  difficulty: 'intermediate',
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  description: "Like SCAN but the arm only goes as far as the last request in each direction, then reverses. No wasted travel to disk ends.",
  visualStyle: 'disk-sched',
  keyInsight: "More efficient than SCAN — the arm turns around at the last request rather than at the physical end of the disk.",
  useCases: ['Optimized disk controllers', 'SSD firmware', 'Storage arrays'],
};
export default meta;

