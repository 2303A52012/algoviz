import { CODE_SNIPPETS } from './code';
﻿const meta = {
  codeSnippets: CODE_SNIPPETS,
  id: 'cscan',
  category: 'os-disk',
  label: "Disk C-SCAN",
  emoji: '🔄',
  difficulty: 'intermediate',
  timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
  spaceComplexity: "O(n)",
  description: "Like SCAN but after reaching one end the head jumps back to the beginning without servicing requests on the return trip.",
  visualStyle: 'disk-sched',
  keyInsight: "Circular SCAN treats the disk as circular. Wait time is more uniform — no process waits for a full sweep in both directions.",
  useCases: ['Modern disk controllers', 'NVMe drives', 'High-performance storage'],
};
export default meta;

