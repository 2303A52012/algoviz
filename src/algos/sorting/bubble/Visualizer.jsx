import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

const BAR_COLORS = {
  default:   { bar: '#1e3a6e', label: '#4a6080' },
  comparing: { bar: '#2563eb', label: '#93c5fd', glow: '#2563eb44' },
  swapping:  { bar: '#dc2626', label: '#fca5a5', glow: '#dc262644' },
  sorted:    { bar: '#16a34a', label: '#86efac' },
  justSorted:{ bar: '#f59e0b', label: '#fcd34d', glow: '#f59e0b44' },
};

const PASS_COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#06b6d4'];

function BarChart({ arr, comparing, swapping, sortedFrom, justSorted }) {
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const getState = (i) => {
    if (swapping.includes(i))  return 'swapping';
    if (comparing.includes(i)) return 'comparing';
    if (i === justSorted)      return 'justSorted';
    if (i >= sortedFrom)       return 'sorted';
    return 'default';
  };

  return (
    <div className="bb-chart-wrap">
      {/* Pointer arrows above bars */}
      <div className="bb-pointers" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {arr.map((_, i) => {
          const isA = comparing[0] === i || swapping[0] === i;
          const isB = comparing[1] === i || swapping[1] === i;
          const isSwap = swapping.length > 0;
          return (
            <div key={i} className="bb-pointer-cell">
              {(isA || isB) && (
                <div className={`bb-pointer ${isSwap ? 'pointer-swap' : 'pointer-compare'}`}>
                  <span className="pointer-label">{isSwap ? (isA ? 'i' : 'j') : (isA ? 'i' : 'j')}</span>
                  <span className="pointer-arrow">▼</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bars */}
      <div className="bb-bars" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const state = getState(i);
          const color = BAR_COLORS[state];
          const heightPct = Math.max(6, (val / maxVal) * 100);

          return (
            <div key={i} className="bb-bar-col">
              <div
                className={`bb-bar ${state}`}
                style={{
                  height: `${heightPct}%`,
                  background: color.bar,
                  boxShadow: color.glow ? `0 0 10px ${color.glow}` : 'none',
                }}
              >
                <span className="bb-bar-val" style={{ color: color.label }}>{val}</span>
              </div>
              <span className="bb-bar-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {/* Sorted region overlay */}
      {sortedFrom < arr.length && (
        <div
          className="bb-sorted-region"
          style={{
            left: `${(sortedFrom / n) * 100}%`,
            width: `${((n - sortedFrom) / n) * 100}%`,
          }}
        >
          <span className="bb-sorted-label">sorted ✓</span>
        </div>
      )}
    </div>
  );
}

function PassTracker({ passNum, totalPasses }) {
  if (!passNum || totalPasses <= 0) return null;
  return (
    <div className="bb-pass-tracker">
      <span className="bb-pass-title">Passes:</span>
      <div className="bb-pass-dots">
        {Array.from({ length: Math.min(totalPasses, 15) }, (_, i) => (
          <div
            key={i}
            className={`bb-pass-dot ${
              i < passNum - 1 ? 'done' : i === passNum - 1 ? 'active' : 'pending'
            }`}
            style={i === passNum - 1
              ? { background: PASS_COLORS[i % PASS_COLORS.length], boxShadow: `0 0 6px ${PASS_COLORS[i % PASS_COLORS.length]}` }
              : {}
            }
            title={`Pass ${i + 1}`}
          />
        ))}
      </div>
      <span className="bb-pass-label">Pass {passNum} of {totalPasses}</span>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr = generateDefaultInput();
  const [arr, setArr]           = useState(defaultArr);
  const [customInput, setCustomInput] = useState('');
  const [customErr, setCustomErr]     = useState('');
  const [inputOpen, setInputOpen]     = useState(false);
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    comparing: [], swapping: [],
    sortedFrom: defaultArr.length,
    justSorted: -1, passNum: 0,
  });

  // Sync viz with currentStep from AlgoPage
  useEffect(() => {
    if (!currentStep) {
      setVizState(v => ({ ...v, arr, comparing: [], swapping: [], sortedFrom: arr.length, justSorted: -1, passNum: 0 }));
      return;
    }
    setVizState(prev => ({
      arr:        currentStep.arr       || prev.arr,
      comparing:  currentStep.comparing || [],
      swapping:   currentStep.swapping  || [],
      sortedFrom: currentStep.sortedFrom ?? prev.sortedFrom,
      justSorted: currentStep.type === 'pass-end' ? currentStep.justSorted : -1,
      passNum:    currentStep.passNum   || prev.passNum,
    }));
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => {
    const steps = generateSteps(arr);
    onRunSteps(steps);
  };

  const handleReset = () => {
    onReset();
    setVizState({ arr, comparing: [], swapping: [], sortedFrom: arr.length, justSorted: -1, passNum: 0 });
  };

  const handleNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 7);
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    setArr(newArr);
    onReset();
    setVizState({ arr: newArr, comparing: [], swapping: [], sortedFrom: newArr.length, justSorted: -1, passNum: 0 });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({ arr: parsed, comparing: [], swapping: [], sortedFrom: parsed.length, justSorted: -1, passNum: 0 });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) {
      setCustomErr(e.message);
    }
  };

  return (
    <div className="bb-root">
      {/* Top bar */}
      <div className="bb-topbar">
        <button className={`bb-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="bb-topbar-right">
          <button className="bb-btn bb-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Array</button>
          <button className="bb-btn bb-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="bb-btn bb-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {/* Custom input panel */}
      {inputOpen && (
        <div className="bb-custom-panel">
          <div className="bb-custom-row">
            <input
              type="text"
              className="bb-custom-input"
              placeholder="e.g. 64, 34, 25, 12, 22, 11, 90, 42"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()}
            />
            <button className="bb-btn bb-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="bb-err">{customErr}</span>}
          <span className="bb-hint">2 to 20 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      {/* Pass tracker */}
      <PassTracker passNum={vizState.passNum} totalPasses={arr.length - 1} />

      {/* Bar chart */}
      <BarChart
        arr={vizState.arr}
        comparing={vizState.comparing}
        swapping={vizState.swapping}
        sortedFrom={vizState.sortedFrom}
        justSorted={vizState.justSorted}
      />

      {/* Legend */}
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
