import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'bubble', category: 'sorting', label: 'Bubble Sort',
  emoji: '🫧',
  difficulty: 'beginner',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Largest elements bubble to the end each pass.',
  visualStyle: 'bars',
  keyInsight: 'After each full pass, the next largest element is guaranteed to be in its correct position at the end.',
  useCases: ['Educational purposes', 'Nearly sorted arrays', 'Very small datasets'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
