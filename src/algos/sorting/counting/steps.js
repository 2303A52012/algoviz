export function generateDefaultInput() {
  return [4, 2, 2, 8, 3, 3, 1, 9, 7, 4];
}

export function parseCustomInput(str) {
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > 20) {
    throw new Error('Please enter between 2 and 20 numbers.');
  }
  const arr = parts.map(p => {
    const n = parseInt(p, 10);
    if (isNaN(n) || n < 0 || n > 20) throw new Error('Numbers must be between 0 and 20 for Counting Sort visualization.');
    return n;
  });
  return arr;
}

export function generateSteps(initialArr) {
  const arr = [...initialArr];
  const steps = [];
  const n = arr.length;
  const max = Math.max(...arr, 0); // To handle empty array case gracefully though we enforce >=2 elements
  
  const counts = new Array(max + 1).fill(0);
  const output = new Array(n).fill(null);

  steps.push({
    arr: [...arr],
    counts: [...counts],
    output: [...output],
    phase: 'init',
    activeIdx: -1,
    countIdx: -1,
    msg: `Starting Counting Sort. Max value is ${max}. Created count array of size ${max + 1}.`,
    activeLine: 0,
  });

  // Step 1: Count frequencies
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    counts[val]++;
    steps.push({
      arr: [...arr],
      counts: [...counts],
      output: [...output],
      phase: 'counting',
      activeIdx: i,
      countIdx: val,
      msg: `Found ${val} at index ${i}. Incrementing count at index ${val}.`,
      activeLine: 6,
    });
  }

  // Step 2: Prefix sums (Cumulative counts)
  steps.push({
    arr: [...arr],
    counts: [...counts],
    output: [...output],
    phase: 'prefix-sum-start',
    activeIdx: -1,
    countIdx: -1,
    msg: 'Calculating prefix sums (cumulative counts) to determine final positions.',
    activeLine: 7,
  });

  for (let i = 1; i <= max; i++) {
    counts[i] += counts[i - 1];
    steps.push({
      arr: [...arr],
      counts: [...counts],
      output: [...output],
      phase: 'prefix-sum',
      activeIdx: -1,
      countIdx: i,
      msg: `counts[${i}] = counts[${i}] + counts[${i - 1}] -> ${counts[i]}`,
      activeLine: 8,
    });
  }

  // Step 3: Place in output array (iterate backwards for stability)
  steps.push({
    arr: [...arr],
    counts: [...counts],
    output: [...output],
    phase: 'placement-start',
    activeIdx: -1,
    countIdx: -1,
    msg: 'Placing elements into the output array. We iterate backwards to maintain stability.',
    activeLine: 9,
  });

  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = counts[val] - 1;
    
    steps.push({
      arr: [...arr],
      counts: [...counts],
      output: [...output],
      phase: 'placement-read',
      activeIdx: i,
      countIdx: val,
      msg: `Element ${val} at index ${i}. counts[${val}] is ${counts[val]}. It belongs at index ${pos}.`,
      activeLine: 10,
    });

    output[pos] = val;
    counts[val]--;

    steps.push({
      arr: [...arr],
      counts: [...counts],
      output: [...output],
      phase: 'placement-write',
      activeIdx: i,
      countIdx: val,
      msg: `Placed ${val} at index ${pos}. Decremented counts[${val}] to ${counts[val]}.`,
      activeLine: 11,
    });
  }

  steps.push({
    arr: [...arr],
    counts: [...counts],
    output: [...output],
    phase: 'done',
    activeIdx: -1,
    countIdx: -1,
    msg: 'Counting Sort Complete!',
    activeLine: 13,
  });

  return steps;
}
