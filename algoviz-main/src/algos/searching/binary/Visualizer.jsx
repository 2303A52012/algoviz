import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

// ---- Number line range visualizer ----
function RangeLine({ arr, lo, hi, mid, eliminated, foundIdx, target }) {
  const n = arr.length;
  if (n === 0) return null;

  const getState = (i) => {
    if (i === foundIdx)          return 'found';
    if (eliminated.includes(i))  return 'eliminated';
    if (i === mid && mid >= 0)   return 'mid';
    if (i >= lo && i <= hi)      return 'active';
    return 'eliminated';
  };

  return (
    <div className="bs-range-wrap">

      {/* Bracket labels: lo, mid, hi */}
      <div className="bs-bracket-row" style={{ '--n': n }}>
        {arr.map((_, i) => {
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

      {/* Arrow row pointing down to mid */}
      <div className="bs-arrow-row" style={{ '--n': n }}>
        {arr.map((_, i) => (
          <div key={i} className="bs-arrow-cell">
            {i === mid && mid >= 0 && foundIdx < 0 && (
              <span className="bs-mid-arrow">▼</span>
            )}
            {i === foundIdx && (
              <span className="bs-found-arrow">★</span>
            )}
          </div>
        ))}
      </div>

      {/* Cells */}
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

      {/* Active range bracket underline */}
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

// ---- Step-by-step halving visualizer ----
function HalvingDiagram({ steps, currentStepIdx }) {
  // Show the sequence of lo/hi/mid across all steps so far
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

// ---- Comparison counter ----
function ComparisonPanel({ comparisons, maxComparisons, target, foundIdx, notFound }) {
  return (
    <div className="bs-cmp-panel">
      <div className="bs-cmp-left">
        <span className="bs-cmp-label">Comparisons</span>
        <span className="bs-cmp-val">{comparisons}</span>
        <span className="bs-cmp-max">of {maxComparisons} max</span>
      </div>
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
  const defaultArr    = generateDefaultInput();
  const defaultTarget = 63;

  const [arr, setArr]               = useState(defaultArr);
  const [target, setTarget]         = useState(defaultTarget);
  const [targetInput, setTargetInput] = useState(String(defaultTarget));
  const [inputOpen, setInputOpen]   = useState(false);
  const [customArr, setCustomArr]   = useState('');
  const [customErr, setCustomErr]   = useState('');
  const [allSteps, setAllSteps]     = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);

  const [vizState, setVizState] = useState({
    arr: defaultArr,
    lo: 0, hi: defaultArr.length - 1, mid: -1,
    eliminated: [],
    foundIdx: -1,
    target: defaultTarget,
    comparisons: 0,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
        arr, lo: 0, hi: arr.length - 1, mid: -1,
        eliminated: [], foundIdx: -1, target, comparisons: 0,
      });
      setCurrentStepIdx(-1);
      return;
    }
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
    setCurrentStepIdx(prev => prev + 1);
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => {
    const t = parseInt(targetInput);
    if (isNaN(t)) { setCustomErr('Enter a valid target number.'); return; }
    setTarget(t);
    setCustomErr('');
    const steps = generateSteps(arr, t);
    setAllSteps(steps);
    setCurrentStepIdx(-1);
    onRunSteps(steps);
  };

  const handleReset = () => {
    onReset();
    setAllSteps([]);
    setCurrentStepIdx(-1);
    setVizState({
      arr, lo: 0, hi: arr.length - 1, mid: -1,
      eliminated: [], foundIdx: -1, target, comparisons: 0,
    });
  };

  const handleNewArray = () => {
    const size = 10 + Math.floor(Math.random() * 8);
    const set = new Set();
    while (set.size < size) set.add(Math.floor(Math.random() * 140) + 5);
    const a = [...set].sort((x, y) => x - y);
    setArr(a);
    const t = Math.random() > 0.4 ? a[Math.floor(Math.random() * a.length)] : Math.floor(Math.random() * 140) + 5;
    setTargetInput(String(t));
    setTarget(t);
    onReset();
    setAllSteps([]);
    setCurrentStepIdx(-1);
    setVizState({ arr: a, lo: 0, hi: a.length - 1, mid: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0 });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customArr);
      const t = parseInt(targetInput);
      if (isNaN(t)) { setCustomErr('Enter a valid target.'); return; }
      setArr(parsed);
      setTarget(t);
      onReset();
      setAllSteps([]);
      setCurrentStepIdx(-1);
      setVizState({ arr: parsed, lo: 0, hi: parsed.length - 1, mid: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0 });
      setInputOpen(false);
      setCustomArr('');
    } catch (e) { setCustomErr(e.message); }
  };

  const maxComparisons = Math.ceil(Math.log2(arr.length));
  const notFound = currentStep?.type === 'not-found';

  return (
    <div className="bs-root">
      {/* Top bar */}
      <div className="bs-topbar">
        <button className={`bs-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        <div className="bs-target-wrap">
          <span className="bs-target-label">Target:</span>
          <input type="number" className="bs-target-input"
            value={targetInput} onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
            disabled={isRunning} placeholder="value" />
        </div>

        <div className="bs-note">Array auto-sorts ↑</div>

        <div className="bs-topbar-right">
          <button className="bs-btn bs-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="bs-btn bs-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Search</button>
          <button className="bs-btn bs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

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

      {/* Comparison tracker */}
      <ComparisonPanel
        comparisons={vizState.comparisons}
        maxComparisons={maxComparisons}
        target={vizState.target}
        foundIdx={vizState.foundIdx}
        notFound={notFound}
      />

      {/* Main range visualizer */}
      <RangeLine
        arr={vizState.arr}
        lo={vizState.lo}
        hi={vizState.hi}
        mid={vizState.mid}
        eliminated={vizState.eliminated}
        foundIdx={vizState.foundIdx}
        target={vizState.target}
      />

      {/* Search history */}
      <HalvingDiagram steps={allSteps} currentStepIdx={currentStepIdx} />

      {/* Legend */}
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
