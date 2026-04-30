import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'selection', category: 'sorting', label: 'Selection Sort',
  emoji: '🎯',
  difficulty: 'beginner',
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  description: 'Divides the array into a sorted and unsorted region. Repeatedly selects the minimum from the unsorted region and moves it to the end of the sorted region.',
  visualStyle: 'bars-sweep',
  keyInsight: 'Makes exactly n-1 swaps — useful when write operations are expensive.',
  useCases: ['When swaps are costly', 'Small datasets', 'Memory-constrained systems'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
