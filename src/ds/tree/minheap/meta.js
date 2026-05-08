const meta = {
  id: 'minheap',
  category: 'ds',
  label: 'Min-Heap',
  emoji: '⬇️',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  stable: false,
  description: 'A complete binary tree usually implemented as an array. In a Min-Heap, the parent is strictly smaller than its children, meaning the smallest element is always at the root.',
  useCases: ["Dijkstra's Algorithm", 'Priority Queues', 'Event-Driven Simulation'],
  operations: ['Insert', 'Extract Min'],
};
export default meta;
