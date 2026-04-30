import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

// ===== RANGE LINE COMPONENT =====
// Visualizes the search range with lo, mid, hi markers
function RangeLine({ arr, lo, hi, mid, eliminated, foundIdx, target }) {
  const n = arr.length;
  if (n === 0) return null;

  // ===== GET CELL STATE =====
  // Determine visual state for each element
  const getState = (i) => {
    if (i === foundIdx)          return 'found';  // Found target
    if (eliminated.includes(i))  return 'eliminated';  // Already ruled out
    if (i === mid && mid >= 0)   return 'mid';  // Current midpoint
    if (i >= lo && i <= hi)      return 'active';  // Still in search range
    return 'eliminated';  // Outside range
  };

  return (
    <div className="bs-range-wrap">
      {/* ===== BRACKET ROW: Shows lo, mid, hi labels above cells ===== */}
      <div className="bs-bracket-row" style={{ '--n': n }}>
        {arr.map((_, i) => {
          // Check if this position should have bracket labels
          const isLo  = i === lo  && foundIdx < 0;
          const isHi  = i === hi  && foundIdx < 0;
          const isMid = i === mid && mid >= 0 && foundIdx < 0;
          return (
            <div key={i} className="bs-bracket-cell">
              {isLo  && !isMid && <span className="bs-bracket bs-bracket-lo">lo</span>}
              {isMid && <span className="bs-bracket bs-bracket-mid">mid</span>}
              {isHi  && !isMid && <span className="bs-bracket bs-bracket-hi">hi</span>}
              {isMid && isLo   && <span className="bs-bracket bs-bracket-lo" style={{marginTop:14}}>lo</span>}
              {isMid && isHi   && <span className="bs-bracket bs-bracket-hi" style={{marginTop:14}}>hi</span>}
            </div>
          );
        })}
      </div>

      {/* ===== ARROW ROW: Points to mid element being checked ===== */}
      <div className="bs-arrow-row" style={{ '--n': n }}>
        {arr.map((_, i) => (
          <div key={i} className="bs-arrow-cell">
            {/* Downward arrow for current mid element */}
            {i === mid && mid >= 0 && foundIdx < 0 && (
              <span className="bs-mid-arrow">▼</span>
            )}
            {/* Star marker for found element */}
            {i === foundIdx && (
              <span className="bs-found-arrow">★</span>
            )}
          </div>
        ))}
      </div>

      {/* ===== CELLS: Display array values and their states ===== */}
      <div className="bs-cells" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const state = getState(i);
          return (
            <div key={i} className={`bs-cell bs-cell-${state}`}>
              <span className="bs-cell-val">{val}</span>
              <span className="bs-cell-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {/* ===== ACTIVE RANGE UNDERLINE: Shows current search boundaries ===== */}
      {lo <= hi && foundIdx < 0 && (
        <div className="bs-range-underline-wrap" style={{ '--n': n }}>
          <div
            className="bs-range-underline"
            style={{
              left:  `calc(${(lo / n) * 100}% + 2px)`,
              width: `calc(${((hi - lo + 1) / n) * 100}% - 4px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ===== HALVING DIAGRAM COMPONENT =====
// Shows search history with each step's mid-check and direction
function HalvingDiagram({ steps, currentStepIdx }) {
  // Filter to show only mid-check steps (eliminations)
  const midSteps = steps
    .slice(0, currentStepIdx + 1)
    .filter(s => s.type === 'mid-check' || s.type === 'found');

  if (midSteps.length === 0) return null;

  return (
    <div className="bs-halving">
      <span className="bs-halving-title">Search history</span>
      <div className="bs-halving-steps">
        {midSteps.map((s, i) => (
          <div key={i} className={`bs-halving-step ${i === midSteps.length - 1 ? 'active' : 'past'}`}>
            <span className="bs-hs-num">#{i + 1}</span>
            <span className="bs-hs-detail">
              [{s.lo}..{s.hi}] → mid={s.mid} ({s.arr[s.mid]})
              {s.arr[s.mid] === s.target ? ' ✓' : s.arr[s.mid] < s.target ? ' → right' : ' → left'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== COMPARISON PANEL COMPONENT =====
// Shows comparison count and progress visualization
function ComparisonPanel({ comparisons, maxComparisons, target, foundIdx, notFound }) {
  return (
    <div className="bs-cmp-panel">
      <div className="bs-cmp-left">
        <span className="bs-cmp-label">Comparisons</span>
        <span className="bs-cmp-val">{comparisons}</span>
        <span className="bs-cmp-max">of {maxComparisons} max</span>
      </div>
      {/* Visual progress dots */}
      <div className="bs-cmp-dots">
        {Array.from({ length: maxComparisons }, (_, i) => (
          <div
            key={i}
            className={`bs-cmp-dot ${
              i < comparisons ? (foundIdx >= 0 ? 'bs-dot-found' : notFound ? 'bs-dot-notfound' : 'bs-dot-used') : 'bs-dot-empty'
            }`}
          />
        ))}
      </div>
      {/* Status indicator */}
      <div className="bs-cmp-right">
        {foundIdx >= 0 && <span className="bs-cmp-result bs-result-found">Found ✓</span>}
        {notFound     && <span className="bs-cmp-result bs-result-notfound">Not found ✗</span>}
        {!foundIdx && !notFound && comparisons > 0 &&
          <span className="bs-cmp-result bs-result-searching">Searching...</span>}
      </div>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  // ===== DEFAULT VALUES =====
  const defaultArr    = generateDefaultInput();
  const defaultTarget = 63;

  // ===== STATE: Array and search parameters =====
  const [arr, setArr]               = useState(defaultArr);  // Current array
  const [target, setTarget]         = useState(defaultTarget);  // Target value
  const [targetInput, setTargetInput] = useState(String(defaultTarget));  // User input field
  const [inputOpen, setInputOpen]   = useState(false);  // Custom input panel open/closed
  const [customArr, setCustomArr]   = useState('');  // Custom array input string
  const [customErr, setCustomErr]   = useState('');  // Error message

  // ===== STATE: Step tracking =====
  const [allSteps, setAllSteps]     = useState([]);  // All generated steps
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);  // Current step number

  // ===== STATE: Visualization state synced with animation =====
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    lo: 0, hi: defaultArr.length - 1, mid: -1,  // Search boundaries and midpoint
    eliminated: [],  // Indices eliminated from search
    foundIdx: -1,  // Index of found element
    target: defaultTarget,
    comparisons: 0,
  });

  // ===== EFFECT: Sync visualization with animation step =====
  // When currentStep changes, update visualization state
  useEffect(() => {
    if (!currentStep) {
      // No step - reset to initial state
      setVizState({
        arr, lo: 0, hi: arr.length - 1, mid: -1,
        eliminated: [], foundIdx: -1, target, comparisons: 0,
      });
      setCurrentStepIdx(-1);
      return;
    }
    // Update visualization from current step
    setVizState({
      arr:         currentStep.arr         || arr,
      lo:          currentStep.lo          ?? 0,
      hi:          currentStep.hi          ?? arr.length - 1,
      mid:         currentStep.mid         ?? -1,
      eliminated:  currentStep.eliminated  || [],
      foundIdx:    currentStep.foundIdx    ?? -1,
      target:      currentStep.target      ?? target,
      comparisons: currentStep.comparisons ?? 0,
    });
    setCurrentStepIdx(prev => prev + 1);  // Increment step counter
  }, [currentStep]); // eslint-disable-line

  // ===== HANDLE RUN: Start search animation =====
  const handleRun = () => {
    const t = parseInt(targetInput);
    if (isNaN(t)) { setCustomErr('Enter a valid target number.'); return; }
    setTarget(t);
    setCustomErr('');
    // Generate steps and trigger animation
    const steps = generateSteps(arr, t);
    setAllSteps(steps);
    setCurrentStepIdx(-1);
    onRunSteps(steps);
  };

  // ===== HANDLE RESET: Clear visualization =====
  const handleReset = () => {
    onReset();
    setAllSteps([]);
    setCurrentStepIdx(-1);
    setVizState({
      arr, lo: 0, hi: arr.length - 1, mid: -1,
      eliminated: [], foundIdx: -1, target, comparisons: 0,
    });
  };

  // ===== HANDLE NEW ARRAY: Generate random sorted array and target =====
  const handleNewArray = () => {
    // Random array size 10-17 elements
    const size = 10 + Math.floor(Math.random() * 8);
    // Create set to avoid duplicates
    const set = new Set();
    while (set.size < size) set.add(Math.floor(Math.random() * 140) + 5);
    // Convert set to sorted array
    const a = [...set].sort((x, y) => x - y);
    setArr(a);
    // 60% chance target exists in array, 40% it's random
    const t = Math.random() > 0.4 ? a[Math.floor(Math.random() * a.length)] : Math.floor(Math.random() * 140) + 5;
    setTargetInput(String(t));
    setTarget(t);
    onReset();
    setAllSteps([]);
    setCurrentStepIdx(-1);
    setVizState({ arr: a, lo: 0, hi: a.length - 1, mid: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0 });
  };

  // ===== HANDLE LOAD CUSTOM: Load user-provided array and target =====
  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      // Parse and validate input (auto-sorts)
      const parsed = parseCustomInput(customArr);
      const t = parseInt(targetInput);
      if (isNaN(t)) { setCustomErr('Enter a valid target.'); return; }
      // Update array and target
      setArr(parsed);
      setTarget(t);
      onReset();
      setAllSteps([]);
      setCurrentStepIdx(-1);
      setVizState({ arr: parsed, lo: 0, hi: parsed.length - 1, mid: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0 });
      setInputOpen(false);  // Close input panel
      setCustomArr('');
    } catch (e) { setCustomErr(e.message); }
  };

  // ===== CALCULATE MAX COMPARISONS =====
  // Binary search worst case: O(log n) comparisons
  const maxComparisons = Math.ceil(Math.log2(arr.length));
  const notFound = currentStep?.type === 'not-found';

  return (
    <div className="bs-root">
      {/* ===== TOP BAR: Controls and target input ===== */}
      <div className="bs-topbar">
        {/* Custom input toggle button */}
        <button className={`bs-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        {/* Target value input */}
        <div className="bs-target-wrap">
          <span className="bs-target-label">Target:</span>
          <input type="number" className="bs-target-input"
            value={targetInput} onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
            disabled={isRunning} placeholder="value" />
        </div>

        {/* Note about auto-sorting */}
        <div className="bs-note">Array auto-sorts ↑</div>

        {/* Action buttons */}
        <div className="bs-topbar-right">
          <button className="bs-btn bs-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="bs-btn bs-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Search</button>
          <button className="bs-btn bs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {/* ===== CUSTOM INPUT PANEL ===== */}
      {inputOpen && (
        <div className="bs-custom-panel">
          <div className="bs-custom-row">
            <input type="text" className="bs-custom-input"
              placeholder="e.g. 5, 14, 23, 42, 67, 91 (will be sorted)"
              value={customArr} onChange={e => setCustomArr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="bs-btn bs-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="bs-err">{customErr}</span>}
          <span className="bs-hint">3–20 numbers, comma-separated. Will be auto-sorted.</span>
        </div>
      )}

      {/* ===== COMPARISON TRACKER: Shows comparison count ===== */}
      <ComparisonPanel
        comparisons={vizState.comparisons}
        maxComparisons={maxComparisons}
        target={vizState.target}
        foundIdx={vizState.foundIdx}
        notFound={notFound}
      />

      {/* ===== RANGE VISUALIZER: Main visualization with lo/hi/mid ===== */}
      <RangeLine
        arr={vizState.arr}
        lo={vizState.lo}
        hi={vizState.hi}
        mid={vizState.mid}
        eliminated={vizState.eliminated}
        foundIdx={vizState.foundIdx}
        target={vizState.target}
      />

      {/* ===== SEARCH HISTORY: Shows halving progression ===== */}
      <HalvingDiagram steps={allSteps} currentStepIdx={currentStepIdx} />

      {/* ===== LEGEND: Explain colors and symbols ===== */}
      <div className="bs-legend">
        {[
          { cls: 'bs-cell-active',      label: 'Active range' },
          { cls: 'bs-cell-mid',         label: 'Mid point'    },
          { cls: 'bs-cell-eliminated',  label: 'Eliminated'   },
          { cls: 'bs-cell-found',       label: 'Found ✓'      },
        ].map(({ cls, label }) => (
          <span key={label} className="bs-legend-item">
            <span className={`bs-legend-swatch ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
