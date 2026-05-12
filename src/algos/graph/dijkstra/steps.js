// ===== DIJKSTRA STEP GENERATOR — Weighted Node Graph =====
import { GRAPH_PRESETS, buildAdj, euclidean } from '../graphPresets';

export { GRAPH_PRESETS };
export const DEFAULT_PRESET = GRAPH_PRESETS[0];

export function generateSteps(nodes, edges, startNode, endNode) {
  const adj = buildAdj(nodes, edges);
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const steps = [];
  const dist   = {};  // shortest known distance from start
  const parent = {};
  const visited = new Set();

  nodes.forEach(n => { dist[n.id] = Infinity; });
  dist[startNode] = 0;

  // Priority queue: array of { id, d } sorted by d
  let pq = [{ id: startNode, d: 0 }];
  const inQueue = new Set([startNode]);

  steps.push({
    type: 'init', current: null, pq: [...pq],
    visitedSet: new Set(), inQueue: new Set(inQueue),
    dist: { ...dist }, parent: {}, path: [], activeEdge: null, done: false,
    msg: `Dijkstra starts at "${startNode}". dist[${startNode}]=0, all others=∞. Priority queue initialized.`,
  });

  while (pq.length > 0) {
    // Extract min
    pq.sort((a, b) => a.d - b.d);
    const { id: cur, d: curDist } = pq.shift();
    inQueue.delete(cur);

    if (visited.has(cur)) continue;
    visited.add(cur);

    if (cur === endNode) {
      const path = [];
      let node = endNode;
      while (node) { path.unshift(node); node = parent[node]; }
      steps.push({
        type: 'found', current: cur, pq: [],
        visitedSet: new Set(visited), inQueue: new Set(inQueue),
        dist: { ...dist }, parent: { ...parent }, path, activeEdge: null, done: true,
        msg: `✓ Reached "${endNode}"! Shortest path: ${path.join(' → ')} with total cost ${dist[endNode]}. Dijkstra guarantees this is optimal.`,
      });
      return steps;
    }

    const relaxed = [];
    for (const { to, weight } of (adj[cur] || [])) {
      if (visited.has(to)) continue;
      const newDist = curDist + weight;
      if (newDist < dist[to]) {
        dist[to] = newDist;
        parent[to] = cur;
        pq.push({ id: to, d: newDist });
        inQueue.add(to);
        relaxed.push(`${to}(${newDist})`);
      }
    }

    steps.push({
      type: 'visit', current: cur, pq: [...pq],
      visitedSet: new Set(visited), inQueue: new Set(inQueue),
      dist: { ...dist }, parent: { ...parent }, path: [], 
      activeEdge: parent[cur] ? [parent[cur], cur] : null, done: false,
      msg: `Settled "${cur}" (dist=${curDist}). Relaxed edges → [${relaxed.join(', ') || '—'}]. PQ size: ${pq.length}.`,
    });
  }

  steps.push({
    type: 'not-found', current: null, pq: [],
    visitedSet: new Set(visited), inQueue: new Set(inQueue),
    dist: { ...dist }, parent: { ...parent }, path: [], activeEdge: null, done: true,
    msg: `✗ No path from "${startNode}" to "${endNode}".`,
  });
  return steps;
}
