// ===== DFS STEP GENERATOR =====
// Grid-based, iterative with explicit stack.
// Each step captures: stack contents, visited, current path, backtracked cells.

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

export function createRandomWallGrid() {
  const grid = createEmptyGrid();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c] === 'empty' && Math.random() < 0.28)
        grid[r][c] = 'wall';
  return grid;
}

function key(r, c)   { return `${r},${c}`; }
function parseKey(k) { const [r, c] = k.split(',').map(Number); return { r, c }; }

function getNeighbors(r, c, grid) {
  // DFS order: down, right, up, left (gives a more interesting snake path)
  return [[1,0],[0,1],[-1,0],[0,-1]]
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

  const visited      = new Set();
  const parent       = {};
  const stack        = [startKey];
  const visitedSet   = new Set();
  const backtrackedSet = new Set();
  // currentPath tracks the actual DFS path (for snake visualization)
  const pathStack    = [startKey];

  steps.push({
    type: 'init',
    visitedSet:    new Set(),
    backtrackedSet: new Set(),
    stack:         [startKey],
    pathStack:     [startKey],
    path:          [],
    current:       null,
    stackDepth:    1,
    msg: `DFS starts at (${START.r},${START.c}). Stack initialized. DFS explores as deep as possible before backtracking.`,
    done: false,
  });

  while (stack.length) {
    const cur = stack.pop();
    const { r, c } = parseKey(cur);

    if (visited.has(cur)) continue;
    visited.add(cur);
    visitedSet.add(cur);

    // Maintain path stack for visualization
    // Trim pathStack back to parent
    if (parent[cur]) {
      while (pathStack.length > 0 && pathStack[pathStack.length - 1] !== parent[cur]) {
        const popped = pathStack.pop();
        if (popped !== startKey) backtrackedSet.add(popped);
      }
    }
    pathStack.push(cur);

    if (cur === endKey) {
      const path = [];
      let node = endKey;
      while (node) { path.unshift(node); node = parent[node]; }

      steps.push({
        type: 'found',
        visitedSet:    new Set(visitedSet),
        backtrackedSet: new Set(backtrackedSet),
        stack:         [],
        pathStack:     [...pathStack],
        path,
        current:       cur,
        stackDepth:    0,
        msg: `✓ Reached (${END.r},${END.c})! DFS found A path in ${visitedSet.size} visits. Note: this may NOT be the shortest path!`,
        done: true,
      });
      return steps;
    }

    const neighbors = getNeighbors(r, c, grid);
    const newNeighbors = neighbors.filter(([nr, nc]) => !visited.has(key(nr, nc)));

    // Push neighbors onto stack (reversed so first neighbor is processed first)
    for (let i = newNeighbors.length - 1; i >= 0; i--) {
      const [nr, nc] = newNeighbors[i];
      const nk = key(nr, nc);
      if (!parent[nk]) parent[nk] = cur;
      stack.push(nk);
    }

    steps.push({
      type: 'visit',
      visitedSet:    new Set(visitedSet),
      backtrackedSet: new Set(backtrackedSet),
      stack:         [...stack],
      pathStack:     [...pathStack],
      path:          [],
      current:       cur,
      stackDepth:    stack.length,
      msg: `Popped (${r},${c}) from stack. Pushed ${newNeighbors.length} unvisited neighbor${newNeighbors.length !== 1 ? 's' : ''}. Stack depth: ${stack.length}.`,
      done: false,
    });
  }

  steps.push({
    type: 'not-found',
    visitedSet:    new Set(visitedSet),
    backtrackedSet: new Set(backtrackedSet),
    stack:         [],
    pathStack:     [],
    path:          [],
    current:       null,
    stackDepth:    0,
    msg: `✗ No path found. DFS visited ${visitedSet.size} cells before exhausting all options.`,
    done: true,
  });

  return steps;
}