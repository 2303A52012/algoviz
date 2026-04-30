import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'radix', category: 'sorting', label: 'Radix Sort',
  emoji: '🔡',
  difficulty: 'advanced',
  timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
  spaceComplexity: 'O(n+k)',
  stable: true,
  description: 'Sorts digit by digit from least significant to most significant using a stable sort (counting sort) at each digit position.',
  visualStyle: 'digit-buckets',
  keyInsight: 'k is the number of digits. For 3-digit numbers, needs only 3 passes — each O(n).',
  useCases: ['Fixed-length integers', 'Strings of same length', 'When O(nk) < O(n log n)'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
