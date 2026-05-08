import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const SHELL_SORT_PSEUDOCODE = [
  "function shellSort(arr) {",
  "  for gap = floor(n / 2); gap > 0; gap = floor(gap / 2) {",
  "    for i = gap to arr.length - 1 {",
  "      temp = arr[i]",
  "      for j = i; j >= gap and arr[j - gap] > temp; j -= gap {",
  "        arr[j] = arr[j - gap]",
  "      }",
  "      arr[j] = temp",
  "    }",
  "  }",
  "  return arr",
  "}"
];

const COLORS = {
  unsorted:     '#1e3a6e',
  comparing:    '#f59e0b',   // amber — element being compared
  partner:      '#10b981',   // emerald - gap partner
  inGap:        '#3b82f644', // subtle blue for elements within the current gap
  sorted:       '#16a34a',
};

function BarChart({ arr, gap, comparingIdx, gapPartnerIdx }) {
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const getColor = (i) => {
    if (gap === 0) return COLORS.sorted;
    if (i === comparingIdx) return COLORS.comparing;
    if (i === gapPartnerIdx) return COLORS.partner;
    
    // Highlight elements that are in the same "gap sequence" if we are comparing
    if (gap > 0 && comparingIdx !== -1) {
      if (i < comparingIdx && (comparingIdx - i) % gap === 0) return COLORS.inGap;
      if (i > comparingIdx && (i - comparingIdx) % gap === 0) return COLORS.inGap;
    }
    
    return COLORS.unsorted;
  };

  const getGlow = (i) => {
    const c = getColor(i);
    const glow = {
      [COLORS.comparing]: `0 0 12px ${COLORS.comparing}88`,
      [COLORS.partner]:   `0 0 12px ${COLORS.partner}88`,
    };
    return glow[c] || 'none';
  };

  return (
    <div className="sh-chart-wrap">
      {/* Pointer labels */}
      <div className="sh-pointers" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {arr.map((_, i) => {
          const isComparing  = i === comparingIdx;
          const isPartner    = i === gapPartnerIdx;
          return (
            <div key={i} className="sh-ptr-cell">
              {isComparing && (
                <div className="sh-ptr sh-ptr-compare">
                  <span className="sh-ptr-lbl">curr</span>
                  <span className="sh-ptr-arrow">▼</span>
                </div>
              )}
              {isPartner && (
                <div className="sh-ptr sh-ptr-partner">
                  <span className="sh-ptr-lbl">cmp</span>
                  <span className="sh-ptr-arrow">▼</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bars */}
      <div className="sh-bars" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const heightPct = Math.max(6, (val / maxVal) * 100);
          const color = getColor(i);
          const glow  = getGlow(i);

          return (
            <div key={i} className="sh-bar-col">
              <div
                className="sh-bar"
                style={{ height: `${heightPct}%`, background: color, boxShadow: glow }}
              >
                <span className="sh-bar-val">{val}</span>
              </div>
              <span className="sh-bar-idx">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr = generateDefaultInput();
  const [arr, setArr]               = useState(defaultArr);
  const [inputOpen, setInputOpen]   = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customErr, setCustomErr]   = useState('');
  
  const [vizState, setVizState] = useState({
    arr: defaultArr,
    gap: -1,
    comparingIdx: -1,
    gapPartnerIdx: -1,
    msg: 'Press Run to start Shell Sort',
    activeLine: 0,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
arr, gap: -1, comparingIdx: -1, gapPartnerIdx: -1, msg: 'Press Run to start Shell Sort', activeLine: 0,
      });
      return;
    }
    setVizState(prev => ({
      arr:           currentStep.arr           || prev.arr,
      gap:           currentStep.gap           ?? -1,
      comparingIdx:  currentStep.comparingIdx  ?? -1,
      gapPartnerIdx: currentStep.gapPartnerIdx ?? -1,
      msg:           currentStep.msg           || '',
      activeLine:    currentStep.activeLine    ?? prev.activeLine,
    }));
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => onRunSteps(generateSteps(arr));

  const handleReset = () => {
    onReset();
    setVizState({
      arr, gap: -1, comparingIdx: -1, gapPartnerIdx: -1, msg: 'Press Run to start Shell Sort', activeLine: 0,
    });
  };

  const handleNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 7);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    setArr(a);
    onReset();
    setVizState({
      arr: a, gap: -1, comparingIdx: -1, gapPartnerIdx: -1, msg: 'Press Run to start Shell Sort', activeLine: 0,
    });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({
        arr: parsed, gap: -1, comparingIdx: -1, gapPartnerIdx: -1, msg: 'Press Run to start Shell Sort', activeLine: 0,
      });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) { setCustomErr(e.message); }
  };

  return (
    <div className="sh-root">
      {/* Top bar */}
      <div className="sh-topbar">
        <button className={`sh-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="sh-topbar-right">
          <button className="sh-btn sh-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Array</button>
          <button className="sh-btn sh-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="sh-btn sh-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="sh-custom-panel">
          <div className="sh-custom-row">
            <input type="text" className="sh-custom-input"
              placeholder="e.g. 41, 12, 64, 7, 33, 90"
              value={customInput} onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="sh-btn sh-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="sh-err">{customErr}</span>}
          <span className="sh-hint">2 to 20 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      <div className="sh-status-row">
        {vizState.msg}
      </div>

      {/* Bar chart */}
      <BarChart
        arr={vizState.arr}
        gap={vizState.gap}
        comparingIdx={vizState.comparingIdx}
        gapPartnerIdx={vizState.gapPartnerIdx}
      />

      {/* Legend */}
      <div className="sh-legend">
        {[
          { color: COLORS.comparing,    label: 'Current Element' },
          { color: COLORS.partner,      label: 'Gap Partner' },
          { color: COLORS.inGap,        label: 'In Gap Sequence' },
          { color: COLORS.sorted,       label: 'Sorted (Gap=0)'  },
          { color: COLORS.unsorted,     label: 'Unsorted'        },
        ].map(({ color, label }) => (
          <span key={label} className="sh-legend-item">
            <span className="sh-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* ===== PSEUDOCODE TRACKER ===== */}
      <Pseudocode code={SHELL_SORT_PSEUDOCODE} activeLine={vizState.activeLine} />
    </div>
  );
}
