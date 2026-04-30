import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'quick', category: 'sorting', label: 'Quick Sort',
  emoji: '⚡',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  spaceComplexity: 'O(log n)',
  stable: false,
  description: 'Picks a pivot element and partitions the array so all smaller elements go left and all larger go right. Recursively sorts each partition.',
  visualStyle: 'partition',
  keyInsight: 'Pivot choice matters — middle element avoids worst-case on already-sorted data.',
  useCases: ['General purpose sorting', 'In-place sorting', 'Cache-friendly access'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
