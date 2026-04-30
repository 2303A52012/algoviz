import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'heap', category: 'sorting', label: 'Heap Sort',
  emoji: '🏔️',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(1)',
  stable: false,
  description: 'Converts the array into a max-heap, then repeatedly extracts the maximum element and places it at the end.',
  visualStyle: 'heap-tree',
  keyInsight: 'The array itself represents the binary heap — index i has children at 2i+1 and 2i+2.',
  useCases: ['Guaranteed O(n log n)', 'In-place with no extra memory', 'Priority queues'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
