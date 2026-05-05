const meta = {
  id: 'interpolation', category: 'searching', label: 'Interpolation Search',
  emoji: '📐',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  stable: null,
  description: 'Like binary search, but computes the probable position of the target using interpolation formula, not always the midpoint.',
  visualStyle: 'probe',
  keyInsight: 'Formula: probe = lo + (target - arr[lo]) / (arr[hi] - arr[lo]) * (hi - lo). Best when data is uniformly distributed.',
  useCases: ['Uniformly distributed sorted data', 'Phone books', 'Numeric ranges'],
};
export default meta;
