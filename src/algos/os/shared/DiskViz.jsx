import React, { useState } from 'react';
import { generateDiskSteps } from './diskSteps';
import './DiskViz.css';

function genRequests() { return '176 79 34 60 92 11 41 114'; }

export default function DiskViz({
  algoId,
  isRunning,
  isPaused,
  currentStep,
  stepIdx,
  onRunSteps,
  onReset,
}) {
  const [initial,  setInitial]  = useState(50);
  const [diskSize, setDiskSize] = useState(200);
  const [reqInput, setReqInput] = useState(genRequests());

  const isActive = isRunning || isPaused;

  // Sync state from currentStep
  const headPos = currentStep ? currentStep.headPos : initial;
  const visSeq = currentStep ? currentStep.visSeq : [initial];
  const animStep = currentStep ? currentStep.animStep : 0;
  const result = currentStep ? currentStep.result : null;
  const isDone = currentStep?.type === 'done';

  const handleRun = () => {
    const reqs = reqInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n < diskSize);
    if (reqs.length === 0) return;

    const steps = generateDiskSteps(reqs, initial, diskSize, algoId);
    onRunSteps(steps);
  };

  const addRequest = (track) => {
    if (isActive) return;
    const currentReqs = reqInput.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (!currentReqs.includes(track)) {
      const newReqs = [...currentReqs, track];
      setReqInput(newReqs.join(' '));
      onReset();
    }
  };

  const randRequests = () => {
    if (isActive) return;
    const n = Math.floor(Math.random() * 5) + 6; // 6 to 10 requests
    const req = Array.from({ length: n }, () => Math.floor(Math.random() * (diskSize - 20)) + 10);
    setReqInput(req.join(' '));
    onReset();
  };

  // Concentric Platter Click Handler
  const handlePlatterClick = (e) => {
    if (isActive) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = clickX - 54;
    const dy = clickY - 48;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= 10 && dist <= 38) {
      const R = Math.max(12, Math.min(36, dist));
      const pct = (36 - R) / 24;
      const track = Math.round(pct * (diskSize - 1));
      addRequest(track);
    }
  };

  // 2D Ruler / Graph Click Handler
  const handleRulerClick = (e) => {
    if (isActive) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;

    const track = Math.round((clickX / 100) * (diskSize - 1));
    const clampedTrack = Math.max(0, Math.min(diskSize - 1, track));
    addRequest(clampedTrack);
  };

  const TRACK_H = 240;
  const toSVGX = (val) => (val / (diskSize - 1)) * 100;
  const toSVGY = (i)   => 22 + i * ((TRACK_H - 32) / Math.max(1, (result?.sequence?.length ?? 1) - 1));

  // Concentric Platter Math
  const pct = headPos / (diskSize - 1);
  const armAngle = -8 - pct * 36;

  const getPlatterRadius = (val) => {
    const trackPct = val / (diskSize - 1);
    return 36 - trackPct * 24;
  };

  return (
    <div className="diskviz-root">

      {/* ═══ TOP CONTROLS BAR ═══ */}
      <div className="diskviz-controls">
        <div className="diskviz-btn-group">
          {!isActive && !isDone && (
            <button className="cv-btn cv-run" onClick={handleRun}>▶ Run Simulation</button>
          )}
          {isActive && (
            <button className="cv-btn cv-run" disabled>⚡ Seeking…</button>
          )}
          {isDone && (
            <button className="cv-btn cv-run" onClick={handleRun}>↺ Re-run</button>
          )}
          <button className="cv-btn cv-reset" onClick={onReset}>↺ Reset</button>
          <button className="cv-btn cv-rand" disabled={isActive} onClick={randRequests}>🎲 Randomize</button>
        </div>

        {result && isDone && (
          <div className="disk-summary">
            <div className="disk-sum-card">
              <span className="disk-sum-val">{result.totalSeek}</span>
              <span className="disk-sum-lbl">TOTAL SEEK</span>
            </div>
            <div className="disk-sum-card cyan">
              <span className="disk-sum-val">{(result.totalSeek / Math.max(1, result.sequence.length - 1)).toFixed(1)}</span>
              <span className="disk-sum-lbl">AVG SEEK</span>
            </div>
          </div>
        )}
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="diskviz-layout">

        {/* Left Control / Input Panel */}
        <div className="diskviz-left">
          <div className="cv-section">
            <div className="cv-section-title">⚙️ Disk Geometry</div>
            <div className="cv-form">
              <div className="cv-field" style={{marginBottom: 8}}>
                <label className="cv-field-label">Initial Head Track</label>
                <input type="number" min="0" max={diskSize-1} value={initial}
                  className="cv-field-input"
                  disabled={isActive}
                  onChange={e => { setInitial(Math.max(0, +e.target.value)); onReset(); }} />
              </div>
              <div className="cv-field" style={{marginBottom: 8}}>
                <label className="cv-field-label">Total Disk Cylinders</label>
                <input type="number" min="50" max="500" value={diskSize}
                  className="cv-field-input"
                  disabled={isActive}
                  onChange={e => { setDiskSize(Math.max(50, +e.target.value)); onReset(); }} />
              </div>
              <div className="cv-field">
                <label className="cv-field-label">Request Queue (tracks 0-{diskSize-1})</label>
                <input type="text" value={reqInput}
                  className="cv-field-input text-mono"
                  disabled={isActive}
                  onChange={e => { setReqInput(e.target.value); onReset(); }} />
              </div>
            </div>
          </div>

          {/* Request Queue Badges */}
          <div className="cv-section" style={{ marginTop: 10 }}>
            <div className="cv-section-title">📥 Track Request Queue</div>
            <div className="disk-req-list">
              {reqInput.split(/[\s,]+/).filter(Boolean).map((r, i) => {
                const num = parseInt(r);
                if (isNaN(num)) return null;
                const servedIdx = result ? result.sequence.slice(1).indexOf(num) : -1;
                const served = servedIdx >= 0 && servedIdx < animStep;
                const active = servedIdx === animStep;
                return (
                  <div key={i} className={`disk-req-item ${active ? 'active' : served ? 'served' : ''}`}>
                    <span>Track {num}</span>
                    {active && <span className="disk-req-pulse" />}
                    {served && <span className="disk-req-check">✓</span>}
                  </div>
                );
              })}
            </div>
            {!isActive && (
              <span className="bs-hint" style={{ marginTop: '8px', display: 'block', fontSize: '10px' }}>
                💡 Click on the Platter or Linear ruler to add seek requests.
              </span>
            )}
          </div>

          {/* Step Log */}
          {result && (
            <div className="cv-section" style={{ marginTop: 10, flex: 1, overflow: 'hidden' }}>
              <div className="cv-section-title">📋 Head Movement Logs</div>
              <div className="cv-log" style={{ maxHeight: 180 }}>
                {result.events.map((e, i) => (
                  <div key={i} className="cv-log-line" style={{ opacity: i < animStep ? 1 : i === animStep ? 0.8 : 0.25 }}>
                    <span className="cv-log-t">#{i+1}</span>
                    <span className="cv-log-msg-disk">{e.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Visualizer Panel (Side-by-Side: Graph and Platter) */}
        <div className="diskviz-right">
          
          <div className="disk-visualizers-grid">
            
            {/* Visualizer 1: 2D Linear Seek Graph */}
            <div className="disk-vis-box">
              <div className="cv-section-title">📈 2D Seek Execution Graph (Tracks 0 → {diskSize-1})</div>
              <div className="disk-track-wrap">
                <svg className="disk-svg" viewBox={`0 0 100 ${TRACK_H}`} preserveAspectRatio="none" onClick={handleRulerClick} style={{ cursor: isActive ? 'default' : 'crosshair' }}>
                  {/* Perfect Ruler drawn DIRECTLY in the SVG to align 100% perfectly */}
                  {[0, 25, 50, 75, 100].map(pctVal => {
                    const val = Math.round((pctVal/100)*(diskSize-1));
                    return (
                      <g key={pctVal}>
                        {/* Ruler tick mark */}
                        <line x1={pctVal} y1="12" x2={pctVal} y2="18" stroke="rgba(30, 48, 80, 0.8)" strokeWidth="0.4" />
                        {/* Ruler value text */}
                        <text x={pctVal} y="8" textAnchor="middle" fill="var(--text-muted, #64748b)" fontSize="3.2" fontWeight="800">
                          {val}
                        </text>
                        {/* Vertical background grid line */}
                        <line x1={pctVal} y1="18" x2={pctVal} y2={TRACK_H} stroke="rgba(30, 48, 80, 0.4)" strokeWidth="0.25" strokeDasharray="1,1" />
                      </g>
                    );
                  })}
                  
                  {/* Ruler Baseline */}
                  <line x1="0" y1="18" x2="100" y2="18" stroke="rgba(30, 48, 80, 0.8)" strokeWidth="0.4" />

                  {/* Dynamic Head seek path */}
                  {visSeq.length > 1 && (
                    <polyline
                      points={visSeq.map((v, i) => `${toSVGX(v)},${toSVGY(i)}`).join(' ')}
                      fill="none" stroke="#22d3ee" strokeWidth="0.8"
                      className="disk-polyline"
                    />
                  )}

                  {/* Request dots along the timeline */}
                  {result && result.requests.map((r, i) => {
                    const servIdx = result.sequence.slice(1).indexOf(r);
                    const done = servIdx >= 0 && servIdx < animStep;
                    const cur = servIdx === animStep;
                    return (
                      <circle key={i} cx={toSVGX(r)} cy={toSVGY(Math.min(servIdx + 1, animStep))}
                        r={cur ? "1.8" : "1.2"} 
                        fill={cur ? '#f59e0b' : done ? '#22c55e' : '#ef4444'} 
                        className={cur ? 'pinging-dot' : ''} />
                    );
                  })}

                  {/* Scanning head position circle */}
                  {result && (
                    <g>
                      <circle cx={toSVGX(headPos)} cy={toSVGY(Math.max(0, animStep))}
                        r="2.2" fill="#22d3ee" stroke="#e0f7fa" strokeWidth="0.8" className="pulsing-head">
                        <animate attributeName="r" values="2.2;3;2.2" dur="0.8s" repeatCount="indefinite"/>
                      </circle>
                      <line x1={toSVGX(headPos)} y1="18" x2={toSVGX(headPos)} y2={TRACK_H} stroke="rgba(34, 211, 238, 0.15)" strokeWidth="0.3" strokeDasharray="2,2" />
                    </g>
                  )}
                </svg>

                {!result && (
                  <div className="disk-placeholder">
                    Configure geometries and press ▶ Run Simulation to start head seek timeline
                  </div>
                )}
              </div>
            </div>

            {/* Visualizer 2: Interactive Hardware Platter */}
            <div className="disk-vis-box">
              <div className="cv-section-title">💽 Hardware Platter & Head Actuator</div>
              <div className="disk-platter-wrap">
                <svg className="disk-platter-svg" viewBox="0 0 100 100" onClick={handlePlatterClick} style={{ cursor: isActive ? 'default' : 'crosshair' }}>
                  <defs>
                    {/* Metallic Platter radial shine */}
                    <radialGradient id="platterShine" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="55%" stopColor="#1e293b" />
                      <stop offset="85%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#020617" />
                    </radialGradient>
                    
                    {/* Brass pivot base gradient */}
                    <linearGradient id="pivotBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="40%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>

                  {/* 1. Platter Case Plate */}
                  <rect x="2" y="2" width="96" height="96" rx="8" fill="#0b1329" stroke="rgba(30, 48, 80, 0.5)" strokeWidth="1" />
                  <circle cx="54" cy="48" r="41" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" />

                  {/* 2. Platter Disk */}
                  <circle cx="54" cy="48" r="38" fill="url(#platterShine)" stroke="#334155" strokeWidth="0.8" className="platter-rotate" />
                  
                  {/* Concentric track guidelines */}
                  {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0].map((t, idx) => (
                    <circle key={idx} cx="54" cy="48" r={12 + t * 24} fill="none" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.3" />
                  ))}

                  {/* 3. Radial Request Sectors */}
                  {reqInput.split(/[\s,]+/).filter(Boolean).map((rStr, i) => {
                    const r = parseInt(rStr);
                    if (isNaN(r) || r < 0 || r >= diskSize) return null;
                    const R = getPlatterRadius(r);
                    const servedIdx = result ? result.sequence.slice(1).indexOf(r) : -1;
                    const done = servedIdx >= 0 && servedIdx < animStep;
                    const active = servedIdx === animStep;

                    // Plot request dots along a radial line angled at -25 degrees
                    const x = 54 + R * 0.906; // cos(-25 deg) = 0.906
                    const y = 48 - R * 0.422; // sin(-25 deg) = -0.422

                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r={active ? "1.5" : "1.0"} 
                          fill={active ? '#f59e0b' : done ? '#22c55e' : '#ef4444'}
                          stroke={active ? '#fff' : 'none'}
                          strokeWidth="0.4"
                          className={active ? 'pinging-platter-dot' : ''} />
                      </g>
                    );
                  })}

                  {/* 4. Rotating Center Spindle */}
                  <circle cx="54" cy="48" r="5" fill="url(#pivotBrass)" stroke="#1e293b" strokeWidth="1" />
                  <circle cx="54" cy="48" r="2" fill="#020617" />
                  <path d="M 52,48 L 56,48 M 54,46 L 54,50" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.4" className="platter-rotate" />

                  {/* 5. Head Actuator Assembly */}
                  {/* Pivot Base */}
                  <circle cx="12" cy="78" r="4.5" fill="url(#pivotBrass)" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="12" cy="78" r="1.5" fill="#1e293b" />

                  {/* Rotating Actuator Arm */}
                  <g transform={`rotate(${armAngle}, 12, 78)`} style={{ transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }}>
                    {/* Metal arm frame */}
                    <polygon points="12,76.5 12,79.5 42,78.6 42,77.4" fill="#94a3b8" stroke="#475569" strokeWidth="0.3" />
                    
                    {/* Head suspension arm extension */}
                    <line x1="42" y1="78" x2="48" y2="78" stroke="#cbd5e1" strokeWidth="0.8" />
                    
                    {/* Read/Write Slider element */}
                    <rect x="47.5" y="77" width="1.5" height="2" rx="0.3" fill="#1e293b" />
                    
                    {/* Dynamic Read/Write status LED */}
                    <circle cx="48.2" cy="78" r="0.8" 
                      fill={isActive ? '#f59e0b' : isDone ? '#22c55e' : '#64748b'} 
                      className={isActive ? 'led-blink-fast' : ''} />
                  </g>
                  
                  {/* Corner screws for case aesthetics */}
                  {[[5,5],[95,5],[5,95],[95,95]].map(([cx, cy], idx) => (
                    <circle key={idx} cx={cx} cy={cy} r="1.2" fill="#334155" stroke="#1e293b" strokeWidth="0.4" />
                  ))}
                </svg>
                
                {/* Physical Track Head Pos Indicator */}
                <div className="platter-info-overlay">
                  <span>ACTUATOR HEAD TRACK: <strong>{headPos}</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* Linear Head Slider Bar (Aligns ruler 0 to N-1) */}
          <div className="disk-head-bar">
            <div className="disk-head-track">
              {/* Active slider node */}
              <div className="disk-head-pos" style={{ left: `${(headPos / (diskSize - 1)) * 100}%` }} />
              
              {/* Request indicators along track bar */}
              {reqInput.split(/[\s,]+/).filter(Boolean).map((rStr, i) => {
                const r = parseInt(rStr);
                if (isNaN(r) || r < 0 || r >= diskSize) return null;
                const servedIdx = result ? result.sequence.slice(1).indexOf(r) : -1;
                const served = servedIdx >= 0 && servedIdx < animStep;
                return (
                  <div key={i} className="disk-req-dot" style={{
                    left: `${(r / (diskSize - 1)) * 100}%`,
                    background: served ? '#22c55e' : '#ef4444',
                    boxShadow: served ? '0 0 4px #22c55e' : '0 0 4px #ef4444',
                  }} />
                );
              })}
            </div>
            <div className="disk-head-labels">
              <span>Cylinder 0</span>
              <span className="active-head-val">Head Cylinder Position: {headPos}</span>
              <span>Cylinder {diskSize-1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
