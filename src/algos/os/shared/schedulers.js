// ===== CPU SCHEDULING ALGORITHMS ENGINE =====
// Each scheduler returns: { gantt, events, processStats, stats }

const CONTEXT_SWITCH_COST = 1; // time units for context switch

// ─── Helpers ────────────────────────────────────────────────────────────────
function initProc(p) {
  return {
    ...p,
    remaining: p.burst,
    wt: 0, tat: 0, rt: -1,
    startTime: -1, endTime: -1,
    state: 'new', // new|ready|running|waiting|terminated
  };
}

function makeEvent(time, msg, type = 'info', pid = null) {
  return { time, msg, type, pid };
}

// ─── FCFS ───────────────────────────────────────────────────────────────────
export function fcfs(processes) {
  const procs = processes.map(initProc).sort((a, b) => a.arrival - b.arrival);
  const gantt = [], events = [], procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });

  let time = 0;
  for (const p of procs) {
    if (time < p.arrival) {
      gantt.push({ pid: 'IDLE', start: time, end: p.arrival, type: 'idle' });
      events.push(makeEvent(time, `CPU idle — waiting for ${p.pid}`, 'idle'));
      time = p.arrival;
    }
    events.push(makeEvent(time, `${p.pid} selected (arrived first at t=${p.arrival})`, 'select', p.pid));
    const start = time;
    const end = time + p.burst;
    gantt.push({ pid: p.pid, start, end, type: 'run', color: p.color });
    procMap[p.pid].rt = start - p.arrival;
    procMap[p.pid].startTime = start;
    procMap[p.pid].endTime = end;
    procMap[p.pid].wt = start - p.arrival;
    procMap[p.pid].tat = end - p.arrival;
    events.push(makeEvent(end, `${p.pid} completed (TAT=${procMap[p.pid].tat}, WT=${procMap[p.pid].wt})`, 'done', p.pid));
    time = end;
  }
  return buildResult(procs, procMap, gantt, events);
}

// ─── SJF (Non-Preemptive) ───────────────────────────────────────────────────
export function sjf(processes) {
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });
  const done = new Set();
  let time = 0;

  while (done.size < procs.length) {
    const available = procs.filter(p => p.arrival <= time && !done.has(p.pid));
    if (available.length === 0) {
      const next = procs.filter(p => !done.has(p.pid)).sort((a, b) => a.arrival - b.arrival)[0];
      gantt.push({ pid: 'IDLE', start: time, end: next.arrival, type: 'idle' });
      events.push(makeEvent(time, `CPU idle — no process ready`, 'idle'));
      time = next.arrival;
      continue;
    }
    const p = available.sort((a, b) => a.burst - b.burst)[0];
    events.push(makeEvent(time, `${p.pid} selected — shortest burst (${p.burst}ms) among ${available.length} ready`, 'select', p.pid));
    const start = time;
    const end = time + p.burst;
    gantt.push({ pid: p.pid, start, end, type: 'run', color: p.color });
    procMap[p.pid].rt = start - p.arrival;
    procMap[p.pid].startTime = start;
    procMap[p.pid].endTime = end;
    procMap[p.pid].wt = start - p.arrival;
    procMap[p.pid].tat = end - p.arrival;
    events.push(makeEvent(end, `${p.pid} completed`, 'done', p.pid));
    done.add(p.pid);
    time = end;
  }
  return buildResult(procs, procMap, gantt, events);
}

// ─── SRTF (Shortest Remaining Time First — Preemptive SJF) ──────────────────
export function srtf(processes) {
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });

  let time = 0;
  let current = null;
  const done = new Set();
  const maxTime = procs.reduce((s, p) => s + p.burst, 0) + Math.max(...procs.map(p => p.arrival)) + 5;

  while (done.size < procs.length && time <= maxTime) {
    const available = procs.filter(p => p.arrival <= time && !done.has(p.pid));
    if (available.length === 0) { time++; continue; }

    const shortest = available.sort((a, b) =>
      procMap[a.pid].remaining - procMap[b.pid].remaining ||
      a.arrival - b.arrival
    )[0];

    if (current && current.pid !== shortest.pid) {
      events.push(makeEvent(time, `${shortest.pid} preempts ${current.pid} (remaining: ${procMap[shortest.pid].remaining} < ${procMap[current.pid].remaining})`, 'preempt', shortest.pid));
    }
    if (!current || current.pid !== shortest.pid) {
      events.push(makeEvent(time, `${shortest.pid} selected — shortest remaining (${procMap[shortest.pid].remaining}ms)`, 'select', shortest.pid));
    }

    if (procMap[shortest.pid].rt === -1) procMap[shortest.pid].rt = time - shortest.arrival;
    if (procMap[shortest.pid].startTime === -1) procMap[shortest.pid].startTime = time;

    const lastGantt = gantt[gantt.length - 1];
    if (lastGantt && lastGantt.pid === shortest.pid && lastGantt.end === time) {
      lastGantt.end = time + 1;
    } else {
      gantt.push({ pid: shortest.pid, start: time, end: time + 1, type: 'run', color: shortest.color });
    }

    procMap[shortest.pid].remaining--;
    current = shortest;
    time++;

    if (procMap[shortest.pid].remaining === 0) {
      procMap[shortest.pid].endTime = time;
      procMap[shortest.pid].wt = time - shortest.arrival - shortest.burst;
      procMap[shortest.pid].tat = time - shortest.arrival;
      events.push(makeEvent(time, `${shortest.pid} completed (TAT=${procMap[shortest.pid].tat})`, 'done', shortest.pid));
      done.add(shortest.pid);
      current = null;
    }
  }
  return buildResult(procs, procMap, gantt, events);
}

