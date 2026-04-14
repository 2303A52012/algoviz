// ===== MERGE SORT STEP GENERATOR =====
// Captures the full recursive tree structure, not just array states.
// Each step knows its depth, left/right bounds, and phase (split vs merge).

export function generateSteps(inputArr) {
  const steps = [];
  const arr = [...inputArr];
  const n = arr.length;

  // Build the full call tree first so we can assign node IDs
  // Each node: { id, depth, lo, hi, left, right, parent }
  let nodeCounter = 0;
  const nodes = {};

  function buildTree(lo, hi, parentId) {
    const id = nodeCounter++;
    nodes[id] = { id, lo, hi, parentId, leftId: null, rightId: null, depth: parentId === null ? 0 : nodes[parentId].depth + 1 };
    if (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      nodes[id].leftId  = buildTree(lo, mid, id);
      nodes[id].rightId = buildTree(mid + 1, hi, id);
    }
    return id;
  }
  buildTree(0, n - 1, null);

  steps.push({
    type: 'init',
    arr: [...arr],
    activeNodeId: 0,
    phase: 'split',
    nodes,
    nodeStates: {},  // nodeId -> 'active'|'split'|'merging'|'done'
    msg: `Merge Sort on ${n} elements. Phase 1: recursively split into halves. Phase 2: merge sorted halves back.`,
    done: false,
  });

  const nodeStates = {};
  const nodeArrays = {}; // track sorted subarrays at each node

  // Initialize all node arrays
  Object.values(nodes).forEach(nd => {
    nodeArrays[nd.id] = arr.slice(nd.lo, nd.hi + 1);
  });

  function runMergeSort(lo, hi, nodeId) {
    nodeStates[nodeId] = 'active';

    steps.push({
      type: 'split',
      arr: [...arr],
      activeNodeId: nodeId,
      phase: 'split',
      nodes,
      nodeStates: { ...nodeStates },
      subarray: arr.slice(lo, hi + 1),
      lo, hi,
      msg: lo === hi
        ? `Base case: [${arr[lo]}] at index ${lo} — single element, already sorted.`
        : `Split [${lo}..${hi}] = [${arr.slice(lo, hi+1).join(', ')}] into [${lo}..${Math.floor((lo+hi)/2)}] and [${Math.floor((lo+hi)/2)+1}..${hi}]`,
      done: false,
    });

    if (lo >= hi) {
      nodeStates[nodeId] = 'done';
      nodeArrays[nodeId] = [arr[lo]];
      return;
    }

    const mid = Math.floor((lo + hi) / 2);
    const nd = nodes[nodeId];

    nodeStates[nodeId] = 'split';
    runMergeSort(lo, mid, nd.leftId);
    runMergeSort(mid + 1, hi, nd.rightId);

    // Merge phase
    nodeStates[nodeId] = 'merging';
    const left  = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);

    steps.push({
      type: 'merge-start',
      arr: [...arr],
      activeNodeId: nodeId,
      phase: 'merge',
      nodes,
      nodeStates: { ...nodeStates },
      lo, mid, hi,
      left: [...left],
      right: [...right],
      msg: `Merging [${left.join(', ')}] + [${right.join(', ')}]`,
      done: false,
    });

    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      steps.push({
        type: 'merge-compare',
        arr: [...arr],
        activeNodeId: nodeId,
        phase: 'merge',
        nodes,
        nodeStates: { ...nodeStates },
        lo, mid, hi,
        left: [...left],
        right: [...right],
        leftPointer: i,
        rightPointer: j,
        msg: `Compare left[${i}]=${left[i]} vs right[${j}]=${right[j]} → take ${left[i] <= right[j] ? left[i] + ' (left)' : right[j] + ' (right)'}`,
        done: false,
      });

      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }

      steps.push({
        type: 'merge-place',
        arr: [...arr],
        activeNodeId: nodeId,
        phase: 'merge',
        nodes,
        nodeStates: { ...nodeStates },
        lo, mid, hi,
        left: [...left],
        right: [...right],
        leftPointer: i,
        rightPointer: j,
        justPlaced: k - 1,
        msg: `Placed ${arr[k - 1]} at position ${k - 1}`,
        done: false,
      });
    }

    while (i < left.length) {
      arr[k++] = left[i++];
      steps.push({
        type: 'merge-place',
        arr: [...arr],
        activeNodeId: nodeId,
        phase: 'merge',
        nodes,
        nodeStates: { ...nodeStates },
        lo, mid, hi,
        left: [...left], right: [...right],
        leftPointer: i, rightPointer: j,
        justPlaced: k - 1,
        msg: `Copying remaining left: ${arr[k - 1]} → position ${k - 1}`,
        done: false,
      });
    }

    while (j < right.length) {
      arr[k++] = right[j++];
      steps.push({
        type: 'merge-place',
        arr: [...arr],
        activeNodeId: nodeId,
        phase: 'merge',
        nodes,
        nodeStates: { ...nodeStates },
        lo, mid, hi,
        left: [...left], right: [...right],
        leftPointer: i, rightPointer: j,
        justPlaced: k - 1,
        msg: `Copying remaining right: ${arr[k - 1]} → position ${k - 1}`,
        done: false,
      });
    }

    nodeStates[nodeId] = 'done';
    nodeArrays[nodeId] = arr.slice(lo, hi + 1);

    steps.push({
      type: 'merge-done',
      arr: [...arr],
      activeNodeId: nodeId,
      phase: 'merge',
      nodes,
      nodeStates: { ...nodeStates },
      lo, hi,
      merged: arr.slice(lo, hi + 1),
      msg: `Merged! [${lo}..${hi}] = [${arr.slice(lo, hi+1).join(', ')}] ✓`,
      done: false,
    });
  }

  runMergeSort(0, n - 1, 0);

  steps.push({
    type: 'done',
    arr: [...arr],
    activeNodeId: -1,
    phase: 'done',
    nodes,
    nodeStates: Object.fromEntries(Object.keys(nodes).map(id => [id, 'done'])),
    msg: `Merge Sort complete! Array sorted in O(n log n) time with O(n) extra space.`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  return [38, 27, 43, 3, 9, 82, 10, 25];
}

export function parseCustomInput(raw) {
  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);
  if (parsed.length < 2)  throw new Error('Enter at least 2 numbers (1–999), comma-separated.');
  if (parsed.length > 16) throw new Error('Max 16 elements — tree gets too wide beyond that.');
  return parsed;
}
