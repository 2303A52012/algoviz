// ===== RADIX SORT STEP GENERATOR =====
// Generates detailed animation steps for visualizing radix sort algorithm
export function generateSteps(input) {
  // Make a copy to avoid modifying original input
  const arr = [...input];
  const n = arr.length;
  
  // Empty array is already sorted
  if (n === 0) return [];

  // Track all steps and statistics
  const steps = [];
  let comparisons = 0;  // Count comparisons (digit examinations)
  let moves = 0;  // Count movements to buckets

  // ===== PHASE 1: PREPARATION =====
  // Find maximum number to determine how many digits we need to process
  const maxNum = Math.max(...arr);
  const numDigits = maxNum.toString().length;  // e.g., 999 has 3 digits

  // Initial info step explaining the algorithm parameters
  steps.push({
    type: 'info',
    msg: `Max number: ${maxNum} has ${numDigits} digits. Will do ${numDigits} passes.`,
    indices: [],
    arr: [...arr],
    pass: 0,
    digit: null,
    buckets: null,
    comparisons,
    moves,
  });

  // ===== PHASE 2: MAIN RADIX SORT LOOP =====
  // Process each digit position from ones place to highest (right to left)
  let digitPosition = 1;  // Start with 10^0 (ones place)
  let passNum = 1;

  // For each digit position
  for (let pass = 0; pass < numDigits; pass++) {
    // Announce the start of this pass
    steps.push({
      type: 'pass_start',
      msg: `Pass ${passNum}: Sorting by digit position (${digitPosition})`,
      indices: [],
      arr: [...arr],
      pass: passNum,
      digit: digitPosition,
      buckets: null,
      comparisons,
      moves,
    });

    // ===== DISTRIBUTION PHASE =====
    // Create 10 buckets (one for each digit 0-9)
    const buckets = Array.from({ length: 10 }, () => []);

    // Distribute each number into appropriate bucket based on its digit
    for (let i = 0; i < n; i++) {
      // Extract digit at current position
      // Example: 345 with digitPosition=10 gives digit 4
      const digit = Math.floor(arr[i] / digitPosition) % 10;
      buckets[digit].push(arr[i]);
      comparisons++;  // We examined one digit

      // Record this distribution step for visualization
      steps.push({
        type: 'distribute',
        msg: `Number ${arr[i]}: digit = ${digit}. Placing in bucket ${digit}`,
        indices: [i],  // Highlight this element
        arr: [...arr],
        pass: passNum,
        digit: digitPosition,
        buckets: buckets.map(b => [...b]),  // Show current bucket state
        comparisons,
        moves,
      });
    }

    // ===== COLLECTION PHASE =====
    // Gather numbers from buckets back into main array (preserving stable sort)
    let newArrIdx = 0;  // Index to place next element in array
    
    // Process buckets in order (0 through 9)
    for (let bucketNum = 0; bucketNum < 10; bucketNum++) {
      // For each number in this bucket
      for (let num of buckets[bucketNum]) {
        // Place number at the current position in array
        arr[newArrIdx] = num;
        moves++;  // Count this movement
        newArrIdx++;

        // Record this collection step
        steps.push({
          type: 'collect',
          msg: `Collecting from buckets: placing ${num} at index ${newArrIdx - 1}`,
          indices: [newArrIdx - 1],  // Highlight where we placed it
          arr: [...arr],
          pass: passNum,
          digit: digitPosition,
          buckets: buckets.map(b => [...b]),  // Show bucket state
          comparisons,
          moves,
        });
      }
    }

    // Record pass completion
    steps.push({
      type: 'pass_complete',
      msg: `Pass ${passNum} complete. Array after digit ${digitPosition}: ${arr.join(', ')}`,
      indices: [],
      arr: [...arr],
      pass: passNum,
      digit: digitPosition,
      buckets: null,
      comparisons,
      moves,
    });

    // Move to next digit position
    digitPosition *= 10;  // 1 -> 10 -> 100 -> 1000
    passNum++;
  }

  // ===== FINAL STEP: ALGORITHM COMPLETE =====
  steps.push({
    type: 'complete',
    msg: `✅ Radix Sort Complete! Final array: ${arr.join(', ')}`,
    indices: [],
    arr: [...arr],
    pass: 0,
    digit: null,
    buckets: null,
    comparisons,
    moves,
  });

  return steps;
}
