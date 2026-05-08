// ===== A* SEARCH STEP GENERATOR =====
// Grid-based. Uses a Priority Queue sorting by f = g + h.
// g = cost from start, h = heuristic (Manhattan distance to end)

export const ROWS = 12;
export const COLS = 20;
export const START = { r: 5, c: 1 };
export const END   = { r: 6, c: 18 };

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
        if (Math.random() < 0.28) grid[r][c] = 'wall';
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

// Manhattan distance
function heuristic(r, c) {
  return Math.abs(r - END.r) + Math.abs(c - END.c);
}

export function generateSteps(grid) {
  const steps = [];
  const startKey = key(START.r, START.c);
  const endKey   = key(END.r,   END.c);

  const gMap = { [startKey]: 0 }; // Cost from start
  const hMap = { [startKey]: heuristic(START.r, START.c) }; // Estimated cost to end
  const fMap = { [startKey]: gMap[startKey] + hMap[startKey] }; // f = g + h

  const parent  = {};
  
  // Priority Queue entries: { k: "r,c", f: estimated total, g, h }
  const pq = [{ k: startKey, f: fMap[startKey], g: gMap[startKey], h: hMap[startKey] }];
  
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
    gMap:        { ...gMap },
    fMap:        { ...fMap },
    hMap:        { ...hMap },
    msg: `A* Search starts at (${START.r},${START.c}). Heuristic distance to target: ${hMap[startKey]}.`,
    activeLine: 0,
    done: false,
  });

  while (pq.length > 0) {
    // Pop min f
    const curObj = pq.shift();
    const cur = curObj.k;
    const curG = curObj.g;
    
    // Skip if already permanently finalized (shorter path already found)
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
        gMap:        { ...gMap },
        fMap:        { ...fMap },
        hMap:        { ...hMap },
        msg: `✓ Target reached! Optimal path cost = ${gMap[endKey]} steps.`,
        activeLine: 6,
        done: true,
      });
      return steps;
    }

    let addedCount = 0;
    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      if (visitedSet.has(nk)) continue; // Already finalized

      const newG = curG + 1; // Assuming cost between all adjacent cells is 1

      if (gMap[nk] === undefined || newG < gMap[nk]) {
        const newH = heuristic(nr, nc);
        const newF = newG + newH;
        
        gMap[nk] = newG;
        hMap[nk] = newH;
        fMap[nk] = newF;
        parent[nk] = cur;
        
        pq.push({ k: nk, f: newF, g: newG, h: newH });
        frontierSet.add(nk);
        addedCount++;
      }
    }

    // Sort PQ by f, tie break by h (prefer closer to target if f is tied)
    pq.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      return a.h - b.h; 
    });

    steps.push({
      type: 'visit',
      visitedSet:  new Set(visitedSet),
      frontierSet: new Set(frontierSet),
      queue:       [...pq],
      path:        [],
      current:     cur,
      gMap:        { ...gMap },
      fMap:        { ...fMap },
      hMap:        { ...hMap },
      msg: `Finalized (${r},${c}) with f=${curObj.f} (g=${curG}, h=${curObj.h}). Relaxed ${addedCount} neighbors.`,
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
    gMap:        { ...gMap },
    fMap:        { ...fMap },
    hMap:        { ...hMap },
    msg: `✗ No path found. The destination is blocked.`,
    activeLine: 18,
    done: true,
  });

  return steps;
}
