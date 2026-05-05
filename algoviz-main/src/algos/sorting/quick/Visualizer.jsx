import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

const COLORS = {
  default:     '#1e3a6e',
  settled:     '#16a34a',   // green — pivot settled in final place
  pivot:       '#f59e0b',   // amber — current pivot
  leftZone:    '#2563eb',   // blue — elements <= pivot
  rightZone:   '#7c3aed',   // purple — elements > pivot
  scanning:    '#06b6d4',   // cyan — currently being scanned
  swapping:    '#ef4444',   // red — being swapped
  inactive:    '#0f172a',   // very dark — outside current partition range
};

// Partition zone visualizer
function ZoneBar({ lo, hi, pivotIdx, leftZone, rightZone, scanIdx, n }) {
  if (lo < 0 || hi < 0) return null;
  return (
    <div className="qk-zone-bar">
      {Array.from({ length: n }, (_, i) => {
        let zoneClass = 'qk-zone-cell';
        let label = '';
        if (i < lo || i > hi)         { zoneClass += ' qk-zone-outer'; }
        else if (i === pivotIdx)       { zoneClass += ' qk-zone-pivot'; label = 'P'; }
        else if (leftZone.includes(i)) { zoneClass += ' qk-zone-left';  label = '≤'; }
        else if (rightZone.includes(i)){ zoneClass += ' qk-zone-right'; label = '>'; }
        else if (i === scanIdx)        { zoneClass += ' qk-zone-scan';  label = '?'; }
        else                           { zoneClass += ' qk-zone-unsorted'; }
        return (
          <div key={i} className={zoneClass}>
            <span className="qk-zone-lbl">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Recursion depth indicator
function DepthIndicator({ depth }) {
  const maxShown = 6;
  return (
    <div className="qk-depth">
      <span className="qk-depth-label">Recursion depth:</span>
      <div className="qk-depth-bars">
        {Array.from({ length: maxShown }, (_, i) => (
          <div key={i} className={`qk-depth-bar ${i < depth ? 'qk-depth-active' : ''}`} />
        ))}
      </div>
      <span className="qk-depth-val">{depth}</span>
    </div>
  );
}

// Pivot info panel
function PivotPanel({ pivotVal, pivotIdx, lo, hi, pivotStrategy, arr }) {
  if (pivotVal === null || pivotVal === undefined) return null;
  const formulaMap = {
    first:  `pivot = arr[${lo}] = ${pivotVal}`,
    last:   `pivot = arr[${hi}] = ${pivotVal}`,
    middle: `pivot = arr[⌊(${lo}+${hi})/2⌋] = arr[${Math.floor((lo+hi)/2)}] = ${pivotVal}`,
  };
  return (
    <div className="qk-pivot-panel">
      <div className="qk-pivot-badge">
        <span className="qk-pivot-title">Pivot</span>
        <span className="qk-pivot-val">{pivotVal}</span>
      </div>
      <div className="qk-pivot-meta">
        <span className="qk-pivot-formula">{formulaMap[pivotStrategy] || `pivot = ${pivotVal}`}</span>
        <span className="qk-pivot-range">range [{lo}..{hi}]</span>
      </div>
    </div>
  );
}

function BarChart({ arr, pivotIdx, leftZone, rightZone, scanIdx, settled, swapping, lo, hi }) {
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const getColor = (i) => {
    if (settled.includes(i) && i !== pivotIdx) return COLORS.settled;
    if (swapping && swapping.includes(i))      return COLORS.swapping;
    if (i === scanIdx)                         return COLORS.scanning;
    if (i === pivotIdx)                        return COLORS.pivot;
    if (leftZone.includes(i))                  return COLORS.leftZone;
    if (rightZone.includes(i))                 return COLORS.rightZone;
    if (lo >= 0 && (i < lo || i > hi))         return COLORS.inactive;
    return COLORS.default;
  };

  const getGlow = (i) => {
    const c = getColor(i);
    const glows = {
      [COLORS.pivot]:    `0 0 14px ${COLORS.pivot}77`,
      [COLORS.scanning]: `0 0 10px ${COLORS.scanning}66`,
      [COLORS.swapping]: `0 0 12px ${COLORS.swapping}66`,
      [COLORS.settled]:  `0 0 8px ${COLORS.settled}44`,
    };
    return glows[c] || 'none';
  };

  return (
    <div className="qk-chart-wrap">
      {/* Pointer row */}
      <div className="qk-pointers" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {arr.map((_, i) => {
          const isPivot   = i === pivotIdx;
          const isScan    = i === scanIdx && !isPivot;
          const isSwap    = swapping?.includes(i);
          return (
            <div key={i} className="qk-ptr-cell">
              {isPivot && !settled.includes(i) && (
                <div className="qk-ptr qk-ptr-pivot">
                  <span className="qk-ptr-lbl">pivot</span>
                  <span className="qk-ptr-arrow">▼</span>
                </div>
              )}
              {isScan && !isSwap && (
                <div className="qk-ptr qk-ptr-scan">
                  <span className="qk-ptr-lbl">scan</span>
                  <span className="qk-ptr-arrow">▼</span>
                </div>
              )}
              {isSwap && (
                <div className="qk-ptr qk-ptr-swap">
                  <span className="qk-ptr-lbl">swap</span>
                  <span className="qk-ptr-arrow">▼</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bars */}
      <div className="qk-bars" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const heightPct = Math.max(6, (val / maxVal) * 100);
          const color = getColor(i);
          const glow  = getGlow(i);
          return (
            <div key={i} className="qk-bar-col">
              <div className="qk-bar"
                style={{ height: `${heightPct}%`, background: color, boxShadow: glow }}>
                <span className="qk-bar-val">{val}</span>
              </div>
              <span className="qk-bar-idx">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr = generateDefaultInput();
  const [arr, setArr]                   = useState(defaultArr);
  const [pivotStrategy, setPivotStrategy] = useState('middle');
  const [inputOpen, setInputOpen]       = useState(false);
  const [customInput, setCustomInput]   = useState('');
  const [customErr, setCustomErr]       = useState('');
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    pivotIdx: -1, pivotVal: null,
    lo: 0, hi: defaultArr.length - 1,
    scanIdx: -1,
    leftZone: [], rightZone: [],
    settled: [],
    swapping: null,
    depth: 0,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
        arr, pivotIdx: -1, pivotVal: null,
        lo: 0, hi: arr.length - 1,
        scanIdx: -1, leftZone: [], rightZone: [],
        settled: [], swapping: null, depth: 0,
      });
      return;
    }
    setVizState({
      arr:        currentStep.arr        || arr,
      pivotIdx:   currentStep.pivotIdx   ?? -1,
      pivotVal:   currentStep.pivotVal   ?? null,
      lo:         currentStep.lo         ?? 0,
      hi:         currentStep.hi         ?? arr.length - 1,
      scanIdx:    currentStep.scanIdx    ?? -1,
      leftZone:   currentStep.leftZone   || [],
      rightZone:  currentStep.rightZone  || [],
      settled:    currentStep.settled    || [],
      swapping:   currentStep.swapping   || null,
      depth:      currentStep.depth      ?? 0,
    });
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => onRunSteps(generateSteps(arr, pivotStrategy));

  const handleReset = () => {
    onReset();
    setVizState({
      arr, pivotIdx: -1, pivotVal: null,
      lo: 0, hi: arr.length - 1,
      scanIdx: -1, leftZone: [], rightZone: [],
      settled: [], swapping: null, depth: 0,
    });
  };

  const handleNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 7);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    setArr(a);
    onReset();
    setVizState({
      arr: a, pivotIdx: -1, pivotVal: null,
      lo: 0, hi: a.length - 1,
      scanIdx: -1, leftZone: [], rightZone: [],
      settled: [], swapping: null, depth: 0,
    });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({
        arr: parsed, pivotIdx: -1, pivotVal: null,
        lo: 0, hi: parsed.length - 1,
        scanIdx: -1, leftZone: [], rightZone: [],
        settled: [], swapping: null, depth: 0,
      });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) { setCustomErr(e.message); }
  };

  return (
    <div className="qk-root">
      {/* Top bar */}
      <div className="qk-topbar">
        <button className={`qk-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        {/* Pivot strategy selector */}
        <div className="qk-pivot-selector">
          <span className="qk-selector-label">Pivot:</span>
          {['first', 'middle', 'last'].map(s => (
            <button
              key={s}
              className={`qk-strat-btn ${pivotStrategy === s ? 'active' : ''}`}
              onClick={() => { setPivotStrategy(s); handleReset(); }}
              disabled={isRunning}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="qk-topbar-right">
          <button className="qk-btn qk-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="qk-btn qk-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="qk-btn qk-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="qk-custom-panel">
          <div className="qk-custom-row">
            <input type="text" className="qk-custom-input"
              placeholder="e.g. 52, 18, 73, 9, 34, 61"
              value={customInput} onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="qk-btn qk-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="qk-err">{customErr}</span>}
          <span className="qk-hint">2 to 20 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      {/* Status row: pivot panel + depth indicator */}
      <div className="qk-status-row">
        <PivotPanel
          pivotVal={vizState.pivotVal}
          pivotIdx={vizState.pivotIdx}
          lo={vizState.lo}
          hi={vizState.hi}
          pivotStrategy={pivotStrategy}
          arr={vizState.arr}
        />
        <DepthIndicator depth={vizState.depth} />
      </div>

      {/* Zone bar */}
      <ZoneBar
        lo={vizState.lo}
        hi={vizState.hi}
        pivotIdx={vizState.pivotIdx}
        leftZone={vizState.leftZone}
        rightZone={vizState.rightZone}
        scanIdx={vizState.scanIdx}
        n={vizState.arr.length}
      />

      {/* Bar chart */}
      <BarChart
        arr={vizState.arr}
        pivotIdx={vizState.pivotIdx}
        leftZone={vizState.leftZone}
        rightZone={vizState.rightZone}
        scanIdx={vizState.scanIdx}
        settled={vizState.settled}
        swapping={vizState.swapping}
        lo={vizState.lo}
        hi={vizState.hi}
      />

      {/* Legend */}
      <div className="qk-legend">
        {[
          { color: COLORS.pivot,     label: 'Pivot'      },
          { color: COLORS.leftZone,  label: '≤ pivot'    },
          { color: COLORS.rightZone, label: '> pivot'    },
          { color: COLORS.scanning,  label: 'Scanning'   },
          { color: COLORS.swapping,  label: 'Swapping'   },
          { color: COLORS.settled,   label: 'Settled ✓'  },
          { color: COLORS.inactive,  label: 'Out of range'},
        ].map(({ color, label }) => (
          <span key={label} className="qk-legend-item">
            <span className="qk-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
