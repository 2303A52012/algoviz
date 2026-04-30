// ===== BINARY SEARCH STEP GENERATOR =====
// Generates detailed animation steps for visualizing binary search

export function generateSteps(inputArr, target) {
  const steps = [];
  // Binary search requires sorted array
  const arr = [...inputArr].sort((a, b) => a - b);
  const n = arr.length;

  // ===== INITIALIZATION STEP =====
  steps.push({
    type: 'init',
    arr: [...arr],
    lo: 0, hi: n - 1, mid: -1,  // lo=left boundary, hi=right boundary
    eliminated: [],  // Indices eliminated from search
    foundIdx: -1,
    target,
    comparisons: 0,
    msg: `Array sorted. Searching for ${target}. Each step eliminates half — O(log n) max ${Math.ceil(Math.log2(n))} steps for ${n} elements.`,
    done: false,
  });

  // ===== MAIN BINARY SEARCH LOOP =====
  let lo = 0, hi = n - 1, comparisons = 0;
  const eliminated = [];

  while (lo <= hi) {
    // ===== CALCULATE MIDPOINT =====
    // Efficient formula: mid = lo + (hi-lo)/2 avoids overflow
    const mid = Math.floor((lo + hi) / 2);
    comparisons++;

    // ===== COMPARE AT MIDPOINT =====
    steps.push({
      type: 'mid-check',
      arr: [...arr],
      lo, hi, mid,
      eliminated: [...eliminated],
      foundIdx: -1,
      target,
      comparisons,
      msg: `lo=${lo}, hi=${hi} → mid=⌊(${lo}+${hi})/2⌋=${mid}. Checking arr[${mid}]=${arr[mid]}.`,
      done: false,
    });

    // ===== FOUND TARGET =====
    if (arr[mid] === target) {
      steps.push({
        type: 'found',  // Success!
        arr: [...arr],
        lo, hi, mid,
        eliminated: [...eliminated],
        foundIdx: mid,  // Store where we found it
        target,
        comparisons,
        msg: `✓ arr[${mid}] = ${arr[mid]} = ${target}. Found in ${comparisons} comparison${comparisons > 1 ? 's' : ''}! (Binary search needed at most ${Math.ceil(Math.log2(n))} for this array.)`,
        done: true,  // Search complete
      });
      return steps;  // Early exit on success
    }

    // ===== TARGET IN RIGHT HALF =====
    if (arr[mid] < target) {
      // Mark left half as eliminated (including mid)
      for (let k = lo; k <= mid; k++) eliminated.push(k);
      steps.push({
        type: 'go-right',  // Moving search to right
        arr: [...arr],
        lo: mid + 1, hi, mid,
        eliminated: [...eliminated],
        foundIdx: -1,
        target,
        comparisons,
        msg: `arr[${mid}]=${arr[mid]} < ${target} → target is in RIGHT half. Eliminate [${lo}..${mid}] (${mid - lo + 1} elements gone).`,
        done: false,
      });
      lo = mid + 1;  // Update left boundary
    } else {
      // ===== TARGET IN LEFT HALF =====
      // Mark right half as eliminated
      for (let k = mid; k <= hi; k++) eliminated.push(k);
      steps.push({
        type: 'go-left',  // Moving search to left
        arr: [...arr],
        lo, hi: mid - 1, mid,
        eliminated: [...eliminated],
        foundIdx: -1,
        target,
        comparisons,
        msg: `arr[${mid}]=${arr[mid]} > ${target} → target is in LEFT half. Eliminate [${mid}..${hi}] (${hi - mid + 1} elements gone).`,
        done: false,
      });
      hi = mid - 1;  // Update right boundary
    }
  }

  // ===== TARGET NOT FOUND =====
  // Search space exhausted (lo > hi means no more elements to check)
  steps.push({
    type: 'not-found',  // Search failed
    arr: [...arr],
    lo, hi, mid: -1,
    eliminated: Array.from({ length: n }, (_, i) => i),  // All elements eliminated
    foundIdx: -1,
    target,
    comparisons,
    msg: `✗ lo(${lo}) > hi(${hi}) — search space exhausted. ${target} is not in the array. Used ${comparisons} comparisons.`,
    done: true,  // Search complete
  });

  return steps;
}

// ===== GENERATE DEFAULT INPUT =====
// Returns a pre-sorted sample array for initial visualization
export function generateDefaultInput() {
  // Array is already sorted for binary search requirement
  return [3, 14, 27, 35, 42, 58, 63, 71, 85, 90, 96, 102, 114, 127, 138];
}

// ===== PARSE AND VALIDATE CUSTOM INPUT =====
export function parseCustomInput(raw) {
  // Split by comma and convert to integers
  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);  // Valid: 1-999
  
  // ===== VALIDATION =====
  if (parsed.length < 3) throw new Error('Enter at least 3 numbers (1–999).');
  if (parsed.length > 20) throw new Error('Max 20 elements for clear visualization.');
  
  // ===== RETURN SORTED ARRAY =====
  // Binary search REQUIRES sorted input
  return [...parsed].sort((a, b) => a - b);
}