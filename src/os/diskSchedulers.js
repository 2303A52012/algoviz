// ===== DISK SCHEDULING ALGORITHMS =====

function buildResult(sequence, requests, initial, totalSeek, events) {
  return { sequence, requests, initial, totalSeek, events };
}

// FCFS — serve in order of arrival
export function diskFCFS(requests, initial) {
  const events = [];
  let head = initial, total = 0;
  const sequence = [initial];
  for (const r of requests) {
    const seek = Math.abs(head - r);
    total += seek;
    events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (seek: ${seek})` });
    head = r;
    sequence.push(r);
  }
  return buildResult(sequence, requests, initial, total, events);
}

// SSTF — shortest seek time first
export function diskSSTF(requests, initial) {
  const events = [];
  const rem = [...requests];
  let head = initial, total = 0;
  const sequence = [initial];
  while (rem.length) {
    rem.sort((a, b) => Math.abs(a - head) - Math.abs(b - head));
    const r = rem.shift();
    const seek = Math.abs(head - r);
    total += seek;
    events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (closest, seek: ${seek})` });
    head = r;
    sequence.push(r);
  }
  return buildResult(sequence, requests, initial, total, events);
}

// SCAN (elevator) — goes to one end then reverses
export function diskSCAN(requests, initial, diskSize = 200, direction = 'up') {
  const events = [];
  let head = initial, total = 0;
  const sequence = [initial];
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < initial).reverse();
  const right = sorted.filter(r => r >= initial);

  const serve = (arr) => {
    for (const r of arr) {
      const seek = Math.abs(head - r);
      total += seek;
      events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (SCAN, seek: ${seek})` });
      head = r; sequence.push(r);
    }
  };

  if (direction === 'up') {
    serve(right);
    if (right.length) {
      // go to end
      const end = diskSize - 1;
      total += Math.abs(head - end);
      events.push({ from: head, to: end, seek: Math.abs(head - end), msg: `Move to disk end (${end})` });
      head = end; sequence.push(end);
    }
    serve(left);
  } else {
    serve(left);
    if (left.length) {
      total += Math.abs(head - 0);
      events.push({ from: head, to: 0, seek: Math.abs(head - 0), msg: `Move to disk start (0)` });
      head = 0; sequence.push(0);
    }
    serve(right);
  }
  return buildResult(sequence, requests, initial, total, events);
}

// C-SCAN — goes to end then jumps to start
export function diskCSCAN(requests, initial, diskSize = 200) {
  const events = [];
  let head = initial, total = 0;
  const sequence = [initial];
  const sorted = [...requests].sort((a, b) => a - b);
  const right = sorted.filter(r => r >= initial);
  const left = sorted.filter(r => r < initial);

  for (const r of right) {
    const seek = Math.abs(head - r);
    total += seek;
    events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (seek: ${seek})` });
    head = r; sequence.push(r);
  }
  if (left.length) {
    // jump to start
    total += Math.abs(head - (diskSize - 1)) + (diskSize - 1);
    events.push({ from: head, to: diskSize - 1, seek: diskSize - 1 - head, msg: `Move to disk end (${diskSize - 1})` });
    events.push({ from: diskSize - 1, to: 0, seek: diskSize - 1, msg: `Circular jump to start (0)` });
    head = 0; sequence.push(diskSize - 1); sequence.push(0);
    for (const r of left) {
      const seek = Math.abs(head - r);
      total += seek;
      events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (seek: ${seek})` });
      head = r; sequence.push(r);
    }
  }
  return buildResult(sequence, requests, initial, total, events);
}

// LOOK — like SCAN but only goes as far as needed
export function diskLOOK(requests, initial, direction = 'up') {
  const events = [];
  let head = initial, total = 0;
  const sequence = [initial];
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < initial).reverse();
  const right = sorted.filter(r => r >= initial);

  const serve = (arr) => {
    for (const r of arr) {
      const seek = Math.abs(head - r);
      total += seek;
      events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (LOOK, seek: ${seek})` });
      head = r; sequence.push(r);
    }
  };

  if (direction === 'up') { serve(right); serve(left); }
  else { serve(left); serve(right); }
  return buildResult(sequence, requests, initial, total, events);
}

// C-LOOK — circular LOOK
export function diskCLOOK(requests, initial) {
  const events = [];
  let head = initial, total = 0;
  const sequence = [initial];
  const sorted = [...requests].sort((a, b) => a - b);
  const right = sorted.filter(r => r >= initial);
  const left = sorted.filter(r => r < initial);

  for (const r of [...right, ...left]) {
    const seek = Math.abs(head - r);
    total += seek;
    events.push({ from: head, to: r, seek, msg: `Move head ${head} → ${r} (C-LOOK, seek: ${seek})` });
    head = r; sequence.push(r);
  }
  return buildResult(sequence, requests, initial, total, events);
}

export const DISK_ALGORITHMS = [
  { id: 'fcfs',  label: 'FCFS',  full: 'First Come First Serve', fn: diskFCFS },
  { id: 'sstf',  label: 'SSTF',  full: 'Shortest Seek Time First', fn: diskSSTF },
  { id: 'scan',  label: 'SCAN',  full: 'SCAN (Elevator)', fn: diskSCAN },
  { id: 'cscan', label: 'C-SCAN', full: 'Circular SCAN', fn: diskCSCAN },
  { id: 'look',  label: 'LOOK',  full: 'LOOK', fn: diskLOOK },
  { id: 'clook', label: 'C-LOOK', full: 'Circular LOOK', fn: diskCLOOK },
];
