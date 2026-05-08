export function generateDefaultInput() {
  const arr = [];
  let val = 5;
  for (let i = 0; i < 15; i++) {
    arr.push(val);
    val += Math.floor(Math.random() * 10) + 1;
  }
  return arr;
}

export function parseCustomInput(str) {
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 3 || parts.length > 25) {
    throw new Error('Please enter between 3 and 25 numbers.');
  }
  const arr = parts.map(p => {
    const n = parseInt(p, 10);
    if (isNaN(n) || n < -999 || n > 999) throw new Error('Numbers must be between -999 and 999.');
    return n;
  });
  return arr.sort((a, b) => a - b);
}

export function generateSteps(initialArr, target) {
  const arr = [...initialArr];
  const steps = [];
  
  let l = 0;
  let r = arr.length - 1;
  let eliminated = [];
  let comparisons = 0;

  while (l <= r) {
    let mid1 = l + Math.floor((r - l) / 3);
    let mid2 = r - Math.floor((r - l) / 3);

    comparisons += 2; // Rough approximation, typically checks mid1, then mid2

    steps.push({
      type: 'mid-check',
      arr: [...arr],
      lo: l,
      hi: r,
      mid1,
      mid2,
      target,
      eliminated: [...eliminated],
      comparisons,
      msg: `Checking mid1=${mid1} (${arr[mid1]}) and mid2=${mid2} (${arr[mid2]})`,
      activeLine: 3,
    });

    if (arr[mid1] === target) {
      steps.push({
        type: 'found',
        arr: [...arr],
        lo: l,
        hi: r,
        mid1,
        mid2,
        foundIdx: mid1,
        target,
        eliminated: [...eliminated],
        comparisons,
        msg: `Found ${target} at mid1 (index ${mid1})`,
        activeLine: 6,
      });
      return steps;
    }

    if (arr[mid2] === target) {
      steps.push({
        type: 'found',
        arr: [...arr],
        lo: l,
        hi: r,
        mid1,
        mid2,
        foundIdx: mid2,
        target,
        eliminated: [...eliminated],
        comparisons,
        msg: `Found ${target} at mid2 (index ${mid2})`,
        activeLine: 7,
      });
      return steps;
    }

    if (target < arr[mid1]) {
      // The key lies in between l and mid1
      const newlyEliminated = [];
      for (let i = mid1; i <= r; i++) {
        if (!eliminated.includes(i)) newlyEliminated.push(i);
      }
      eliminated = [...eliminated, ...newlyEliminated];
      
      steps.push({
        type: 'eliminate',
        arr: [...arr],
        lo: l,
        hi: r,
        mid1,
        mid2,
        target,
        eliminated: [...eliminated],
        comparisons,
        msg: `${target} < ${arr[mid1]}, searching left third.`,
        activeLine: 8,
      });
      r = mid1 - 1;
    } else if (target > arr[mid2]) {
      // The key lies in between mid2 and r
      const newlyEliminated = [];
      for (let i = l; i <= mid2; i++) {
        if (!eliminated.includes(i)) newlyEliminated.push(i);
      }
      eliminated = [...eliminated, ...newlyEliminated];

      steps.push({
        type: 'eliminate',
        arr: [...arr],
        lo: l,
        hi: r,
        mid1,
        mid2,
        target,
        eliminated: [...eliminated],
        comparisons,
        msg: `${target} > ${arr[mid2]}, searching right third.`,
        activeLine: 9,
      });
      l = mid2 + 1;
    } else {
      // The key lies in between mid1 and mid2
      const newlyEliminated = [];
      for (let i = l; i <= mid1; i++) {
        if (!eliminated.includes(i)) newlyEliminated.push(i);
      }
      for (let i = mid2; i <= r; i++) {
        if (!eliminated.includes(i)) newlyEliminated.push(i);
      }
      eliminated = [...eliminated, ...newlyEliminated];

      steps.push({
        type: 'eliminate',
        arr: [...arr],
        lo: l,
        hi: r,
        mid1,
        mid2,
        target,
        eliminated: [...eliminated],
        comparisons,
        msg: `${target} is between mid1 and mid2, searching middle third.`,
        activeLine: 10,
      });
      l = mid1 + 1;
      r = mid2 - 1;
    }
  }

  // Not found
  steps.push({
    type: 'not-found',
    arr: [...arr],
    lo: l,
    hi: r,
    mid1: -1,
    mid2: -1,
    target,
    eliminated: [...eliminated],
    comparisons,
    msg: `${target} not found in the array.`,
    activeLine: 12,
  });

  return steps;
}
