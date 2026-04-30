import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

// ===== COLOR SCHEME =====
// Define colors for different cell states during visualization
const COLORS = {
  default:  { bg: '#1e293b', border: '#334155', text: '#64748b' },  // Default cell
  scanning: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },  // Currently checking
  missed:   { bg: '#0f172a', border: '#1e293b', text: '#334155' },  // Already checked - no match
  found:    { bg: '#14532d', border: '#22c55e', text: '#86efac' },  // Found target
  target:   { bg: '#2d1b6e', border: '#7c3aed', text: '#d8b4fe' },  // Target color
};

// ===== ARRAY SCANNER COMPONENT =====
// Displays array with animated "lens" showing scanning process
function ArrayScanner({ arr, currentIdx, scannedIdx, foundIdx, target }) {
  const n = arr.length;

  // ===== GET CELL STATE =====
  // Determine visual state for each cell based on search progress
  const getCellState = (i) => {
    if (i === foundIdx)          return 'found';  // Target found here
    if (i === currentIdx)        return 'scanning';  // Currently checking this
    if (scannedIdx.includes(i))  return 'missed';  // Already checked, not a match
    return 'default';  // Not yet checked
  };

  return (
    <div className="ls-scanner-wrap">
      {/* ===== CURSOR ROW: Shows visual indicator above cells ===== */}
      <div className="ls-cursor-row" style={{ '--n': n }}>
        {arr.map((_, i) => (
          <div key={i} className="ls-cursor-cell">
            {/* Moving lens for current element being scanned */}
            {i === currentIdx && foundIdx < 0 && (
              <div className="ls-cursor">
                <div className="ls-cursor-glass">
                  <div className="ls-cursor-inner" />
                </div>
                <div className="ls-cursor-handle" />
              </div>
            )}
            {/* Star marker showing where target was found */}
            {i === foundIdx && (
              <div className="ls-found-marker">
                <span className="ls-found-star">★</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== MAIN CELLS: Each cell shows array element and its state ===== */}
      <div className="ls-cells" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const state = getCellState(i);  // Get visual state
          const c = COLORS[state];  // Get colors for this state

          return (
            <div
              key={i}
              className={`ls-cell ls-cell-${state}`}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                // Glow effect for scanning and found states
                boxShadow: state === 'scanning' ? `0 0 14px ${c.border}55` :
                           state === 'found'    ? `0 0 16px ${c.border}77` : 'none',
              }}
            >
              {/* Display value */}
              <span className="ls-cell-val" style={{ color: c.text }}>{val}</span>
              {/* Display index */}
              <span className="ls-cell-idx">{i}</span>

              {/* ===== COMPARE BUBBLE: Shows comparison during scanning ===== */}
              {state === 'scanning' && (
                <div className="ls-compare-bubble">
                  <span>{val} {val === target ? '=' : '≠'} {target}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== PROGRESS BAR: Shows how many elements have been scanned ===== */}
      <div className="ls-progress-wrap">
        <div className="ls-progress-bar">
          <div
            className={`ls-progress-fill ${foundIdx >= 0 ? 'ls-progress-found' : ''}`}
            // Width shows percentage of array scanned
            style={{ width: `${(Math.max(scannedIdx.length, currentIdx >= 0 ? currentIdx + 1 : 0) / n) * 100}%` }}
          />
        </div>
        {/* Progress label: show scan count or found message */}
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

// ===== TARGET PANEL COMPONENT =====
// Shows target value and search status
function TargetPanel({ target, foundIdx, currentIdx, arr }) {
  // Determine status: found, not found, or still searching
  const status = foundIdx >= 0 ? 'found'
    : currentIdx < 0 && foundIdx < 0 ? 'not-found'
    : 'searching';

  return (
    <div className={`ls-target-panel ls-target-${status}`}>
      <div className="ls-target-left">
        <span className="ls-target-label">Target</span>
        <span className="ls-target-val">{target}</span>
      </div>
      {/* Display current search status */}
      <div className="ls-target-status">
        {status === 'searching'  && <span className="ls-status-text ls-status-searching">🔍 Searching...</span>}
        {status === 'found'      && <span className="ls-status-text ls-status-found">✓ Found at index {foundIdx}</span>}
        {status === 'not-found'  && <span className="ls-status-text ls-status-notfound">✗ Not found</span>}
      </div>
    </div>
  );
}

// ===== COMPLEXITY NOTE COMPONENT =====
// Shows time complexity analysis
function ComplexityNote({ scannedCount, total, found }) {
  return (
    <div className="ls-complexity-note">
      <span className="ls-cn-title">Complexity</span>
      <span className="ls-cn-item"><b>Best:</b> O(1) — target at index 0</span>
      <span className="ls-cn-item"><b>Worst:</b> O(n) — target at end or not found</span>
      <span className="ls-cn-item">
        <b>This run:</b> {scannedCount} comparisons {found ? '(found early!)' : total > 0 ? `(${((scannedCount/total)*100).toFixed(0)}% of array scanned)` : ''}
      </span>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  // ===== DEFAULT VALUES =====
  const defaultArr = generateDefaultInput();
  const defaultTarget = 47;

  // ===== STATE: Array and search parameters =====
  const [arr, setArr]           = useState(defaultArr);  // Current array
  const [target, setTarget]     = useState(defaultTarget);  // Target value
  const [targetInput, setTargetInput] = useState(String(defaultTarget));  // User input field
  const [inputOpen, setInputOpen] = useState(false);  // Custom input panel open/closed
  const [customArr, setCustomArr] = useState('');  // Custom array input string
  const [customErr, setCustomErr] = useState('');  // Error message for custom input

  // ===== STATE: Visualization state synced with animation =====
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    currentIdx: -1,  // Index currently being checked
    scannedIdx: [],  // Indices already checked
    foundIdx: -1,  // Index where target was found (-1 if not found)
    target: defaultTarget,
  });

  // ===== EFFECT: Sync visualization with animation step =====
  // When currentStep changes, update visualization state
  useEffect(() => {
    if (!currentStep) {
      // No step - reset to initial state
      setVizState({ arr, currentIdx: -1, scannedIdx: [], foundIdx: -1, target });
      return;
    }
    // Update visualization from current step
    setVizState({
      arr:        currentStep.arr        || arr,
      currentIdx: currentStep.currentIdx ?? -1,
      scannedIdx: currentStep.scannedIdx || [],
      foundIdx:   currentStep.foundIdx   ?? -1,
      target:     currentStep.target     ?? target,
    });
  }, [currentStep]); // eslint-disable-line

  // ===== HANDLE RUN: Start search animation =====
  const handleRun = () => {
    const t = parseInt(targetInput);
    if (isNaN(t)) { setCustomErr('Enter a valid target number.'); return; }
    setTarget(t);
    setCustomErr('');
    // Generate steps and trigger animation
    onRunSteps(generateSteps(arr, t));
  };

  // ===== HANDLE RESET: Clear visualization =====
  const handleReset = () => {
    onReset();
    setVizState({ arr, currentIdx: -1, scannedIdx: [], foundIdx: -1, target });
  };

  // ===== HANDLE NEW ARRAY: Generate random array and target =====
  const handleNewArray = () => {
    // Random array size 10-17 elements
    const size = 10 + Math.floor(Math.random() * 8);
    // Random values 5-95
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    setArr(a);
    // 60% chance target exists in array, 40% chance it's a random value
    const t = Math.random() > 0.4 ? a[Math.floor(Math.random() * a.length)] : Math.floor(Math.random() * 90) + 5;
    setTargetInput(String(t));
    setTarget(t);
    onReset();
    setVizState({ arr: a, currentIdx: -1, scannedIdx: [], foundIdx: -1, target: t });
  };

  // ===== HANDLE LOAD CUSTOM: Load user-provided array and target =====
  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      // Parse and validate input
      const parsed = parseCustomInput(customArr);
      const t = parseInt(targetInput);
      if (isNaN(t)) { setCustomErr('Enter a valid target number.'); return; }
      // Update array and target
      setArr(parsed);
      setTarget(t);
      onReset();
      setVizState({ arr: parsed, currentIdx: -1, scannedIdx: [], foundIdx: -1, target: t });
      setInputOpen(false);  // Close input panel
      setCustomArr('');
    } catch (e) { setCustomErr(e.message); }
  };

  // ===== CALCULATE SCAN COUNT =====
  // Total elements scanned so far
  const scannedCount = vizState.scannedIdx.length + (vizState.currentIdx >= 0 ? 1 : 0);

  return (
    <div className="ls-root">
      {/* ===== TOP BAR: Controls and target input ===== */}
      <div className="ls-topbar">
        {/* Custom input toggle button */}
        <button className={`ls-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        {/* Target value input */}
        <div className="ls-target-input-wrap">
          <span className="ls-target-input-label">Target:</span>
          <input
            type="number"
            className="ls-target-input"
            value={targetInput}
            onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}  // Enter key to search
            disabled={isRunning}
            placeholder="value"
          />
        </div>

        {/* Action buttons */}
        <div className="ls-topbar-right">
          <button className="ls-btn ls-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="ls-btn ls-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Search</button>
          <button className="ls-btn ls-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {/* ===== CUSTOM INPUT PANEL ===== */}
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

      {/* ===== TARGET PANEL: Shows target value and search status ===== */}
      <TargetPanel
        target={vizState.target}
        foundIdx={vizState.foundIdx}
        currentIdx={vizState.currentIdx}
        arr={vizState.arr}
      />

      {/* ===== ARRAY SCANNER: Main visualization ===== */}
      <ArrayScanner
        arr={vizState.arr}
        currentIdx={vizState.currentIdx}
        scannedIdx={vizState.scannedIdx}
        foundIdx={vizState.foundIdx}
        target={vizState.target}
      />

      {/* ===== COMPLEXITY NOTE: Analysis info ===== */}
      <ComplexityNote
        scannedCount={scannedCount}
        total={vizState.arr.length}
        found={vizState.foundIdx >= 0}
      />

      {/* ===== LEGEND: Explain colors ===== */}
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