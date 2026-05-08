// ===== DIJKSTRA STEP GENERATOR =====
// Grid-based. Uses a Priority Queue to find shortest paths.
// Supports "weight" cells (cost = 5) vs "empty" cells (cost = 1).

export const ROWS = 12;
export const COLS = 20;
export const START = { r: 5, c: 1 };
export const END   = { r: 6, c: 18 };
export const WEIGHT_COST = 5;

export function createEmptyGrid() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
  grid[START.r][START.c] = 'start';
  grid[END.r][END.c]     = 'end';
  return grid;
}

export function createRandomGrid() {
  const grid = createEmptyGrid();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 'empty') {
        const rand = Math.random();
        if (rand < 0.20) grid[r][c] = 'wall';
        else if (rand < 0.35) grid[r][c] = 'weight';
      }
    }
  }
  return grid;
}

function key(r, c)    { return `${r},${c}`; }
function parseKey(k)  { const [r, c] = k.split(',').map(Number); return { r, c }; }

function getNeighbors(r, c, grid) {
  return [[-1,0],[1,0],[0,-1],[0,1]]
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([nr, nc]) => 
      nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && 
      grid[nr][nc] !== 'wall'
    );
}

export function generateSteps(grid) {
  const steps = [];
  const startKey = key(START.r, START.c);
  const endKey   = key(END.r,   END.c);

  const distMap = { [startKey]: 0 };
  const parent  = {};
  // Priority Queue entries: { k: "r,c", d: distance }
  const pq = [{ k: startKey, d: 0 }];
  
  // Sets for visualization state
  const visitedSet  = new Set(); // nodes permanently finalized
  const frontierSet = new Set([startKey]);

  steps.push({
    type: 'init',
    visitedSet:  new Set(visitedSet),
    frontierSet: new Set(frontierSet),
    queue:       [...pq],
    path:        [],
    current:     null,
    distMap:     { ...distMap },
    msg: `Dijkstra starts at (${START.r},${START.c}). Cost to reach start is 0.`,
    activeLine: 0,
    done: false,
  });

  while (pq.length > 0) {
    // Pop min
    const curObj = pq.shift();
    const cur = curObj.k;
    const curDist = curObj.d;
    
    // We might have duplicate entries in PQ with higher distances, ignore them if we already finalized a shorter one
    if (visitedSet.has(cur)) continue;

    const { r, c } = parseKey(cur);
    visitedSet.add(cur);
    frontierSet.delete(cur);

    if (cur === endKey) {
      // Trace path
      const path = [];
      let node = endKey;
      while (node && node !== startKey) {
        path.unshift(node);
        node = parent[node];
      }
      steps.push({
        type: 'found',
        visitedSet:  new Set(visitedSet),
        frontierSet: new Set(frontierSet),
        queue:       [],
        path,
        current:     cur,
        distMap:     { ...distMap },
        msg: `✓ Reached destination! Total cost = ${distMap[endKey]}. Dijkstra guarantees this is the minimum cost.`,
        activeLine: 6,
        done: true,
      });
      return steps;
    }

    let addedCount = 0;
    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      if (visitedSet.has(nk)) continue; // Already finalized

      const cost = grid[nr][nc] === 'weight' ? WEIGHT_COST : 1;
      const newDist = curDist + cost;

      if (distMap[nk] === undefined || newDist < distMap[nk]) {
        distMap[nk] = newDist;
        parent[nk] = cur;
        pq.push({ k: nk, d: newDist });
        frontierSet.add(nk);
        addedCount++;
      }
    }

    // Sort PQ by distance (min-heap approximation)
    pq.sort((a, b) => a.d - b.d);

    steps.push({
      type: 'visit',
      visitedSet:  new Set(visitedSet),
      frontierSet: new Set(frontierSet),
      queue:       [...pq],
      path:        [],
      current:     cur,
      distMap:     { ...distMap },
      msg: `Finalized (${r},${c}) with min cost ${curDist}. Relaxed ${addedCount} edge(s). PQ size: ${pq.length}.`,
      activeLine: 9,
      done: false,
    });
  }

  steps.push({
    type: 'not-found',
    visitedSet:  new Set(visitedSet),
    frontierSet: new Set(frontierSet),
    queue:       [],
    path:        [],
    current:     null,
    distMap:     { ...distMap },
    msg: `✗ No path found — destination is unreachable. Finalized ${visitedSet.size} cells.`,
    activeLine: 17,
    done: true,
  });

  return steps;
}
