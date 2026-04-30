// ===== LINEAR SEARCH STEP GENERATOR =====
// Generates detailed animation steps for visualizing linear search

export function generateSteps(inputArr, target) {
  const steps = [];
  const arr = [...inputArr];  // Copy array to avoid mutation
  const n = arr.length;

  // ===== INITIALIZATION STEP =====
  // Explain the algorithm and starting conditions
  steps.push({
    type: 'init',
    arr: [...arr],
    currentIdx: -1,  // No element being checked yet
    scannedIdx: [],  // No elements scanned yet
    foundIdx: -1,  // Nothing found yet
    target,
    msg: `Searching for ${target} in ${n} elements. Scanning left to right — no sorting required.`,
    done: false,
  });

  // ===== MAIN SEARCH LOOP =====
  // Check each element sequentially from left to right
  for (let i = 0; i < n; i++) {
    // ===== CHECK CURRENT ELEMENT =====
    steps.push({
      type: 'check',  // We're checking this index
      arr: [...arr],
      currentIdx: i,  // Currently at index i
      scannedIdx: Array.from({ length: i }, (_, k) => k),  // All previous indices scanned
      foundIdx: -1,  // Not found yet
      target,
      msg: `Checking index ${i}: arr[${i}] = ${arr[i]} ${arr[i] === target ? `— MATCH! Found ${target}!` : `≠ ${target}, move right`}`,
      done: false,
    });

    // ===== FOUND TARGET =====
    if (arr[i] === target) {
      steps.push({
        type: 'found',  // Success!
        arr: [...arr],
        currentIdx: i,  // Found at this index
        scannedIdx: Array.from({ length: i }, (_, k) => k),  // Indices scanned before finding
        foundIdx: i,  // Store where we found it
        target,
        msg: `✓ Found ${target} at index ${i}! Scanned ${i + 1} of ${n} elements.`,
        done: true,  // Search complete
      });
      return steps;  // Early exit on success
    }

    // ===== MISS: ELEMENT DOESN'T MATCH =====
    steps.push({
      type: 'miss',  // This element doesn't match
      arr: [...arr],
      currentIdx: -1,  // Done checking
      scannedIdx: Array.from({ length: i + 1 }, (_, k) => k),  // Include current in scanned
      foundIdx: -1,  // Still not found
      target,
      msg: `arr[${i}] = ${arr[i]} ≠ ${target}. Moving to next.`,
      done: false,
    });
  }

  // ===== TARGET NOT FOUND =====
  // Went through entire array without finding target
  steps.push({
    type: 'not-found',  // Search failed
    arr: [...arr],
    currentIdx: -1,  // No valid current index
    scannedIdx: Array.from({ length: n }, (_, k) => k),  // All indices scanned
    foundIdx: -1,  // Nothing found
    target,
    msg: `✗ ${target} not found. Scanned all ${n} elements — O(n) worst case.`,
    done: true,  // Search complete
  });

  return steps;
}

// ===== GENERATE DEFAULT INPUT =====
// Returns a sample array for initial visualization
export function generateDefaultInput() {
  return [14, 52, 7, 38, 91, 23, 65, 11, 47, 83, 30, 56, 19, 72, 4];
}

// ===== PARSE AND VALIDATE CUSTOM INPUT =====
export function parseCustomInput(raw) {
  // Split by comma and convert to integers
  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);  // Valid: 1-999
  
  // ===== VALIDATION =====
  if (parsed.length < 2) throw new Error('Enter at least 2 numbers, comma-separated.');
  if (parsed.length > 24) throw new Error('Max 24 elements for clear visualization.');
  return parsed;
}