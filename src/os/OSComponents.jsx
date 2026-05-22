import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DISK_ALGORITHMS } from './diskSchedulers';
import './OSPage.css';



// ─── Constants ───────────────────────────────────────────────────────────────
const SPEED_MS = { 1: 1200, 2: 600, 3: 250, 4: 80, 5: 20 };
const STATE_COLORS = {
  new: '#a855f7', ready: '#3b82f6', running: '#22c55e',
  waiting: '#f59e0b', terminated: '#4a6080',
};

// ─── ProcessStateDiagram ─────────────────────────────────────────────────────
function ProcessStateDiagram({ activeStates }) {
  const states = [
    { id: 'new', label: 'NEW', x: 20, y: 50 },
    { id: 'ready', label: 'READY', x: 120, y: 10 },
    { id: 'running', label: 'RUNNING', x: 220, y: 50 },
    { id: 'waiting', label: 'WAITING', x: 120, y: 90 },
    { id: 'terminated', label: 'EXIT', x: 320, y: 50 },
  ];
  const arrows = [
    { from: [60,55], to: [118,30], label: 'admitted' },
    { from: [157,20], to: [218,46], label: 'scheduled' },
    { from: [258,54], to: [158,24], label: 'preempt' },
    { from: [240,62], to: [160,90], label: 'I/O wait' },
    { from: [118,90], to: [158,34], label: 'I/O done' },
    { from: [260,50], to: [318,50], label: 'exit' },
  ];

  return (
    <svg viewBox="0 0 380 120" style={{ width: '100%', maxHeight: 120 }}>
      {arrows.map((a, i) => (
        <g key={i}>
          <defs>
            <marker id={`arr${i}`} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#2a4070" />
            </marker>
          </defs>
          <line x1={a.from[0]} y1={a.from[1]} x2={a.to[0]} y2={a.to[1]}
            stroke="#2a4070" strokeWidth="1" markerEnd={`url(#arr${i})`} />
          <text x={(a.from[0]+a.to[0])/2} y={(a.from[1]+a.to[1])/2 - 3}
            fontSize="5" fill="#4a6080" textAnchor="middle">{a.label}</text>
        </g>
      ))}
      {states.map(s => {
        const active = activeStates?.includes(s.id);
        const col = STATE_COLORS[s.id];
        return (
          <g key={s.id}>
            <rect x={s.x} y={s.y} width={s.id==='running'?58:s.id==='terminated'?38:44}
              height={22} rx="4"
              fill={active ? col + '33' : '#0c1220'}
              stroke={active ? col : '#1e3050'}
              strokeWidth={active ? 1.5 : 1}
            />
            {active && <rect x={s.x} y={s.y} width={s.id==='running'?58:s.id==='terminated'?38:44}
              height={22} rx="4" fill={col} opacity=".08">
              <animate attributeName="opacity" values=".08;.18;.08" dur="1s" repeatCount="indefinite"/>
            </rect>}
            <text x={s.x + (s.id==='running'?29:s.id==='terminated'?19:22)} y={s.y+14}
              fontSize="7" fontWeight="700" fill={active ? col : '#4a6080'} textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── CPUBlock ────────────────────────────────────────────────────────────────
function CPUBlock({ running, simTime, totalBurst }) {
  const pct = totalBurst > 0 ? Math.min(100, (simTime / totalBurst) * 100) : 0;
  const state = running ? (running === '__switching__' ? 'switching' : 'running') : 'idle';

  return (
    <div className={`cpu-box ${state}`}>
      <div className="cpu-icon">🖥️</div>
      <div className="cpu-info">
        <div className="cpu-state-label">CPU — {state.toUpperCase()}</div>
        <div className="cpu-process-name" style={{ color: running && running !== '__switching__' ? running.color : 'var(--text-muted)' }}>
          {state === 'running' ? running.pid : state === 'switching' ? 'Context Switch' : 'IDLE'}
        </div>
        {state === 'running' && (
          <div className="cpu-process-sub">
            burst: {running.burst}ms · priority: {running.priority}
          </div>
        )}
        <div className="cpu-exec-bar">
          <div className="cpu-exec-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className={`cpu-pulse ${state}`} />
    </div>
  );
}

// ─── ReadyQueueViz ───────────────────────────────────────────────────────────
function ReadyQueueViz({ queue, algoId }) {
  const isMLQ = algoId === 'mlq' || algoId === 'mlfq';

  if (isMLQ) {
    const q0 = queue.filter(p => p.queueLevel === 0);
    const q1 = queue.filter(p => p.queueLevel === 1);
    const q2 = queue.filter(p => p.queueLevel === 2);
    return (
      <div className="mlq-queues">
        {[['Q0 — High Priority (RR)', q0, '#22c55e'], ['Q1 — Medium (RR)', q1, '#f59e0b'], ['Q2 — Low (FCFS)', q2, '#ef4444']].map(([label, items, col]) => (
          <div className="mlq-queue" key={label} style={{ borderColor: col + '44' }}>
            <div className="mlq-queue-label" style={{ color: col }}>{label}</div>
            <div className="mlq-queue-track">
              {items.length === 0 ? <span className="queue-empty">empty</span> :
                items.map(p => (
                  <div key={p.pid} className="queue-block" style={{ borderColor: p.color, color: p.color, background: p.color + '18' }}>
                    {p.pid}
                    <span className="queue-block-sub">{p.remaining}ms</span>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="queue-track">
      {queue.length === 0
        ? <span className="queue-empty">Queue empty</span>
        : queue.map((p, i) => (
          <React.Fragment key={p.pid}>
            {i > 0 && <span className="queue-arrow">→</span>}
            <div className="queue-block" style={{ borderColor: p.color, color: p.color, background: p.color + '18' }}>
              {p.pid}
              <span className="queue-block-sub">{p.remaining}ms</span>
            </div>
          </React.Fragment>
        ))
      }
    </div>
  );
}

// ─── GanttChart ──────────────────────────────────────────────────────────────
function GanttChart({ gantt, currentTime }) {
  if (!gantt || gantt.length === 0) return (
    <div className="gantt-chart" style={{ color: 'var(--text-muted)', fontSize: 11, padding: 16 }}>
      Run a simulation to see the Gantt chart.
    </div>
  );
  const total = gantt[gantt.length - 1]?.end || 1;
  return (
    <div className="gantt-chart">
      <div className="gantt-track">
        {gantt.map((b, i) => {
          const w = ((b.end - b.start) / total) * 100;
          const isIdle = b.pid === 'IDLE';
          const isPast = b.end <= currentTime;
          return (
            <div key={i} title={`${b.pid} [${b.start}–${b.end}]`}
              className={`gantt-block ${isIdle ? 'idle' : ''}`}
              style={{
                width: `${Math.max(w, 1.5)}%`,
                background: isIdle ? undefined : b.color + (isPast ? 'cc' : '55'),
                borderRadius: 4,
                opacity: isPast || b.start <= currentTime ? 1 : 0.3,
              }}>
              <span className="gantt-block-label">{b.pid}</span>
            </div>
          );
        })}
      </div>
      <div className="gantt-times">
        {gantt.map((b, i) => (
          <div key={i} title={b.start} className="gantt-time"
            style={{ width: `${Math.max(((b.end - b.start) / total) * 100, 1.5)}%`, fontSize: 8, color: 'var(--text-dim)', textAlign: 'left', paddingLeft: 2 }}>
            {b.start}
          </div>
        ))}
        <div className="gantt-time" style={{ fontSize: 8, color: 'var(--text-dim)' }}>{total}</div>
      </div>
    </div>
  );
}

// ─── ExecLog ─────────────────────────────────────────────────────────────────
function ExecLog({ events, currentTime }) {
  const ref = useRef(null);
  const visible = events.filter(e => e.time <= currentTime);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [visible.length]);
  return (
    <div className="exec-log" ref={ref}>
      {visible.length === 0 && <div className="log-line"><span className="log-msg">Waiting to start…</span></div>}
      {visible.map((e, i) => (
        <div key={i} className="log-line">
          <span className="log-time">t={e.time}</span>
          <span className={`log-msg ${e.type || ''}`}>{e.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── StatsPanel ──────────────────────────────────────────────────────────────
function StatsPanel({ stats, processStats, processes }) {
  const s = stats || {};
  const metrics = [
    { label: 'Avg Wait', val: s.avgWT ?? '—', unit: 'ms' },
    { label: 'Avg TAT', val: s.avgTAT ?? '—', unit: 'ms' },
    { label: 'Avg RT', val: s.avgRT ?? '—', unit: 'ms' },
    { label: 'CPU Util', val: s.cpuUtilization ?? '—', unit: '%' },
    { label: 'Throughput', val: s.throughput ?? '—', unit: '/t' },
    { label: 'Ctx Switch', val: s.contextSwitches ?? '—', unit: '' },
  ];
  return (
    <div>
      <div className="stats-grid">
        {metrics.map(m => (
          <div key={m.label} className="stat-card">
            <span className="stat-card-val">{m.val}{m.unit && m.val !== '—' ? m.unit : ''}</span>
            <span className="stat-card-label">{m.label}</span>
          </div>
        ))}
      </div>
      {processStats && processes.length > 0 && (
        <div className="mt8">
          <table className="proc-result-table">
            <thead>
              <tr><th>PID</th><th>WT</th><th>TAT</th><th>RT</th></tr>
            </thead>
            <tbody>
              {processes.map(p => {
                const ps = processStats[p.pid] || {};
                return (
                  <tr key={p.pid}>
                    <td style={{ color: p.color }}>{p.pid}</td>
                    <td>{ps.wt ?? '—'}</td>
                    <td>{ps.tat ?? '—'}</td>
                    <td>{ps.rt >= 0 ? ps.rt : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── DiskScheduler ───────────────────────────────────────────────────────────
function DiskScheduler() {
  const [algoId, setAlgoId] = useState('fcfs');
  const [initial, setInitial] = useState(50);
  const [reqInput, setReqInput] = useState('176 79 34 60 92 11 41 114');
  const [diskSize, setDiskSize] = useState(200);
  const [result, setResult] = useState(null);
  const [animStep, setAnimStep] = useState(0);
  const timerRef = useRef(null);

  const run = useCallback(() => {
    const reqs = reqInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n < diskSize);
    const algo = DISK_ALGORITHMS.find(a => a.id === algoId);
    if (!algo || reqs.length === 0) return;
    const res = algo.fn(reqs, initial, diskSize);
    setResult(res);
    setAnimStep(0);
    clearInterval(timerRef.current);
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      setAnimStep(step);
      if (step >= res.sequence.length) clearInterval(timerRef.current);
    }, 400);
  }, [algoId, initial, reqInput, diskSize]);

  const toPercent = (val) => (val / diskSize) * 100;
  const seq = result?.sequence || [];
  const visSeq = seq.slice(0, Math.max(1, animStep + 1));

  return (
    <div className="disk-page">
      <div className="disk-layout">
        {/* Left */}
        <div className="disk-input-panel">
          <div className="os-panel-label">Disk Scheduling</div>
          <div className="proc-field" style={{ marginBottom: 8 }}>
            <label>Algorithm</label>
            <select value={algoId} onChange={e => setAlgoId(e.target.value)}
              style={{ background:'var(--bg-surface)', border:'1px solid var(--border-dim)', borderRadius:4, padding:'5px 7px', color:'var(--text-primary)', fontFamily:'var(--font-mono)', fontSize:11 }}>
              {DISK_ALGORITHMS.map(a => <option key={a.id} value={a.id}>{a.label} — {a.full}</option>)}
            </select>
          </div>
          <div className="proc-input-grid">
            <div className="proc-field">
              <label>Initial Head</label>
              <input type="number" min="0" max={diskSize-1} value={initial} onChange={e=>setInitial(+e.target.value)} />
            </div>
            <div className="proc-field">
              <label>Disk Size</label>
              <input type="number" min="50" max="500" value={diskSize} onChange={e=>setDiskSize(+e.target.value)} />
            </div>
          </div>
          <div className="proc-field mt4">
            <label>Request Queue (space or comma separated)</label>
            <input type="text" value={reqInput} onChange={e=>setReqInput(e.target.value)} style={{ fontFamily:'var(--font-mono)' }} />
          </div>
          <button className="os-ctrl-btn run mt8" style={{ width:'100%', marginTop:8 }} onClick={run}>▶ Run Simulation</button>

          {result && (
            <div className="mt8">
              <div className="disk-stats">
                <div className="disk-stat-item">
                  <span className="disk-stat-val">{result.totalSeek}</span>
                  <span className="disk-stat-label">Total Seek (cylinders)</span>
                </div>
                <div className="disk-stat-item">
                  <span className="disk-stat-val">{result.sequence.length - 1}</span>
                  <span className="disk-stat-label">Movements</span>
                </div>
              </div>
              <div className="exec-log mt8" style={{ maxHeight: 160 }}>
                {result.events.map((e, i) => (
                  <div key={i} className="log-line" style={{ opacity: i < animStep ? 1 : 0.3 }}>
                    <span className="log-msg">{e.msg}</span>
                    <span className="log-time">seek:{e.seek}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Disk Track */}
        <div className="disk-viz-panel">
          <div className="os-panel-label">Disk Head Movement Visualization</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
            Track: 0 → {diskSize - 1} | Blue dot = head | Circles = requests
          </div>
          <div className="disk-track">
            {/* Ruler lines */}
            {[0, 25, 50, 75, 100].map(pct => {
              const val = Math.round((pct / 100) * (diskSize - 1));
              return (
                <div key={pct}>
                  <div className="disk-ruler-line" style={{ left: `${pct}%` }} />
                  <div className="disk-ruler-label" style={{ left: `${pct}%` }}>{val}</div>
                </div>
              );
            })}

            {/* Request dots */}
            {result && result.requests.map((r, i) => {
              const served = result.sequence.indexOf(r) <= animStep;
              return (
                <div key={i} className="disk-request-dot"
                  style={{ left: `${toPercent(r)}%`, top: `${20 + (i % 8) * 30}px`,
                    background: served ? '#22c55e' : '#ef444488',
                    border: `2px solid ${served ? '#22c55e' : '#ef4444'}` }} />
              );
            })}

            {/* Path SVG */}
            {result && visSeq.length > 1 && (
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible' }}>
                <polyline
                  className="disk-seek-path"
                  points={visSeq.map((v, i) => `${toPercent(v)}%,${30 + i * 22}px`).join(' ')}
                />
              </svg>
            )}

            {/* Moving head */}
            {result && (
              <div className="disk-head"
                style={{ left: `${toPercent(visSeq[visSeq.length - 1] || initial)}%`,
                  top: `${30 + (Math.max(0, animStep)) * 22}px` }} />
            )}
          </div>
          {!result && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, color:'var(--text-muted)', fontSize:12 }}>
              Configure and run simulation to see visualization
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { ProcessStateDiagram, CPUBlock, ReadyQueueViz, GanttChart, ExecLog, StatsPanel };
export default DiskScheduler;
