const meta = {
  id: 'maxheap',
  category: 'ds',
  label: 'Max-Heap',
  emoji: '⬆️',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  stable: false,
  description: 'A complete binary tree usually implemented as an array. In a Max-Heap, the parent is strictly larger than its children, meaning the largest element is always at the root.',
  useCases: ['Priority Queues', 'Heap Sort', 'Kth Largest Element'],
  operations: ['Insert', 'Extract Max'],
};
export default meta;
