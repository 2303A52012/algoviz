// ===== BUBBLE SORT STEP GENERATOR =====
// Each step captures full array state + what's happening

export function generateSteps(inputArr) {
  const steps = [];
  const arr = [...inputArr];
  const n = arr.length;
  const sortedFrom = n; // tracks where sorted region starts (from right)

  steps.push({
    type: 'init',
    arr: [...arr],
    comparing: [],
    swapping: [],
    sortedFrom: n,
    msg: `Starting Bubble Sort on ${n} elements. We will make up to ${n - 1} passes.`,
    done: false,
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;

    steps.push({
      type: 'pass-start',
      arr: [...arr],
      comparing: [],
      swapping: [],
      sortedFrom: n - i,
      passNum: i + 1,
      msg: `Pass ${i + 1}: scanning from index 0 to ${n - i - 2}, comparing adjacent pairs.`,
      done: false,
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      steps.push({
        type: 'compare',
        arr: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sortedFrom: n - i,
        msg: `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}`,
        done: false,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedThisPass = true;

        steps.push({
          type: 'swap',
          arr: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sortedFrom: n - i,
          msg: `${arr[j + 1]} > ${arr[j]} — swapping! arr[${j}] ↔ arr[${j + 1}]`,
          done: false,
        });
      } else {
        steps.push({
          type: 'no-swap',
          arr: [...arr],
          comparing: [],
          swapping: [],
          sortedFrom: n - i,
          msg: `${arr[j]} ≤ ${arr[j + 1]} — already in order, no swap needed.`,
          done: false,
        });
      }
    }

    // After each pass, the rightmost unsorted element is now in place
    steps.push({
      type: 'pass-end',
      arr: [...arr],
      comparing: [],
      swapping: [],
      sortedFrom: n - i - 1,
      passNum: i + 1,
      justSorted: n - i - 1,
      msg: `Pass ${i + 1} complete. ${arr[n - i - 1]} is now in its final position at index ${n - i - 1}.`,
      done: false,
    });

    // Early exit optimization
    if (!swappedThisPass) {
      steps.push({
        type: 'early-exit',
        arr: [...arr],
        comparing: [],
        swapping: [],
        sortedFrom: 0,
        msg: `No swaps in pass ${i + 1} — array is already sorted! Early exit.`,
        done: true,
      });
      return steps;
    }
  }

  steps.push({
    type: 'done',
    arr: [...arr],
    comparing: [],
    swapping: [],
    sortedFrom: 0,
    msg: `Bubble Sort complete! All ${n} elements are sorted.`,
    done: true,
  });

  return steps;
}

export function generateDefaultInput() {
  return [64, 34, 25, 12, 22, 11, 90, 42, 55, 7, 38, 16];
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
