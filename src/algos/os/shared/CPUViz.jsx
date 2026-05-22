import React, { useState } from 'react';
import { generateCpuSteps } from './cpuSteps';
import { PROCESS_COLORS } from './schedulers';
import './CPUViz.css';

function genRandom(n = 4) {
  return Array.from({ length: n }, (_, i) => ({
    pid: `P${i + 1}`,
    arrival:  Math.floor(Math.random() * 5),
    burst:    Math.floor(Math.random() * 7) + 2,
    priority: Math.floor(Math.random() * 5) + 1,
    color: PROCESS_COLORS[i % PROCESS_COLORS.length],
  }));
}

export default function CPUViz({
  algoId,
  isRunning,
  isPaused,
  currentStep,
  stepIdx,
  onRunSteps,
  onReset,
}) {
  const [processes, setProcesses] = useState(() => genRandom(4));
  const [quantum,   setQuantum]   = useState(3);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkErr,   setBulkErr]   = useState('');
  const [newProc,   setNewProc]   = useState({ pid: 'P5', arrival: 0, burst: 5, priority: 1 });

  // Sync state from currentStep
  const simTime = currentStep ? currentStep.simTime : 0;
  const completedPids = currentStep ? currentStep.completedPids : new Set();
  const liveRunning = currentStep ? currentStep.liveRunning : null;
  const liveQueue = currentStep ? currentStep.liveQueue : [];
  const decision = currentStep ? currentStep.decision : 'Configure process pool and click Simulate to start.';
  const activeTransition = currentStep ? currentStep.activeTransition : null;

  const result = currentStep ? {
    gantt: currentStep.gantt,
    events: currentStep.events,
    processStats: currentStep.processStats,
    stats: currentStep.stats
  } : null;

  const isDone = currentStep?.type === 'done';
  const isActive = isRunning || isPaused;

  const unarrivedProcs = processes.filter(p => p.arrival > simTime);

  const getProcState = (p) => {
    if (!currentStep) return 'new';
    if (liveRunning?.pid === p.pid) return 'running';
    if (completedPids.has(p.pid)) return 'done';
    if (liveQueue.some(q => q.pid === p.pid)) return 'ready';
    return 'new';
  };

  const addProc = () => {
    if (isActive || processes.length >= 8) return;
    setProcesses(prev => [...prev, {
      ...newProc,
      color: PROCESS_COLORS[prev.length % PROCESS_COLORS.length],
    }]);
    setNewProc(p => ({ ...p, pid: `P${processes.length + 2}` }));
    onReset();
  };

  const handleRun = () => {
    if (processes.length === 0) return;
    const steps = generateCpuSteps(processes, algoId, quantum);
    onRunSteps(steps);
  };

  const handleLoadBulk = () => {
    if (isActive) return;
    setBulkErr('');
    try {
      const parts = bulkInput.trim().split(';');
      const parsed = [];
      let idx = 1;
      for (let part of parts) {
        part = part.trim();
        if (!part) continue;
        const vals = part.split(',').map(s => parseInt(s.trim()));
        if (vals.some(isNaN)) {
          throw new Error('All values must be valid integers.');
        }
        if (vals.length < 2) {
          throw new Error('Each process must have at least (Arrival, Burst).');
        }
        const arrival = vals[0];
        const burst = vals[1];
        const priority = vals[2] ?? 1;
        
        if (arrival < 0 || burst <= 0 || priority < 0) {
          throw new Error('Arrival/Priority must be >= 0, and Burst must be > 0.');
        }
        
        parsed.push({
          pid: `P${idx}`,
          arrival,
          burst,
          priority,
          color: PROCESS_COLORS[(idx - 1) % PROCESS_COLORS.length]
        });
        idx++;
      }
      
      if (parsed.length === 0) {
        throw new Error('Please enter at least one process.');
      }
      if (parsed.length > 8) {
        throw new Error('Max 8 processes for clear visualization.');
      }
      
      setProcesses(parsed);
      setBulkInput('');
      onReset();
    } catch (e) {
      setBulkErr(e.message);
    }
  };

  const totalTime = result?.gantt?.[result.gantt.length - 1]?.end ?? 0;
  const progress  = totalTime > 0 ? Math.min(100, (simTime / totalTime) * 100) : 0;

  return (
    <div className="cpuviz-root">

      {/* ═══ TOP CONTROLS BAR ═══ */}
      <div className="cpuviz-topbar">
        <div className="cpuviz-btn-group">
          {!isActive && !isDone &&
            <button className="cv-btn cv-run" onClick={handleRun} disabled={processes.length === 0}>▶ Run Scheduler</button>}
          {isActive &&
            <button className="cv-btn cv-run" disabled>⚡ Simulating…</button>}
          {isDone &&
            <button className="cv-btn cv-run" onClick={handleRun}>↺ Re-run</button>}
          <button className="cv-btn cv-reset" onClick={onReset}>✕ Reset</button>
          <button className="cv-btn cv-rand" disabled={isActive}
            onClick={() => { setProcesses(genRandom(4)); onReset(); }}>🎲 Random
          </button>
          {(algoId === 'rr' || algoId === 'mlq' || algoId === 'mlfq') && (
            <label className="cv-inline-label">
              <span>Quantum:</span>
              <input type="number" min="1" max="12" value={quantum}
                className="cv-num-input"
                disabled={isActive}
                onChange={e => { setQuantum(Math.max(1, +e.target.value)); onReset(); }} />
              <span>ms</span>
            </label>
          )}
        </div>

        {/* Glowing Clock */}
        <div className="cv-clock-box">
          <div className="cv-clock-label">SYSTEM CLOCK</div>
          <div className="cv-clock-val">t = {String(simTime).padStart(3, '0')} ms</div>
          <div className="cv-progress-bar">
            <div className="cv-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ═══ MAIN BODY ═══ */}
      <div className="cpuviz-body">

        {/* ── LEFT PANEL ── */}
        <div className="cpuviz-left">

          {/* Add Process */}
          <div className="cv-section">
            <div className="cv-section-title">➕ Create Custom Process</div>
            <div className="cv-form-grid">
              {[
                ['PID Name', 'pid',      'text'],
                ['Arrival',  'arrival',  'number'],
                ['Burst',    'burst',    'number'],
                ['Priority', 'priority', 'number'],
              ].map(([label, key, type]) => (
                <div key={key} className="cv-field">
                  <label className="cv-field-label">{label}</label>
                  <input
                    type={type} value={newProc[key]}
                    className="cv-field-input"
                    disabled={isActive}
                    onChange={e => setNewProc(p => ({
                      ...p, [key]: type === 'number' ? Math.max(0, +e.target.value) : e.target.value,
                    }))}
                  />
                </div>
              ))}
            </div>
            <button className="cv-add-btn" onClick={addProc} disabled={isActive || processes.length >= 8}>
              + Add to Process Pool {processes.length >= 8 && '(Max 8)'}
            </button>
          </div>

          {/* Bulk Copy-Paste Input */}
          <div className="cv-section">
            <div className="cv-section-title">📝 Bulk Load Workload</div>
            <div className="cv-field">
              <textarea
                className="cv-field-input text-mono"
                style={{ height: '60px', resize: 'none', fontSize: '11px' }}
                placeholder="e.g. 0,5,1; 2,3,2; 4,1,3 (Arrival,Burst,Priority)"
                value={bulkInput}
                disabled={isActive}
                onChange={e => setBulkInput(e.target.value)}
              />
            </div>
            <button className="cv-add-btn" onClick={handleLoadBulk} disabled={isActive || !bulkInput.trim()}>
              ⚡ Load Bulk Workload
            </button>
            {bulkErr && <div className="cv-bulk-err" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{bulkErr}</div>}
          </div>

          {/* Process Pool */}
          <div className="cv-section" style={{ flex: 1, overflow: 'hidden' }}>
            <div className="cv-section-title">📋 Process Pool ({processes.length})</div>
            <div className="cv-proc-table">
              <div className="cv-proc-thead">
                <span>PID</span><span>Arr</span><span>Burst</span><span>Pri</span>
                <span>State</span><span>WT/TAT</span><span></span>
              </div>
              {processes.map(p => {
                const st = getProcState(p);
                const ps = result?.processStats?.[p.pid];
                const activeRow = st === 'running';
                return (
                  <div key={p.pid}
                    className={`cv-proc-row ${activeRow ? 'cv-proc-active' : ''}`}
                    style={{ '--pc': p.color }}>
                    <span className="cv-proc-pid">{p.pid}</span>
                    <span>{p.arrival}</span>
                    <span>{p.burst}</span>
                    <span>{p.priority}</span>
                    <span className="cv-state-badge-col">
                      <span className={`cv-mini-badge ${st}`}>{st.toUpperCase()}</span>
                    </span>
                    <span className="cv-proc-stats">
                      {ps && ps.wt !== undefined
                        ? <>{ps.wt} / {ps.tat}</>
                        : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                    </span>
                    <span>
                      <button className="cv-del-btn" disabled={isActive}
                        onClick={() => { setProcesses(prev => prev.filter(x => x.pid !== p.pid)); onReset(); }}>
                        ✕
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="cpuviz-right">

          {/* ── CPU + Queue Row ── */}
          <div className="cv-cpu-row">

            {/* Hardware Styled CPU */}
            <div className={`cv-cpu-box ${liveRunning ? 'cv-cpu-on' : isDone ? 'cv-cpu-done' : 'cv-cpu-off'}`}>
              <div className="cv-cpu-chip">
                <div className="cv-cpu-pins left">{[0,1,2,3].map(i=><div key={i}/>)}</div>
                <div className="cv-cpu-core">
                  <div className="cv-cpu-tag">OS CORE</div>
                  <div className={`cv-cpu-fan ${liveRunning ? 'spinning' : ''}`} />
                  <div className="cv-cpu-proc-name" style={{ color: liveRunning?.color ?? (isDone ? '#22c55e' : '#223047') }}>
                    {liveRunning ? liveRunning.pid : isDone ? 'DONE' : 'IDLE'}
                  </div>
                  {liveRunning && (
                    <div className="cv-cpu-detail">
                      Rem: {liveRunning.remaining} / {liveRunning.burst}ms
                    </div>
                  )}
                  <div className={`cv-cpu-led ${liveRunning ? 'led-on' : ''}`} />
                </div>
                <div className="cv-cpu-pins right">{[0,1,2,3].map(i=><div key={i}/>)}</div>
              </div>
            </div>

            {/* Animated Flow Arrow */}
            <div className="cv-flow-arrow">
              <div className={`cv-flow-line ${liveRunning ? 'active' : ''}`} />
              <div className={`cv-flow-head ${liveRunning ? 'active' : ''}`}>▶</div>
            </div>

            {/* Ready Queue with Process Blocks */}
            <div className="cv-queue-box">
              <div className="cv-queue-header">
                <span>Scheduler Ready Queue Buffer</span>
                <span className="cv-queue-count">{liveQueue.length} Ready</span>
              </div>
              <div className="cv-queue-track">
                {liveQueue.length === 0 ? (
                  <div className="cv-queue-empty">
                    {result ? 'Queue empty — CPU executing or idle' : 'Initialize simulation to fill queue'}
                  </div>
                ) : (
                  liveQueue.map((p, i) => (
                    <React.Fragment key={p.pid}>
                      {i > 0 && <span className="cv-queue-sep">›</span>}
                      <div className="cv-queue-chip" style={{ '--pc': p.color }}>
                        <span className="cv-queue-pid">{p.pid}</span>
                        <span className="cv-queue-rem">{p.remaining}ms left</span>
                      </div>
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Process State Diagram ── */}
          <div className="cv-state-diagram-section">
            <div className="cv-section-title">🔄 Process State Machine Diagram</div>
            <div className="cv-state-diagram-wrap">
              <svg className="cv-state-svg" viewBox="0 0 280 85" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Arrow markers */}
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--arrow-color, #1e3050)" />
                  </marker>
                  <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 8 5 L 0 8 z" fill="#3b82f6" />
                  </marker>
                  <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 8 5 L 0 8 z" fill="#22c55e" />
                  </marker>
                  <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 8 5 L 0 8 z" fill="#f59e0b" />
                  </marker>
                </defs>

                {/* State Connectors (Arrows) */}
                {/* 1. Admission: NEW -> READY */}
                <line x1="53" y1="42" x2="83" y2="42" 
                  stroke={activeTransition === 'arrive' ? '#3b82f6' : 'var(--border-dim, #1e3050)'} 
                  strokeWidth={activeTransition === 'arrive' ? '2' : '1.2'}
                  strokeDasharray={activeTransition === 'arrive' ? '4,3' : 'none'}
                  className={activeTransition === 'arrive' ? 'arrow-pulse' : ''}
                  markerEnd={activeTransition === 'arrive' ? 'url(#arrow-active)' : 'url(#arrow)'} />
                <text x="68" y="34" className={`cv-state-arrow-lbl ${activeTransition === 'arrive' ? 'active' : ''}`}>Admit</text>

                {/* 2. Dispatch: READY -> RUNNING */}
                <line x1="123" y1="36" x2="153" y2="36" 
                  stroke={activeTransition === 'select' ? '#3b82f6' : 'var(--border-dim, #1e3050)'} 
                  strokeWidth={activeTransition === 'select' ? '2' : '1.2'}
                  strokeDasharray={activeTransition === 'select' ? '4,3' : 'none'}
                  className={activeTransition === 'select' ? 'arrow-pulse' : ''}
                  markerEnd={activeTransition === 'select' ? 'url(#arrow-active)' : 'url(#arrow)'} />
                <text x="138" y="28" className={`cv-state-arrow-lbl ${activeTransition === 'select' ? 'active' : ''}`}>Dispatch</text>

                {/* 3. Timeout / Preempt: RUNNING -> READY */}
                <path d="M 163 48 Q 138 68 113 48" 
                  fill="none" 
                  stroke={activeTransition === 'preempt' ? '#f59e0b' : 'var(--border-dim, #1e3050)'} 
                  strokeWidth={activeTransition === 'preempt' ? '2' : '1.2'}
                  strokeDasharray={activeTransition === 'preempt' ? '4,3' : 'none'}
                  className={activeTransition === 'preempt' ? 'arrow-pulse-reverse' : ''}
                  markerEnd={activeTransition === 'preempt' ? 'url(#arrow-orange)' : 'url(#arrow)'} />
                <text x="138" y="68" className={`cv-state-arrow-lbl orange ${activeTransition === 'preempt' ? 'active' : ''}`}>Timeout / Preempt</text>

                {/* 4. Release: RUNNING -> DONE */}
                <line x1="193" y1="42" x2="223" y2="42" 
                  stroke={activeTransition === 'done' ? '#22c55e' : 'var(--border-dim, #1e3050)'} 
                  strokeWidth={activeTransition === 'done' ? '2' : '1.2'}
                  strokeDasharray={activeTransition === 'done' ? '4,3' : 'none'}
                  className={activeTransition === 'done' ? 'arrow-pulse' : ''}
                  markerEnd={activeTransition === 'done' ? 'url(#arrow-green)' : 'url(#arrow)'} />
                <text x="208" y="34" className={`cv-state-arrow-lbl green ${activeTransition === 'done' ? 'active' : ''}`}>Exit</text>


                {/* State Node Blocks */}
                {[
                  { id: 'new',     lbl: 'NEW',     x: 15,  y: 28, w: 38, h: 28, list: unarrivedProcs, color: '#a855f7' },
                  { id: 'ready',   lbl: 'READY',   x: 85,  y: 28, w: 38, h: 28, list: liveQueue,      color: '#3b82f6' },
                  { id: 'running', lbl: 'RUNNING', x: 155, y: 28, w: 38, h: 28, list: liveRunning ? [liveRunning] : [], color: '#22c55e' },
                  { id: 'done',    lbl: 'DONE',    x: 225, y: 28, w: 38, h: 28, list: Array.from(completedPids).map(pid => processes.find(p=>p.pid===pid)).filter(Boolean), color: '#64748b' }
                ].map(node => {
                  const nodeActive = (node.id === 'running' && liveRunning) ||
                                     (node.id === 'ready' && liveQueue.length > 0) ||
                                     (node.id === 'new' && unarrivedProcs.length > 0) ||
                                     (node.id === 'done' && completedPids.size > 0);

                  return (
                    <g key={node.id} className="cv-state-node-g">
                      <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="5"
                        fill="var(--bg-base)"
                        stroke={nodeActive ? node.color : 'var(--border-dim)'}
                        strokeWidth={nodeActive ? '1.8' : '1'}
                        className={`cv-state-node-rect ${node.id} ${nodeActive ? 'active' : ''}`}
                        style={{ '--glow-color': node.color }} />
                      
                      <text x={node.x + node.w/2} y={node.y + 10} 
                        textAnchor="middle" 
                        fontSize="7" 
                        fontWeight="700" 
                        fill={nodeActive ? node.color : 'var(--text-muted)'}>
                        {node.lbl}
                      </text>

                      {/* List processes inside this state */}
                      <text x={node.x + node.w/2} y={node.y + 20} 
                        textAnchor="middle" 
                        fontSize="6.5" 
                        fill="var(--text-secondary)"
                        fontWeight="700">
                        {node.list.length > 0 
                          ? node.list.map(p => p.pid).slice(0, 3).join(',') + (node.list.length > 3 ? '+' : '')
                          : '—'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ── Kernel Console Strip ── */}
          {(decision || isActive) && (
            <div className="cv-decision-strip">
              <span className="cv-dec-badge">KERNEL LOG t={simTime}ms</span>
              <span className="cv-dec-text">{decision || 'Awaiting scheduler dispatch event…'}</span>
            </div>
          )}

          {/* ── Gantt Chart ── */}
          <div className="cv-gantt-section">
            <div className="cv-section-title">📊 Execution Gantt Chart / Timeline</div>
            <div className="cv-gantt-wrap">
              {!result ? (
                <div className="cv-placeholder">
                  <span>Configure processes and press the ▶ Run Scheduler button above</span>
                </div>
              ) : (() => {
                const total = result.gantt[result.gantt.length - 1]?.end ?? 1;
                return (
                  <div className="cv-gantt-inner">
                    {/* Blocks row */}
                    <div className="cv-gantt-blocks">
                      {result.gantt.map((b, i) => {
                        const w  = ((b.end - b.start) / total) * 100;
                        const past = b.end <= simTime;
                        const cur  = b.start <= simTime && b.end > simTime;
                        const isIdle = b.pid === 'IDLE';
                        return (
                          <div key={i}
                            className={`cv-gantt-seg${isIdle ? ' seg-idle' : ''}${cur ? ' seg-cur' : ''}${past ? ' seg-past' : ''}`}
                            style={{
                              width: `${Math.max(w, 1.5)}%`,
                              background: isIdle ? undefined : past || cur ? b.color : b.color + '26',
                              borderColor: isIdle ? undefined : b.color,
                            }}
                            title={`${b.pid}: t=${b.start}ms → t=${b.end}ms (${b.end - b.start}ms)`}>
                            {w > 4.5 && <span className="seg-label">{b.pid}</span>}
                            {cur && <div className="seg-cursor" />}
                          </div>
                        );
                      })}
                    </div>
                    {/* Time labels */}
                    <div className="cv-gantt-times">
                      {result.gantt.map((b, i) => (
                        <div key={i} style={{ width: `${Math.max(((b.end-b.start)/total)*100, 1.5)}%` }}>
                          {b.start}
                        </div>
                      ))}
                      <div>{total}</div>
                    </div>
                    {/* Legend */}
                    <div className="cv-gantt-legend">
                      {processes.map(p => (
                        <div key={p.pid} className="cv-legend-item">
                          <div className="cv-legend-dot" style={{ background: p.color }} />
                          <span>{p.pid}</span>
                        </div>
                      ))}
                      <div className="cv-legend-item">
                        <div className="cv-legend-dot" style={{ background: '#1c283c' }} />
                        <span>IDLE</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── Stats + Log row ── */}
          <div className="cv-bottom-row">

            {/* Stats Dashboard Grid */}
            <div className="cv-stats-panel">
              <div className="cv-section-title">📈 Metric Dashboard</div>
              {result && isDone ? (
                <div className="cv-stats-grid">
                  {[
                    { label: 'Avg Wait Time',     val: result.stats.avgWT,            unit: 'ms',  color: '#3b82f6' },
                    { label: 'Avg Turnaround',    val: result.stats.avgTAT,           unit: 'ms',  color: '#a855f7' },
                    { label: 'Avg Response',      val: result.stats.avgRT,            unit: 'ms',  color: '#22c55e' },
                    { label: 'CPU Utilization',   val: result.stats.cpuUtilization,   unit: '%',   color: '#f59e0b' },
                    { label: 'Context Switches',  val: result.stats.contextSwitches,  unit: '',    color: '#ef4444' },
                    { label: 'Throughput Speed',  val: result.stats.throughput,       unit: '/ms', color: '#14b8a6' },
                  ].map(({ label, val, unit, color }) => (
                    <div key={label} className="cv-stat-card">
                      <div className="cv-stat-val" style={{ color }}>{val}<span className="cv-stat-unit">{unit}</span></div>
                      <div className="cv-stat-lbl">{label}</div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="cv-placeholder small">Simulating in progress… Wait for completion to view final stats</div>
              ) : (
                <div className="cv-placeholder small">Run simulation to calculate statistics</div>
              )}
            </div>

            {/* Console Log panel */}
            <div className="cv-log-panel">
              <div className="cv-section-title">🖥️ Kernel Scheduler Console</div>
              <div className="cv-log-scroll">
                {!result && (
                  <div className="cv-placeholder small">Scheduler inactive — press Run Scheduler to start</div>
                )}
                {(result?.events ?? []).filter(e => e.time <= simTime).map((e, i) => (
                  <div key={i} className={`cv-log-entry cv-log-${e.type ?? 'info'}`}>
                    <span className="cv-log-time">[t={String(e.time).padStart(2,'0')}ms]</span>
                    <span className="cv-log-msg">{e.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
