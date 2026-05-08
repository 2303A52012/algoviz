import React, { useState, useCallback, useRef } from 'react';
import Pseudocode from '../../components/Pseudocode';
import './Visualizer.css';

const DLL_PSEUDOCODES = {
  insertHead: [
    "function insertAtHead(list, value) {",
    "  newNode = new Node(value)",
    "  if list.head == null {",
    "    list.head = list.tail = newNode",
    "  } else {",
    "    newNode.next = list.head",
    "    list.head.prev = newNode",
    "    list.head = newNode",
    "  }",
    "  list.size++",
    "}"
  ],
  insertTail: [
    "function insertAtTail(list, value) {",
    "  newNode = new Node(value)",
    "  if list.tail == null {",
    "    list.head = list.tail = newNode",
    "  } else {",
    "    newNode.prev = list.tail",
    "    list.tail.next = newNode",
    "    list.tail = newNode",
    "  }",
    "  list.size++",
    "}"
  ],
  deleteHead: [
    "function deleteHead(list) {",
    "  if list.head == null return",
    "  if list.head == list.tail {",
    "    list.head = list.tail = null",
    "  } else {",
    "    list.head = list.head.next",
    "    list.head.prev = null",
    "  }",
    "  list.size--",
    "}"
  ],
  deleteTail: [
    "function deleteTail(list) {",
    "  if list.tail == null return",
    "  if list.head == list.tail {",
    "    list.head = list.tail = null",
    "  } else {",
    "    list.tail = list.tail.prev",
    "    list.tail.next = null",
    "  }",
    "  list.size--",
    "}"
  ],
  search: [
    "function search(list, target) {",
    "  curr = list.head",
    "  while curr != null {",
    "    if curr.value == target {",
    "      return true",
    "    }",
    "    curr = curr.next",
    "  }",
    "  return false",
    "}"
  ],
  default: [
    "// Select an operation to see pseudocode"
  ]
};

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
    <div className="dll-node-wrap">
      {/* Head/Tail label */}
      <div className="dll-head-label">
        {isHead && "HEAD"}
        {isHead && isTail && " / "}
        {isTail && "TAIL"}
      </div>
      
      {/* Node box */}
      <div
        className={`dll-node dll-node-${state}`}
        style={{
          background: color.bg,
          border: `2px solid ${color.border}`,
          color: color.text,
        }}
      >
        <span className="dll-node-pointer-left">←</span>
        <span className="dll-node-val">{value}</span>
        <span className="dll-node-pointer-right">→</span>
      </div>
    </div>
  );
}

