import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

// Color scheme unique to selection sort
const COLORS = {
  default:  '#1e3a6e',
  sorted:   '#16a34a',
  scanning: '#7c3aed',   // purple — the scanning pointer
  minIdx:   '#f59e0b',   // amber — current known minimum
  swapping: '#dc2626',   // red — the final swap
  justPlaced: '#06b6d4', // teal — just settled into place
};

function BarChart({ arr, sortedBoundary, scanning, minIdx, swapping, justPlaced }) {
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const getColor = (i) => {
    if (swapping.includes(i))    return COLORS.swapping;
    if (i === justPlaced)        return COLORS.justPlaced;
    if (i < sortedBoundary)      return COLORS.sorted;
    if (i === minIdx)            return COLORS.minIdx;
    if (i === scanning)          return COLORS.scanning;
    return COLORS.default;
  };

  const getGlow = (i) => {
    if (swapping.includes(i)) return `0 0 12px ${COLORS.swapping}66`;
    if (i === minIdx)         return `0 0 12px ${COLORS.minIdx}66`;
    if (i === scanning)       return `0 0 8px ${COLORS.scanning}55`;
    return 'none';
  };

  return (
    <div className="sl-chart-wrap">
      {/* Pointer labels above */}
      <div className="sl-pointers" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {arr.map((_, i) => {
          const isScanning = i === scanning && !swapping.includes(i);
          const isMin      = i === minIdx && !swapping.includes(i) && i >= sortedBoundary;
          const isSwap     = swapping.includes(i);
          return (
            <div key={i} className="sl-ptr-cell">
              {isSwap && (
                <div className="sl-ptr sl-ptr-swap">
                  <span className="sl-ptr-label">swap</span>
                  <span className="sl-ptr-arrow">▼</span>
                </div>
              )}
              {!isSwap && isMin && (
                <div className="sl-ptr sl-ptr-min">
                  <span className="sl-ptr-label">min</span>
                  <span className="sl-ptr-arrow">▼</span>
                </div>
              )}
              {!isSwap && !isMin && isScanning && (
                <div className="sl-ptr sl-ptr-scan">
                  <span className="sl-ptr-label">scan</span>
                  <span className="sl-ptr-arrow">▼</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bars */}
      <div className="sl-bars" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const heightPct = Math.max(6, (val / maxVal) * 100);
          const color = getColor(i);
          const glow  = getGlow(i);

          return (
            <div key={i} className="sl-bar-col">
              <div
                className="sl-bar"
                style={{ height: `${heightPct}%`, background: color, boxShadow: glow }}
              >
                <span className="sl-bar-val">{val}</span>
              </div>
              <span className="sl-bar-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {/* Sorted boundary line */}
      {sortedBoundary > 0 && sortedBoundary < n && (
        <div className="sl-boundary" style={{ left: `${(sortedBoundary / n) * 100}%` }}>
          <span className="sl-boundary-label">sorted | unsorted</span>
        </div>
      )}
    </div>
  );
}

// Shows "current minimum" value as a big highlighted badge
function MinTracker({ minIdx, minVal, scanning, sortedBoundary, passNum, totalPasses }) {
  if (minIdx < 0 || minIdx < sortedBoundary) return null;
  return (
    <div className="sl-min-tracker">
      <div className="sl-min-badge">
        <span className="sl-min-title">Current Minimum</span>
        <span className="sl-min-val">{minVal}</span>
        <span className="sl-min-at">at index {minIdx}</span>
      </div>
      {passNum > 0 && (
        <div className="sl-pass-info">
          Pass <b>{passNum}</b> of <b>{totalPasses}</b>
          <div className="sl-pass-bar">
            <div
              className="sl-pass-fill"
              style={{ width: `${((passNum - 1) / totalPasses) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr = generateDefaultInput();
  const [arr, setArr]           = useState(defaultArr);
  const [inputOpen, setInputOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customErr, setCustomErr]     = useState('');
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    sortedBoundary: 0,
    scanning: -1,
    minIdx: -1,
    swapping: [],
    justPlaced: -1,
    passNum: 0,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState(v => ({ ...v, arr, sortedBoundary: 0, scanning: -1, minIdx: -1, swapping: [], justPlaced: -1, passNum: 0 }));
      return;
    }
    setVizState(prev => ({
      arr:            currentStep.arr            || prev.arr,
      sortedBoundary: currentStep.sortedBoundary ?? prev.sortedBoundary,
      scanning:       currentStep.scanning       ?? -1,
      minIdx:         currentStep.minIdx         ?? -1,
      swapping:       currentStep.swapping       || [],
      justPlaced:     currentStep.type === 'placed' ? currentStep.justPlaced : -1,
      passNum:        currentStep.passNum        || prev.passNum,
    }));
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => onRunSteps(generateSteps(arr));

  const handleReset = () => {
    onReset();
    setVizState({ arr, sortedBoundary: 0, scanning: -1, minIdx: -1, swapping: [], justPlaced: -1, passNum: 0 });
  };

  const handleNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 7);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    setArr(a);
    onReset();
    setVizState({ arr: a, sortedBoundary: 0, scanning: -1, minIdx: -1, swapping: [], justPlaced: -1, passNum: 0 });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({ arr: parsed, sortedBoundary: 0, scanning: -1, minIdx: -1, swapping: [], justPlaced: -1, passNum: 0 });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) { setCustomErr(e.message); }
  };

  return (
    <div className="sl-root">
      {/* Top bar */}
      <div className="sl-topbar">
        <button className={`sl-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="sl-topbar-right">
          <button className="sl-btn sl-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Array</button>
          <button className="sl-btn sl-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="sl-btn sl-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="sl-custom-panel">
          <div className="sl-custom-row">
            <input type="text" className="sl-custom-input"
              placeholder="e.g. 64, 25, 12, 22, 11, 90"
              value={customInput} onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="sl-btn sl-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="sl-err">{customErr}</span>}
          <span className="sl-hint">2 to 20 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      {/* Min tracker */}
      <MinTracker
        minIdx={vizState.minIdx}
        minVal={vizState.arr[vizState.minIdx]}
        scanning={vizState.scanning}
        sortedBoundary={vizState.sortedBoundary}
        passNum={vizState.passNum}
        totalPasses={arr.length - 1}
      />

      {/* Bar chart */}
      <BarChart
        arr={vizState.arr}
        sortedBoundary={vizState.sortedBoundary}
        scanning={vizState.scanning}
        minIdx={vizState.minIdx}
        swapping={vizState.swapping}
        justPlaced={vizState.justPlaced}
      />

      {/* Legend */}
      <div className="sl-legend">
        {[
          { color: COLORS.default,    label: 'Unsorted'      },
          { color: COLORS.scanning,   label: 'Scanning'      },
          { color: COLORS.minIdx,     label: 'Current Min'   },
          { color: COLORS.swapping,   label: 'Swapping'      },
          { color: COLORS.justPlaced, label: 'Just Placed'   },
          { color: COLORS.sorted,     label: 'Sorted'        },
        ].map(({ color, label }) => (
          <span key={label} className="sl-legend-item">
            <span className="sl-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
