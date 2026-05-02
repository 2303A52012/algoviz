// ===== BUBBLE SORT VISUALIZER COMPONENT =====
// React component that renders step-by-step bubble sort visualization with bar chart, controls, and state management

import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

// ===== COLOR CONFIGURATION: Define visual appearance for each bar state =====
// Each state includes: bar color, label text color, optional glow effect
const BAR_COLORS = {
  default:    { bar: '#1e3a6e', label: '#4a6080' }, // Unsorted elements: dark blue
  comparing:  { bar: '#2563eb', label: '#93c5fd', glow: '#2563eb44' }, // Being compared: bright blue with glow
  swapping:   { bar: '#dc2626', label: '#fca5a5', glow: '#dc262644' }, // Being swapped: red with glow
  sorted:     { bar: '#16a34a', label: '#86efac' }, // Confirmed sorted: green
  justSorted: { bar: '#f59e0b', label: '#fcd34d', glow: '#f59e0b44' }, // Just placed: amber with glow
};

// ===== PASS TRACKER COLORS: Rainbow colors for different passes =====
// Each pass gets a unique color for visual distinction in pass tracker dots
const PASS_COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#06b6d4'];

// ===== BAR CHART COMPONENT: Renders visual bar chart with color-coded states =====
function BarChart({ arr, comparing, swapping, sortedFrom, justSorted }) {
  // Find maximum value in array for scaling bar heights
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  // ===== HELPER: Determine visual state of bar at index i =====
  // Priority: swapping > comparing > justSorted > sorted > default
  const getState = (i) => {
    // Currently being swapped: highest priority
    if (swapping.includes(i))  return 'swapping';
    // Currently being compared
    if (comparing.includes(i)) return 'comparing';
    // Just placed in sorted region
    if (i === justSorted)      return 'justSorted';
    // In sorted region (beyond sortedFrom index)
    if (i >= sortedFrom)       return 'sorted';
    // Default unsorted state
    return 'default';
  };

  return (
    <div className="bb-chart-wrap">
      {/* ===== POINTER ARROWS: Show which indices are being compared/swapped ===== */}
      <div className="bb-pointers" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {arr.map((_, i) => {
          // Check if this index is first or second element in comparison/swap
          const isA = comparing[0] === i || swapping[0] === i;
          const isB = comparing[1] === i || swapping[1] === i;
          // Determine if current operation is swap or compare
          const isSwap = swapping.length > 0;
          
          return (
            <div key={i} className="bb-pointer-cell">
              {/* Show pointer if this index is involved in current operation */}
              {(isA || isB) && (
                <div className={`bb-pointer ${isSwap ? 'pointer-swap' : 'pointer-compare'}`}>
                  {/* Label: i for first element, j for second */}
                  <span className="pointer-label">{isSwap ? (isA ? 'i' : 'j') : (isA ? 'i' : 'j')}</span>
                  <span className="pointer-arrow">▼</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== BAR CHART: Render color-coded bars with heights proportional to values ===== */}
      <div className="bb-bars" style={{ '--n': n }}>
        {arr.map((val, i) => {
          // Determine color and styling based on element state
          const state = getState(i);
          const color = BAR_COLORS[state];
          // Calculate bar height as percentage of max value, minimum 6% for visibility
          const heightPct = Math.max(6, (val / maxVal) * 100);

          return (
            <div key={i} className="bb-bar-col">
              {/* Individual bar with dynamic styling */}
              <div
                className={`bb-bar ${state}`}
                style={{
                  height: `${heightPct}%`, // Scale proportional to value
                  background: color.bar, // Color based on state
                  boxShadow: color.glow ? `0 0 10px ${color.glow}` : 'none', // Glow effect if active
                }}
              >
                {/* Value label inside bar */}
                <span className="bb-bar-val" style={{ color: color.label }}>{val}</span>
              </div>
              {/* Index label below bar */}
              <span className="bb-bar-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {/* ===== SORTED REGION OVERLAY: Visual indicator of sorted section ===== */}
      {/* Only show overlay if some elements are sorted but not all */}
      {sortedFrom < arr.length && (
        <div
          className="bb-sorted-region"
          style={{
            // Position overlay to start at sortedFrom index
            left: `${(sortedFrom / n) * 100}%`,
            // Width covers remaining unsorted region
            width: `${((n - sortedFrom) / n) * 100}%`,
          }}
        >
          <span className="bb-sorted-label">sorted ✓</span>
        </div>
      )}
    </div>
  );
}

// ===== PASS TRACKER COMPONENT: Show progress through algorithm passes =====
function PassTracker({ passNum, totalPasses }) {
  // Don't render if no pass data available
  if (!passNum || totalPasses <= 0) return null;
  
  return (
    <div className="bb-pass-tracker">
      <span className="bb-pass-title">Passes:</span>
      <div className="bb-pass-dots">
        {/* Render dot for each pass (max 15 to prevent overflow) */}
        {Array.from({ length: Math.min(totalPasses, 15) }, (_, i) => (
          <div
            key={i}
            className={`bb-pass-dot ${
              // Determine dot state: completed passes are 'done', current is 'active', future are 'pending'
              i < passNum - 1 ? 'done' : i === passNum - 1 ? 'active' : 'pending'
            }`}
            // Add glow effect to active pass dot
            style={i === passNum - 1
              ? { background: PASS_COLORS[i % PASS_COLORS.length], boxShadow: `0 0 6px ${PASS_COLORS[i % PASS_COLORS.length]}` }
              : {}
            }
            title={`Pass ${i + 1}`}
          />
        ))}
      </div>
      {/* Display current pass number and total passes */}
      <span className="bb-pass-label">Pass {passNum} of {totalPasses}</span>
    </div>
  );
}

// ===== MAIN VISUALIZER COMPONENT: Orchestrates entire Bubble Sort visualization =====
export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  // ===== STATE: Input array and visualization tracking =====
  const defaultArr = generateDefaultInput(); // Load default array from steps.js
  const [arr, setArr]           = useState(defaultArr); // Current working array
  const [customInput, setCustomInput] = useState(''); // User's custom input text
  const [customErr, setCustomErr]     = useState(''); // Error message for invalid input
  const [inputOpen, setInputOpen]     = useState(false); // Toggle custom input panel
  
  // ===== STATE: Visualization state synced with current step =====
  const [vizState, setVizState] = useState({
    arr: defaultArr, // Array being visualized
    comparing: [], // Indices of elements being compared
    swapping: [], // Indices of elements being swapped
    sortedFrom: defaultArr.length, // Index where sorted region begins
    justSorted: -1, // Index of element just placed in final position
    passNum: 0, // Current pass number
  });

  // ===== EFFECT: Sync visualization state with current algorithm step =====
  // This updates the visualization whenever the algorithm advances to a new step
  useEffect(() => {
    // If no current step, reset visualization to initial state
    if (!currentStep) {
      setVizState(v => ({ ...v, arr, comparing: [], swapping: [], sortedFrom: arr.length, justSorted: -1, passNum: 0 }));
      return;
    }
    
    // ===== UPDATE VIZ STATE: Pull data from current step =====
    setVizState(prev => ({
      arr:        currentStep.arr       || prev.arr, // Update array
      comparing:  currentStep.comparing || [], // Update comparing indices
      swapping:   currentStep.swapping  || [], // Update swapping indices
      sortedFrom: currentStep.sortedFrom ?? prev.sortedFrom, // Update sorted region boundary
      justSorted: currentStep.type === 'pass-end' ? currentStep.justSorted : -1, // Highlight if pass ended
      passNum:    currentStep.passNum   || prev.passNum, // Update pass number
    }));
  }, [currentStep]); // Re-run when current step changes

  // ===== HANDLER: Execute algorithm by generating all steps =====
  const handleRun = () => {
    // Generate complete sequence of steps for current array
    const steps = generateSteps(arr);
    // Pass steps to AlgoPage parent component for execution
    onRunSteps(steps);
  };

  // ===== HANDLER: Reset visualization to initial state =====
  const handleReset = () => {
    // Notify parent to reset algorithm state
    onReset();
    // Reset all visualization state
    setVizState({ arr, comparing: [], swapping: [], sortedFrom: arr.length, justSorted: -1, passNum: 0 });
  };

  // ===== HANDLER: Generate random array and reset =====
  const handleNewArray = () => {
    // Generate random size between 8-14 elements
    const size = 8 + Math.floor(Math.random() * 7);
    // Generate random values between 10-99
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    // Update array and reset visualization
    setArr(newArr);
    onReset();
    setVizState({ arr: newArr, comparing: [], swapping: [], sortedFrom: newArr.length, justSorted: -1, passNum: 0 });
  };

  // ===== HANDLER: Load and validate user-provided custom array =====
  const handleLoadCustom = () => {
    // Clear any previous error messages
    setCustomErr('');
    try {
      // Parse input using validation function from steps.js
      const parsed = parseCustomInput(customInput);
      // Update array and reset visualization
      setArr(parsed);
      onReset();
      setVizState({ arr: parsed, comparing: [], swapping: [], sortedFrom: parsed.length, justSorted: -1, passNum: 0 });
      // Close input panel after successful load
      setInputOpen(false);
      setCustomInput('');
    } catch (e) {
      // Display error message if input validation fails
      setCustomErr(e.message);
    }
  };

  return (
    <div className="bb-root">
      {/* ===== TOP CONTROL BAR: Custom input toggle and action buttons ===== */}
      <div className="bb-topbar">
        {/* Toggle button for custom input panel */}
        <button className={`bb-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="bb-topbar-right">
          {/* Generate random array button */}
          <button className="bb-btn bb-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Array</button>
          {/* Run algorithm button */}
          <button className="bb-btn bb-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          {/* Reset to initial state button */}
          <button className="bb-btn bb-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {/* ===== CUSTOM INPUT PANEL: Allow user to enter custom array ===== */}
      {inputOpen && (
        <div className="bb-custom-panel">
          <div className="bb-custom-row">
            {/* Input field for comma-separated numbers */}
            <input
              type="text"
              className="bb-custom-input"
              placeholder="e.g. 64, 34, 25, 12, 22, 11, 90, 42"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()}
            />
            {/* Load button to submit input */}
            <button className="bb-btn bb-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {/* Display validation error if input is invalid */}
          {customErr && <span className="bb-err">{customErr}</span>}
          {/* Help text showing input constraints */}
          <span className="bb-hint">2 to 20 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      {/* ===== PASS TRACKER: Show progress through passes ===== */}
      <PassTracker passNum={vizState.passNum} totalPasses={arr.length - 1} />

      {/* ===== BAR CHART: Main visualization of algorithm execution ===== */}
      <BarChart
        arr={vizState.arr}
        comparing={vizState.comparing}
        swapping={vizState.swapping}
        sortedFrom={vizState.sortedFrom}
        justSorted={vizState.justSorted}
      />

      {/* ===== LEGEND: Explain color coding ===== */}
      <div className="bb-legend">
        {[
          { color: BAR_COLORS.default.bar,    label: 'Unsorted'   },
          { color: BAR_COLORS.comparing.bar,  label: 'Comparing'  },
          { color: BAR_COLORS.swapping.bar,   label: 'Swapping'   },
          { color: BAR_COLORS.justSorted.bar, label: 'Just Placed'},
          { color: BAR_COLORS.sorted.bar,     label: 'Sorted'     },
        ].map(({ color, label }) => (
          <span key={label} className="bb-legend-item">
            <span className="bb-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
