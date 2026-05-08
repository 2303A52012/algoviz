import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';


// ===== RANGE LINE COMPONENT =====
function RangeLine({ arr, lo, hi, mid1, mid2, eliminated, foundIdx, target }) {
  const n = arr.length;
  if (n === 0) return null;

  const getState = (i) => {
    if (i === foundIdx)          return 'found';
    if (eliminated.includes(i))  return 'eliminated';
    if ((i === mid1 && mid1 >= 0) || (i === mid2 && mid2 >= 0)) return 'mid';
    if (i >= lo && i <= hi)      return 'active';
    return 'eliminated';
  };

  return (
    <div className="ts-range-wrap">
      <div className="ts-bracket-row" style={{ '--n': n }}>
        {arr.map((_, i) => {
          const isLo  = i === lo  && foundIdx < 0;
          const isHi  = i === hi  && foundIdx < 0;
          const isMid1 = i === mid1 && mid1 >= 0 && foundIdx < 0;
          const isMid2 = i === mid2 && mid2 >= 0 && foundIdx < 0;
          return (
            <div key={i} className="ts-bracket-cell">
              {isLo  && !isMid1 && !isMid2 && <span className="ts-bracket ts-bracket-lo">lo</span>}
              {isMid1 && <span className="ts-bracket ts-bracket-mid1">m1</span>}
              {isMid2 && <span className="ts-bracket ts-bracket-mid2">m2</span>}
              {isHi  && !isMid1 && !isMid2 && <span className="ts-bracket ts-bracket-hi">hi</span>}
              {(isMid1 || isMid2) && isLo && <span className="ts-bracket ts-bracket-lo" style={{marginTop:14}}>lo</span>}
              {(isMid1 || isMid2) && isHi && <span className="ts-bracket ts-bracket-hi" style={{marginTop:14}}>hi</span>}
            </div>
          );
        })}
      </div>

      <div className="ts-arrow-row" style={{ '--n': n }}>
        {arr.map((_, i) => (
          <div key={i} className="ts-arrow-cell">
            {(i === mid1 || i === mid2) && foundIdx < 0 && (
              <span className="ts-mid-arrow">▼</span>
            )}
            {i === foundIdx && (
              <span className="ts-found-arrow">★</span>
            )}
          </div>
        ))}
      </div>

      <div className="ts-cells" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const state = getState(i);
          return (
            <div key={i} className={`ts-cell ts-cell-${state}`}>
              <span className="ts-cell-val">{val}</span>
              <span className="ts-cell-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {lo <= hi && foundIdx < 0 && (
        <div className="ts-range-underline-wrap" style={{ '--n': n }}>
           
      )}
    </div>
  );
}

