import React, { useState, useEffect } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

const COLORS = {
  sorted:       '#16a34a',
  unsorted:     '#1e3a6e',
  comparing:    '#f59e0b',   // amber — element being compared against picked
  shifting:     '#0891b2',   // cyan — elements being shifted right
  insertAt:     '#a855f7',   // purple — gap / insertion point
  justInserted: '#10b981',   // emerald — just dropped into place
  picked:       '#ec4899',   // pink — the element held in hand (floating)
};

function PickedCard({ val }) {
  if (val === null) return <div className="is-picked-placeholder" />;
  return (
    <div className="is-picked-card">
      <span className="is-picked-label">holding</span>
      <span className="is-picked-val">{val}</span>
      <span className="is-picked-sub">finding its spot →</span>
    </div>
  );
}

function BarChart({ arr, sortedCount, pickedIdx, comparingIdx, insertAt, shiftingRange, justInserted }) {
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const getColor = (i) => {
    if (i === justInserted)        return COLORS.justInserted;
    if (i === insertAt && insertAt >= 0) return COLORS.insertAt;
    if (shiftingRange.includes(i)) return COLORS.shifting;
    if (i === comparingIdx)        return COLORS.comparing;
    if (i === pickedIdx)           return COLORS.picked;
    if (i < sortedCount)           return COLORS.sorted;
    return COLORS.unsorted;
  };

  const getGlow = (i) => {
    const c = getColor(i);
    const glow = {
      [COLORS.comparing]:    `0 0 12px ${COLORS.comparing}66`,
      [COLORS.shifting]:     `0 0 10px ${COLORS.shifting}55`,
      [COLORS.insertAt]:     `0 0 14px ${COLORS.insertAt}77`,
      [COLORS.justInserted]: `0 0 14px ${COLORS.justInserted}66`,
      [COLORS.picked]:       `0 0 12px ${COLORS.picked}66`,
    };
    return glow[c] || 'none';
  };

  return (
    <div className="is-chart-wrap">
      {/* Pointer labels */}
      <div className="is-pointers" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {arr.map((_, i) => {
          const isComparing  = i === comparingIdx;
          const isInsertAt   = i === insertAt && insertAt >= 0;
          const isShifting   = shiftingRange.includes(i);
          const isJustInsert = i === justInserted;
          return (
            <div key={i} className="is-ptr-cell">
              {isJustInsert && (
                <div className="is-ptr is-ptr-insert">
                  <span className="is-ptr-lbl">insert</span>
                  <span className="is-ptr-arrow">▼</span>
                </div>
              )}
              {!isJustInsert && isInsertAt && (
                <div className="is-ptr is-ptr-gap">
                  <span className="is-ptr-lbl">gap</span>
                  <span className="is-ptr-arrow">▼</span>
                </div>
              )}
              {!isJustInsert && !isInsertAt && isComparing && (
                <div className="is-ptr is-ptr-compare">
                  <span className="is-ptr-lbl">cmp</span>
                  <span className="is-ptr-arrow">▼</span>
                </div>
              )}
              {!isJustInsert && !isInsertAt && !isComparing && isShifting && (
                <div className="is-ptr is-ptr-shift">
                  <span className="is-ptr-lbl">→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bars */}
      <div className="is-bars" style={{ '--n': n }}>
        {arr.map((val, i) => {
          const heightPct = Math.max(6, (val / maxVal) * 100);
          const color = getColor(i);
          const glow  = getGlow(i);

          return (
            <div key={i} className="is-bar-col">
              <div
                className={`is-bar ${i === pickedIdx ? 'is-bar-ghost' : ''}`}
                style={{ height: `${heightPct}%`, background: color, boxShadow: glow }}
              >
                <span className="is-bar-val">{val}</span>
              </div>
              <span className="is-bar-idx">{i}</span>
            </div>
          );
        })}
      </div>

      {/* Split label: sorted | unsorted */}
      {sortedCount > 0 && sortedCount < n && (
        <div className="is-split-line" style={{ left: `${(sortedCount / n) * 100}%` }}>
          <div className="is-split-labels">
            <span className="is-split-left">sorted ({sortedCount})</span>
            <span className="is-split-right">unsorted ({n - sortedCount})</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SortedRegionPreview({ arr, sortedCount }) {
  if (sortedCount <= 0) return null;
  const sorted = arr.slice(0, sortedCount);
  return (
    <div className="is-sorted-preview">
      <span className="is-sorted-preview-title">Sorted so far:</span>
      <div className="is-sorted-chips">
        {sorted.map((v, i) => (
          <span key={i} className="is-sorted-chip">{v}</span>
        ))}
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
  const [vizState, setVizState]     = useState({
    arr: defaultArr,
    sortedCount: 1,
    pickedIdx: -1,
    pickedVal: null,
    comparingIdx: -1,
    insertAt: -1,
    shiftingRange: [],
    justInserted: -1,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
        arr, sortedCount: 1, pickedIdx: -1, pickedVal: null,
        comparingIdx: -1, insertAt: -1, shiftingRange: [], justInserted: -1,
      });
      return;
    }
    setVizState({
      arr:           currentStep.arr           || arr,
      sortedCount:   currentStep.sortedCount   ?? 1,
      pickedIdx:     currentStep.pickedIdx     ?? -1,
      pickedVal:     currentStep.pickedVal     ?? null,
      comparingIdx:  currentStep.comparingIdx  ?? -1,
      insertAt:      currentStep.insertAt      ?? -1,
      shiftingRange: currentStep.shiftingRange || [],
      justInserted:  currentStep.type === 'insert' ? currentStep.justInserted : -1,
    });
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => onRunSteps(generateSteps(arr));

  const handleReset = () => {
    onReset();
    setVizState({
      arr, sortedCount: 1, pickedIdx: -1, pickedVal: null,
      comparingIdx: -1, insertAt: -1, shiftingRange: [], justInserted: -1,
    });
  };

  const handleNewArray = () => {
    const size = 8 + Math.floor(Math.random() * 7);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    setArr(a);
    onReset();
    setVizState({
      arr: a, sortedCount: 1, pickedIdx: -1, pickedVal: null,
      comparingIdx: -1, insertAt: -1, shiftingRange: [], justInserted: -1,
    });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({
        arr: parsed, sortedCount: 1, pickedIdx: -1, pickedVal: null,
        comparingIdx: -1, insertAt: -1, shiftingRange: [], justInserted: -1,
      });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) { setCustomErr(e.message); }
  };

  return (
    <div className="is-root">
      {/* Top bar */}
      <div className="is-topbar">
        <button className={`is-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="is-topbar-right">
          <button className="is-btn is-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random Array</button>
          <button className="is-btn is-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="is-btn is-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="is-custom-panel">
          <div className="is-custom-row">
            <input type="text" className="is-custom-input"
              placeholder="e.g. 41, 12, 64, 7, 33, 90"
              value={customInput} onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="is-btn is-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="is-err">{customErr}</span>}
          <span className="is-hint">2 to 20 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      {/* Picked card + sorted preview row */}
      <div className="is-status-row">
        <PickedCard val={vizState.pickedVal} />
        <SortedRegionPreview arr={vizState.arr} sortedCount={vizState.sortedCount} />
      </div>

      {/* Bar chart */}
      <BarChart
        arr={vizState.arr}
        sortedCount={vizState.sortedCount}
        pickedIdx={vizState.pickedIdx}
        comparingIdx={vizState.comparingIdx}
        insertAt={vizState.insertAt}
        shiftingRange={vizState.shiftingRange}
        justInserted={vizState.justInserted}
      />

      {/* Legend */}
      <div className="is-legend">
        {[
          { color: COLORS.sorted,       label: 'Sorted'        },
          { color: COLORS.picked,       label: 'Picked'        },
          { color: COLORS.comparing,    label: 'Comparing'     },
          { color: COLORS.shifting,     label: 'Shifting →'    },
          { color: COLORS.insertAt,     label: 'Insert Gap'    },
          { color: COLORS.justInserted, label: 'Just Inserted' },
          { color: COLORS.unsorted,     label: 'Unsorted'      },
        ].map(({ color, label }) => (
          <span key={label} className="is-legend-item">
            <span className="is-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