// ─── Round Robin ─────────────────────────────────────────────────────────────
export function roundRobin(processes, quantum = 3) {
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });

  let time = 0;
  const queue = [];
  const arrived = new Set();
  const done = new Set();
  let contextSwitches = 0;
  let lastPid = null;

  const addArrivals = (t) => {
    procs.filter(p => p.arrival <= t && !arrived.has(p.pid) && !done.has(p.pid))
      .sort((a, b) => a.arrival - b.arrival)
      .forEach(p => {
        queue.push(p.pid);
        arrived.add(p.pid);
        events.push(makeEvent(t, `${p.pid} entered ready queue`, 'arrive', p.pid));
      });
  };

  addArrivals(0);
  if (queue.length === 0 && procs.length > 0) {
    const firstArrival = Math.min(...procs.map(p => p.arrival));
    time = firstArrival;
    addArrivals(time);
  }

  while (done.size < procs.length) {
    if (queue.length === 0) {
      const nextArrival = procs.filter(p => !arrived.has(p.pid) && !done.has(p.pid))
        .map(p => p.arrival).sort((a, b) => a - b)[0];
      if (nextArrival === undefined) break;
      gantt.push({ pid: 'IDLE', start: time, end: nextArrival, type: 'idle' });
      events.push(makeEvent(time, `Queue empty — CPU idle`, 'idle'));
      time = nextArrival;
      addArrivals(time);
      continue;
    }

    const pid = queue.shift();
    const pm = procMap[pid];
    const proc = procs.find(p => p.pid === pid);

    if (pid !== lastPid && lastPid !== null) contextSwitches++;
    lastPid = pid;

    if (pm.rt === -1) pm.rt = time - proc.arrival;
    if (pm.startTime === -1) pm.startTime = time;

    const execTime = Math.min(quantum, pm.remaining);
    events.push(makeEvent(time, `${pid} running — quantum=${quantum}, remaining=${pm.remaining}ms`, 'select', pid));
    gantt.push({ pid, start: time, end: time + execTime, type: 'run', color: proc.color });
    pm.remaining -= execTime;
    time += execTime;

    addArrivals(time);

    if (pm.remaining === 0) {
      pm.endTime = time;
      pm.wt = time - proc.arrival - proc.burst;
      pm.tat = time - proc.arrival;
      done.add(pid);
      events.push(makeEvent(time, `${pid} completed (TAT=${pm.tat}, WT=${pm.wt})`, 'done', pid));
    } else {
      events.push(makeEvent(time, `${pid} quantum expired — moved back to queue (remaining: ${pm.remaining}ms)`, 'preempt', pid));
      queue.push(pid);
    }
  }
  return buildResult(procs, procMap, gantt, events, contextSwitches);
}

// ─── Priority (Non-Preemptive) ───────────────────────────────────────────────
export function priority(processes, preemptive = false) {
  if (preemptive) return priorityPreemptive(processes);
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });
  const done = new Set();
  let time = 0;

  while (done.size < procs.length) {
    const available = procs.filter(p => p.arrival <= time && !done.has(p.pid));
    if (available.length === 0) {
      const next = procs.filter(p => !done.has(p.pid)).sort((a, b) => a.arrival - b.arrival)[0];
      gantt.push({ pid: 'IDLE', start: time, end: next.arrival, type: 'idle' });
      time = next.arrival; continue;
    }
    const p = available.sort((a, b) => a.priority - b.priority)[0];
    events.push(makeEvent(time, `${p.pid} selected — highest priority (P=${p.priority}) among ${available.length} ready`, 'select', p.pid));
    const start = time; const end = time + p.burst;
    gantt.push({ pid: p.pid, start, end, type: 'run', color: p.color });
    procMap[p.pid].rt = start - p.arrival;
    procMap[p.pid].startTime = start;
    procMap[p.pid].endTime = end;
    procMap[p.pid].wt = start - p.arrival;
    procMap[p.pid].tat = end - p.arrival;
    events.push(makeEvent(end, `${p.pid} completed`, 'done', p.pid));
    done.add(p.pid); time = end;
  }
  return buildResult(procs, procMap, gantt, events);
}

