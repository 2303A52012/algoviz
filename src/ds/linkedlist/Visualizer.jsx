import React, { useState, useCallback, useRef } from 'react';
import { CODE_SNIPPETS } from './code';
import './Visualizer.css';

// ===== NODE COLOR STATES =====
const NODE_STATES = {
  default:    { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  head:       { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  focus:      { bg: '#2d1f08', border: '#f59e0b', text: '#fcd34d' },
  inserting:  { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
};

// ===== SINGLE NODE COMPONENT =====
function Node({ value, state, isHead }) {
  const color = NODE_STATES[state] || NODE_STATES.default;
  
  return (
    <div className="ll-node-wrap">
      {/* Head label */}
      {isHead && <span className="ll-head-label">HEAD</span>}
      
      {/* Node box */}
      <div
        className={`ll-node ll-node-${state}`}
        style={{
          background: color.bg,
          border: `2px solid ${color.border}`,
          color: color.text,
        }}
      >
        <span className="ll-node-val">{value}</span>
        <span className="ll-node-pointer">→</span>
      </div>
    </div>
  );
}

// ===== OPERATION PANEL: TABS & CONTROLS =====
function OpPanel({ onInsertAtHead, onInsertAtTail, onDeleteHead, onSearch, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="ll-op-panel">
      {/* Tabs */}
      <div className="ll-tabs">
        <button className={`ll-tab ${tab === 'insert' ? 'active' : ''}`} onClick={() => setTab('insert')} disabled={running}>Insert</button>
        <button className={`ll-tab ${tab === 'delete' ? 'active' : ''}`} onClick={() => setTab('delete')} disabled={running}>Delete</button>
        <button className={`ll-tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')} disabled={running}>Search</button>
        <button className={`ll-tab ${tab === 'init' ? 'active' : ''}`} onClick={() => setTab('init')} disabled={running}>Init</button>
      </div>

      {/* Tab Content */}
      <div className="ll-tab-content">
        {tab === 'insert' && (
          <div className="ll-tab-form">
            <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Value" disabled={running} />
            <button onClick={() => { if(inputVal) { onInsertAtHead(+inputVal); setInputVal(''); } }} disabled={running || !inputVal} className="ll-btn">Insert Head - O(1)</button>
            <button onClick={() => { if(inputVal) { onInsertAtTail(+inputVal); setInputVal(''); } }} disabled={running || !inputVal} className="ll-btn">Insert Tail - O(n)</button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="ll-tab-form">
            <button onClick={onDeleteHead} disabled={running} className="ll-btn ll-btn-danger">Delete Head - O(1)</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="ll-tab-form">
            <input type="number" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search" disabled={running} />
            <button onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); } }} disabled={running || !searchVal} className="ll-btn">Search - O(n)</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="ll-tab-form">
            <button onClick={onRandom} disabled={running} className="ll-btn">Random List (5)</button>
            <button onClick={onReset} disabled={running} className="ll-btn ll-btn-reset">Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== STATE PANEL =====
function StatePanel({ list, size, operations }) {
  const head = list && list.length > 0 ? list[0] : null;
  const tail = list && list.length > 0 ? list[list.length - 1] : null;

  return (
    <div className="ll-state-panel">
      <div className="ll-state-row">
        <span className="ll-state-label">Head</span>
        <span className="ll-state-val" style={{ color: 'var(--green-light)' }}>{head !== null ? head : '∅'}</span>
      </div>
      <div className="ll-state-row">
        <span className="ll-state-label">Tail</span>
        <span className="ll-state-val" style={{ color: 'var(--amber-light)' }}>{tail !== null ? tail : '∅'}</span>
      </div>
      <div className="ll-state-row">
        <span className="ll-state-label">Size</span>
        <span className="ll-state-val">{size}</span>
      </div>
      <div className="ll-state-row">
        <span className="ll-state-label">isEmpty()</span>
        <span className="ll-state-val" style={{ color: size === 0 ? 'var(--green-light)' : 'var(--red-light)' }}>{size === 0 ? 'true' : 'false'}</span>
      </div>
      <div className="ll-state-row">
        <span className="ll-state-label">Ops</span>
        <span className="ll-state-val">{operations.length}</span>
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function LinkedListVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [operations, setOperations] = useState(['List initialized with [15, 28, 7, 42]']);
  const [running, setRunning] = useState(false);

  const addOp = useCallback((op) => {
    setOperations((prev) => [...prev, op]);
  }, []);

  const handleInsertAtHead = useCallback(
    (value) => {
      setRunning(true);
      setTimeout(() => {
        setList((prev) => [value, ...prev]);
        addOp(`Inserted ${value} at HEAD - O(1)`);
        setRunning(false);
      }, 400);
    },
    [addOp]
  );

  const handleInsertAtTail = useCallback(
    (value) => {
      setRunning(true);
      const steps = list.length;
      setTimeout(() => {
        setList((prev) => [...prev, value]);
        addOp(`Inserted ${value} at TAIL - O(n) [traversed ${steps} nodes]`);
        setRunning(false);
      }, 400);
    },
    [list.length, addOp]
  );

  const handleDeleteHead = useCallback(() => {
    if (list.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const deleted = list[0];
      setList((prev) => prev.slice(1));
      addOp(`Deleted HEAD (${deleted}) - O(1)`);
      setRunning(false);
    }, 400);
  }, [list, addOp]);

  const handleSearch = useCallback(
    (value) => {
      setRunning(true);
      let pos = -1;
      let step = 0;

      const doSearch = () => {
        if (step < list.length) {
          setFocusIdx(step);
          if (list[step] === value) pos = step;
          step++;
          setTimeout(doSearch, 300);
        } else {
          if (pos !== -1) {
            addOp(`Found ${value} at index ${pos} - O(n) [${step} steps]`);
          } else {
            addOp(`Not found ${value} - O(n) [searched ${step} nodes]`);
          }
          setFocusIdx(-1);
          setRunning(false);
        }
      };

      doSearch();
    },
    [list, addOp]
  );

  const handleRandom = useCallback(() => {
    const random = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1);
    setList(random);
    setOperations(['List initialized with random values']);
    setFocusIdx(-1);
  }, []);

  const handleReset = useCallback(() => {
    setList([]);
    setOperations([]);
    setFocusIdx(-1);
  }, []);

  return (
    <div className="ll-root">
      {/* Header */}
      <div className="ll-header">
        <div>
          <h2 className="ll-title">🔗 Singly Linked List</h2>
          <p className="ll-desc">Linear data structure with node-based sequential access</p>
        </div>
        <div className="ll-badges">
          <span className="ll-badge">Intermediate</span>
          <span className="ll-badge">O(n) Search</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="ll-content">
        {/* Visualization */}
        <div className="ll-visual">
          <div className="ll-visual-title">Node Chain Visualization</div>
          <div className="ll-lane">
            {list.length === 0 ? (
              <div className="ll-empty">Empty list — Insert a value to start</div>
            ) : (
              <>
                {list.map((val, idx) => (
                  <div key={idx} className="ll-node-chain">
                    <Node
                      value={val}
                      isHead={idx === 0}
                      state={idx === focusIdx ? 'focus' : idx === 0 ? 'head' : 'default'}
                    />
                    {idx < list.length - 1 && <div className="ll-connector">→</div>}
                  </div>
                ))}
                <div className="ll-null-term">∅</div>
              </>
            )}
          </div>
          
          {/* Operations Log */}
          <div className="ll-log">
            <div className="ll-log-label">Recent Ops:</div>
            <div className="ll-log-items">
              {operations.slice(-4).map((op, i) => (
                <div key={i} className="ll-log-item">{op}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="ll-controls">
          <OpPanel
            onInsertAtHead={handleInsertAtHead}
            onInsertAtTail={handleInsertAtTail}
            onDeleteHead={handleDeleteHead}
            onSearch={handleSearch}
            onRandom={handleRandom}
            onReset={handleReset}
            running={running}
          />
          <StatePanel list={list} size={list.length} operations={operations} />
        </div>
      </div>

      {/* Comparison */}
      <div className="ll-comparison">
        <h3>Linked List vs Array</h3>
        <table className="ll-table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Linked List</th>
              <th>Array</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Insert at Head</td><td className="ll-good">O(1)</td><td>O(n)</td></tr>
            <tr><td>Insert at Tail</td><td>O(n)</td><td className="ll-good">O(1)*</td></tr>
            <tr><td>Delete from Head</td><td className="ll-good">O(1)</td><td>O(n)</td></tr>
            <tr><td>Random Access</td><td>O(n)</td><td className="ll-good">O(1)</td></tr>
            <tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
            <tr><td>Space Overhead</td><td>Extra (pointers)</td><td className="ll-good">Minimal</td></tr>
          </tbody>
        </table>
      </div>

      {/* Code */}
      <div className="ll-code-wrap">
        <details>
          <summary className="ll-code-title">📝 Code Examples</summary>
          <div className="ll-code-langs">
            {Object.entries(CODE_SNIPPETS).map(([lang, code]) => (
              <details key={lang}>
                <summary className="ll-code-lang-title">{lang.toUpperCase()}</summary>
                <pre className="ll-code-block">{code}</pre>
              </details>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
