const meta = {
  id: 'dfs', category: 'graph', label: 'Depth-First Search',
  emoji: '🕳️',
  difficulty: 'intermediate',
  timeComplexity: { best: 'O(1)', average: 'O(V+E)', worst: 'O(V+E)' },
  spaceComplexity: 'O(V)',
  stable: null,
  description: 'Explores as far as possible along each branch before backtracking. Uses a stack (or recursion). Does not guarantee shortest path.',
  visualStyle: 'grid-snake',
  keyInsight: 'DFS commits to a direction and goes all the way. Useful for maze generation, cycle detection, topological sort.',
  useCases: ['Cycle detection', 'Topological sort', 'Maze solving', 'Connected components'],
};
export default meta;
