export function generateDefaultInput() {
  return [61, 23, 74, 11, 45, 9, 38, 85, 2, 54, 17, 30];
}

export function parseCustomInput(str) {
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > 20) {
    throw new Error('Please enter between 2 and 20 numbers.');
  }
  const arr = parts.map(p => {
    const n = parseInt(p, 10);
    if (isNaN(n) || n < 1 || n > 999) throw new Error('Numbers must be between 1 and 999.');
    return n;
  });
  return arr;
}

export function generateSteps(initialArr) {
  const arr = [...initialArr];
  const steps = [];
  const n = arr.length;
  
  steps.push({
    arr: [...arr],
    gap: -1,
    comparingIdx: -1,
    gapPartnerIdx: -1,
    msg: 'Starting Shell Sort...',
    activeLine: 0,
  });

  // Shell sort with standard gap sequence N/2, N/4, ..., 1
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      arr: [...arr],
      gap,
      comparingIdx: -1,
      gapPartnerIdx: -1,
      msg: `Current Gap: ${gap}`,
      activeLine: 1,
    });

    for (let i = gap; i < n; i += 1) {
      let temp = arr[i];
      let j;
      
      steps.push({
        arr: [...arr],
        gap,
        comparingIdx: i,
        gapPartnerIdx: i - gap,
        msg: `Comparing elements at gap ${gap}: arr[${i}] (${temp}) and arr[${i - gap}] (${arr[i - gap]})`,
        activeLine: 4,
      });

      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        steps.push({
          arr: [...arr],
          gap,
          comparingIdx: j,
          gapPartnerIdx: j - gap,
          msg: `${arr[j - gap]} is greater than ${temp}, shifting ${arr[j - gap]} to right by ${gap}`,
          activeLine: 5,
        });
        
        arr[j] = arr[j - gap];
        
        steps.push({
          arr: [...arr],
          gap,
          comparingIdx: j - gap,
          gapPartnerIdx: -1,
          msg: `Shifted.`,
          activeLine: 6,
        });
      }
      
      arr[j] = temp;
      steps.push({
        arr: [...arr],
        gap,
        comparingIdx: -1,
        gapPartnerIdx: j,
        msg: `Inserted ${temp} at index ${j}`,
        activeLine: 8,
      });
    }
  }

  steps.push({
    arr: [...arr],
    gap: 0,
    comparingIdx: -1,
    gapPartnerIdx: -1,
    msg: 'Shell Sort Complete!',
    activeLine: 10,
  });

  return steps;
}
