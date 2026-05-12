// ===== A* STEP GENERATOR — Weighted Node Graph =====
import { GRAPH_PRESETS, buildAdj, euclidean } from '../graphPresets';

export { GRAPH_PRESETS };
export const DEFAULT_PRESET = GRAPH_PRESETS[0];

export function generateSteps(nodes, edges, startNode, endNode) {
  const adj = buildAdj(nodes, edges);
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const endNode_ = nodeMap[endNode];

  // Heuristic: euclidean distance scaled by 50 (same unit as edge weights)
  const h = (id) => {
    const n = nodeMap[id];
    if (!n || !endNode_) return 0;
    return Math.round(Math.sqrt((n.x - endNode_.x) ** 2 + (n.y - endNode_.y) ** 2) / 50);
  };

  const steps = [];
  const gScore = {}; // cost from start
  const fScore = {}; // g + h
  const parent = {};
  const closed = new Set();  // settled nodes

  nodes.forEach(n => { gScore[n.id] = Infinity; fScore[n.id] = Infinity; });
  gScore[startNode] = 0;
  fScore[startNode] = h(startNode);

  let openSet = [{ id: startNode, f: fScore[startNode], g: 0, hv: h(startNode) }];
  const inOpen = new Set([startNode]);

  steps.push({
    type: 'init', current: null, openSet: [...openSet],
    closedSet: new Set(), inOpen: new Set(inOpen),
    gScore: { ...gScore }, fScore: { ...fScore },
    hScore: Object.fromEntries(nodes.map(n => [n.id, h(n.id)])),
    path: [], activeEdge: null, done: false,
    msg: `A* starts at "${startNode}". h(${startNode})=${h(startNode)}. f=g+h prioritizes nodes closest to goal.`,
  });

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f !== b.f ? a.f - b.f : a.hv - b.hv);
    const best = openSet.shift();
    const cur = best.id;
    inOpen.delete(cur);

    if (closed.has(cur)) continue;
    closed.add(cur);

    if (cur === endNode) {
      const path = [];
      let node = endNode;
      while (node) { path.unshift(node); node = parent[node]; }
      steps.push({
        type: 'found', current: cur, openSet: [],
        closedSet: new Set(closed), inOpen: new Set(inOpen),
        gScore: { ...gScore }, fScore: { ...fScore },
        hScore: Object.fromEntries(nodes.map(n => [n.id, h(n.id)])),
        path, activeEdge: null, done: true,
        msg: `✓ Reached "${endNode}"! Path: ${path.join(' → ')} | g=${gScore[endNode]} (actual cost). A* is optimal with an admissible heuristic.`,
      });
      return steps;
    }

    const relaxed = [];
    for (const { to, weight } of (adj[cur] || [])) {
      if (closed.has(to)) continue;
      const tentativeG = gScore[cur] + weight;
      if (tentativeG < gScore[to]) {
        gScore[to] = tentativeG;
        fScore[to] = tentativeG + h(to);
        parent[to] = cur;
        openSet.push({ id: to, f: fScore[to], g: tentativeG, hv: h(to) });
        inOpen.add(to);
        relaxed.push(`${to}(g=${tentativeG},h=${h(to)},f=${fScore[to]})`);
      }
    }

    steps.push({
      type: 'visit', current: cur, openSet: [...openSet],
      closedSet: new Set(closed), inOpen: new Set(inOpen),
      gScore: { ...gScore }, fScore: { ...fScore },
      hScore: Object.fromEntries(nodes.map(n => [n.id, h(n.id)])),
      path: [], activeEdge: parent[cur] ? [parent[cur], cur] : null, done: false,
      msg: `Settled "${cur}" (g=${gScore[cur]}, h=${h(cur)}, f=${fScore[cur]}). Updated: [${relaxed.join(' | ') || '—'}].`,
    });
  }

  steps.push({
    type: 'not-found', current: null, openSet: [],
    closedSet: new Set(closed), inOpen: new Set(inOpen),
    gScore: { ...gScore }, fScore: { ...fScore },
    hScore: Object.fromEntries(nodes.map(n => [n.id, h(n.id)])),
    path: [], activeEdge: null, done: true,
    msg: `✗ No path from "${startNode}" to "${endNode}".`,
  });
  return steps;
}