function priorityPreemptive(processes) {
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });
  let time = 0, current = null;
  const done = new Set();
  const maxTime = procs.reduce((s, p) => s + p.burst, 0) + 10;

  while (done.size < procs.length && time <= maxTime) {
    const available = procs.filter(p => p.arrival <= time && !done.has(p.pid));
    if (available.length === 0) { time++; continue; }
    const best = available.sort((a, b) => a.priority - b.priority)[0];
    if (current && current.pid !== best.pid) {
      events.push(makeEvent(time, `${best.pid} preempts ${current.pid} (priority ${best.priority} > ${current.priority})`, 'preempt', best.pid));
    }
    if (!current || current.pid !== best.pid) {
      events.push(makeEvent(time, `${best.pid} selected — highest priority (P=${best.priority})`, 'select', best.pid));
    }
    if (procMap[best.pid].rt === -1) procMap[best.pid].rt = time - best.arrival;
    if (procMap[best.pid].startTime === -1) procMap[best.pid].startTime = time;
    const last = gantt[gantt.length - 1];
    if (last && last.pid === best.pid && last.end === time) last.end++;
    else gantt.push({ pid: best.pid, start: time, end: time + 1, type: 'run', color: best.color });
    procMap[best.pid].remaining--;
    current = best; time++;
    if (procMap[best.pid].remaining === 0) {
      procMap[best.pid].endTime = time;
      procMap[best.pid].wt = time - best.arrival - best.burst;
      procMap[best.pid].tat = time - best.arrival;
      events.push(makeEvent(time, `${best.pid} completed`, 'done', best.pid));
      done.add(best.pid); current = null;
    }
  }
  return buildResult(procs, procMap, gantt, events);
}

// ─── Multilevel Queue ────────────────────────────────────────────────────────
export function multilevelQueue(processes) {
  // Queue 0: priority 1 (highest) — Round Robin q=2
  // Queue 1: priority 2 — FCFS
  // Queue 2: priority 3+ — FCFS
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p }; });
  const done = new Set();
  let time = 0;
  const maxTime = procs.reduce((s, p) => s + p.burst + 2, 0) + 10;

  while (done.size < procs.length && time <= maxTime) {
    const all = procs.filter(p => p.arrival <= time && !done.has(p.pid));
    if (all.length === 0) { time++; continue; }
    const q0 = all.filter(p => p.priority === 1);
    const q1 = all.filter(p => p.priority === 2);
    const q2 = all.filter(p => p.priority >= 3);
    const queue = q0.length ? q0 : q1.length ? q1 : q2;
    const qid = q0.length ? 0 : q1.length ? 1 : 2;
    const p = queue.sort((a, b) => a.arrival - b.arrival)[0];
    const execTime = qid === 0 ? Math.min(2, procMap[p.pid].remaining) : procMap[p.pid].remaining;
    events.push(makeEvent(time, `${p.pid} running from Queue-${qid} (priority=${p.priority})`, 'select', p.pid));
    if (procMap[p.pid].rt === -1) procMap[p.pid].rt = time - p.arrival;
    if (procMap[p.pid].startTime === -1) procMap[p.pid].startTime = time;
    gantt.push({ pid: p.pid, start: time, end: time + execTime, type: 'run', color: p.color, queue: qid });
    procMap[p.pid].remaining -= execTime;
    time += execTime;
    if (procMap[p.pid].remaining === 0) {
      procMap[p.pid].endTime = time;
      procMap[p.pid].wt = time - p.arrival - p.burst;
      procMap[p.pid].tat = time - p.arrival;
      done.add(p.pid);
      events.push(makeEvent(time, `${p.pid} completed`, 'done', p.pid));
    }
  }
  return buildResult(procs, procMap, gantt, events);
}

