import React, { useState, useCallback, useRef } from 'react';
import './Visualizer.css';

// ===== NODE COLORS =====
const COLORS = {
  default:  { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  head:     { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  tail:     { bg: '#2d200a', border: '#f59e0b', text: '#fcd34d' },
  focus:    { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
  inserting:{ bg: '#1a2d1a', border: '#22c55e', text: '#86efac' },
};

// ===== SINGLE DLL NODE =====
function DLLNode({ value, state, isHead, isTail }) {
  const col = COLORS[state] || COLORS.default;
  return (
    <div className="dll-node-wrap">
      <div className="dll-node-labels">
        {isHead && <span className="dll-label dll-label-head">HEAD</span>}
        {isTail && <span className="dll-label dll-label-tail">TAIL</span>}
      </div>
      <div className="dll-node" style={{ background: col.bg, border: `2px solid ${col.border}`, color: col.text }}>
        <span className="dll-ptr">←</span>
        <span className="dll-val">{value}</span>
        <span className="dll-ptr">→</span>
      </div>
    </div>
  );
}

// ===== OP PANEL =====
function OpPanel({ onInsHead, onInsTail, onDelHead, onDelTail, onSearch, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [val, setVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="dll-op-panel">
      <div className="dll-tabs">
        {['insert','delete','search','init'].map(t => (
          <button key={t} className={`dll-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="dll-tab-content">
        {tab === 'insert' && (
          <div className="dll-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" disabled={running} />
            <button className="dll-btn" onClick={() => { if(val) { onInsHead(+val); setVal(''); }}} disabled={running || !val}>Insert Head — O(1)</button>
            <button className="dll-btn" onClick={() => { if(val) { onInsTail(+val); setVal(''); }}} disabled={running || !val}>Insert Tail — O(1)</button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="dll-tab-form">
            <button className="dll-btn dll-btn-danger" onClick={onDelHead} disabled={running}>Delete Head — O(1)</button>
            <button className="dll-btn dll-btn-warning" onClick={onDelTail} disabled={running}>Delete Tail — O(1)</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="dll-tab-form">
            <input type="number" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search value" disabled={running} />
            <button className="dll-btn" onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); }}} disabled={running || !searchVal}>Search — O(n)</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="dll-tab-form">
            <button className="dll-btn" onClick={onRandom} disabled={running}>Random List (5)</button>
            <button className="dll-btn dll-btn-reset" onClick={onReset} disabled={running}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== STATE PANEL =====
function StatePanel({ list, ops }) {
  return (
    <div className="dll-state-panel">
      {[
        ['Head', list[0] ?? '∅', 'var(--green-light)'],
        ['Tail', list[list.length-1] ?? '∅', 'var(--amber-light)'],
        ['Size', list.length, 'var(--blue-light)'],
        ['isEmpty()', list.length === 0 ? 'true' : 'false', list.length === 0 ? 'var(--green-light)' : 'var(--red-light)'],
        ['Ops', ops.length, 'var(--blue-light)'],
      ].map(([label, value, color]) => (
        <div key={label} className="dll-state-row">
          <span className="dll-state-label">{label}</span>
          <span className="dll-state-val" style={{ color }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function DLLVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [ops, setOps] = useState(['DLL initialized with [15, 28, 7, 42]']);
  const [running, setRunning] = useState(false);
  const laneRef = useRef(null);

  const addOp = useCallback(op => setOps(p => [...p, op]), []);

  const run = useCallback((fn) => {
    setRunning(true);
    setTimeout(() => { fn(); setRunning(false); }, 350);
  }, []);

  const handleInsHead = useCallback(v => run(() => {
    setList(p => [v, ...p]);
    addOp(`Inserted ${v} at HEAD — O(1)`);
  }), [run, addOp]);

  const handleInsTail = useCallback(v => run(() => {
    setList(p => [...p, v]);
    addOp(`Inserted ${v} at TAIL — O(1)`);
  }), [run, addOp]);

  const handleDelHead = useCallback(() => {
    if (list.length === 0) return;
    run(() => {
      const del = list[0];
      setList(p => p.slice(1));
      addOp(`Deleted HEAD (${del}) — O(1)`);
    });
  }, [list, run, addOp]);

  const handleDelTail = useCallback(() => {
    if (list.length === 0) return;
    run(() => {
      const del = list[list.length - 1];
      setList(p => p.slice(0, -1));
      addOp(`Deleted TAIL (${del}) — O(1)`);
    });
  }, [list, run, addOp]);

  const handleSearch = useCallback(v => {
    setRunning(true);
    let step = 0;
    let found = -1;
    const tick = () => {
      if (step < list.length) {
        setFocusIdx(step);
        if (list[step] === v) found = step;
        step++;
        setTimeout(tick, 300);
      } else {
        addOp(found !== -1
          ? `Found ${v} at index ${found} — O(n) [${step} steps]`
          : `Not found: ${v} — O(n) [searched ${step} nodes]`);
        setFocusIdx(-1);
        setRunning(false);
      }
    };
    tick();
  }, [list, addOp]);

  const handleRandom = useCallback(() => {
    const r = Array.from({length: 5}, () => Math.floor(Math.random() * 99) + 1);
    setList(r); setOps(['Random DLL initialized']); setFocusIdx(-1);
  }, []);

  const handleReset = useCallback(() => {
    setList([]); setOps([]); setFocusIdx(-1);
  }, []);

  return (
    <div className="dll-root">
      {/* Header */}
      <div className="dll-header">
        <div>
          <h2 className="dll-title">⇄ Doubly Linked List</h2>
          <p className="dll-desc">Bidirectional linked list — traverse forward and backward</p>
        </div>
        <div className="dll-badges">
          <span className="dll-badge">Intermediate</span>
          <span className="dll-badge">O(1) Head/Tail</span>
        </div>
      </div>

      {/* Main */}
      <div className="dll-content">
        {/* Visualization */}
        <div className="dll-visual">
          <div className="dll-visual-title">
            Node Chain Visualization
            <span className="dll-dir-hint">← prev | next →</span>
          </div>

          {/* Null terminator (left) */}
          <div className="dll-lane" ref={laneRef}>
            {list.length === 0 ? (
              <div className="dll-empty">Empty list — insert a value to start</div>
            ) : (
              <>
                <div className="dll-null-term">∅</div>
                {list.map((val, idx) => (
                  <div key={idx} className="dll-node-chain">
                    <div className="dll-connector dll-conn-both">⇄</div>
                    <DLLNode
                      value={val}
                      isHead={idx === 0}
                      isTail={idx === list.length - 1}
                      state={idx === focusIdx ? 'focus' : idx === 0 ? 'head' : idx === list.length - 1 ? 'tail' : 'default'}
                    />
                  </div>
                ))}
                <div className="dll-connector dll-conn-both">⇄</div>
                <div className="dll-null-term">∅</div>
              </>
            )}
          </div>

          {/* Log */}
          <div className="dll-log">
            <div className="dll-log-label">Recent Ops:</div>
            <div className="dll-log-items">
              {ops.slice(-4).map((op, i) => <div key={i} className="dll-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="dll-controls">
          <OpPanel
            onInsHead={handleInsHead} onInsTail={handleInsTail}
            onDelHead={handleDelHead} onDelTail={handleDelTail}
            onSearch={handleSearch} onRandom={handleRandom}
            onReset={handleReset} running={running}
          />
          <StatePanel list={list} ops={ops} />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="dll-comparison">
        <h3>DLL vs SLL</h3>
        <table className="dll-table">
          <thead><tr><th>Operation</th><th>DLL</th><th>SLL</th></tr></thead>
          <tbody>
            <tr><td>Insert at Head</td><td className="dll-good">O(1)</td><td className="dll-good">O(1)</td></tr>
            <tr><td>Insert at Tail</td><td className="dll-good">O(1)*</td><td>O(n)</td></tr>
            <tr><td>Delete from Head</td><td className="dll-good">O(1)</td><td className="dll-good">O(1)</td></tr>
            <tr><td>Delete from Tail</td><td className="dll-good">O(1)*</td><td>O(n)</td></tr>
            <tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
            <tr><td>Traverse Backward</td><td className="dll-good">O(n)</td><td className="dll-bad">Not possible</td></tr>
            <tr><td>Memory/node</td><td>2 pointers</td><td className="dll-good">1 pointer</td></tr>
          </tbody>
        </table>
        <p className="dll-note">* O(1) when tail pointer is maintained</p>
      </div>
    </div>
  );
}


