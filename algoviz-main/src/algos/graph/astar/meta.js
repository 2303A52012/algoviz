const meta = {
  id: 'astar', category: 'graph', label: 'A* Search',
  emoji: '⭐',
  difficulty: 'advanced',
  timeComplexity: { best: 'O(1)', average: 'O(E)', worst: 'O(V²)' },
  spaceComplexity: 'O(V)',
  stable: null,
  description: 'Like Dijkstra but uses a heuristic to guide the search toward the goal. f(n) = g(n) + h(n) where g = cost so far, h = estimated cost to goal.',
  visualStyle: 'grid-heuristic',
  keyInsight: 'Manhattan distance heuristic: h = |row - goalRow| + |col - goalCol|. This guides A* to explore toward the goal first.',
  useCases: ['Game pathfinding', 'GPS routing', 'Robot navigation', 'Puzzle solving'],
};
export default meta;
