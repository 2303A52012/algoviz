// ===== BFS STEP GENERATOR =====
// Grid-based. Each step captures full grid state + queue contents.

export const ROWS = 12;
export const COLS = 20;
export const START = { r: 5, c: 1 };
export const END   = { r: 6, c: 18 };

export function createEmptyGrid() {
  const grid = Array.from({ length: ROWS }, () =>
    Array(COLS).fill('empty')
  );
  grid[START.r][START.c] = 'start';
  grid[END.r][END.c]     = 'end';
  return grid;
}

export function createRandomWallGrid() {
  const grid = createEmptyGrid();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 'empty' && Math.random() < 0.28)
        grid[r][c] = 'wall';
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

  const visited  = new Set([startKey]);
  const parent   = {};
  const queue    = [startKey];
  const distMap  = { [startKey]: 0 };

  // Cell states: visited set, frontier set, path array
  const visitedSet  = new Set([startKey]);
  const frontierSet = new Set();

  steps.push({
    type: 'init',
    visitedSet:  new Set(visitedSet),
    frontierSet: new Set(),
    queue:       [...queue],
    path:        [],
    current:     null,
    distMap:     { ...distMap },
    msg: `BFS starts at (${START.r},${START.c}). Queue initialized with start node. Exploring level by level.`,
    done: false,
  });

  while (queue.length) {
    const cur = queue.shift();
    const { r, c } = parseKey(cur);
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
        frontierSet: new Set(),
        queue:       [],
        path,
        current:     cur,
        distMap:     { ...distMap },
        msg: `✓ Reached destination (${END.r},${END.c})! Shortest path = ${path.length} steps. BFS guarantees this is optimal.`,
        done: true,
      });
      return steps;
    }

    const newFrontier = new Set();
    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      if (!visited.has(nk)) {
        visited.add(nk);
        visitedSet.add(nk);
        parent[nk] = cur;
        queue.push(nk);
        distMap[nk] = (distMap[cur] || 0) + 1;
        frontierSet.add(nk);
        newFrontier.add(nk);
      }
    }

    steps.push({
      type: 'visit',
      visitedSet:  new Set(visitedSet),
      frontierSet: new Set(frontierSet),
      queue:       [...queue],
      path:        [],
      current:     cur,
      distMap:     { ...distMap },
      msg: `Dequeued (${r},${c}) [dist=${distMap[cur]}]. Added ${newFrontier.size} neighbor${newFrontier.size !== 1 ? 's' : ''} to queue. Queue size: ${queue.length}.`,
      done: false,
    });
  }

  steps.push({
    type: 'not-found',
    visitedSet:  new Set(visitedSet),
    frontierSet: new Set(),
    queue:       [],
    path:        [],
    current:     null,
    distMap:     { ...distMap },
    msg: `✗ No path found — destination is unreachable. Visited ${visitedSet.size} cells.`,
    done: true,
  });

  return steps;
}