// ===== ALGOVIZ REGISTRY =====
// To add a new algorithm:
//   1. Create folder: src/algos/{category}/{algoId}/
//   2. Create: steps.js, Visualizer.jsx, meta.js inside it
//   3. Import meta here and add to REGISTRY array
//   That's it. Nothing else needs to change.

// ---- SORTING ----
import bubbleMeta    from './algos/sorting/bubble/meta';
import selectionMeta from './algos/sorting/selection/meta';
import insertionMeta from './algos/sorting/insertion/meta';
import mergeMeta     from './algos/sorting/merge/meta';
import quickMeta     from './algos/sorting/quick/meta';
import heapMeta      from './algos/sorting/heap/meta';
import shellMeta     from './algos/sorting/shell/meta';
import countingMeta  from './algos/sorting/counting/meta';
import radixMeta     from './algos/sorting/radix/meta';

// ---- SEARCHING ----
import linearMeta        from './algos/searching/linear/meta';
import binaryMeta        from './algos/searching/binary/meta';
import jumpMeta          from './algos/searching/jump/meta';
import interpolationMeta from './algos/searching/interpolation/meta';
import ternaryMeta       from './algos/searching/ternary/meta';

// ---- GRAPH ----
import bfsMeta      from './algos/graph/bfs/meta';
import dfsMeta      from './algos/graph/dfs/meta';
import dijkstraMeta from './algos/graph/dijkstra/meta';
import astarMeta    from './algos/graph/astar/meta';

// ===== FULL REGISTRY =====
export const REGISTRY = [
  bubbleMeta, selectionMeta, insertionMeta, mergeMeta, quickMeta,
  heapMeta, shellMeta, countingMeta, radixMeta,
  linearMeta, binaryMeta, jumpMeta, interpolationMeta, ternaryMeta,
  bfsMeta, dfsMeta, dijkstraMeta, astarMeta,
];

// ===== CATEGORY DEFINITIONS =====
export const CATEGORIES = [
  {
    id:    'sorting',
    label: 'Sorting',
    icon:  '▦',
    color: 'var(--cat-sort)',
    desc:  'Algorithms that arrange elements in order',
  },
  {
    id:    'searching',
    label: 'Searching',
    icon:  '◎',
    color: 'var(--cat-search)',
    desc:  'Algorithms that locate elements in data',
  },
  {
    id:    'graph',
    label: 'Graph',
    icon:  '⬡',
    color: 'var(--cat-graph)',
    desc:  'Algorithms that traverse nodes and edges',
  },
];

// ===== HELPERS =====
export function getByCategory(categoryId) {
  return REGISTRY.filter(a => a.category === categoryId);
}

export function getById(algoId) {
  return REGISTRY.find(a => a.id === algoId) || null;
}
