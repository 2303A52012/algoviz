// ===== BINARY SEARCH STEP GENERATOR =====

export function generateSteps(inputArr, target) {
  const steps = [];
  const arr = [...inputArr].sort((a, b) => a - b); // must be sorted
  const n = arr.length;

  steps.push({
    type: 'init',
    arr: [...arr],
    lo: 0, hi: n - 1, mid: -1,
    eliminated: [],
    foundIdx: -1,
    target,
    comparisons: 0,
    msg: `Array sorted. Searching for ${target}. Each step eliminates half — O(log n) max ${Math.ceil(Math.log2(n))} steps for ${n} elements.`,
    done: false,
  });

  let lo = 0, hi = n - 1, comparisons = 0;
  const eliminated = [];

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    comparisons++;

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

    if (arr[mid] === target) {
      steps.push({
        type: 'found',
        arr: [...arr],
        lo, hi, mid,
        eliminated: [...eliminated],
        foundIdx: mid,
        target,
        comparisons,
        msg: `✓ arr[${mid}] = ${arr[mid]} = ${target}. Found in ${comparisons} comparison${comparisons > 1 ? 's' : ''}! (Binary search needed at most ${Math.ceil(Math.log2(n))} for this array.)`,
        done: true,
      });
      return steps;
    }

    if (arr[mid] < target) {
      // Eliminate left half
      for (let k = lo; k <= mid; k++) eliminated.push(k);
      steps.push({
        type: 'go-right',
        arr: [...arr],
        lo: mid + 1, hi, mid,
        eliminated: [...eliminated],
        foundIdx: -1,
        target,
        comparisons,
        msg: `arr[${mid}]=${arr[mid]} < ${target} → target is in RIGHT half. Eliminate [${lo}..${mid}] (${mid - lo + 1} elements gone).`,
        done: false,
      });
      lo = mid + 1;
    } else {
      // Eliminate right half
      for (let k = mid; k <= hi; k++) eliminated.push(k);
      steps.push({
        type: 'go-left',
        arr: [...arr],
        lo, hi: mid - 1, mid,
        eliminated: [...eliminated],
        foundIdx: -1,
        target,
        comparisons,
        msg: `arr[${mid}]=${arr[mid]} > ${target} → target is in LEFT half. Eliminate [${mid}..${hi}] (${hi - mid + 1} elements gone).`,
        done: false,
      });
      hi = mid - 1;
    }
  }

  steps.push({
    type: 'not-found',
    arr: [...arr],
    lo, hi, mid: -1,
    eliminated: Array.from({ length: n }, (_, i) => i),
    foundIdx: -1,
    target,
    comparisons,
    msg: `✗ lo(${lo}) > hi(${hi}) — search space exhausted. ${target} is not in the array. Used ${comparisons} comparisons.`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  // return unsorted — steps.js will sort it
  return [3, 14, 27, 35, 42, 58, 63, 71, 85, 90, 96, 102, 114, 127, 138];
}

export function parseCustomInput(raw) {
  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);
  if (parsed.length < 3)  throw new Error('Enter at least 3 numbers (1–999).');
  if (parsed.length > 20) throw new Error('Max 20 elements for clear visualization.');
  return [...parsed].sort((a, b) => a - b);
}