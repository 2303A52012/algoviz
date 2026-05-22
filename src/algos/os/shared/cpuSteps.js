// ===== CPU SCHEDULING STEPS GENERATOR =====
import { fcfs, sjf, srtf, roundRobin, priority, multilevelQueue, mlfq } from './schedulers';

const ALGO_FN_MAP = {
  fcfs:      (p)    => fcfs(p),
  sjf:       (p)    => sjf(p),
  srtf:      (p)    => srtf(p),
  rr:        (p, q) => roundRobin(p, q),
  priority:  (p)    => priority(p, false),
  priorityp: (p)    => priority(p, true),
  mlq:       (p)    => multilevelQueue(p),
  mlfq:      (p)    => mlfq(p),
};

export function generateCpuSteps(processes, algoId, quantum = 3) {
  if (!processes || processes.length === 0) return [];
  
  let result;
  try {
    const fn = ALGO_FN_MAP[algoId];
    if (!fn) throw new Error(`Unknown algorithm: ${algoId}`);
    result = fn(processes, quantum);
  } catch (e) {
    console.error(e);
    return [];
  }

  const totalTime = result.gantt[result.gantt.length - 1]?.end ?? 0;
  const steps = [];

  // Step 0: Initial state before starting
  steps.push({
    type: 'init',
    simTime: 0,
    liveRunning: null,
    liveQueue: [],
    completedPids: new Set(),
    decision: 'Scheduler initialized. Click Play to start simulation.',
    events: [],
    activeTransition: null,
    stats: null,
    processStats: {},
    gantt: result.gantt,
    msg: 'Scheduler initialized. Ready to simulate.',
    done: false
  });

  // Tick-by-tick trace
  for (let t = 0; t <= totalTime; t++) {
    // 1. Find running process at time t
    const block = result.gantt.find(b => b.start <= t && b.end > t);
    const runningProc = block && block.pid !== 'IDLE'
      ? processes.find(p => p.pid === block.pid) : null;
    
    let liveRunning = null;
    if (runningProc) {
      const totalRunBefore = result.gantt
        .filter(b => b.pid === runningProc.pid && b.end <= t)
        .reduce((s, b) => s + (b.end - b.start), 0);
      const activeRun = (block.pid === runningProc.pid) ? (t - block.start) : 0;
      liveRunning = {
        ...runningProc,
        remaining: runningProc.burst - (totalRunBefore + activeRun)
      };
    }

    // 2. Completed PIDs at or before time t
    const completedPids = new Set(
      result.gantt.filter(b => b.end <= t && b.pid !== 'IDLE').map(b => b.pid)
    );

    // 3. Ready queue at time t
    const liveQueue = processes.filter(p =>
      p.arrival <= t && !completedPids.has(p.pid) && (!liveRunning || liveRunning.pid !== p.pid)
    ).map(p => {
      const runBefore = result.gantt
        .filter(b => b.pid === p.pid && b.end <= t)
        .reduce((s, b) => s + (b.end - b.start), 0);
      return {
        ...p,
        remaining: p.burst - runBefore,
        queueLevel: result.processStats?.[p.pid]?.queueLevel ?? 0
      };
    });

    // 4. Decision & active transition
    const currentEvents = result.events.filter(e => e.time === t);
    let activeTransition = null;
    if (currentEvents.length > 0) {
      const types = currentEvents.map(e => e.type);
      if (types.includes('preempt')) activeTransition = 'preempt';
      else if (types.includes('select')) activeTransition = 'select';
      else if (types.includes('done')) activeTransition = 'done';
      else if (types.includes('arrive')) activeTransition = 'arrive';
      else activeTransition = types[0] ?? null;
    } else {
      const lastEvent = result.events.filter(e => e.time <= t).pop();
      activeTransition = lastEvent?.type ?? null;
    }

    const lastEvent = result.events.filter(e => e.time <= t).pop();
    const decision = lastEvent ? lastEvent.msg : 'Awaiting scheduler dispatch event...';

    // 5. Final state check
    const isDone = t === totalTime;
    const stepMsg = isDone ? '✅ Simulation complete — all processes processed!' : decision;

    steps.push({
      type: isDone ? 'done' : activeTransition || 'run',
      simTime: t,
      liveRunning,
      liveQueue,
      completedPids,
      decision: stepMsg,
      events: result.events.filter(e => e.time <= t),
      activeTransition,
      stats: result.stats,
      processStats: result.processStats,
      gantt: result.gantt,
      msg: `[t=${t}ms] ${stepMsg}`,
      done: isDone
    });
  }

  return steps;
}
