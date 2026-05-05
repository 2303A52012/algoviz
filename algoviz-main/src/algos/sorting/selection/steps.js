// ===== SELECTION SORT STEP GENERATOR =====

export function generateSteps(inputArr) {
  const steps = [];
  const arr = [...inputArr];
  const n = arr.length;
  const sorted = new Set();

  steps.push({
    type: 'init',
    arr: [...arr],
    sortedBoundary: 0,
    scanning: -1,
    minIdx: -1,
    swapping: [],
    msg: `Starting Selection Sort on ${n} elements. Each pass finds the minimum of the unsorted region and places it at the front.`,
    done: false,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      type: 'pass-start',
      arr: [...arr],
      sortedBoundary: i,
      scanning: i,
      minIdx,
      swapping: [],
      passNum: i + 1,
      msg: `Pass ${i + 1}: finding the minimum in unsorted region [${i}..${n - 1}]. Starting with arr[${i}] = ${arr[i]} as current minimum.`,
      done: false,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        arr: [...arr],
        sortedBoundary: i,
        scanning: j,
        minIdx,
        swapping: [],
        msg: `Scanning index ${j}: arr[${j}] = ${arr[j]} vs current min arr[${minIdx}] = ${arr[minIdx]}`,
        done: false,
      });

      if (arr[j] < arr[minIdx]) {
        const oldMin = minIdx;
        minIdx = j;
        steps.push({
          type: 'new-min',
          arr: [...arr],
          sortedBoundary: i,
          scanning: j,
          minIdx,
          swapping: [],
          msg: `New minimum found! arr[${j}] = ${arr[j]} < arr[${oldMin}] = ${arr[oldMin]}. Minimum pointer moves to index ${j}.`,
          done: false,
        });
      }
    }

    // Swap minimum into position
    if (minIdx !== i) {
      steps.push({
        type: 'pre-swap',
        arr: [...arr],
        sortedBoundary: i,
        scanning: -1,
        minIdx,
        swapping: [i, minIdx],
        msg: `Scan complete. Minimum is arr[${minIdx}] = ${arr[minIdx]}. Swapping with arr[${i}] = ${arr[i]}.`,
        done: false,
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      steps.push({
        type: 'swap',
        arr: [...arr],
        sortedBoundary: i,
        scanning: -1,
        minIdx: i,
        swapping: [i, minIdx],
        msg: `Swapped! ${arr[i]} is now at index ${i}.`,
        done: false,
      });
    } else {
      steps.push({
        type: 'no-swap',
        arr: [...arr],
        sortedBoundary: i,
        scanning: -1,
        minIdx: i,
        swapping: [],
        msg: `Minimum arr[${i}] = ${arr[i]} is already in position ${i}. No swap needed.`,
        done: false,
      });
    }

    sorted.add(i);
    steps.push({
      type: 'placed',
      arr: [...arr],
      sortedBoundary: i + 1,
      scanning: -1,
      minIdx: -1,
      swapping: [],
      justPlaced: i,
      passNum: i + 1,
      msg: `Pass ${i + 1} complete. ${arr[i]} is now permanently in position ${i}.`,
      done: false,
    });
  }

  sorted.add(n - 1);
  steps.push({
    type: 'done',
    arr: [...arr],
    sortedBoundary: n,
    scanning: -1,
    minIdx: -1,
    swapping: [],
    msg: `Selection Sort complete! All ${n} elements sorted. Made exactly ${n - 1} swaps (one per pass).`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  return [64, 25, 12, 22, 11, 90, 38, 47, 5, 73, 16, 55];
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
