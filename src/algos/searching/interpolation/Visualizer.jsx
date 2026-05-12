import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';


// ===== RANGE LINE COMPONENT =====
function RangeLine({ arr, lo, hi, pos, eliminated, foundIdx, target }) {
  const n = arr.length;
  if (n === 0) return null;

  const getState = (i) => {
    if (i === foundIdx)          return 'found';
    if (eliminated.includes(i))  return 'eliminated';
    if (i === pos && pos >= 0)   return 'pos';
    if (i >= lo && i <= hi)      return 'active';
    return 'eliminated';
  };

  return (
    <div className="int-range-wrap">
      <div className="int-bracket-row" style={{ '--n': n }}>
        {arr.map((_, i) => {
          const isLo  = i === lo  && foundIdx < 0;
          const isHi  = i === hi  && foundIdx < 0;
          const isPos = i === pos && pos >= 0 && foundIdx < 0;
          return (
            <div key={i} className="int-bracket-cell">
              {isLo  && !isPos && <span className="int-bracket int-bracket-lo">lo</span>}
              {isPos && <span className="int-bracket int-bracket-pos">pos</span>}
              {isHi  && !isPos && <span className="int-bracket int-bracket-hi">hi</span>}
              {isPos && isLo   && <span className="int-bracket int-bracket-lo" style={{marginTop:14}}>lo</span>}
              {isPos && isHi   && <span className="int-bracket int-bracket-hi" style={{marginTop:14}}>hi</span>}
            </div>
          );
        })}
      </div>

      <div className="int-arrow-row" style={{ '--n': n }}>
        {arr.map((_, i) => (
          <div key={i} className="int-arrow-cell">
            {i === pos && pos >= 0 && foundIdx < 0 && (
              <span className="int-pos-arrow">▼</span>
            )}
            {i === foundIdx && (
              <span className="int-found-arrow">★</span>
            )}
          </div>
        ))}
      </div>

      <div className="int-cells" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const state = getState(i);
          return (
            <div key={i} className={`int-cell int-cell-${state}`}>
              <span className="int-cell-val">{val}</span>
              <span className="int-cell-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {lo <= hi && foundIdx < 0 && (
        <div className="int-range-underline-wrap" style={{ '--n': n }} />
      )}
    </div>
  );
}

// ===== COMPARISON PANEL COMPONENT =====
function ComparisonPanel({ comparisons, target, foundIdx, notFound }) {
  // Interpolation search doesn't have a strict max bound like binary, it's roughly O(log log n) average
  // So we just show the count
  return (
    <div className="int-cmp-panel">
      <div className="int-cmp-left">
        <span className="int-cmp-label">Steps Taken</span>
        <span className="int-cmp-val">{comparisons}</span>
      </div>
      <div className="int-cmp-right" style={{marginLeft: 'auto'}}>
        {foundIdx >= 0 && <span className="int-cmp-result int-result-found">Found ✓</span>}
        {notFound     && <span className="int-cmp-result int-result-notfound">Not found ✗</span>}
        {!foundIdx && !notFound && comparisons > 0 &&
          <span className="int-cmp-result int-result-searching">Searching...</span>}
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
    lo: 0, hi: defaultArr.length - 1, pos: -1,
    eliminated: [], foundIdx: -1, target: defaultTarget, comparisons: 0,
    msg: 'Press Search to start Interpolation Search'
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
arr, lo: 0, hi: arr.length - 1, pos: -1,
        eliminated: [], foundIdx: -1, target, comparisons: 0,
        msg: 'Press Search to start Interpolation Search'
      });
      return;
    }
    setVizState(prev => ({
      arr:         currentStep.arr         || arr,
      lo:          currentStep.lo          ?? 0,
      hi:          currentStep.hi          ?? arr.length - 1,
      pos:         currentStep.pos         ?? -1,
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
      arr, lo: 0, hi: arr.length - 1, pos: -1,
      eliminated: [], foundIdx: -1, target, comparisons: 0,
      msg: 'Press Search to start Interpolation Search'
    });
  };

  const handleNewArray = () => {
    const a = generateDefaultInput();
    setArr(a);
    const t = Math.random() > 0.4 ? a[Math.floor(Math.random() * a.length)] : Math.floor(Math.random() * 140) + 5;
    setTargetInput(String(t));
    setTarget(t);
    onReset();
    setVizState({ arr: a, lo: 0, hi: a.length - 1, pos: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0, msg: 'Press Search to start Interpolation Search'});
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
      setVizState({ arr: parsed, lo: 0, hi: parsed.length - 1, pos: -1, eliminated: [], foundIdx: -1, target: t, comparisons: 0, msg: 'Press Search to start Interpolation Search'});
      setInputOpen(false);
      setCustomArr('');
    } catch (e) { setCustomErr(e.message); }
  };

  const notFound = currentStep?.type === 'not-found';

  return (
    <div className="int-root">
      <div className="int-topbar">
        <button className={`int-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>

        <div className="int-target-wrap">
          <span className="int-target-label">Target:</span>
          <input type="number" className="int-target-input"
            value={targetInput} onChange={e => setTargetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
            disabled={isRunning} placeholder="value" />
        </div>

        <div className="int-note">Array auto-sorts ↑</div>

        <div className="int-topbar-right">
          <button className="int-btn int-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Uniform</button>
          <button className="int-btn int-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Search</button>
          <button className="int-btn int-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="int-custom-panel">
          <div className="int-custom-row">
            <input type="text" className="int-custom-input"
              placeholder="e.g. 5, 14, 23, 42, 67, 91 (will be sorted)"
              value={customArr} onChange={e => setCustomArr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="int-btn int-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="int-err">{customErr}</span>}
          <span className="int-hint">3–25 numbers, comma-separated. Best on uniformly distributed data.</span>
        </div>
      )}

      <ComparisonPanel
        comparisons={vizState.comparisons}
        target={vizState.target}
        foundIdx={vizState.foundIdx}
        notFound={notFound}
      />

      <div className="int-formula-row">
        {vizState.msg}
      </div>

      <RangeLine
        arr={vizState.arr}
        lo={vizState.lo}
        hi={vizState.hi}
        pos={vizState.pos}
        eliminated={vizState.eliminated}
        foundIdx={vizState.foundIdx}
        target={vizState.target}
      />

      <div className="int-legend">
        {[
          { cls: 'int-cell-active',      label: 'Active range' },
          { cls: 'int-cell-pos',         label: 'Probed pos'   },
          { cls: 'int-cell-eliminated',  label: 'Eliminated'   },
          { cls: 'int-cell-found',       label: 'Found ✓'      },
        ].map(({ cls, label }) => (
          <span key={label} className="int-legend-item">
            <span className={`int-legend-swatch ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}





