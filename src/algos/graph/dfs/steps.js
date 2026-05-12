import { GRAPH_PRESETS, buildAdjUnweighted as buildAdj } from '../graphPresets';

export { GRAPH_PRESETS };
export const DEFAULT_PRESET = GRAPH_PRESETS[0];

export function generateSteps(nodes, edges, startNode, endNode) {
  const adj = buildAdj(nodes, edges);
  const steps = [];
  const visited = new Set();
  const stack = [startNode];
  const parent = {};
  const visitedSeq = [];

  steps.push({
    type: 'init', current: null, stack: [startNode],
    visitedSet: new Set(), visitedSeq: [],
    activeEdge: null, path: [], done: false,
    msg: `DFS starts at "${startNode}". Push it onto stack. DFS dives deep before backtracking.`,
  });

  while (stack.length > 0) {
    const cur = stack.pop();
    if (visited.has(cur)) continue;
    visited.add(cur);
    visitedSeq.push(cur);

    if (cur === endNode) {
      const path = [];
      let node = endNode;
      while (node !== undefined) { path.unshift(node); node = parent[node]; }
      steps.push({
        type: 'found', current: cur, stack: [...stack],
        visitedSet: new Set(visited), visitedSeq: [...visitedSeq],
        activeEdge: parent[cur] ? [parent[cur], cur] : null, path, done: true,
        msg: `✓ Reached "${endNode}"! DFS path: ${path.join(' → ')}. Note: DFS does NOT guarantee shortest path!`,
      });
      return steps;
    }

    const unvisited = (adj[cur] || []).filter(n => !visited.has(n));
    for (let i = unvisited.length - 1; i >= 0; i--) {
      const nbr = unvisited[i];
      if (!parent[nbr]) parent[nbr] = cur;
      stack.push(nbr);
    }

    steps.push({
      type: 'visit', current: cur, stack: [...stack],
      visitedSet: new Set(visited), visitedSeq: [...visitedSeq],
      activeEdge: parent[cur] ? [parent[cur], cur] : null, path: [], done: false,
      msg: `Popped "${cur}". Pushed unvisited: [${unvisited.join(', ') || '—'}]. Stack: [${stack.join(', ') || 'empty'}].`,
    });
  }

  steps.push({
    type: 'not-found', current: null, stack: [],
    visitedSet: new Set(visited), visitedSeq: [...visitedSeq],
    activeEdge: null, path: [], done: true,
    msg: `✗ No path from "${startNode}" to "${endNode}". DFS exhausted all options.`,
  });
  return steps;
}