// ─── Multilevel Feedback Queue ───────────────────────────────────────────────
export function mlfq(processes) {
  const procs = processes.map(initProc);
  const gantt = [], events = [];
  const procMap = {};
  procs.forEach(p => { procMap[p.pid] = { ...p, queueLevel: 0 }; });
  const queues = [[], [], []];
  const quantums = [4, 8, 0]; // q2 is FCFS
  const done = new Set();
  const arrived = new Set();
  let time = 0;
  const maxTime = procs.reduce((s, p) => s + p.burst + 2, 0) + 20;

  while (done.size < procs.length && time <= maxTime) {
    procs.filter(p => p.arrival <= time && !arrived.has(p.pid)).forEach(p => {
      queues[0].push(p.pid); arrived.add(p.pid);
      events.push(makeEvent(time, `${p.pid} entered Q0 (highest priority)`, 'arrive', p.pid));
    });

    let pid = null, qLevel = -1;
    for (let q = 0; q < 3; q++) {
      if (queues[q].length > 0) { pid = queues[q].shift(); qLevel = q; break; }
    }
    if (!pid) { time++; continue; }

    const pm = procMap[pid];
    const proc = procs.find(p => p.pid === pid);
    if (pm.rt === -1) pm.rt = time - proc.arrival;
    if (pm.startTime === -1) pm.startTime = time;

    const execTime = quantums[qLevel] > 0
      ? Math.min(quantums[qLevel], pm.remaining)
      : pm.remaining;

    events.push(makeEvent(time, `${pid} running in Q${qLevel} (quantum=${quantums[qLevel] || '∞'}, remaining=${pm.remaining})`, 'select', pid));
    gantt.push({ pid, start: time, end: time + execTime, type: 'run', color: proc.color, queue: qLevel });
    pm.remaining -= execTime;
    time += execTime;

    procs.filter(p => p.arrival <= time && !arrived.has(p.pid)).forEach(p => {
      queues[0].push(p.pid); arrived.add(p.pid);
      events.push(makeEvent(time, `${p.pid} entered Q0`, 'arrive', p.pid));
    });

    if (pm.remaining === 0) {
      pm.endTime = time; pm.wt = time - proc.arrival - proc.burst; pm.tat = time - proc.arrival;
      done.add(pid);
      events.push(makeEvent(time, `${pid} completed from Q${qLevel}`, 'done', pid));
    } else if (quantums[qLevel] > 0 && execTime === quantums[qLevel]) {
      const newLevel = Math.min(qLevel + 1, 2);
      pm.queueLevel = newLevel;
      queues[newLevel].push(pid);
      events.push(makeEvent(time, `${pid} demoted from Q${qLevel} → Q${newLevel} (quantum expired)`, 'preempt', pid));
    } else {
      queues[qLevel].push(pid);
    }
  }
  return buildResult(procs, procMap, gantt, events);
}

// ─── Build Result ────────────────────────────────────────────────────────────
function buildResult(procs, procMap, gantt, events, extraCtxSwitches = 0) {
  const n = procs.length;
  let totalWT = 0, totalTAT = 0, totalRT = 0, cpuBusy = 0, ctxSwitches = 0;

  gantt.forEach((g, i) => {
    if (g.pid !== 'IDLE') cpuBusy += g.end - g.start;
    if (i > 0 && g.pid !== 'IDLE' && gantt[i - 1].pid !== 'IDLE' && gantt[i - 1].pid !== g.pid) ctxSwitches++;
  });

  procs.forEach(p => {
    const pm = procMap[p.pid];
    totalWT += pm.wt || 0;
    totalTAT += pm.tat || 0;
    totalRT += pm.rt >= 0 ? pm.rt : 0;
  });

  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;

  return {
    gantt,
    events: events.sort((a, b) => a.time - b.time),
    processStats: procMap,
    stats: {
      avgWT: n > 0 ? (totalWT / n).toFixed(2) : 0,
      avgTAT: n > 0 ? (totalTAT / n).toFixed(2) : 0,
      avgRT: n > 0 ? (totalRT / n).toFixed(2) : 0,
      cpuUtilization: totalTime > 0 ? ((cpuBusy / totalTime) * 100).toFixed(1) : 0,
      throughput: totalTime > 0 ? (n / totalTime).toFixed(3) : 0,
      contextSwitches: ctxSwitches + extraCtxSwitches,
      totalTime,
    },
  };
}

// ─── Default process colors ──────────────────────────────────────────────────
export const PROCESS_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
  '#a855f7', '#14b8a6', '#f97316', '#ec4899',
  '#06b6d4', '#84cc16',
];

export const ALGORITHMS = [
  { id: 'fcfs',      label: 'FCFS',            full: 'First Come First Serve',     preemptive: false, fn: fcfs },
  { id: 'sjf',       label: 'SJF',             full: 'Shortest Job First',          preemptive: false, fn: sjf },
  { id: 'srtf',      label: 'SRTF',            full: 'Shortest Remaining Time First', preemptive: true, fn: srtf },
  { id: 'rr',        label: 'Round Robin',      full: 'Round Robin',                preemptive: true,  fn: null },
  { id: 'priority',  label: 'Priority',         full: 'Priority Scheduling',        preemptive: false, fn: (p) => priority(p, false) },
  { id: 'priorityP', label: 'Priority (P)',     full: 'Priority Scheduling (Preemptive)', preemptive: true, fn: (p) => priority(p, true) },
  { id: 'mlq',       label: 'MLQ',             full: 'Multilevel Queue',            preemptive: false, fn: multilevelQueue },
  { id: 'mlfq',      label: 'MLFQ',            full: 'Multilevel Feedback Queue',   preemptive: true,  fn: mlfq },
];
