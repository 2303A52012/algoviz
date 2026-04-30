import { CODE_SNIPPETS } from './code';

const meta = {
  id: 'jump', category: 'searching', label: 'Jump Search',
  emoji: '🦘',
  difficulty: 'beginner',
  timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
  spaceComplexity: 'O(1)',
  stable: null,
  description: 'Jumps ahead by √n steps to find the block containing the target, then does a linear scan within that block.',
  visualStyle: 'jump-blocks',
  keyInsight: 'Optimal block size is √n — balances the number of jumps and the linear scan within each block.',
  useCases: ['Sorted arrays', 'When backward traversal is costly', 'Disk/tape storage'],
  codeSnippets: CODE_SNIPPETS,
};
export default meta;
