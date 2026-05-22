import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALGORITHMS, PROCESS_COLORS, roundRobin } from './schedulers';
import {
  ProcessStateDiagram, CPUBlock, ReadyQueueViz,
  GanttChart, ExecLog, StatsPanel
} from './OSComponents';
import DiskScheduler from './OSComponents';
import './OSPage.css';

// ─── Algo info text ───────────────────────────────────────────────────────────
const ALGO_INFO = {
  fcfs:      { info: 'First Come First Serve. Processes execute in arrival order. Simple but may cause convoy effect.', decision: (e) => e.type==='select' ? e.msg : null },
  sjf:       { info: 'Shortest Job First. Minimizes average waiting time but can cause starvation.', decision: null },
  srtf:      { info: 'Shortest Remaining Time First (Preemptive SJF). Optimal average waiting time but high context switch overhead.', decision: null },
  rr:        { info: 'Round Robin. Each process gets a fixed time quantum. Fair scheduling with bounded wait time.', decision: null },
  priority:  { info: 'Priority Scheduling. Highest priority (lowest number) runs first. Can cause starvation of low-priority processes.', decision: null },
  priorityP: { info: 'Preemptive Priority. Higher priority arriving processes immediately preempt the running process.', decision: null },
  mlq:       { info: 'Multilevel Queue. Processes separated into queues by priority. Each queue has its own algorithm.', decision: null },
  mlfq:      { info: 'Multilevel Feedback Queue. Processes can move between queues. New processes start at highest priority.', decision: null },
};

// ─── Random process generator ────────────────────────────────────────────────
function generateRandomProcesses(n = 5) {
  return Array.from({ length: n }, (_, i) => ({
    pid: `P${i + 1}`,
    arrival: Math.floor(Math.random() * 8),
    burst: Math.floor(Math.random() * 10) + 2,
    priority: Math.floor(Math.random() * 5) + 1,
    color: PROCESS_COLORS[i % PROCESS_COLORS.length],
  }));
}

