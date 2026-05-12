// Shared graph presets for BFS, DFS, Dijkstra & A*
// edges with optional weight: [nodeA, nodeB, weight?]
export const GRAPH_PRESETS = [
  {
    name: 'Classic',
    nodes: [
      { id: 'A', x: 100, y: 120 }, { id: 'B', x: 260, y: 50 },
      { id: 'C', x: 260, y: 190 }, { id: 'D', x: 420, y: 20 },
      { id: 'E', x: 420, y: 120 }, { id: 'F', x: 420, y: 220 },
      { id: 'G', x: 580, y: 60 },  { id: 'H', x: 580, y: 180 },
      { id: 'I', x: 740, y: 120 },
    ],
    edges: [['A','B',4],['A','C',2],['B','D',5],['B','E',3],['C','E',1],['C','F',6],
            ['D','G',2],['E','G',4],['E','H',3],['F','H',2],['G','I',3],['H','I',1]],
    start: 'A', end: 'I',
  },
  {
    name: 'Binary Tree',
    nodes: [
      { id: 'A', x: 420, y: 35 },
      { id: 'B', x: 230, y: 110 }, { id: 'C', x: 610, y: 110 },
      { id: 'D', x: 120, y: 195 }, { id: 'E', x: 330, y: 195 },
      { id: 'F', x: 520, y: 195 }, { id: 'G', x: 720, y: 195 },
    ],
    edges: [['A','B',3],['A','C',5],['B','D',2],['B','E',4],['C','F',1],['C','G',3],['D','E',6],['F','G',2]],
    start: 'A', end: 'G',
  },
  {
    name: 'Grid (3×3)',
    nodes: [
      { id: 'A', x: 120, y: 50 }, { id: 'B', x: 420, y: 50 }, { id: 'C', x: 720, y: 50 },
      { id: 'D', x: 120, y: 120 }, { id: 'E', x: 420, y: 120 }, { id: 'F', x: 720, y: 120 },
      { id: 'G', x: 120, y: 200 }, { id: 'H', x: 420, y: 200 }, { id: 'I', x: 720, y: 200 },
    ],
    edges: [['A','B',2],['B','C',3],['D','E',1],['E','F',4],['G','H',2],['H','I',1],
            ['A','D',3],['D','G',2],['B','E',1],['E','H',3],['C','F',2],['F','I',1],
            ['A','E',5],['E','I',4]],
    start: 'A', end: 'I',
  },
  {
    name: 'Dense Web',
    nodes: [
      { id: 'A', x: 80,  y: 120 }, { id: 'B', x: 230, y: 45 },
      { id: 'C', x: 420, y: 30 },  { id: 'D', x: 600, y: 70 },
      { id: 'E', x: 230, y: 200 }, { id: 'F', x: 420, y: 210 },
      { id: 'G', x: 600, y: 185 }, { id: 'H', x: 750, y: 120 },
    ],
    edges: [['A','B',3],['A','E',2],['B','C',4],['B','E',5],['B','F',2],['C','D',3],['C','F',1],
            ['D','G',4],['D','H',2],['E','F',3],['F','G',2],['G','H',1],['C','G',6],['B','D',7]],
    start: 'A', end: 'H',
  },
  {
    name: 'Winding Path',
    nodes: [
      { id: 'A', x: 80,  y: 120 }, { id: 'B', x: 200, y: 55 },
      { id: 'C', x: 310, y: 185 }, { id: 'D', x: 420, y: 55 },
      { id: 'E', x: 530, y: 185 }, { id: 'F', x: 640, y: 55 },
      { id: 'G', x: 750, y: 120 }, { id: 'H', x: 420, y: 120 },
    ],
    edges: [['A','B',2],['B','C',3],['C','D',4],['D','E',2],['E','F',3],['F','G',1],
            ['A','C',6],['B','D',5],['D','F',4],['E','G',2],['B','H',3],['D','H',1],['F','H',2],['H','G',3]],
    start: 'A', end: 'G',
  },
  {
    name: 'Wheel',
    nodes: [
      { id: 'G', x: 420, y: 120 },
      { id: 'A', x: 420, y: 30 },  { id: 'B', x: 560, y: 75 },
      { id: 'C', x: 560, y: 180 }, { id: 'D', x: 420, y: 215 },
      { id: 'E', x: 280, y: 180 }, { id: 'F', x: 280, y: 75 },
    ],
    edges: [['A','B',2],['B','C',3],['C','D',2],['D','E',3],['E','F',2],['F','A',3],
            ['G','A',1],['G','B',2],['G','C',2],['G','D',1],['G','E',2],['G','F',1],
            ['A','C',4],['B','D',5],['C','E',4],['D','F',5]],
    start: 'A', end: 'D',
  },
];

export function getRandomPreset() {
  return GRAPH_PRESETS[Math.floor(Math.random() * GRAPH_PRESETS.length)];
}

export function buildAdj(nodes, edges) {
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(([a, b, w = 1]) => {
    if (adj[a]) adj[a].push({ to: b, weight: w });
    if (adj[b]) adj[b].push({ to: a, weight: w });
  });
  return adj;
}

// Simple unweighted adjacency for BFS/DFS
export function buildAdjUnweighted(nodes, edges) {
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(([a, b]) => {
    if (adj[a]) adj[a].push(b);
    if (adj[b]) adj[b].push(a);
  });
  return adj;
}

export const NODE_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Euclidean distance heuristic for A* (straight-line)
export function euclidean(n1, n2) {
  return Math.round(Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2) / 50);
}
