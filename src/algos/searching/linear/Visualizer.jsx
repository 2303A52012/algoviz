import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

const COLORS = {
  default:  { bg: '#1e293b', border: '#334155', text: '#64748b' },
  scanning: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  missed:   { bg: '#0f172a', border: '#1e293b', text: '#334155' },
  found:    { bg: '#14532d', border: '#22c55e', text: '#86efac' },
  target:   { bg: '#2d1b6e', border: '#7c3aed', text: '#d8b4fe' },
};

// The scanner — shows a moving "lens" over the array
function ArrayScanner({ arr, currentIdx, scannedIdx, foundIdx, target }) {
  const n = arr.length;

  const getCellState = (i) => {
    if (i === foundIdx)          return 'found';
    if (i === currentIdx)        return 'scanning';
    if (scannedIdx.includes(i))  return 'missed';
    return 'default';
  };

  return (
    <div className="ls-scanner-wrap">

      {/* Scanner cursor above cells */}
      <div className="ls-cursor-row" style={{ '--n': n }}>
        {arr.map((_, i) => (
          <div key={i} className="ls-cursor-cell">
            {i === currentIdx && foundIdx < 0 && (
              <div className="ls-cursor">
                <div className="ls-cursor-glass">
                  <div className="ls-cursor-inner" />
                </div>
                <div className="ls-cursor-handle" />
              </div>
            )}
            {i === foundIdx && (
              <div className="ls-found-marker">
                <span className="ls-found-star">★</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main cells */}
      <div className="ls-cells" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const state = getCellState(i);
          const c = COLORS[state];
          const isTarget = val === target && i !== currentIdx && !scannedIdx.includes(i) && i !== foundIdx;

          return (
            <div
              key={i}
              className={`ls-cell ls-cell-${state}`}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                boxShadow: state === 'scanning' ? `0 0 14px ${c.border}55` :
                           state === 'found'    ? `0 0 16px ${c.border}77` : 'none',
              }}
            >
              <span className="ls-cell-val" style={{ color: c.text }}>{val}</span>
              <span className="ls-cell-idx">{i}</span>

              {/* Compare indicator — shown while scanning */}
              {state === 'scanning' && (
                <div className="ls-compare-bubble">
                  <span>{val} {val === target ? '=' : '≠'} {target}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="ls-progress-wrap">
        <div className="ls-progress-bar">
          <div
            className={`ls-progress-fill ${foundIdx >= 0 ? 'ls-progress-found' : ''}`}
            style={{ width: `${(Math.max(scannedIdx.length, currentIdx >= 0 ? currentIdx + 1 : 0) / n) * 100}%` }}
          />
        </div>
        <span className="ls-progress-label">
          {foundIdx >= 0
            ? `Found at index ${foundIdx}`
            : currentIdx >= 0
              ? `${currentIdx + 1} / ${n} checked`
              : scannedIdx.length > 0
                ? `${scannedIdx.length} / ${n} checked`
                : `0 / ${n} checked`}
        </span>
      </div>
    </div>
  );
}

// Target display panel
function TargetPanel({ target, foundIdx, currentIdx, arr }) {
  const status = foundIdx >= 0 ? 'found'
    : currentIdx < 0 && foundIdx < 0 ? 'not-found'
    : 'searching';

  return (
    <div className={`ls-target-panel ls-target-${status}`}>
      <div className="ls-target-left">
        <span className="ls-target-label">Target</span>
        <span className="ls-target-val">{target}</span>
      </div>
      <div className="ls-target-status">
        {status === 'searching'  && <span className="ls-status-text ls-status-searching">🔍 Searching...</span>}
        {status === 'found'      && <span className="ls-status-text ls-status-found">✓ Found at index {foundIdx}</span>}
        {status === 'not-found'  && <span className="ls-status-text ls-status-notfound">✗ Not found</span>}
      </div>
    </div>
  );
}

// Complexity callout
function ComplexityNote({ scannedCount, total, found }) {
  return (
    <div className="ls-complexity-note">
      <span className="ls-cn-title">Complexity</span>
      <span className="ls-cn-item"><b>Best:</b> O(1) — target at index 0</span>
      <span className="ls-cn-item"><b>Worst:</b> O(n) — target at end or not found</span>
      <span className="ls-cn-item"><b>This run:</b> {scannedCount} comparisons {found ? '(found early!)' : total > 0 ? `(${((scannedCount/total)*100).toFixed(0)}% of array scanned)` : ''}</span>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr = generateDefaultInput();
  const defaultTarget = 47;

  const [arr, setArr]           = useState(defaultArr);
  const [target, setTarget]     = useState(defaultTarget);
  const [targetInput, setTargetInput] = useState(String(defaultTarget));
  const [inputOpen, setInputOpen] = useState(false);
  const [customArr, setCustomArr] = useState('');
  const [customErr, setCustomErr] = useState('');
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    currentIdx: -1,
    scannedIdx: [],
    foundIdx: -1,
    target: defaultTarget,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({ arr, currentIdx: -1, scannedIdx: [], foundIdx: -1, target });
      return;
    }
    setVizState({
      arr:        currentStep.arr        || arr,
      currentIdx: currentStep.currentIdx ?? -1,
      scannedIdx: currentStep.scannedIdx || [],
      foundIdx:   currentStep.foundIdx   ?? -1,
      target:     currentStep.target     ?? target,
    });
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => {
    const t = parseInt(targetInput);
    if (isNaN(t)) { setCustomErr('Enter a valid target number.'); return; }
    setTarget(t);
    setCustomErr('');
    onRunSteps(generateSteps(arr, t));
  };

  const handleReset = () => {
    onReset();
    setVizState({ arr, currentIdx: -1, scannedIdx: [], foundIdx: -1, target });
  };

  const handleNewArray = () => {
    const size = 10 + Math.floor(Math.random() * 8);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    setArr(a);
    // Pick a target that exists half the time
    const t = Math.random() > 0.4 ? a[Math.floor(Math.random() * a.length)] : Math.floor(Math.random() * 90) + 5;
    setTargetInput(String(t));
    setTarget(t);
    onReset();
    setVizState({ arr: a, currentIdx: -1, scannedIdx: [], foundIdx: -1, target: t });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customArr);
      const t = parseInt(targetInput);
      if (isNaN(t)) { setCustomErr('Enter a valid target number.'); return; }
      setArr(parsed);
      setTarget(t);
      onReset();
      setVizState({ arr: parsed, currentIdx: -1, scannedIdx: [], foundIdx: -1, target: t });
      setInputOpen(false);
      setCustomArr('');
    } catch (e) { setCustomErr(e.message); }
  };

  const scannedCount = vizState.scannedIdx.length + (vizState.currentIdx >= 0 ? 1 : 0);

  return (
    <div className="ls-root">
      {/* Top bar */}
      <div className="ls-topbar">
        <button className={`ls-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        <div className="ls-target-input-wrap">
          <span className="ls-target-input-label">Target:</span>
          <input
            type="number"
            className="ls-target-input"
            value={targetInput}
            onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
            disabled={isRunning}
            placeholder="value"
          />
        </div>

        <div className="ls-topbar-right">
          <button className="ls-btn ls-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="ls-btn ls-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Search</button>
          <button className="ls-btn ls-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="ls-custom-panel">
          <div className="ls-custom-row">
            <input type="text" className="ls-custom-input"
              placeholder="e.g. 14, 52, 7, 38, 91, 23"
              value={customArr} onChange={e => setCustomArr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="ls-btn ls-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="ls-err">{customErr}</span>}
          <span className="ls-hint">2–24 numbers, comma-separated. Target field above applies.</span>
        </div>
      )}

      {/* Target panel */}
      <TargetPanel
        target={vizState.target}
        foundIdx={vizState.foundIdx}
        currentIdx={vizState.currentIdx}
        arr={vizState.arr}
      />

      {/* Scanner */}
      <ArrayScanner
        arr={vizState.arr}
        currentIdx={vizState.currentIdx}
        scannedIdx={vizState.scannedIdx}
        foundIdx={vizState.foundIdx}
        target={vizState.target}
      />

      {/* Complexity note */}
      <ComplexityNote
        scannedCount={scannedCount}
        total={vizState.arr.length}
        found={vizState.foundIdx >= 0}
      />

      {/* Legend */}
      <div className="ls-legend">
        {[
          { color: COLORS.scanning.border, label: 'Currently checking' },
          { color: COLORS.missed.border,   label: 'Already scanned (miss)' },
          { color: COLORS.found.border,    label: 'Found ✓' },
          { color: COLORS.default.border,  label: 'Not yet checked' },
        ].map(({ color, label }) => (
          <span key={label} className="ls-legend-item">
            <span className="ls-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}