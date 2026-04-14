const meta = {
  id: 'bfs', category: 'graph', label: 'Breadth-First Search',
  emoji: '🌊',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(V+E)', worst: 'O(V+E)' },
  spaceComplexity: 'O(V)',
  stable: null,
  description: 'Explores all neighbors at the current depth before moving deeper. Uses a queue. Guarantees shortest path in unweighted graphs.',
  visualStyle: 'grid-wave',
  keyInsight: 'BFS explores level by level — all nodes at distance 1, then distance 2, etc. This is why it finds shortest path.',
  useCases: ['Shortest path (unweighted)', 'Level-order traversal', 'Social network distance', 'Puzzle solving'],
};
export default meta;
