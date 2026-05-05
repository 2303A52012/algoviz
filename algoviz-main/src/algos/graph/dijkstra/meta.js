const meta = {
  id: 'dijkstra', category: 'graph', label: 'Dijkstra\'s Algorithm',
  emoji: '🗺️',
  difficulty: 'advanced',
  timeComplexity: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)' },
  spaceComplexity: 'O(V)',
  stable: null,
  description: 'Finds shortest path from source to all nodes in a weighted graph. Uses a priority queue to always process the lowest-cost node next.',
  visualStyle: 'grid-distance',
  keyInsight: 'Greedy approach: once a node is finalized its shortest distance never changes. Requires non-negative edge weights.',
  useCases: ['GPS navigation', 'Network routing', 'Weighted shortest path', 'Maps'],
};
export default meta;
