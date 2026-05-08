const meta = {
  id: 'avl',
  category: 'ds',
  label: 'AVL Tree',
  emoji: '⚖️',
  difficulty: 'advanced',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  stable: false,
  description: 'A self-balancing Binary Search Tree where the heights of the two child subtrees of any node differ by at most one. Uses rotations to maintain balance.',
  useCases: ['Databases', 'In-memory sorted sets', 'Fast predictable lookups'],
  operations: ['Insert', 'Left/Right Rotations'],
};
export default meta;
