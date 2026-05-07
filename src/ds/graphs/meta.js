// Graphs DS Category Metadata
export default {
  id: 'graphs',
  category: 'ds',
  label: 'Graphs',
  emoji: '⬡',
  difficulty: 'advanced',
  description: 'Non-hierarchical data with nodes and edges (directed/undirected)',
  status: 'under-construction',
  complexities: {
    'Traversal': 'O(V + E)',
    'Shortest Path': 'O(V²) - O(V log V)',
    'Minimum Spanning Tree': 'O(E log V)',
    'Topological Sort': 'O(V + E)',
  },
  operations: [
    'Breadth-First Search',
    'Depth-First Search',
    'Dijkstra\'s Algorithm',
    'A* Algorithm',
    'Kruskal\'s Algorithm',
    'Prim\'s Algorithm',
  ],
  useCases: [
    'Social networks',
    'GPS navigation',
    'Network routing',
    'Recommendation systems',
    'Web crawling',
    'Game pathfinding',
  ],
};
