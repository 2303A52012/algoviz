// ===== ALGOVIZ REGISTRY =====
// Add algo: create src/algos/{category}/{id}/ with steps.js + Visualizer.jsx + meta.js, import here
// Add DS:   create src/ds/{id}/ with Visualizer.jsx + meta.js, import here

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

// ---- GRAPH ALGOS ----
import bfsMeta      from './algos/graph/bfs/meta';
import dfsMeta      from './algos/graph/dfs/meta';
import dijkstraMeta from './algos/graph/dijkstra/meta';
import astarMeta    from './algos/graph/astar/meta';

// ---- DATA STRUCTURES ----
import arrayDSMeta from './ds/array/meta';
import stackDSMeta  from './ds/stack/meta';

// ===== ALGO REGISTRY =====
export const REGISTRY = [
  bubbleMeta, selectionMeta, insertionMeta, mergeMeta, quickMeta,
  heapMeta, shellMeta, countingMeta, radixMeta,
  linearMeta, binaryMeta, jumpMeta, interpolationMeta, ternaryMeta,
  bfsMeta, dfsMeta, dijkstraMeta, astarMeta,
];

// ===== DS REGISTRY =====
export const DS_REGISTRY = [
  arrayDSMeta,
  stackDSMeta,
  // Add more DS here as you build them
];

// ===== ALGO CATEGORIES =====
export const CATEGORIES = [
  { id: 'sorting',   label: 'Sorting',   icon: '▦', color: 'var(--cat-sort)',   desc: 'Arrange elements in order' },
  { id: 'searching', label: 'Searching', icon: '◎', color: 'var(--cat-search)', desc: 'Locate elements in data'   },
  { id: 'graph',     label: 'Graph',     icon: '⬡', color: 'var(--cat-graph)',  desc: 'Traverse nodes and edges'  },
];

// ===== DS CATEGORY =====
export const DS_CATEGORY = {
  id: 'ds', label: 'Data Structures', icon: '⬛',
  color: 'var(--cat-tree)',
  desc: 'Interactive visualizations — add, delete, search, traverse',
};

// ===== HELPERS =====
export function getByCategory(categoryId) {
  return REGISTRY.filter(a => a.category === categoryId);
}
export function getById(algoId) {
  return REGISTRY.find(a => a.id === algoId) || null;
}
export function getDSById(dsId) {
  return DS_REGISTRY.find(d => d.id === dsId) || null;
}
