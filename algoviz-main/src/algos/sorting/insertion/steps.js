// ===== INSERTION SORT STEP GENERATOR =====

export function generateSteps(inputArr) {
  const steps = [];
  const arr = [...inputArr];
  const n = arr.length;

  steps.push({
    type: 'init',
    arr: [...arr],
    sortedCount: 1,       // first element is trivially sorted
    pickedIdx: -1,
    pickedVal: null,
    comparingIdx: -1,
    insertAt: -1,
    shiftingRange: [],
    msg: `Starting Insertion Sort on ${n} elements. Index 0 (${arr[0]}) is trivially sorted. We pick each remaining element and insert it into the sorted left portion.`,
    done: false,
  });

  for (let i = 1; i < n; i++) {
    const pickedVal = arr[i];

    // Pick up the element
    steps.push({
      type: 'pick',
      arr: [...arr],
      sortedCount: i,
      pickedIdx: i,
      pickedVal,
      comparingIdx: -1,
      insertAt: -1,
      shiftingRange: [],
      msg: `Picking up arr[${i}] = ${pickedVal}. Will find its correct position in the sorted region [0..${i - 1}].`,
      done: false,
    });

    let j = i - 1;
    const shifting = [];

    // Compare and shift
    while (j >= 0 && arr[j] > pickedVal) {
      steps.push({
        type: 'compare',
        arr: [...arr],
        sortedCount: i,
        pickedIdx: i,
        pickedVal,
        comparingIdx: j,
        insertAt: -1,
        shiftingRange: [...shifting],
        msg: `Comparing held value ${pickedVal} with arr[${j}] = ${arr[j]}. Since ${arr[j]} > ${pickedVal}, shift arr[${j}] one position right.`,
        done: false,
      });

      arr[j + 1] = arr[j];
      shifting.push(j + 1);

      steps.push({
        type: 'shift',
        arr: [...arr],
        sortedCount: i,
        pickedIdx: i,
        pickedVal,
        comparingIdx: j,
        insertAt: -1,
        shiftingRange: [...shifting],
        msg: `Shifted arr[${j}] = ${arr[j]} → position ${j + 1}. Gap opens at index ${j}.`,
        done: false,
      });

      j--;
    }

    // Show where it will be inserted
    const insertAt = j + 1;
    steps.push({
      type: 'pre-insert',
      arr: [...arr],
      sortedCount: i,
      pickedIdx: i,
      pickedVal,
      comparingIdx: -1,
      insertAt,
      shiftingRange: [...shifting],
      msg: j >= 0
        ? `arr[${j}] = ${arr[j]} ≤ ${pickedVal}. Correct position found: index ${insertAt}.`
        : `Reached start of array. ${pickedVal} goes at index 0.`,
      done: false,
    });

    arr[insertAt] = pickedVal;

    steps.push({
      type: 'insert',
      arr: [...arr],
      sortedCount: i + 1,
      pickedIdx: -1,
      pickedVal: null,
      comparingIdx: -1,
      insertAt,
      shiftingRange: [],
      justInserted: insertAt,
      msg: `Inserted ${pickedVal} at index ${insertAt}. Sorted region is now [0..${i}] — ${i + 1} elements.`,
      done: false,
    });
  }

  steps.push({
    type: 'done',
    arr: [...arr],
    sortedCount: n,
    pickedIdx: -1,
    pickedVal: null,
    comparingIdx: -1,
    insertAt: -1,
    shiftingRange: [],
    msg: `Insertion Sort complete! All ${n} elements sorted. The left portion grew one element per pass until it consumed the whole array.`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  return [41, 12, 64, 7, 33, 90, 22, 55, 18, 76, 45, 3];
}

export function parseCustomInput(raw) {
  const parsed = raw
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => !isNaN(n) && n > 0 && n <= 999);
  if (parsed.length < 2)  throw new Error('Enter at least 2 numbers (1–999), comma-separated.');
  if (parsed.length > 20) throw new Error('Max 20 elements for clear visualization.');
  return parsed;
}
