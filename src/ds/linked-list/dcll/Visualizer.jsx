import React, { useState, useCallback } from 'react';
import './Visualizer.css';

const COLORS = {
  default:  { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  head:     { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  tail:     { bg: '#1f0a2d', border: '#a855f7', text: '#d8b4fe' },
  focus:    { bg: '#2d200a', border: '#f59e0b', text: '#fcd34d' },
};

function DCLLNode({ value, state, isHead, isTail }) {
  const col = COLORS[state] || COLORS.default;
  return (
    <div className="dcll-node-wrap">
      <div className="dcll-node-labels">
        {isHead && <span className="dcll-label dcll-label-head">HEAD</span>}
        {isTail && <span className="dcll-label dcll-label-tail">TAIL</span>}
        {!isHead && !isTail && <span className="dcll-label" style={{visibility:'hidden'}}>x</span>}
      </div>
      <div className="dcll-node" style={{ background: col.bg, border: `2px solid ${col.border}`, color: col.text }}>
        <span className="dcll-ptr">←</span>
        <span className="dcll-val">{value}</span>
        <span className="dcll-ptr">→</span>
      </div>
    </div>
  );
}

function OpPanel({ onInsHead, onInsTail, onDelHead, onDelTail, onSearch, onTraverseFwd, onTraverseBwd, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [val, setVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="dcll-op-panel">
      <div className="dcll-tabs">
        {['insert','delete','search','traverse','init'].map(t => (
          <button key={t} className={`dcll-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="dcll-tab-content">
        {tab === 'insert' && (
          <div className="dcll-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" disabled={running} />
            <button className="dcll-btn" onClick={() => { if(val) { onInsHead(+val); setVal(''); }}} disabled={running || !val}>Insert Head — O(1)</button>
            <button className="dcll-btn" onClick={() => { if(val) { onInsTail(+val); setVal(''); }}} disabled={running || !val}>Insert Tail — O(1)</button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="dcll-tab-form">
            <button className="dcll-btn dcll-btn-danger" onClick={onDelHead} disabled={running}>Delete Head — O(1)</button>
            <button className="dcll-btn dcll-btn-warning" onClick={onDelTail} disabled={running}>Delete Tail — O(1)</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="dcll-tab-form">
            <input type="number" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search value" disabled={running} />
            <button className="dcll-btn" onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); }}} disabled={running || !searchVal}>Search — O(n)</button>
          </div>
        )}
        {tab === 'traverse' && (
          <div className="dcll-tab-form">
            <button className="dcll-btn" onClick={onTraverseFwd} disabled={running}>Traverse Forward →</button>
            <button className="dcll-btn dcll-btn-purple" onClick={onTraverseBwd} disabled={running}>Traverse Backward ←</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="dcll-tab-form">
            <button className="dcll-btn" onClick={onRandom} disabled={running}>Random List (5)</button>
            <button className="dcll-btn dcll-btn-reset" onClick={onReset} disabled={running}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatePanel({ list, ops }) {
  return (
    <div className="dcll-state-panel">
      {[
        ['Head', list[0] ?? '∅', 'var(--green-light)'],
        ['Tail', list[list.length-1] ?? '∅', 'var(--purple-light)'],
        ['Size', list.length, 'var(--blue-light)'],
        ['Circular', list.length > 0 ? 'true' : 'false', 'var(--amber-light)'],
        ['Bidirectional', 'true', 'var(--teal-light)'],
        ['Ops', ops.length, 'var(--blue-light)'],
      ].map(([label, val, color]) => (
        <div key={label} className="dcll-state-row">
          <span className="dcll-state-label">{label}</span>
          <span className="dcll-state-val" style={{ color }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

export default function DCLLVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [ops, setOps] = useState(['DCLL initialized with [15, 28, 7, 42]']);
  const [running, setRunning] = useState(false);
  const [traverseDir, setTraverseDir] = useState(null);

  const addOp = useCallback(op => setOps(p => [...p, op]), []);

  const run = useCallback(fn => {
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
    setRunning(true); setTraverseDir('fwd');
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
        setFocusIdx(-1); setTraverseDir(null); setRunning(false);
      }
    };
    tick();
  }, [list, addOp]);

  const handleTraverseFwd = useCallback(() => {
    setRunning(true); setTraverseDir('fwd');
    let step = 0;
    const tick = () => {
      if (step < list.length) {
        setFocusIdx(step++);
        setTimeout(tick, 250);
      } else {
        addOp(`Forward traversal: [${list.join(' → ')}] → ↺ HEAD`);
        setFocusIdx(-1); setTraverseDir(null); setRunning(false);
      }
    };
    tick();
  }, [list, addOp]);

  const handleTraverseBwd = useCallback(() => {
    setRunning(true); setTraverseDir('bwd');
    let step = list.length - 1;
    const tick = () => {
      if (step >= 0) {
        setFocusIdx(step--);
        setTimeout(tick, 250);
      } else {
        addOp(`Backward traversal: [${[...list].reverse().join(' → ')}] → ↺ TAIL`);
        setFocusIdx(-1); setTraverseDir(null); setRunning(false);
      }
    };
    tick();
  }, [list, addOp]);

  const handleRandom = useCallback(() => {
    const r = Array.from({length: 5}, () => Math.floor(Math.random() * 99) + 1);
    setList(r); setOps(['Random DCLL initialized']); setFocusIdx(-1); setTraverseDir(null);
  }, []);

  const handleReset = useCallback(() => {
    setList([]); setOps([]); setFocusIdx(-1); setTraverseDir(null);
  }, []);

  return (
    <div className="dcll-root">
      <div className="dcll-header">
        <div>
          <h2 className="dcll-title">◉⇄ Doubly Circular Linked List</h2>
          <p className="dcll-desc">Bidirectional circular list — tail↔head connected in both directions</p>
        </div>
        <div className="dcll-badges">
          <span className="dcll-badge">Advanced</span>
          <span className="dcll-badge">Bidirectional</span>
          <span className="dcll-badge">Circular</span>
        </div>
      </div>

      <div className="dcll-content">
        <div className="dcll-visual">
          <div className="dcll-visual-title">
            Node Chain Visualization
            <span className="dcll-dir-label">
              {traverseDir === 'fwd' ? '→ Forward Traversal' : traverseDir === 'bwd' ? '← Backward Traversal' : '⇄ Bidirectional Circular'}
            </span>
          </div>

          {/* Top circular arc: tail.next → head */}
          {list.length > 1 && (
            <div className="dcll-circ-top">
              <svg viewBox="0 0 300 28" width="100%" height="28" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="dcll-arr-top" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" fill="#22c55e" />
                  </marker>
                </defs>
                <path d="M 290 20 Q 150 -10 10 20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#dcll-arr-top)" />
                <text x="150" y="12" textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace">tail.next → head</text>
              </svg>
            </div>
          )}

          <div className="dcll-lane">
            {list.length === 0 ? (
              <div className="dcll-empty">Empty list — insert a value to start</div>
            ) : (
              <>
                {list.map((val, idx) => (
                  <div key={idx} className="dcll-node-chain">
                    {idx > 0 && <div className="dcll-connector">⇄</div>}
                    <DCLLNode
                      value={val}
                      isHead={idx === 0}
                      isTail={idx === list.length - 1}
                      state={idx === focusIdx ? 'focus' : idx === 0 ? 'head' : idx === list.length - 1 ? 'tail' : 'default'}
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Bottom circular arc: head.prev → tail */}
          {list.length > 1 && (
            <div className="dcll-circ-bottom">
              <svg viewBox="0 0 300 28" width="100%" height="28" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="dcll-arr-bot" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" fill="#a855f7" />
                  </marker>
                </defs>
                <path d="M 10 8 Q 150 38 290 8" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#dcll-arr-bot)" />
                <text x="150" y="26" textAnchor="middle" fill="#a855f7" fontSize="8" fontFamily="monospace">head.prev → tail</text>
              </svg>
            </div>
          )}

          <div className="dcll-log">
            <div className="dcll-log-label">Recent Ops:</div>
            <div className="dcll-log-items">
              {ops.slice(-4).map((op, i) => <div key={i} className="dcll-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="dcll-controls">
          <OpPanel
            onInsHead={handleInsHead} onInsTail={handleInsTail}
            onDelHead={handleDelHead} onDelTail={handleDelTail}
            onSearch={handleSearch}
            onTraverseFwd={handleTraverseFwd} onTraverseBwd={handleTraverseBwd}
            onRandom={handleRandom} onReset={handleReset}
            running={running}
          />
          <StatePanel list={list} ops={ops} />
        </div>
      </div>

      {/* Insight */}
      <div className="dcll-insight">
        <div className="dcll-insight-title">🔑 DCLL Structure</div>
        <div className="dcll-insight-cols">
          <div>
            <div className="dcll-insight-tag dcll-tag-green">Forward circle</div>
            <p><code>tail.next → head</code><br />Any node can reach all others by going forward</p>
          </div>
          <div>
            <div className="dcll-insight-tag dcll-tag-purple">Backward circle</div>
            <p><code>head.prev → tail</code><br />Any node can reach all others by going backward</p>
          </div>
        </div>
      </div>
    </div>
  );
}


