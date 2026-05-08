import React, { useState, useCallback, useRef } from 'react';
import './Visualizer.css';


// ===== NODE COLOR STATES =====
const NODE_STATES = {
  default:    { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  head:       { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  tail:       { bg: '#4a0d2a', border: '#ec4899', text: '#f9a8d4' },
  focus:      { bg: '#2d1f08', border: '#f59e0b', text: '#fcd34d' },
  inserting:  { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
};

// ===== SINGLE NODE COMPONENT =====
function Node({ value, state, isHead, isTail }) {
  const color = NODE_STATES[state] || NODE_STATES.default;
  
  return (
    <div className="dcll-node-wrap">
      {/* Head/Tail label */}
      <div className="dcll-head-label">
        {isHead && "HEAD"}
        {isHead && isTail && " / "}
        {isTail && "TAIL"}
      </div>
      
      {/* Node box */}
      <div
        className={`dcll-node dcll-node-${state}`}
        style={{
          background: color.bg,
          border: `2px solid ${color.border}`,
          color: color.text,
        }}
      >
        <span className="dcll-node-pointer-left">←</span>
        <span className="dcll-node-val">{value}</span>
        <span className="dcll-node-pointer-right">→</span>
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
    <div className="dcll-op-panel">
      {/* Tabs */}
      <div className="dcll-tabs">
        <button className={`dcll-tab ${tab === 'insert' ? 'active' : ''}`} onClick={() => setTab('insert')} disabled={running}>Insert</button>
        <button className={`dcll-tab ${tab === 'delete' ? 'active' : ''}`} onClick={() => setTab('delete')} disabled={running}>Delete</button>
        <button className={`dcll-tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')} disabled={running}>Search</button>
        <button className={`dcll-tab ${tab === 'init' ? 'active' : ''}`} onClick={() => setTab('init')} disabled={running}>Init</button>
      </div>

      {/* Tab Content */}
      <div className="dcll-tab-content">
        {tab === 'insert' && (
          <div className="dcll-tab-form">
            <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Value" disabled={running} />
            <button onClick={() => { if(inputVal) { onInsertAtHead(+inputVal); setInputVal(''); } }} disabled={running || !inputVal} className="dcll-btn">Insert Head - O(1)</button>
            <button onClick={() => { if(inputVal) { onInsertAtTail(+inputVal); setInputVal(''); } }} disabled={running || !inputVal} className="dcll-btn">Insert Tail - O(1)</button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="dcll-tab-form">
            <button onClick={onDeleteHead} disabled={running} className="dcll-btn dcll-btn-danger">Delete Head - O(1)</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="dcll-tab-form">
            <input type="number" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search" disabled={running} />
            <button onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); } }} disabled={running || !searchVal} className="dcll-btn">Search - O(n)</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="dcll-tab-form">
            <button onClick={onRandom} disabled={running} className="dcll-btn">Random List (5)</button>
            <button onClick={onReset} disabled={running} className="dcll-btn dcll-btn-reset">Clear</button>
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
    <div className="dcll-state-panel">
      <div className="dcll-state-row">
        <span className="dcll-state-label">Head</span>
        <span className="dcll-state-val" style={{ color: 'var(--green-light)' }}>{head !== null ? head : '∅'}</span>
      </div>
      <div className="dcll-state-row">
        <span className="dcll-state-label">Tail</span>
        <span className="dcll-state-val" style={{ color: 'var(--pink-light)' }}>{tail !== null ? tail : '∅'}</span>
      </div>
      <div className="dcll-state-row">
        <span className="dcll-state-label">Size</span>
        <span className="dcll-state-val">{size}</span>
      </div>
      <div className="dcll-state-row">
        <span className="dcll-state-label">isEmpty()</span>
        <span className="dcll-state-val" style={{ color: size === 0 ? 'var(--green-light)' : 'var(--red-light)' }}>{size === 0 ? 'true' : 'false'}</span>
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function DoublyCircularLinkedListVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [operations, setOperations] = useState(['List initialized with [15, 28, 7, 42]']);
  const [running, setRunning] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const laneRef = useRef(null);

  React.useEffect(() => {
    const checkScroll = () => {
      if (laneRef.current) {
        const { scrollWidth, clientWidth } = laneRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [list.length]);

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
    [addOp, list.length]
  );

  const handleInsertAtTail = useCallback(
    (value) => {
      setRunning(true);
      setTimeout(() => {
        setList((prev) => [...prev, value]);
        addOp(`Inserted ${value} at TAIL - O(1)`);
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
    <div className="dcll-root">
      {/* Header */}
      <div className="dcll-header">
        <div>
          <h2 className="dcll-title">🔗 Doubly Circular Linked List</h2>
          <p className="dcll-desc">Nodes point to both prev/next, and tail connects back to head</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dcll-content">
        {/* Visualization */}
        <div className="dcll-visual">
          <div className="dcll-visual-title">
            Node Chain Visualization
            {isScrollable && <span className="dcll-scroll-hint"> ← Scroll →</span>}
          </div>
          <div className="dcll-lane" ref={laneRef}>
            {list.length === 0 ? (
              <div className="dcll-empty">Empty list — Insert a value to start</div>
            ) : (
              <>
                <div className="dcll-circular-return">↻ (from tail)</div>
                {list.map((val, idx) => (
                  <div key={idx} className="dcll-node-chain">
                    {idx > 0 && <div className="dcll-connector">⇄</div>}
                    <Node
                      value={val}
                      isHead={idx === 0}
                      isTail={idx === list.length - 1}
                      state={idx === focusIdx ? 'focus' : idx === 0 ? 'head' : idx === list.length - 1 ? 'tail' : 'default'}
                    />
                  </div>
                ))}
                <div className="dcll-circular-return">↺ (to head)</div>
              </>
            )}
          </div>
          
          {/* Operations Log */}
          <div className="dcll-log">
            <div className="dcll-log-label">Recent Ops:</div>
            <div className="dcll-log-items">
              {operations.slice(-4).map((op, i) => (
                <div key={i} className="dcll-log-item">{op}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="dcll-controls">
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

      {/* Code */}
       
    </div>
  );
}





