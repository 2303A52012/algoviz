// ===== HEAP SORT STEP GENERATOR =====
// Generates detailed animation steps for visualizing heap sort
export function generateSteps(input) {
  // Create a copy of input array to avoid mutation
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comparisons = 0;  // Track comparison count
  let swaps = 0;  // Track swap count

  // ===== HELPER: Record a step for visualization =====
  const addStep = (type, i, j, msg) => {
    steps.push({
      type,  // Type of operation (compare, swap, etc.)
      indices: [i, j],  // Indices involved in this step
      arr: [...arr],  // Current array state
      comparisons,
      swaps,
      msg,
    });
  };

  // ===== HELPER: HEAPIFY FUNCTION =====
  // Maintains max heap property for subtree rooted at `root` with given `size`
  const heapify = (size, root) => {
    // Assume root is largest initially
    let largest = root;
    // Calculate child indices in array representation
    const left = 2 * root + 1;  // Left child
    const right = 2 * root + 2;  // Right child

    // ===== COMPARE LEFT CHILD =====
    if (left < size) {
      comparisons++;
      // Record comparison for visualization
      addStep('compare', root, left, `Compare arr[${root}]=${arr[root]} with arr[${left}]=${arr[left]}`);
      // If left child is greater, update largest
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    // ===== COMPARE RIGHT CHILD =====
    if (right < size) {
      comparisons++;
      // Record comparison for visualization
      addStep('compare', root, right, `Compare arr[${root}]=${arr[root]} with arr[${right}]=${arr[right]}`);
      // If right child is greater than current largest, update largest
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    // ===== SWAP IF NEEDED =====
    // If largest is not root, swap and heapify the affected subtree
    if (largest !== root) {
      swaps++;
      // Swap parent with larger child
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      // Record swap for visualization
      addStep('swap', root, largest, `Swap arr[${root}] and arr[${largest}]`);
      // Recursively heapify the subtree affected by swap
      heapify(size, largest);
    }
  };

  // ===== PHASE 1: BUILD MAX HEAP =====
  addStep('message', -1, -1, 'Phase 1: Building max heap from array...');
  // Start from last non-leaf node (n/2 - 1) and work backwards to root
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    // Inform user we're heapifying from this index
    addStep('message', i, -1, `Heapifying from index ${i}`);
    // Call heapify to maintain heap property
    heapify(n, i);
  }

  // ===== PHASE 2: EXTRACT SORTED ELEMENTS =====
  addStep('message', -1, -1, 'Phase 2: Extracting sorted elements from heap...');
  // Process each element from last to second position
  for (let i = n - 1; i > 0; i--) {
    // Swap root (max) with current last position
    swaps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    // Record swap for visualization
    addStep('swap', 0, i, `Move max element to position ${i}`);

    // Announce we're heapifying the reduced heap
    addStep('message', -1, -1, `Heapifying reduced heap (size=${i})`);
    // Heapify root with reduced heap size
    heapify(i, 0);
  }

  // ===== FINAL STEP: DONE =====
  addStep('done', -1, -1, `✅ Sorted! Comparisons: ${comparisons}, Swaps: ${swaps}`);

  return steps;
}


