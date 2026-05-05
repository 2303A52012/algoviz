// ===== QUICK SORT STEP GENERATOR =====
// Lomuto partition scheme
// Captures: pivot position, left zone, right zone, scanning pointer

export function generateSteps(inputArr, pivotStrategy = 'middle') {
  const steps = [];
  const arr = [...inputArr];
  const n = arr.length;

  // Track sorted positions (pivot settled)
  const settledIndices = new Set();

  function getPivotIdx(lo, hi) {
    if (pivotStrategy === 'first')  return lo;
    if (pivotStrategy === 'last')   return hi;
    return Math.floor((lo + hi) / 2); // middle
  }

  steps.push({
    type: 'init',
    arr: [...arr],
    pivotIdx: -1, pivotVal: null,
    lo: 0, hi: n - 1,
    scanIdx: -1,
    leftZone: [], rightZone: [],
    settled: [],
    depth: 0,
    msg: `Starting Quick Sort (${pivotStrategy} pivot). Partitioning [0..${n-1}].`,
    done: false,
  });

  function partition(lo, hi, depth) {
    const pivotSrcIdx = getPivotIdx(lo, hi);
    const pivotVal    = arr[pivotSrcIdx];

    // Move pivot to end
    [arr[pivotSrcIdx], arr[hi]] = [arr[hi], arr[pivotSrcIdx]];

    steps.push({
      type: 'pivot-chosen',
      arr: [...arr],
      pivotIdx: hi, pivotVal,
      lo, hi, scanIdx: -1,
      leftZone: [], rightZone: [],
      settled: [...settledIndices],
      depth,
      msg: `Partition [${lo}..${hi}]: pivot = ${pivotVal} (${pivotStrategy} of [${arr.slice(lo, hi+1).join(', ')}]) → moved to end at index ${hi}.`,
      done: false,
    });

    let i = lo - 1; // boundary of left zone

    for (let j = lo; j < hi; j++) {
      const leftZone  = Array.from({ length: i - lo + 1 }, (_, k) => lo + k);
      const rightZone = Array.from({ length: j - lo - (i - lo + 1) }, (_, k) => lo + (i - lo + 1) + k);

      steps.push({
        type: 'scan',
        arr: [...arr],
        pivotIdx: hi, pivotVal,
        lo, hi, scanIdx: j,
        leftZone, rightZone,
        settled: [...settledIndices],
        depth,
        msg: `Compare arr[${j}] = ${arr[j]} with pivot ${pivotVal}: ${arr[j] <= pivotVal ? `${arr[j]} ≤ ${pivotVal} → goes to LEFT zone` : `${arr[j]} > ${pivotVal} → goes to RIGHT zone`}`,
        done: false,
      });

      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            type: 'swap',
            arr: [...arr],
            pivotIdx: hi, pivotVal,
            lo, hi, scanIdx: j,
            swapping: [i, j],
            leftZone: Array.from({ length: i - lo + 1 }, (_, k) => lo + k),
            rightZone: [],
            settled: [...settledIndices],
            depth,
            msg: `arr[${j}] belongs in left zone → swap arr[${i}] ↔ arr[${j}]`,
            done: false,
          });
        }
      }
    }

    // Place pivot in final position
    const pivotFinal = i + 1;
    [arr[pivotFinal], arr[hi]] = [arr[hi], arr[pivotFinal]];
    settledIndices.add(pivotFinal);

    steps.push({
      type: 'pivot-placed',
      arr: [...arr],
      pivotIdx: pivotFinal, pivotVal,
      lo, hi, scanIdx: -1,
      leftZone:  Array.from({ length: pivotFinal - lo }, (_, k) => lo + k),
      rightZone: Array.from({ length: hi - pivotFinal }, (_, k) => pivotFinal + 1 + k),
      settled: [...settledIndices],
      depth,
      msg: `Pivot ${pivotVal} placed at final position ${pivotFinal}. Left: [${arr.slice(lo, pivotFinal).join(', ')}] | Pivot: ${pivotVal} | Right: [${arr.slice(pivotFinal+1, hi+1).join(', ')}]`,
      done: false,
    });

    return pivotFinal;
  }

  function quickSort(lo, hi, depth) {
    if (lo >= hi) {
      if (lo === hi) {
        settledIndices.add(lo);
        steps.push({
          type: 'base-case',
          arr: [...arr],
          pivotIdx: lo, pivotVal: arr[lo],
          lo, hi, scanIdx: -1,
          leftZone: [], rightZone: [],
          settled: [...settledIndices],
          depth,
          msg: `Base case: single element ${arr[lo]} at index ${lo} — already in place.`,
          done: false,
        });
      }
      return;
    }

    const p = partition(lo, hi, depth);
    quickSort(lo, p - 1, depth + 1);
    quickSort(p + 1, hi, depth + 1);
  }

  quickSort(0, n - 1, 0);

  steps.push({
    type: 'done',
    arr: [...arr],
    pivotIdx: -1, pivotVal: null,
    lo: 0, hi: n - 1,
    scanIdx: -1,
    leftZone: [], rightZone: [],
    settled: Array.from({ length: n }, (_, i) => i),
    depth: 0,
    msg: `Quick Sort complete! (${pivotStrategy} pivot strategy). Average O(n log n) — pivot choice matters!`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  return [52, 18, 73, 9, 34, 61, 27, 85, 42, 16, 68, 31];
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