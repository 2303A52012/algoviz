// ===== BUBBLE SORT STEP GENERATOR =====
// Generates array of step objects showing algorithm execution
// Each step captures: array state, elements being compared/swapped, position in sorted region, descriptive message

export function generateSteps(inputArr) {
  // Initialize working array and state tracking
  const steps = [];
  const arr = [...inputArr]; // Copy input to avoid mutations
  const n = arr.length;
  // sortedFrom: index where sorted region begins (elements from this index rightward are sorted)
  const sortedFrom = n;

  // ===== INITIALIZATION STEP: Document starting state =====
  steps.push({
    type: 'init', // Step type for visualization
    arr: [...arr], // Current array state
    comparing: [], // No elements being compared initially
    swapping: [], // No elements being swapped initially
    sortedFrom: n, // Sorted region starts after all elements (none sorted yet)
    msg: `Starting Bubble Sort on ${n} elements. We will make up to ${n - 1} passes.`,
    done: false, // Algorithm not complete
  });

  // ===== MAIN SORTING PASSES: Repeat until array is sorted =====
  for (let i = 0; i < n - 1; i++) {
    // Track if any swaps occurred during this pass (used for early exit optimization)
    let swappedThisPass = false;

    // ===== PASS START: Begin a new pass through unsorted region =====
    steps.push({
      type: 'pass-start', // Mark beginning of a pass
      arr: [...arr],
      comparing: [],
      swapping: [],
      sortedFrom: n - i, // After i passes, rightmost i elements are in place
      passNum: i + 1,
      msg: `Pass ${i + 1}: scanning from index 0 to ${n - i - 2}, comparing adjacent pairs.`,
      done: false,
    });

    // ===== COMPARISON LOOP: Compare all adjacent pairs in unsorted region =====
    // Reduce upper bound each pass because rightmost element is already in place
    for (let j = 0; j < n - i - 1; j++) {
      // ===== COMPARE STEP: Record current comparison for visualization =====
      steps.push({
        type: 'compare', // Mark this step as a comparison
        arr: [...arr],
        comparing: [j, j + 1], // Highlight these two elements being compared
        swapping: [],
        sortedFrom: n - i,
        msg: `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}`,
        done: false,
      });

      // ===== SWAP DECISION: If left > right, bubble right element to right =====
      if (arr[j] > arr[j + 1]) {
        // Left element is larger: swap to move larger element rightward
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedThisPass = true; // Mark that we made a swap

        // ===== SWAP STEP: Record swap operation for visualization =====
        steps.push({
          type: 'swap', // Mark as swap step
          arr: [...arr],
          comparing: [],
          swapping: [j, j + 1], // Highlight swapped elements
          sortedFrom: n - i,
          msg: `${arr[j + 1]} > ${arr[j]} — swapping! arr[${j}] ↔ arr[${j + 1}]`,
          done: false,
        });
      } else {
        // Left element <= right element: already in correct order
        steps.push({
          type: 'no-swap', // Mark that no swap was needed
          arr: [...arr],
          comparing: [],
          swapping: [],
          sortedFrom: n - i,
          msg: `${arr[j]} ≤ ${arr[j + 1]} — already in order, no swap needed.`,
          done: false,
        });
      }
    }

    // ===== PASS END: Document that largest unsorted element is now in place =====
    // After each pass, the largest element in unsorted region bubbles to its correct position
    steps.push({
      type: 'pass-end', // Mark end of pass
      arr: [...arr],
      comparing: [],
      swapping: [],
      sortedFrom: n - i - 1, // One more element is now in sorted region
      passNum: i + 1,
      justSorted: n - i - 1, // Highlight the element just placed
      msg: `Pass ${i + 1} complete. ${arr[n - i - 1]} is now in its final position at index ${n - i - 1}.`,
      done: false,
    });

    // ===== EARLY EXIT OPTIMIZATION: If no swaps occurred, array is sorted =====
    // This optimization detects when array becomes sorted before all passes complete
    if (!swappedThisPass) {
      steps.push({
        type: 'early-exit', // Mark early termination
        arr: [...arr],
        comparing: [],
        swapping: [],
        sortedFrom: 0, // Entire array is now sorted
        msg: `No swaps in pass ${i + 1} — array is already sorted! Early exit.`,
        done: true, // Algorithm complete
      });
      return steps; // Exit function early
    }
  }

  // ===== FINAL STEP: Algorithm complete after all passes =====
  steps.push({
    type: 'done', // Mark completion
    arr: [...arr],
    comparing: [],
    swapping: [],
    sortedFrom: 0, // Entire array is sorted
    msg: `Bubble Sort complete! All ${n} elements are sorted.`,
    done: true, // Algorithm finished
  });

  return steps; // Return all recorded steps
}

// ===== HELPER: Generate default unsorted array for initial load =====
export function generateDefaultInput() {
  // Return predefined array that demonstrates algorithm well
  return [64, 34, 25, 12, 22, 11, 90, 42, 55, 7, 38, 16];
}

// ===== HELPER: Parse and validate user custom input =====
export function parseCustomInput(raw) {
  // Split by comma, trim whitespace, and convert to integers
  const parsed = raw
    .split(',') // Separate by commas
    .map(s => parseInt(s.trim())) // Convert each to integer
    .filter(n => !isNaN(n) && n > 0 && n <= 999); // Filter: valid range 1-999
  
  // Validate: at least 2 elements required
  if (parsed.length < 2)  throw new Error('Enter at least 2 numbers (1–999), comma-separated.');
  
  // Validate: max 20 elements for visual clarity
  if (parsed.length > 20) throw new Error('Max 20 elements for clear visualization.');
  
  return parsed; // Return validated array
}
