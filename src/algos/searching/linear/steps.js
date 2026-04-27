// ===== LINEAR SEARCH STEP GENERATOR =====

export function generateSteps(inputArr, target) {
  const steps = [];
  const arr = [...inputArr];
  const n = arr.length;

  steps.push({
    type: 'init',
    arr: [...arr],
    currentIdx: -1,
    scannedIdx: [],
    foundIdx: -1,
    target,
    msg: `Searching for ${target} in ${n} elements. Scanning left to right — no sorting required.`,
    done: false,
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      type: 'check',
      arr: [...arr],
      currentIdx: i,
      scannedIdx: Array.from({ length: i }, (_, k) => k),
      foundIdx: -1,
      target,
      msg: `Checking index ${i}: arr[${i}] = ${arr[i]} ${arr[i] === target ? `— MATCH! Found ${target}!` : `≠ ${target}, move right`}`,
      done: false,
    });

    if (arr[i] === target) {
      steps.push({
        type: 'found',
        arr: [...arr],
        currentIdx: i,
        scannedIdx: Array.from({ length: i }, (_, k) => k),
        foundIdx: i,
        target,
        msg: `✓ Found ${target} at index ${i}! Scanned ${i + 1} of ${n} elements.`,
        done: true,
      });
      return steps;
    }

    steps.push({
      type: 'miss',
      arr: [...arr],
      currentIdx: -1,
      scannedIdx: Array.from({ length: i + 1 }, (_, k) => k),
      foundIdx: -1,
      target,
      msg: `arr[${i}] = ${arr[i]} ≠ ${target}. Moving to next.`,
      done: false,
    });
  }

  steps.push({
    type: 'not-found',
    arr: [...arr],
    currentIdx: -1,
    scannedIdx: Array.from({ length: n }, (_, k) => k),
    foundIdx: -1,
    target,
    msg: `✗ ${target} not found. Scanned all ${n} elements — O(n) worst case.`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  return [14, 52, 7, 38, 91, 23, 65, 11, 47, 83, 30, 56, 19, 72, 4];
}

export function parseCustomInput(raw) {
  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);
  if (parsed.length < 2)  throw new Error('Enter at least 2 numbers, comma-separated.');
  if (parsed.length > 24) throw new Error('Max 24 elements for clear visualization.');
  return parsed;
}