import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'linear', category: 'searching', label: 'Linear Search',
  emoji: '🔦',
  difficulty: 'beginner',
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  stable: null,
  description: 'Scans every element from left to right until the target is found or the array ends. Works on any array — sorted or unsorted.',
  visualStyle: 'scanner',
  keyInsight: 'Simple but slow. Best used when data is unsorted or when you only need to search once.',
  useCases: ['Unsorted data', 'Linked lists', 'Small datasets', 'One-time search'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
