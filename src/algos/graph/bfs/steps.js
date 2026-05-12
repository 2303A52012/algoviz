import { GRAPH_PRESETS, buildAdjUnweighted as buildAdj } from '../graphPresets';

export { GRAPH_PRESETS };
export const DEFAULT_PRESET = GRAPH_PRESETS[0];

export function generateSteps(nodes, edges, startNode, endNode) {
  const adj = buildAdj(nodes, edges);
  const steps = [];
  const visited = new Set();
  const queue = [startNode];
  const parent = {};
  const visitedSeq = [];

  visited.add(startNode);

  steps.push({
    type: 'init', current: null, queue: [startNode],
    visitedSet: new Set([startNode]), visitedSeq: [],
    activeEdge: null, path: [], done: false,
    msg: `BFS starts at "${startNode}". Enqueue it. BFS explores all neighbours level by level.`,
  });

  while (queue.length > 0) {
    const cur = queue.shift();

    if (cur === endNode) {
      const path = [];
      let node = endNode;
      while (node) { path.unshift(node); node = parent[node]; }
      visitedSeq.push(cur);
      steps.push({
        type: 'found', current: cur, queue: [],
        visitedSet: new Set(visited), visitedSeq: [...visitedSeq],
        activeEdge: parent[cur] ? [parent[cur], cur] : null, path, done: true,
        msg: `✓ Reached "${endNode}"! Shortest path: ${path.join(' → ')} (${path.length - 1} edges). BFS guarantees shortest path in unweighted graphs.`,
      });
      return steps;
    }

    visitedSeq.push(cur);
    const newNeighbors = [];
    for (const nbr of (adj[cur] || [])) {
      if (!visited.has(nbr)) {
        visited.add(nbr);
        parent[nbr] = cur;
        queue.push(nbr);
        newNeighbors.push(nbr);
      }
    }

    steps.push({
      type: 'visit', current: cur, queue: [...queue],
      visitedSet: new Set(visited), visitedSeq: [...visitedSeq],
      activeEdge: parent[cur] ? [parent[cur], cur] : null, path: [], done: false,
      msg: `Dequeued "${cur}". Enqueued neighbours: [${newNeighbors.join(', ') || '—'}]. Queue: [${queue.join(', ') || 'empty'}].`,
    });
  }

  steps.push({
    type: 'not-found', current: null, queue: [],
    visitedSet: new Set(visited), visitedSeq: [...visitedSeq],
    activeEdge: null, path: [], done: true,
    msg: `✗ No path from "${startNode}" to "${endNode}". All reachable nodes visited.`,
  });
  return steps;
}