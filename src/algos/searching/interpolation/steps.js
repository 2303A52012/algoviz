export function generateDefaultInput() {
  const arr = [];
  let val = 5;
  for (let i = 0; i < 15; i++) {
    arr.push(val);
    val += Math.floor(Math.random() * 5) + 2; // Roughly uniform distribution
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

  while (l <= r && target >= arr[l] && target <= arr[r]) {
    comparisons++;

    if (l === r) {
      if (arr[l] === target) {
        steps.push({
          type: 'found',
          arr: [...arr], lo: l, hi: r, pos: l, target, eliminated: [...eliminated], comparisons,
          msg: `Found ${target} at index ${l}`,
          activeLine: 6,
        });
      } else {
        steps.push({
          type: 'not-found',
          arr: [...arr], lo: l, hi: r, pos: -1, target, eliminated: [...eliminated], comparisons,
          msg: `${target} not found.`,
          activeLine: 7,
        });
      }
      return steps;
    }

    // Probing the position with keeping uniform distribution in mind.
    let pos = l + Math.floor(((target - arr[l]) * (r - l)) / (arr[r] - arr[l]));

    steps.push({
      type: 'mid-check',
      arr: [...arr], lo: l, hi: r, pos, target, eliminated: [...eliminated], comparisons,
      msg: `pos = ${l} + floor([(${target} - ${arr[l]}) * (${r} - ${l})] / (${arr[r]} - ${arr[l]})) = ${pos}`,
      activeLine: 9,
    });

    if (arr[pos] === target) {
      steps.push({
        type: 'found',
        arr: [...arr], lo: l, hi: r, pos, target, eliminated: [...eliminated], comparisons,
        msg: `Found ${target} at pos (index ${pos})`,
        activeLine: 10,
      });
      return steps;
    }

    if (arr[pos] < target) {
      const newlyEliminated = [];
      for (let i = l; i <= pos; i++) {
        if (!eliminated.includes(i)) newlyEliminated.push(i);
      }
      eliminated = [...eliminated, ...newlyEliminated];
      
      steps.push({
        type: 'eliminate',
        arr: [...arr], lo: l, hi: r, pos, target, eliminated: [...eliminated], comparisons,
        msg: `${target} > ${arr[pos]}, searching right side.`,
        activeLine: 11,
      });
      l = pos + 1;
    } else {
      const newlyEliminated = [];
      for (let i = pos; i <= r; i++) {
        if (!eliminated.includes(i)) newlyEliminated.push(i);
      }
      eliminated = [...eliminated, ...newlyEliminated];

      steps.push({
        type: 'eliminate',
        arr: [...arr], lo: l, hi: r, pos, target, eliminated: [...eliminated], comparisons,
        msg: `${target} < ${arr[pos]}, searching left side.`,
        activeLine: 12,
      });
      r = pos - 1;
    }
  }

  // Not found
  steps.push({
    type: 'not-found',
    arr: [...arr], lo: l, hi: r, pos: -1, target, eliminated: [...eliminated], comparisons,
    msg: `${target} not found in the array or out of bounds.`,
    activeLine: 14,
  });

  return steps;
}
