import React, { useState, useCallback, useRef } from 'react';
import './Visualizer.css';

const COLORS = {
  default:  { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  head:     { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  tail:     { bg: '#2d200a', border: '#f59e0b', text: '#fcd34d' },
  focus:    { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
};

function CLLNode({ value, state, isHead, isTail }) {
  const col = COLORS[state] || COLORS.default;
  return (
    <div className="cll-node-wrap">
      {isHead && <span className="cll-label cll-label-head">HEAD</span>}
      {!isHead && isTail && <span className="cll-label cll-label-tail">TAIL</span>}
      {!isHead && !isTail && <span className="cll-label" style={{visibility:'hidden'}}>x</span>}
      <div className="cll-node" style={{ background: col.bg, border: `2px solid ${col.border}`, color: col.text }}>
        <span className="cll-val">{value}</span>
        <span className="cll-ptr">→</span>
      </div>
    </div>
  );
}

function OpPanel({ onInsHead, onInsTail, onDelHead, onSearch, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [val, setVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="cll-op-panel">
      <div className="cll-tabs">
        {['insert','delete','search','init'].map(t => (
          <button key={t} className={`cll-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="cll-tab-content">
        {tab === 'insert' && (
          <div className="cll-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" disabled={running} />
            <button className="cll-btn" onClick={() => { if(val) { onInsHead(+val); setVal(''); }}} disabled={running || !val}>Insert Head — O(1)</button>
            <button className="cll-btn" onClick={() => { if(val) { onInsTail(+val); setVal(''); }}} disabled={running || !val}>Insert Tail — O(n)</button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="cll-tab-form">
            <button className="cll-btn cll-btn-danger" onClick={onDelHead} disabled={running}>Delete Head — O(1)</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="cll-tab-form">
            <input type="number" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search value" disabled={running} />
            <button className="cll-btn" onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); }}} disabled={running || !searchVal}>Search — O(n)</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="cll-tab-form">
            <button className="cll-btn" onClick={onRandom} disabled={running}>Random List (5)</button>
            <button className="cll-btn cll-btn-reset" onClick={onReset} disabled={running}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatePanel({ list, ops }) {
  return (
    <div className="cll-state-panel">
      {[
        ['Head', list[0] ?? '∅', 'var(--green-light)'],
        ['Tail', list[list.length-1] ?? '∅', 'var(--amber-light)'],
        ['Size', list.length, 'var(--blue-light)'],
        ['Circular', list.length > 0 ? 'true' : 'false', 'var(--amber-light)'],
        ['isEmpty()', list.length === 0 ? 'true' : 'false', list.length === 0 ? 'var(--green-light)' : 'var(--red-light)'],
        ['Ops', ops.length, 'var(--blue-light)'],
      ].map(([label, val, color]) => (
        <div key={label} className="cll-state-row">
          <span className="cll-state-label">{label}</span>
          <span className="cll-state-val" style={{ color }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

export default function CLLVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [ops, setOps] = useState(['SCLL initialized with [15, 28, 7, 42]']);
  const [running, setRunning] = useState(false);

  const addOp = useCallback(op => setOps(p => [...p, op]), []);

  const run = useCallback(fn => {
    setRunning(true);
    setTimeout(() => { fn(); setRunning(false); }, 350);
  }, []);

  const handleInsHead = useCallback(v => run(() => {
    setList(p => [v, ...p]);
    addOp(`Inserted ${v} at HEAD — O(1)`);
  }), [run, addOp]);

  const handleInsTail = useCallback(v => {
    const steps = list.length;
    run(() => {
      setList(p => [...p, v]);
      addOp(`Inserted ${v} at TAIL — O(n) [traversed ${steps} nodes]`);
    });
  }, [list.length, run, addOp]);

  const handleDelHead = useCallback(() => {
    if (list.length === 0) return;
    run(() => {
      const del = list[0];
      setList(p => p.slice(1));
      addOp(`Deleted HEAD (${del}) — O(1)`);
    });
  }, [list, run, addOp]);

  const handleSearch = useCallback(v => {
    setRunning(true);
    let step = 0, found = -1;
    const tick = () => {
      if (step < list.length) {
        setFocusIdx(step);
        if (list[step] === v) found = step;
        step++;
        setTimeout(tick, 300);
      } else {
        addOp(found !== -1
          ? `Found ${v} at index ${found} — O(n) [${step} steps]`
          : `Not found: ${v} — O(n) [${step} nodes searched]`);
        setFocusIdx(-1);
        setRunning(false);
      }
    };
    tick();
  }, [list, addOp]);

  const handleRandom = useCallback(() => {
    const r = Array.from({length: 5}, () => Math.floor(Math.random() * 99) + 1);
    setList(r); setOps(['Random SCLL initialized']); setFocusIdx(-1);
  }, []);

  const handleReset = useCallback(() => {
    setList([]); setOps([]); setFocusIdx(-1);
  }, []);

  return (
    <div className="cll-root">
      <div className="cll-header">
        <div>
          <h2 className="cll-title">↺ Singly Circular Linked List</h2>
          <p className="cll-desc">Singly linked list where tail's next points back to HEAD — no null terminator</p>
        </div>
        <div className="cll-badges">
          <span className="cll-badge">Intermediate</span>
          <span className="cll-badge">Circular</span>
        </div>
      </div>

      <div className="cll-content">
        <div className="cll-visual">
          <div className="cll-visual-title">Node Chain Visualization (Circular)</div>

          <div className="cll-lane">
            {list.length === 0 ? (
              <div className="cll-empty">Empty list — insert a value to start</div>
            ) : (
              <>
                {list.map((val, idx) => (
                  <div key={idx} className="cll-node-chain">
                    <CLLNode
                      value={val}
                      isHead={idx === 0}
                      isTail={idx === list.length - 1}
                      state={idx === focusIdx ? 'focus' : idx === 0 ? 'head' : idx === list.length - 1 ? 'tail' : 'default'}
                    />
                    {idx < list.length - 1 && <div className="cll-connector">→</div>}
                  </div>
                ))}

                {/* Circular back-pointer from TAIL to HEAD */}
                <div className="cll-circular-wrap">
                  <div className="cll-circular-arrow">
                    <svg viewBox="0 0 120 48" width="120" height="48" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <marker id="cll-arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                          <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
                        </marker>
                      </defs>
                      {/* Curved arc from right (tail exit) around to left (head entry) */}
                      <path
                        d="M 10 10 Q 60 -8 110 10 Q 118 24 110 38 Q 90 48 60 44 Q 30 40 10 38 Q 2 24 10 10"
                        fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3"
                        markerEnd="url(#cll-arrowhead)"
                      />
                      <text x="60" y="26" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">↺ HEAD</text>
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="cll-log">
            <div className="cll-log-label">Recent Ops:</div>
            <div className="cll-log-items">
              {ops.slice(-4).map((op, i) => <div key={i} className="cll-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="cll-controls">
          <OpPanel
            onInsHead={handleInsHead} onInsTail={handleInsTail}
            onDelHead={handleDelHead} onSearch={handleSearch}
            onRandom={handleRandom} onReset={handleReset}
            running={running}
          />
          <StatePanel list={list} ops={ops} />
        </div>
      </div>

      {/* Key Difference Box */}
      <div className="cll-insight">
        <div className="cll-insight-title">🔑 Key Difference: No NULL terminator</div>
        <div className="cll-insight-body">
          In a regular SLL, the last node's <code>next = null</code>. In a Circular SLL, the last node's <code>next = head</code>.
          This means traversal must check <code>current === head</code> to detect cycle completion — not a null check.
        </div>
      </div>
    </div>
  );
}
