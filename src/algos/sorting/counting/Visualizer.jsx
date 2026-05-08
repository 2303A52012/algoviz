import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const COUNTING_SORT_PSEUDOCODE = [
  "function countingSort(arr) {",
  "  max = findMax(arr)",
  "  counts = new Array(max + 1).fill(0)",
  "  output = new Array(arr.length)",
  "  for i = 0 to arr.length - 1 {",
  "    counts[arr[i]]++",
  "  }",
  "  for i = 1 to max {",
  "    counts[i] += counts[i - 1]",
  "  }",
  "  for i = arr.length - 1 down to 0 {",
  "    output[counts[arr[i]] - 1] = arr[i]",
  "    counts[arr[i]]--",
  "  }",
  "  return output",
  "}"
];

const COLORS = {
  activeArr: '#3b82f6',
  activeCount: '#10b981',
  activeOutput: '#8b5cf6',
  done: '#065f46',
};

function ArrayRow({ title, arr, activeIdx, activeClass, done }) {
  if (!arr) return null;
  return (
    <div className="cs-array-wrap">
      <div className="cs-array-title">{title}</div>
      <div className="cs-array">
        {arr.map((val, i) => {
          let cls = 'cs-cell';
          if (val === null) cls += ' empty';
          else if (done) cls += ' done';
          else if (i === activeIdx) cls += ` ${activeClass}`;

          return (
            <div key={i} className="cs-cell-col">
              <div className="cs-cell-idx">{i}</div>
              <div className={cls}>{val !== null ? val : ''}</div>
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
    counts: null,
    output: null,
    phase: 'init',
    outputIdx: -1,
    msg: 'Press Run to start Counting Sort',
    activeLine: 0,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
arr, counts: null, output: null, phase: 'init',
        activeIdx: -1, countIdx: -1, outputIdx: -1, msg: 'Press Run to start Counting Sort', activeLine: 0,
      });
      return;
    }
    setVizState(prev => ({
      arr:       currentStep.arr       || arr,
      counts:    currentStep.counts    || null,
      output:    currentStep.output    || null,
      phase:     currentStep.phase     || 'init',
      outputIdx: currentStep.outputIdx ?? -1,
      msg:       currentStep.msg       || '',
      activeLine:currentStep.activeLine?? prev.activeLine,
    }));
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => onRunSteps(generateSteps(arr));

  const handleReset = () => {
    onReset();
    setVizState({
      arr, counts: null, output: null, phase: 'init',
      activeIdx: -1, countIdx: -1, outputIdx: -1, msg: 'Press Run to start Counting Sort', activeLine: 0,
    });
  };

  const handleNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 5);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 15)); // Keep values small for visualization
    setArr(a);
    onReset();
    setVizState({
      arr: a, counts: null, output: null, phase: 'init',
      activeIdx: -1, countIdx: -1, outputIdx: -1, msg: 'Press Run to start Counting Sort', activeLine: 0,
    });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({
        arr: parsed, counts: null, output: null, phase: 'init',
        activeIdx: -1, countIdx: -1, outputIdx: -1, msg: 'Press Run to start Counting Sort', activeLine: 0,
      });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) { setCustomErr(e.message); }
  };

  const isDone = vizState.phase === 'done';

  return (
    <div className="cs-root">
      {/* Top bar */}
      <div className="cs-topbar">
        <button className={`cs-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="cs-topbar-right">
          <button className="cs-btn cs-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Array</button>
          <button className="cs-btn cs-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="cs-btn cs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="cs-custom-panel">
          <div className="cs-custom-row">
            <input type="text" className="cs-custom-input"
              placeholder="e.g. 4, 2, 2, 8, 3, 3"
              value={customInput} onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="cs-btn cs-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="cs-err">{customErr}</span>}
          <span className="cs-hint">2 to 20 numbers, comma-separated, values 0–20 (small max value required for counting sort visualization)</span>
        </div>
      )}

      <div className="cs-status-row">
        {vizState.msg}
      </div>

      <div className="cs-arrays-container">
        <ArrayRow 
          title="Input Array" 
          arr={vizState.arr} 
          activeIdx={vizState.activeIdx} 
          activeClass="active" 
          done={isDone}
        />
        
        {vizState.counts && (
          <ArrayRow 
            title="Counts Array (Frequencies / Prefix Sums)" 
            arr={vizState.counts} 
            activeIdx={vizState.countIdx} 
            activeClass="active-count" 
          />
        )}

        {vizState.output && (
          <ArrayRow 
            title="Output (Sorted) Array" 
            arr={vizState.output} 
            activeIdx={vizState.outputIdx} 
            activeClass="active-output" 
            done={isDone}
          />
        )}
      </div>

      {/* Legend */}
      <div className="cs-legend">
        {[
          { color: COLORS.activeArr,    label: 'Reading Input' },
          { color: COLORS.activeCount,  label: 'Updating/Reading Counts' },
          { color: COLORS.activeOutput, label: 'Writing Output' },
          { color: COLORS.done,         label: 'Sorted' },
        ].map(({ color, label }) => (
          <span key={label} className="cs-legend-item">
            <span className="cs-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* ===== PSEUDOCODE TRACKER ===== */}
      <Pseudocode code={COUNTING_SORT_PSEUDOCODE} activeLine={vizState.activeLine} />
    </div>
  );
}