// ===== COMPARISON PANEL COMPONENT =====
function ComparisonPanel({ comparisons, maxComparisons, target, foundIdx, notFound }) {
  return (
    <div className="ts-cmp-panel">
      <div className="ts-cmp-left">
        <span className="ts-cmp-label">Comparisons</span>
        <span className="ts-cmp-val">{comparisons}</span>
        <span className="ts-cmp-max">of ~{maxComparisons} max</span>
      </div>
      <div className="ts-cmp-dots">
        {Array.from({ length: maxComparisons }, (_, i) => (
          <div
            key={i}
            className={`ts-cmp-dot ${
              i < comparisons ? (foundIdx >= 0 ? 'ts-dot-found' : notFound ? 'ts-dot-notfound' : 'ts-dot-used') : 'ts-dot-empty'
            }`}
          />
        ))}
      </div>
      <div className="ts-cmp-right">
        {foundIdx >= 0 && <span className="ts-cmp-result ts-result-found">Found ✓</span>}
        {notFound     && <span className="ts-cmp-result ts-result-notfound">Not found ✗</span>}
        {!foundIdx && !notFound && comparisons > 0 &&
          <span className="ts-cmp-result ts-result-searching">Searching...</span>}
      </div>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr    = generateDefaultInput();
  const defaultTarget = defaultArr[Math.floor(defaultArr.length / 2)];

  const [arr, setArr]               = useState(defaultArr);
  const [target, setTarget]         = useState(defaultTarget);
  const [targetInput, setTargetInput] = useState(String(defaultTarget));
  const [inputOpen, setInputOpen]   = useState(false);
  const [customArr, setCustomArr]   = useState('');
  const [customErr, setCustomErr]   = useState('');

  const [vizState, setVizState] = useState({
    arr: defaultArr,
    lo: 0, hi: defaultArr.length - 1, mid1: -1, mid2: -1,
    eliminated: [], foundIdx: -1, target: defaultTarget, comparisons: 0,
    msg: 'Press Search to start Ternary Search'
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
arr, lo: 0, hi: arr.length - 1, mid1: -1, mid2: -1,
        eliminated: [], foundIdx: -1, target, comparisons: 0,
        msg: 'Press Search to start Ternary Search'
      });
      return;
    }
    setVizState(prev => ({
      arr:         currentStep.arr         || arr,
      lo:          currentStep.lo          ?? 0,
      hi:          currentStep.hi          ?? arr.length - 1,
      mid1:        currentStep.mid1        ?? -1,
      mid2:        currentStep.mid2        ?? -1,
      eliminated:  currentStep.eliminated  || [],
      foundIdx:    currentStep.foundIdx    ?? -1,
      target:      currentStep.target      ?? target,
      comparisons: currentStep.comparisons ?? 0,
      msg:         currentStep.msg         || ''
    }));
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
    setVizState({
      arr, lo: 0, hi: arr.length - 1, mid1: -1, mid2: -1,
      eliminated: [], foundIdx: -1, target, comparisons: 0,
      msg: 'Press Search to start Ternary Search'
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
    setVizState({ arr: a, lo: 0, hi: a.length - 1, mid1: -1, mid2: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0, msg: 'Press Search to start Ternary Search'});
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
      setVizState({ arr: parsed, lo: 0, hi: parsed.length - 1, mid1: -1, mid2: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0, msg: 'Press Search to start Ternary Search'});
      setInputOpen(false);
      setCustomArr('');
    } catch (e) { setCustomErr(e.message); }
  };

  const maxComparisons = Math.ceil(Math.log(arr.length) / Math.log(1.5)) * 2 + 2; 
  const notFound = currentStep?.type === 'not-found';

  return (
    <div className="ts-root">
      <div className="ts-topbar">
        <button className={`ts-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        <div className="ts-target-wrap">
          <span className="ts-target-label">Target:</span>
          <input type="number" className="ts-target-input"
            value={targetInput} onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
            disabled={isRunning} placeholder="value" />
        </div>

        <div className="ts-note">Array auto-sorts ↑</div>

        <div className="ts-topbar-right">
          <button className="ts-btn ts-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="ts-btn ts-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Search</button>
          <button className="ts-btn ts-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="ts-custom-panel">
          <div className="ts-custom-row">
            <input type="text" className="ts-custom-input"
              placeholder="e.g. 5, 14, 23, 42, 67, 91 (will be sorted)"
              value={customArr} onChange={e => setCustomArr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="ts-btn ts-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="ts-err">{customErr}</span>}
          <span className="ts-hint">3–25 numbers, comma-separated. Will be auto-sorted.</span>
        </div>
      )}

      <ComparisonPanel
        comparisons={vizState.comparisons}
        maxComparisons={maxComparisons}
        target={vizState.target}
        foundIdx={vizState.foundIdx}
        notFound={notFound}
      />

      <div style={{ background: '#1e3a8a33', padding: '10px 16px', borderRadius: '8px', color: '#bfdbfe', fontSize: '13px', fontFamily: 'monospace' }}>
        {vizState.msg}
      </div>

      <RangeLine
        arr={vizState.arr}
        lo={vizState.lo}
        hi={vizState.hi}
        mid1={vizState.mid1}
        mid2={vizState.mid2}
        eliminated={vizState.eliminated}
        foundIdx={vizState.foundIdx}
        target={vizState.target}
      />

      <div className="ts-legend">
        {[
          { cls: 'ts-cell-active',      label: 'Active range' },
          { cls: 'ts-cell-mid',         label: 'Mid points'    },
          { cls: 'ts-cell-eliminated',  label: 'Eliminated'   },
          { cls: 'ts-cell-found',       label: 'Found ✓'      },
        ].map(({ cls, label }) => (
          <span key={label} className="ts-legend-item">
            <span className={`ts-legend-swatch ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}





