import React, { useState, useRef } from 'react';
import './Visualizer.css';

const MAX_SIZE = 12;
const INITIAL  = [14, 7, 23, 5, 38, 11, 42, 19];

const CELL_COLORS = {
  default:    { bg: '#1e293b', border: '#334155', text: '#94a3b8' },
  highlighted:{ bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  found:      { bg: '#14532d', border: '#22c55e', text: '#86efac' },
  notfound:   { bg: '#2d0a0a', border: '#ef4444', text: '#fca5a5' },
  inserting:  { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
  deleting:   { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' },
  shifting:   { bg: '#1a1f08', border: '#84cc16', text: '#bef264' },
  new:        { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  empty:      { bg: '#0a0e14', border: '#1e293b', text: '#1e293b' },
};

function useStepRunner() {
  const timerRef = useRef(null);
  const run = (steps, delay = 500, onDone) => {
    clearTimeout(timerRef.current);
    let i = 0;
    const tick = () => {
      if (i >= steps.length) { onDone?.(); return; }
      steps[i++]();
      timerRef.current = setTimeout(tick, delay);
    };
    tick();
  };
  const stop = () => clearTimeout(timerRef.current);
  return { run, stop };
}

function CapacityGauge({ size, capacity }) {
  const pct   = Math.min(100, (size / capacity) * 100);
  const color = pct >= 100 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#22c55e';
  return (
    <div className="ar-gauge">
      <span className="ar-gauge-label">Size / Capacity</span>
      <div className="ar-gauge-bar">
        <div className="ar-gauge-fill"
          style={{ width: `${pct}%`, background: color, transition: 'width 0.3s ease' }} />
      </div>
      <span className="ar-gauge-text" style={{ color }}>{size} / {capacity}</span>
    </div>
  );
}

function ArrayRow({ cells, capacity }) {
  return (
    <div className="ar-row-wrap">
      <div className="ar-cells">
        {Array.from({ length: capacity }, (_, i) => {
          const cell   = cells[i];
          const isEmpty = !cell || cell.state === 'empty';
          const colors  = CELL_COLORS[cell?.state || 'empty'];
          return (
            <div key={i} className="ar-cell-col">
              <div className="ar-cell"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: !isEmpty ? `0 0 8px ${colors.border}44` : 'none',
                  opacity: isEmpty ? 0.2 : 1,
                  transition: 'all 0.2s ease',
                }}>
                <span className="ar-cell-val" style={{ color: colors.text }}>
                  {isEmpty ? '' : cell.val}
                </span>
              </div>
              <span className="ar-cell-idx">{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpPanel({ onAccess, onInsert, onDelete, onSearch, onReset, onRandom, disabled }) {
  const [val, setVal] = useState('');
  const [idx, setIdx] = useState('');
  const [op, setOp]   = useState('access');

  const ops = [
    { id: 'access', label: 'Access',  icon: '👁' },
    { id: 'insert', label: 'Insert',  icon: '+' },
    { id: 'delete', label: 'Delete',  icon: '✕' },
    { id: 'search', label: 'Search',  icon: '◎' },
  ];

  const handleGo = () => {
    const v = parseInt(val);
    const i = parseInt(idx);
    if (op === 'access') onAccess(isNaN(i) ? 0 : i);
    if (op === 'insert') onInsert(isNaN(v) ? 99 : v, isNaN(i) ? -1 : i);
    if (op === 'delete') onDelete(isNaN(i) ? 0 : i);
    if (op === 'search') onSearch(isNaN(v) ? 0 : v);
  };

  const needsVal = op === 'insert' || op === 'search';
  const needsIdx = op === 'access' || op === 'insert' || op === 'delete';

  const hints = {
    access: 'O(1) — direct index lookup. No traversal needed.',
    insert: 'O(n) — elements after the index shift right to make room.',
    delete: 'O(n) — elements after the index shift left to fill the gap.',
    search: 'O(n) — scan left to right until value found.',
  };

  return (
    <div className="ar-op-panel">
      <div className="ar-op-tabs">
        {ops.map(o => (
          <button key={o.id}
            className={`ar-op-tab ${op === o.id ? 'active' : ''}`}
            onClick={() => setOp(o.id)} disabled={disabled}>
            <span className="ar-op-icon">{o.icon}</span> {o.label}
          </button>
        ))}
      </div>

      <div className="ar-op-inputs">
        {needsVal && (
          <div className="ar-input-group">
            <label>Value</label>
            <input type="number" className="ar-input"
              placeholder="e.g. 42" value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              disabled={disabled} />
          </div>
        )}
        {needsIdx && (
          <div className="ar-input-group">
            <label>{op === 'insert' ? 'At index (blank = end)' : 'Index'}</label>
            <input type="number" className="ar-input"
              placeholder={op === 'insert' ? 'optional' : 'e.g. 2'}
              value={idx}
              onChange={e => setIdx(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              disabled={disabled} />
          </div>
        )}
        <button className="ar-go-btn" onClick={handleGo} disabled={disabled}>
          ▶ Run
        </button>
        <button className="ar-rand-btn" onClick={onRandom} disabled={disabled}>
          ⚡ Random Array
        </button>
        <button className="ar-reset-btn" onClick={onReset} disabled={disabled}>
          ↺ Reset
        </button>
      </div>

      <div className="ar-op-hint">{hints[op]}</div>
    </div>
  );
}

export default function Visualizer() {
  const initCells = () => INITIAL.map(v => ({ val: v, state: 'default' }));

  const [cells, setCells]       = useState(initCells);
  const [capacity, setCapacity] = useState(MAX_SIZE);
  const [log, setLog]           = useState('Choose an operation above and press ▶ Run.');
  const [running, setRunning]   = useState(false);
  const { run, stop }           = useStepRunner();

  const size = cells.length;

  const setCell = (arr, i, patch) =>
    arr.map((c, idx) => idx === i ? { ...c, ...patch } : c);

  const resetAll = (arr) =>
    arr.map(c => ({ ...c, state: 'default' }));

  // ACCESS
  const handleAccess = (idx) => {
    if (idx < 0 || idx >= size) {
      setLog(`✗ Index ${idx} out of bounds. Array has ${size} elements (indices 0–${size - 1}).`);
      return;
    }
    setRunning(true);
    run([
      () => { setCells(prev => setCell(prev, idx, { state: 'highlighted' })); setLog(`Accessing arr[${idx}]...`); },
      () => { setLog(`✓ arr[${idx}] = ${cells[idx].val}. O(1) — base address + offset. No loop!`); },
      () => { setCells(prev => resetAll(prev)); setRunning(false); },
    ], 500);
  };

  // SEARCH
  const handleSearch = (val) => {
    setRunning(true);
    setLog(`Searching for ${val}...`);
    const steps = [];
    let found = false;

    for (let i = 0; i < cells.length; i++) {
      const ci = i;
      steps.push(() => {
        setCells(prev => prev.map((c, j) => ({
          ...c,
          state: j < ci ? 'shifting' : j === ci ? 'highlighted' : 'default',
        })));
        setLog(`Checking arr[${ci}] = ${cells[ci].val} ${cells[ci].val === val ? '= ' + val + ' — MATCH!' : '≠ ' + val}`);
      });

      if (cells[i].val === val) {
        found = true;
        const fi = i;
        steps.push(() => {
          setCells(prev => setCell(resetAll(prev), fi, { state: 'found' }));
          setLog(`✓ Found ${val} at index ${fi}! Took ${fi + 1} comparison${fi > 0 ? 's' : ''} — O(n).`);
          setRunning(false);
          setTimeout(() => setCells(prev => resetAll(prev)), 1800);
        });
        break;
      }
    }

    if (!found) {
      steps.push(() => {
        setCells(prev => prev.map(c => ({ ...c, state: 'notfound' })));
        setLog(`✗ ${val} not found after checking all ${cells.length} elements — O(n) worst case.`);
        setRunning(false);
        setTimeout(() => setCells(prev => resetAll(prev)), 1800);
      });
    }
    run(steps, 380);
  };

  // INSERT
  const handleInsert = (val, atIdx) => {
    const insertAt = (atIdx < 0 || atIdx > size) ? size : atIdx;

    if (size >= capacity) {
      // Resize — double capacity
      const newCap = capacity * 2;
      setRunning(true);
      setLog(`Array full (${size}/${capacity})! Resizing — doubling capacity to ${newCap}...`);
      run([
        () => setCells(prev => prev.map(c => ({ ...c, state: 'shifting' }))),
        () => { setCapacity(newCap); setLog(`Capacity → ${newCap}. Old elements copied to new array. Now inserting ${val}...`); },
        () => {
          setCells(prev => {
            const next = [...prev];
            next.splice(insertAt, 0, { val, state: 'new' });
            return next;
          });
        },
        () => { setCells(prev => resetAll(prev)); setLog(`✓ Inserted ${val} at index ${insertAt}. Size: ${size + 1}/${newCap}.`); setRunning(false); },
      ], 600);
      return;
    }

    setRunning(true);
    const shiftCount = size - insertAt;
    setLog(`Inserting ${val} at index ${insertAt}. Shifting ${shiftCount} element${shiftCount !== 1 ? 's' : ''} right...`);

    run([
      () => setCells(prev => prev.map((c, i) => ({
        ...c, state: i === insertAt ? 'highlighted' : i > insertAt ? 'shifting' : 'default',
      }))),
      () => {
        setCells(prev => {
          const next = [...prev];
          next.splice(insertAt, 0, { val, state: 'new' });
          return next;
        });
        setLog(`Gap created at index ${insertAt}. Dropping ${val} in...`);
      },
      () => { setCells(prev => resetAll(prev)); setLog(`✓ Inserted ${val} at index ${insertAt}. Size: ${size + 1}/${capacity}.`); setRunning(false); },
    ], 500);
  };

  // DELETE
  const handleDelete = (idx) => {
    if (idx < 0 || idx >= size) {
      setLog(`✗ Index ${idx} out of bounds. Array has ${size} elements (0–${size - 1}).`);
      return;
    }
    const deletedVal = cells[idx].val;
    const shiftCount = size - idx - 1;
    setRunning(true);
    setLog(`Deleting arr[${idx}] = ${deletedVal}. Shifting ${shiftCount} element${shiftCount !== 1 ? 's' : ''} left...`);

    run([
      () => setCells(prev => setCell(prev, idx, { state: 'deleting' })),
      () => setCells(prev => prev.map((c, i) => ({
        ...c, state: i === idx ? 'deleting' : i > idx ? 'shifting' : 'default',
      }))),
      () => {
        setCells(prev => { const next = [...prev]; next.splice(idx, 1); return resetAll(next); });
        setLog(`✓ Deleted ${deletedVal} from index ${idx}. Size: ${size - 1}/${capacity}.`);
        setRunning(false);
      },
    ], 480);
  };

  const handleReset = () => {
    stop(); setRunning(false);
    setCells(initCells()); setCapacity(MAX_SIZE);
    setLog('Reset. Choose an operation above and press ▶ Run.');
  };

  const handleRandom = () => {
    stop(); setRunning(false);
    const size = 4 + Math.floor(Math.random() * 6);
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    setCells(newArr.map(v => ({ val: v, state: 'default' })));
    setCapacity(MAX_SIZE);
    setLog('Random array loaded: [' + newArr.join(', ') + ']. Size: ' + size + '/' + MAX_SIZE + '.');
  };

  return (
    <div className="ar-root">
      <CapacityGauge size={size} capacity={capacity} />
      <ArrayRow cells={cells} capacity={capacity} />
      <OpPanel
        onAccess={handleAccess} onInsert={handleInsert}
        onDelete={handleDelete} onSearch={handleSearch}
        onReset={handleReset} onRandom={handleRandom}
        disabled={running}
      />
      <div className="ar-log"><span className="ar-log-msg">{log}</span></div>
      <div className="ar-complexity-row">
        {[
          { op: 'Access', val: 'O(1)', good: true  },
          { op: 'Search', val: 'O(n)', good: false },
          { op: 'Insert', val: 'O(n)', good: false },
          { op: 'Delete', val: 'O(n)', good: false },
          { op: 'Resize', val: 'O(n)', good: false },
        ].map(({ op, val, good }) => (
          <div key={op} className="ar-complexity-chip">
            <span className="ar-chip-op">{op}</span>
            <span className={`ar-chip-val ${good ? 'good' : 'bad'}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