// ===== OPERATION PANEL: TABS & CONTROLS =====
function OpPanel({ onInsertAtHead, onInsertAtTail, onDeleteHead, onDeleteTail, onSearch, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="dll-op-panel">
      {/* Tabs */}
      <div className="dll-tabs">
        <button className={`dll-tab ${tab === 'insert' ? 'active' : ''}`} onClick={() => setTab('insert')} disabled={running}>Insert</button>
        <button className={`dll-tab ${tab === 'delete' ? 'active' : ''}`} onClick={() => setTab('delete')} disabled={running}>Delete</button>
        <button className={`dll-tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')} disabled={running}>Search</button>
        <button className={`dll-tab ${tab === 'init' ? 'active' : ''}`} onClick={() => setTab('init')} disabled={running}>Init</button>
      </div>

      {/* Tab Content */}
      <div className="dll-tab-content">
        {tab === 'insert' && (
          <div className="dll-tab-form">
            <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Value" disabled={running} />
            <button onClick={() => { if(inputVal) { onInsertAtHead(+inputVal); setInputVal(''); } }} disabled={running || !inputVal} className="dll-btn">Insert Head - O(1)</button>
            <button onClick={() => { if(inputVal) { onInsertAtTail(+inputVal); setInputVal(''); } }} disabled={running || !inputVal} className="dll-btn">Insert Tail - O(1)</button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="dll-tab-form">
            <button onClick={onDeleteHead} disabled={running} className="dll-btn dll-btn-danger">Delete Head - O(1)</button>
            <button onClick={onDeleteTail} disabled={running} className="dll-btn dll-btn-danger">Delete Tail - O(1)</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="dll-tab-form">
            <input type="number" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search" disabled={running} />
            <button onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); } }} disabled={running || !searchVal} className="dll-btn">Search - O(n)</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="dll-tab-form">
            <button onClick={onRandom} disabled={running} className="dll-btn">Random List (5)</button>
            <button onClick={onReset} disabled={running} className="dll-btn dll-btn-reset">Clear</button>
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
    <div className="dll-state-panel">
      <div className="dll-state-row">
        <span className="dll-state-label">Head</span>
        <span className="dll-state-val" style={{ color: 'var(--green-light)' }}>{head !== null ? head : '∅'}</span>
      </div>
      <div className="dll-state-row">
        <span className="dll-state-label">Tail</span>
        <span className="dll-state-val" style={{ color: 'var(--pink-light)' }}>{tail !== null ? tail : '∅'}</span>
      </div>
      <div className="dll-state-row">
        <span className="dll-state-label">Size</span>
        <span className="dll-state-val">{size}</span>
      </div>
      <div className="dll-state-row">
        <span className="dll-state-label">isEmpty()</span>
        <span className="dll-state-val" style={{ color: size === 0 ? 'var(--green-light)' : 'var(--red-light)' }}>{size === 0 ? 'true' : 'false'}</span>
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function DoublyLinkedListVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [operations, setOperations] = useState(['List initialized with [15, 28, 7, 42]']);
  const [running, setRunning] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [activeCode, setActiveCode] = useState('default');
  const [activeLine, setActiveLine] = useState(0);
  const laneRef = useRef(null);

  // Check if content is scrollable
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
      setActiveCode('insertHead');
      setActiveLine(1);
      setRunning(true);
      setTimeout(() => {
        setList((prev) => [value, ...prev]);
        addOp(`Inserted ${value} at HEAD - O(1)`);
        setActiveLine(list.length === 0 ? 3 : 7);
        setRunning(false);
      }, 400);
    },
    [addOp, list.length]
  );

  const handleInsertAtTail = useCallback(
    (value) => {
      setActiveCode('insertTail');
      setActiveLine(1);
      setRunning(true);
      setTimeout(() => {
        setList((prev) => [...prev, value]);
        addOp(`Inserted ${value} at TAIL - O(1)`);
        setActiveLine(list.length === 0 ? 3 : 7);
        setRunning(false);
      }, 400);
    },
    [list.length, addOp]
  );

  const handleDeleteHead = useCallback(() => {
    setActiveCode('deleteHead');
    setActiveLine(0);
    if (list.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const deleted = list[0];
      setList((prev) => prev.slice(1));
      addOp(`Deleted HEAD (${deleted}) - O(1)`);
      setActiveLine(list.length === 1 ? 3 : 6);
      setRunning(false);
    }, 400);
  }, [list, addOp]);

  const handleDeleteTail = useCallback(() => {
    setActiveCode('deleteTail');
    setActiveLine(0);
    if (list.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const deleted = list[list.length - 1];
      setList((prev) => prev.slice(0, -1));
      addOp(`Deleted TAIL (${deleted}) - O(1)`);
      setActiveLine(list.length === 1 ? 3 : 6);
      setRunning(false);
    }, 400);
  }, [list, addOp]);

  const handleSearch = useCallback(
    (value) => {
      setActiveCode('search');
      setActiveLine(1);
      setRunning(true);
      let pos = -1;
      let step = 0;

      const doSearch = () => {
        if (step < list.length) {
          setFocusIdx(step);
          setActiveLine(3);
          if (list[step] === value) pos = step;
          step++;
          setTimeout(doSearch, 300);
        } else {
          if (pos !== -1) {
            addOp(`Found ${value} at index ${pos} - O(n) [${step} steps]`);
            setActiveLine(4);
          } else {
            addOp(`Not found ${value} - O(n) [searched ${step} nodes]`);
            setActiveLine(8);
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
    setActiveCode('default');
    setActiveLine(0);
  }, []);

  const handleReset = useCallback(() => {
    setList([]);
    setOperations([]);
    setFocusIdx(-1);
    setActiveCode('default');
    setActiveLine(0);
  }, []);

  return (
    <div className="dll-root">
      {/* Header */}
      <div className="dll-header">
        <div>
          <h2 className="dll-title">🔗 Doubly Linked List</h2>
          <p className="dll-desc">Nodes with pointers to both previous and next</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dll-content">
        {/* Visualization */}
        <div className="dll-visual">
          <div className="dll-visual-title">
            Node Chain Visualization
            {isScrollable && <span className="dll-scroll-hint"> ← Scroll →</span>}
          </div>
          <div className="dll-lane" ref={laneRef}>
            {list.length === 0 ? (
              <div className="dll-empty">Empty list — Insert a value to start</div>
            ) : (
              <>
                <div className="dll-null-term">∅</div>
                {list.map((val, idx) => (
                  <div key={idx} className="dll-node-chain">
                    {idx > 0 && <div className="dll-connector">⇄</div>}
                    <Node
                      value={val}
                      isHead={idx === 0}
                      isTail={idx === list.length - 1}
                      state={idx === focusIdx ? 'focus' : idx === 0 ? 'head' : idx === list.length - 1 ? 'tail' : 'default'}
                    />
                  </div>
                ))}
                <div className="dll-null-term">∅</div>
              </>
            )}
          </div>
          
          {/* Operations Log */}
          <div className="dll-log">
            <div className="dll-log-label">Recent Ops:</div>
            <div className="dll-log-items">
              {operations.slice(-4).map((op, i) => (
                <div key={i} className="dll-log-item">{op}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="dll-controls">
          <OpPanel
            onInsertAtHead={handleInsertAtHead}
            onInsertAtTail={handleInsertAtTail}
            onDeleteHead={handleDeleteHead}
            onDeleteTail={handleDeleteTail}
            onSearch={handleSearch}
            onRandom={handleRandom}
            onReset={handleReset}
            running={running}
          />
          <StatePanel list={list} size={list.length} operations={operations} />
        </div>
      </div>

      {/* Code */}
      <div className="dll-code-wrap">
        <Pseudocode code={DLL_PSEUDOCODES[activeCode]} activeLine={activeLine} />
      </div>
    </div>
  );
}
