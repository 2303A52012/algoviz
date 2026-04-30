import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'insertion', category: 'sorting', label: 'Insertion Sort',
  emoji: '🃏',
  difficulty: 'beginner',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description: 'Builds the sorted array one item at a time. Picks each element and inserts it into its correct position within the already-sorted portion.',
  visualStyle: 'bars-split',
  keyInsight: 'Very efficient for nearly sorted data — can be O(n) in the best case.',
  useCases: ['Nearly sorted arrays', 'Online sorting (stream)', 'Small datasets'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
