// ===== DISK SCHEDULING STEPS GENERATOR =====
import { diskFCFS, diskSSTF, diskSCAN, diskCSCAN, diskLOOK, diskCLOOK } from './diskSchedulers';

const DISK_ALGO_FN_MAP = {
  fcfs:  (r, i, d) => diskFCFS(r, i),
  sstf:  (r, i, d) => diskSSTF(r, i),
  scan:  (r, i, d) => diskSCAN(r, i, d, 'up'),
  cscan: (r, i, d) => diskCSCAN(r, i, d),
  look:  (r, i, d) => diskLOOK(r, i, 'up'),
  clook: (r, i, d) => diskCLOOK(r, i),
};

export function generateDiskSteps(requests, initial, diskSize, algoId) {
  const normAlgoId = algoId === 'disk-fcfs' ? 'fcfs' : algoId;
  const fn = DISK_ALGO_FN_MAP[normAlgoId];
  if (!fn || !requests || requests.length === 0) return [];

  const result = fn(requests, initial, diskSize);
  const seq = result.sequence;
  const steps = [];

  for (let s = 0; s < seq.length; s++) {
    const headPos = seq[s];
    const visSeq = seq.slice(0, s + 1);
    const isDone = s === seq.length - 1;

    let msg = '';
    if (s === 0) {
      msg = `Initial head position set at cylinder ${initial}.`;
    } else {
      const ev = result.events[s - 1];
      msg = ev ? ev.msg : `Head moved to cylinder ${headPos}.`;
    }

    steps.push({
      type: isDone ? 'done' : 'seek',
      animStep: s,
      headPos,
      visSeq,
      result,
      msg: `[Seek #${s}] ${msg}`,
      done: isDone
    });
  }

  return steps;
}
