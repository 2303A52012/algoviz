const meta = {
  id: 'counting', category: 'sorting', label: 'Counting Sort',
  emoji: '🔢',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
  spaceComplexity: 'O(k)',
  stable: true,
  description: 'Counts occurrences of each value, then reconstructs the sorted array. Not a comparison sort — works on integers in a known range.',
  visualStyle: 'buckets',
  keyInsight: 'k is the range of input values. Fast when k is small relative to n.',
  useCases: ['Integer data with small range', 'Radix sort subroutine', 'Counting frequencies'],
};
export default meta;
