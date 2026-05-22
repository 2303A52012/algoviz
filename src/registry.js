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

// ---- OS — CPU SCHEDULING ----
import osFcfsMeta      from './algos/os/fcfs/meta';
import osSjfMeta       from './algos/os/sjf/meta';
import osSrtfMeta      from './algos/os/srtf/meta';
import osRrMeta        from './algos/os/rr/meta';
import osPriorityMeta  from './algos/os/priority/meta';
import osPriorityPMeta from './algos/os/priorityp/meta';
import osMlqMeta       from './algos/os/mlq/meta';
import osMlfqMeta      from './algos/os/mlfq/meta';

// ---- OS — DISK SCHEDULING ----
import diskFcfsMeta  from './algos/os/disk-fcfs/meta';
import diskSstfMeta  from './algos/os/sstf/meta';
import diskScanMeta  from './algos/os/scan/meta';
import diskCscanMeta from './algos/os/cscan/meta';
import diskLookMeta  from './algos/os/look/meta';
import diskClookMeta from './algos/os/clook/meta';

// ---- DATA STRUCTURES ----
import arrayDSMeta      from './ds/array/meta';
import stackDSMeta      from './ds/stack/meta';
import queueDSMeta      from './ds/queue/meta';
import linkedlistDSMeta from './ds/linkedlist/meta';
import dllDSMeta        from './ds/dll/meta';
import cllDSMeta        from './ds/cll/meta';
import dcllDSMeta       from './ds/dcll/meta';
import binaryDSMeta     from './ds/tree/binary/meta';
import bstDSMeta        from './ds/tree/bst/meta';
import minheapDSMeta    from './ds/tree/minheap/meta';
import maxheapDSMeta    from './ds/tree/maxheap/meta';
import trieDSMeta       from './ds/tree/trie/meta';
import hashmapDSMeta    from './ds/hashmap/meta';
import avlDSMeta        from './ds/tree/avl/meta';

// ===== ALGO REGISTRY =====
export const REGISTRY = [
  bubbleMeta, selectionMeta, insertionMeta, mergeMeta, quickMeta,
  heapMeta, shellMeta, countingMeta, radixMeta,
  linearMeta, binaryMeta, jumpMeta, interpolationMeta, ternaryMeta,
  bfsMeta, dfsMeta, dijkstraMeta, astarMeta,
  osFcfsMeta, osSjfMeta, osSrtfMeta, osRrMeta, osPriorityMeta, osPriorityPMeta, osMlqMeta, osMlfqMeta,
  diskFcfsMeta, diskSstfMeta, diskScanMeta, diskCscanMeta, diskLookMeta, diskClookMeta,
];

// ===== DS REGISTRY =====
export const DS_REGISTRY = [
  arrayDSMeta,
  stackDSMeta,
  queueDSMeta,
  linkedlistDSMeta,
  dllDSMeta,
  cllDSMeta,
  dcllDSMeta,
  binaryDSMeta,
  bstDSMeta,
  minheapDSMeta,
  maxheapDSMeta,
  trieDSMeta,
  hashmapDSMeta,
  avlDSMeta,
  // Add more DS here as you build them
];

// ===== ALGO CATEGORIES =====
export const CATEGORIES = [
  { id: 'sorting',   label: 'Sorting',              icon: '▦', color: 'var(--cat-sort)',   desc: 'Arrange elements in order' },
  { id: 'searching', label: 'Searching',             icon: '◎', color: 'var(--cat-search)', desc: 'Locate elements in data'   },
  { id: 'graph',     label: 'Graph',                 icon: '⬡', color: 'var(--cat-graph)',  desc: 'Traverse nodes and edges'  },
  { id: 'ds',        label: 'Data Structures',       icon: '⬛', color: 'var(--cat-tree)',   desc: 'Interactive — add, delete, search, traverse' },
  { id: 'os',        label: 'CPU Scheduling',        icon: '🖥️', color: 'var(--cat-os)',    desc: 'Process scheduling & CPU management' },
  { id: 'os-disk',   label: 'Disk Scheduling',       icon: '💽', color: 'var(--cat-disk)',  desc: 'Disk head movement optimization' },
];

// ===== DS CATEGORY =====
export const DS_CATEGORY = {
  id: 'ds', label: 'Data Structures', icon: '⬛',
  color: 'var(--cat-tree)',
  desc: 'Interactive visualizations — add, delete, search, traverse',
};

// ===== HELPERS =====
export function getByCategory(categoryId) {
  if (categoryId === 'ds') return DS_REGISTRY;
  return REGISTRY.filter(a => a.category === categoryId);
}
export function getById(algoId) {
  return REGISTRY.find(a => a.id === algoId) || null;
}
export function getDSById(dsId) {
  return DS_REGISTRY.find(d => d.id === dsId) || null;
}
