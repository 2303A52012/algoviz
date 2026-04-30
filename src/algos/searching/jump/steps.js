// ===== JUMP SEARCH STEP GENERATOR =====
// Generates detailed steps for visualizing jump search algorithm
export function generateSteps(input) {
  const { arr, target } = input;
  const n = arr.length;
  
  // Calculate optimal jump size (square root of array length)
  const jumpSize = Math.floor(Math.sqrt(n));
  const steps = [];
  let comparisons = 0;  // Track number of comparisons
  let jumps = 0;        // Track number of jumps made

  // Step 1: Initial info
  steps.push({
    type: 'info',
    msg: `Searching for ${target} | Size: ${n}, Jump: √${n} = ${jumpSize}`,
    indices: [],
    arr: [...arr],
    comparisons,
    jumps,
  });

  // PHASE 1: JUMPING - Find the block containing target
  let prev = 0;  // Start index of current block
  let curr = jumpSize;  // End index of current block

  // Jump ahead until we find a block where target might be
  // Condition: current block's last element < target
  while (curr < n && arr[curr] < target) {
    comparisons++;
    jumps++;
    
    // Record this jump step
    steps.push({
      type: 'jump',
      msg: `Jump to index ${curr}. Value ${arr[curr]} < target ${target}`,
      indices: [curr],  // Highlight the index we jumped to
      blockStart: prev,
      blockEnd: curr,
      arr: [...arr],
      comparisons,
      jumps,
    });

    // Move to next block
    prev = curr;
    curr += jumpSize;
  }

  // PHASE 2: LINEAR SEARCH - Search within the identified block
  const blockEnd = Math.min(curr, n - 1);
  steps.push({
    type: 'block_found',
    msg: `Block found: indices ${prev}–${blockEnd}. Starting linear search...`,
    indices: [],
    blockStart: prev,
    blockEnd: blockEnd,
    arr: [...arr],
    comparisons,
    jumps,
  });

  // Linear search from block start
  let found = false;
  for (let i = prev; i < Math.min(curr, n); i++) {
    comparisons++;
    
    // Early exit: if element > target, target doesn't exist (array is sorted)
    if (arr[i] > target) {
      steps.push({
        type: 'search',
        msg: `Checking index ${i}. Value ${arr[i]} > target ${target}. Target not in array.`,
        indices: [i],
        blockStart: prev,
        blockEnd: Math.min(curr, n - 1),
        arr: [...arr],
        comparisons,
        jumps,
      });
      break;
    }
    
    // Check if this element is the target
    if (arr[i] === target) {
      steps.push({
        type: 'found',
        msg: `✅ Found ${target} at index ${i}!`,
        indices: [i],
        found: true,
        arr: [...arr],
        comparisons,
        jumps,
      });
      found = true;
      break;
    } else {
      // Not found yet, record this comparison
      steps.push({
        type: 'search',
        msg: `Checking index ${i}. Value ${arr[i]} < target ${target}`,
        indices: [i],
        blockStart: prev,
        blockEnd: Math.min(curr, n - 1),
        arr: [...arr],
        comparisons,
        jumps,
      });
    }
  }

  // Final step: Target not found
  if (!found) {
    steps.push({
      type: 'not_found',
      msg: `❌ Target ${target} not found in array`,
      indices: [],
      arr: [...arr],
      comparisons,
      jumps,
    });
  }

  return steps;
}
