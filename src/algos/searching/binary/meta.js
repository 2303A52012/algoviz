import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'binary', category: 'searching', label: 'Binary Search',
  emoji: '✂️',
  difficulty: 'beginner',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(1)',
  stable: null,
  description: 'On a sorted array, compares the target with the middle element. Eliminates half the search space each step.',
  visualStyle: 'range-shrink',
  keyInsight: 'Every comparison cuts the problem in half. 1 million elements needs at most 20 comparisons.',
  useCases: ['Sorted arrays', 'Dictionary lookup', 'Finding boundaries', 'Frequent searches'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