// ─── Main OSPage ─────────────────────────────────────────────────────────────
export default function OSPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('cpu'); // cpu | disk
  const [algoId, setAlgoId] = useState('fcfs');
  const [quantum, setQuantum] = useState(3);
  const [speed, setSpeed] = useState(3);
  const [processes, setProcesses] = useState(() => generateRandomProcesses(4));

  // New process form
  const [newProc, setNewProc] = useState({ pid: 'P5', arrival: 0, burst: 5, priority: 1 });

  // Simulation state
  const [simResult, setSimResult] = useState(null);
  const [simTime, setSimTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [decision, setDecision] = useState('Add processes and press Run to start the simulation.');

  // Derived live state
  const [liveRunning, setLiveRunning] = useState(null);   // current proc obj or null
  const [liveQueue, setLiveQueue]     = useState([]);      // ready queue
  const [liveStates, setLiveStates]   = useState([]);      // active state names

  const timerRef = useRef(null);
  const speedRef = useRef(3);
  const timeRef  = useRef(0);

  const algo = ALGORITHMS.find(a => a.id === algoId);

  // ── Run simulation ──────────────────────────────────────────────────────
  const runSim = useCallback(() => {
    if (processes.length === 0) return;
    let result;
    try {
      if (algoId === 'rr') result = roundRobin(processes, quantum);
      else result = algo.fn(processes);
    } catch (e) { console.error(e); return; }

    setSimResult(result);
    setSimTime(0);
    timeRef.current = 0;
    setIsRunning(true);
    setIsPaused(false);
    setLiveRunning(null);
    setLiveQueue([]);
    setLiveStates(['new']);

    clearInterval(timerRef.current);
    const totalTime = result.gantt[result.gantt.length - 1]?.end || 0;

    const tick = () => {
      const t = timeRef.current;
      if (t > totalTime) {
        setIsRunning(false); setIsPaused(false);
        setLiveStates(['terminated']);
        setLiveRunning(null); setLiveQueue([]);
        setDecision('✅ Simulation complete! All processes terminated.');
        return;
      }

      // Find current gantt block
      const block = result.gantt.find(b => b.start <= t && b.end > t);
      const runningProc = block && block.pid !== 'IDLE'
        ? processes.find(p => p.pid === block.pid) : null;
      setLiveRunning(runningProc || null);

      // Compute ready queue at time t
      const done = new Set(
        result.gantt.filter(b => b.end <= t && b.pid !== 'IDLE').map(b => b.pid)
      );
      const running = runningProc ? new Set([runningProc.pid]) : new Set();
      const readyProcs = processes.filter(p =>
        p.arrival <= t && !done.has(p.pid) && !running.has(p.pid)
      ).map(p => ({
        ...p,
        remaining: result.processStats[p.pid]?.remaining ??
          p.burst - result.gantt.filter(b => b.pid === p.pid && b.end <= t).reduce((s,b)=>s+(b.end-b.start),0),
        queueLevel: result.processStats[p.pid]?.queueLevel ?? 0,
      }));
      setLiveQueue(readyProcs);

      // States
      const states = [];
      if (runningProc) states.push('running');
      if (readyProcs.length > 0) states.push('ready');
      if (processes.some(p => p.arrival > t)) states.push('new');
      if (done.size > 0) states.push('terminated');
      setLiveStates(states);

      // Decision
      const lastEvent = result.events.filter(e => e.time <= t).pop();
      if (lastEvent) setDecision(lastEvent.msg);

      timeRef.current = t + 1;
      setSimTime(t + 1);
      timerRef.current = setTimeout(tick, (5 - speedRef.current + 1) * 50 + 10);
    };
    tick();
  }, [processes, algoId, quantum, algo]);

  const pauseSim = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false); setIsPaused(true);
  };

  const resumeSim = useCallback(() => {
    if (!simResult) return;
    setIsRunning(true); setIsPaused(false);
    const totalTime = simResult.gantt[simResult.gantt.length - 1]?.end || 0;
    const tick = () => {
      const t = timeRef.current;
      if (t > totalTime) {
        setIsRunning(false); setIsPaused(false);
        setLiveStates(['terminated']); setLiveRunning(null);
        setDecision('✅ Simulation complete!'); return;
      }
      const block = simResult.gantt.find(b => b.start <= t && b.end > t);
      const runningProc = block && block.pid !== 'IDLE' ? processes.find(p => p.pid === block.pid) : null;
      setLiveRunning(runningProc || null);
      const done = new Set(simResult.gantt.filter(b=>b.end<=t&&b.pid!=='IDLE').map(b=>b.pid));
      const running = runningProc ? new Set([runningProc.pid]) : new Set();
      const readyProcs = processes.filter(p=>p.arrival<=t&&!done.has(p.pid)&&!running.has(p.pid))
        .map(p=>({...p,remaining:p.burst-simResult.gantt.filter(b=>b.pid===p.pid&&b.end<=t).reduce((s,b)=>s+(b.end-b.start),0),queueLevel:0}));
      setLiveQueue(readyProcs);
      const lastEvent = simResult.events.filter(e=>e.time<=t).pop();
      if (lastEvent) setDecision(lastEvent.msg);
      timeRef.current = t + 1; setSimTime(t + 1);
      timerRef.current = setTimeout(tick, (5 - speedRef.current + 1) * 50 + 10);
    };
    tick();
  }, [simResult, processes]);

  const resetSim = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false); setIsPaused(false);
    setSimResult(null); setSimTime(0); timeRef.current = 0;
    setLiveRunning(null); setLiveQueue([]); setLiveStates([]);
    setDecision('Add processes and press Run to start the simulation.');
  };

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ── Add process ──────────────────────────────────────────────────────────
  const addProcess = () => {
    if (processes.length >= 10) return;
    const idx = processes.length;
    setProcesses(prev => [...prev, {
      ...newProc,
      pid: newProc.pid || `P${idx+1}`,
      color: PROCESS_COLORS[idx % PROCESS_COLORS.length],
    }]);
    setNewProc({ pid: `P${processes.length + 2}`, arrival: 0, burst: 5, priority: 1 });
    resetSim();
  };

  const removeProcess = (pid) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    resetSim();
  };

  const randomize = () => {
    setProcesses(generateRandomProcesses(Math.floor(Math.random() * 3) + 3));
    resetSim();
  };

  const totalBurst = processes.reduce((s, p) => s + p.burst, 0);
  const algoInfo = ALGO_INFO[algoId] || {};

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="os-page">

      {/* Top Bar */}
      <div className="os-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="os-topbar-title">🖥️ OS Algorithm Visualizer</span>

        <div className="os-tabs">
          <button className={`os-tab ${activeTab==='cpu'?'active':''}`} onClick={()=>setActiveTab('cpu')}>⚙️ CPU Scheduling</button>
          <button className={`os-tab ${activeTab==='disk'?'active':''}`} onClick={()=>setActiveTab('disk')}>💽 Disk Scheduling</button>
        </div>

        {activeTab === 'cpu' && (
          <div className="os-sim-controls">
            {!isRunning && !isPaused && (
              <button className="os-ctrl-btn run" onClick={runSim} disabled={processes.length===0}>▶ Run</button>
            )}
            {isRunning && (
              <button className="os-ctrl-btn pause" onClick={pauseSim}>⏸ Pause</button>
            )}
            {isPaused && (
              <button className="os-ctrl-btn run" onClick={resumeSim}>▶ Resume</button>
            )}
            <button className="os-ctrl-btn stop" onClick={resetSim}>↺ Reset</button>

            <div className="os-speed-row">
              <span>Speed</span>
              <input type="range" min="1" max="5" value={speed} onChange={e=>setSpeed(+e.target.value)} />
              <span>{['Slow','Normal','Medium','Fast','Turbo'][speed-1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tab: CPU Scheduling */}
      {activeTab === 'cpu' && (
        <>
          <div className="os-layout">

            {/* ── LEFT PANEL ── */}
            <div className="os-panel">

              {/* Algorithm selector */}
              <div className="os-panel-section">
                <div className="os-panel-label">Algorithm</div>
                <div className="algo-selector">
                  <select value={algoId} onChange={e=>{setAlgoId(e.target.value);resetSim();}}>
                    {ALGORITHMS.map(a=>(
                      <option key={a.id} value={a.id}>{a.label} — {a.full}</option>
                    ))}
                  </select>
                  <div className="algo-badge">
                    <span className={`badge ${algo?.preemptive?'preemptive':'nonpreemptive'}`}>
                      {algo?.preemptive ? '⚡ Preemptive' : '🔒 Non-Preemptive'}
                    </span>
                  </div>
                  {algoId === 'rr' && (
                    <div className="quantum-row">
                      <span>Quantum:</span>
                      <input type="number" min="1" max="20" value={quantum} onChange={e=>setQuantum(+e.target.value)} />
                      <span>ms</span>
                    </div>
                  )}
                </div>
                {algoInfo.info && <div className="algo-info-box mt4">{algoInfo.info}</div>}
              </div>

              {/* Add Process */}
              <div className="os-panel-section">
                <div className="os-panel-label">Add Process</div>
                <div className="proc-input-grid">
                  <div className="proc-field">
                    <label>PID</label>
                    <input value={newProc.pid} onChange={e=>setNewProc(p=>({...p,pid:e.target.value}))} />
                  </div>
                  <div className="proc-field">
                    <label>Arrival</label>
                    <input type="number" min="0" value={newProc.arrival} onChange={e=>setNewProc(p=>({...p,arrival:+e.target.value}))} />
                  </div>
                  <div className="proc-field">
                    <label>Burst</label>
                    <input type="number" min="1" value={newProc.burst} onChange={e=>setNewProc(p=>({...p,burst:+e.target.value}))} />
                  </div>
                  <div className="proc-field">
                    <label>Priority</label>
                    <input type="number" min="1" max="10" value={newProc.priority} onChange={e=>setNewProc(p=>({...p,priority:+e.target.value}))} />
                  </div>
                </div>
                <button className="proc-add-btn" onClick={addProcess} disabled={processes.length>=10}>
                  + Add Process
                </button>
                <button className="rand-btn mt4" onClick={randomize} style={{width:'100%'}}>
                  🎲 Random Processes
                </button>
              </div>

              {/* Process List */}
              <div className="os-panel-section">
                <div className="os-panel-label">Processes ({processes.length})</div>
                <div className="proc-cards">
                  {processes.map(p => {
                    const ps = simResult?.processStats?.[p.pid];
                    const state = liveRunning?.pid === p.pid ? 'running'
                      : liveQueue.some(q=>q.pid===p.pid) ? 'ready'
                      : ps?.endTime <= simTime ? 'terminated'
                      : p.arrival > simTime ? 'new' : 'ready';
                    return (
                      <div key={p.pid} className="proc-card" style={{ borderColor: p.color }}>
                        <div className="proc-card-pid" style={{ color: p.color }}>{p.pid}</div>
                        <div className="proc-card-stats">
                          <span>Arrival: {p.arrival}  Burst: {p.burst}  Priority: {p.priority}</span>
                          {ps && <span>WT: {ps.wt}  TAT: {ps.tat}  RT: {ps.rt}</span>}
                        </div>
                        <span className={`proc-card-state ${state}`}>{state}</span>
                        <button className="proc-del-btn" onClick={()=>removeProcess(p.pid)}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── CENTER PANEL ── */}
            <div className="os-center">
              {/* Clock */}
              <div className="os-clock">
                <div>
                  <div className="clock-label">SYSTEM TIME</div>
                  <div className="clock-display">t = {String(simTime).padStart(3,'0')}</div>
                </div>
                <div className="clock-bar">
                  <div className="clock-bar-fill"
                    style={{ width: `${totalBurst>0?Math.min(100,(simTime/totalBurst)*100):0}%` }} />
                </div>
                <div style={{ fontSize:10, color:'var(--text-muted)', textAlign:'right' }}>
                  <div>{algo?.full}</div>
                  <div>{isRunning ? '🟢 Running' : isPaused ? '🟡 Paused' : '⚫ Idle'}</div>
                </div>
              </div>

              {/* CPU */}
              <div className="cpu-viz">
                <div className="os-panel-label">CPU Execution Unit</div>
                <CPUBlock running={liveRunning} simTime={simTime} totalBurst={totalBurst} />
              </div>

              {/* Ready Queue */}
              <div className="queue-viz">
                <div className="queue-label-row">
                  <span className="queue-title">Ready Queue</span>
                  <span className="queue-count">{liveQueue.length} process{liveQueue.length!==1?'es':''}</span>
                </div>
                <ReadyQueueViz queue={liveQueue} algoId={algoId} />
              </div>

              {/* Process State Diagram */}
              <div className="state-diagram os-panel-section" style={{ paddingTop:12 }}>
                <div className="os-panel-label">Process State Machine</div>
                <ProcessStateDiagram activeStates={liveStates} />
              </div>

              {/* Gantt Chart */}
              <div className="gantt-wrap">
                <div className="os-panel-label">Gantt Chart — Execution Timeline</div>
                <GanttChart gantt={simResult?.gantt} currentTime={simTime} />
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="os-panel">

              {/* Decision */}
              <div className="os-panel-section">
                <div className="os-panel-label">Algorithm Decision</div>
                <div className="decision-box">
                  <div className="decision-time">t = {simTime}</div>
                  {decision}
                </div>
              </div>

              {/* Log */}
              <div className="os-panel-section">
                <div className="os-panel-label">Execution Log</div>
                <ExecLog events={simResult?.events || []} currentTime={simTime} />
              </div>

              {/* Stats */}
              <div className="os-panel-section">
                <div className="os-panel-label">Statistics</div>
                <StatsPanel
                  stats={simResult?.stats}
                  processStats={simResult?.processStats}
                  processes={processes}
                />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="os-bottom">
            {[
              { label: 'Avg Wait', val: simResult?.stats?.avgWT ?? '—', color: '#3b82f6' },
              { label: 'Avg TAT', val: simResult?.stats?.avgTAT ?? '—', color: '#22c55e' },
              { label: 'CPU Util', val: simResult?.stats?.cpuUtilization ? simResult.stats.cpuUtilization+'%' : '—', color: '#f59e0b' },
              { label: 'Context Switches', val: simResult?.stats?.contextSwitches ?? '—', color: '#a855f7' },
              { label: 'Throughput', val: simResult?.stats?.throughput ?? '—', color: '#14b8a6' },
              { label: 'Time', val: simTime, color: '#93c5fd' },
            ].map(m => (
              <div key={m.label} className="bottom-metric">
                <div className="bottom-metric-dot" style={{ background: m.color }} />
                <span className="bottom-metric-val">{m.val}</span>
                <span className="bottom-metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab: Disk Scheduling */}
      {activeTab === 'disk' && <DiskScheduler />}
    </div>
  );
}
