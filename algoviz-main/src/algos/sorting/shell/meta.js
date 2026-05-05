const meta = {
  id: 'shell', category: 'sorting', label: 'Shell Sort',
  emoji: '🐚',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(n log n)', average: 'O(n^1.5)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  description: 'An extension of insertion sort that compares elements far apart first, then reduces the gap. Allows elements to move to their position faster.',
  visualStyle: 'bars-gap',
  keyInsight: 'Gap sequence determines performance. Common choice: n/2, n/4, ..., 1.',
  useCases: ['Medium datasets', 'Embedded systems', 'When memory is limited'],
};
export default meta;
