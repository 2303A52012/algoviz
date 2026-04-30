import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'merge', category: 'sorting', label: 'Merge Sort',
  emoji: '🌳',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  description: 'Divide and conquer. Recursively splits the array in half until single elements remain, then merges sorted halves back together.',
  visualStyle: 'tree',
  keyInsight: 'The split phase builds a binary call tree. The merge phase climbs back up combining sorted pieces.',
  useCases: ['Large datasets', 'Linked lists', 'External sorting', 'Stable sort required'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
