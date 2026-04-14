const meta = {
  id: 'ternary', category: 'searching', label: 'Ternary Search',
  emoji: '🔱',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(log₃ n)', worst: 'O(log₃ n)' },
  spaceComplexity: 'O(1)',
  stable: null,
  description: 'Divides the sorted array into three parts using two midpoints. Eliminates one-third of the array each step.',
  visualStyle: 'three-zones',
  keyInsight: 'Uses more comparisons per step than binary search (2 vs 1), so binary search is generally preferred.',
  useCases: ['Sorted arrays', 'Finding max of unimodal functions', 'Academic study'],
};
export default meta;
