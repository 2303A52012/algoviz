import React, { useState, useCallback, useRef } from 'react';
import { CODE_SNIPPETS } from './code';
import './Visualizer.css';

// ===== LINKED LIST VISUALIZATION COMPONENT =====
// Interactive visualization of Singly Linked List operations
// Shows nodes connected by pointers with animations

const COLORS = {
  default:  '#60a5fa',    // blue — regular node
  head:     '#10b981',    // green — head pointer
  focus:    '#f59e0b',    // amber — currently focused node
  inserting: '#a78bfa',   // purple — node being inserted
  deleted:  '#ef4444',    // red — deleted node
  null:     '#6b7280',    // gray — null pointer
};

// ===== LINKED LIST NODE COMPONENT =====
// Represents a single node in the visualization
function ListNode({ value, isHead, isFocused, state, label }) {
  const getColor = () => {
    if (isHead) return COLORS.head;
    if (state === 'inserting') return COLORS.inserting;
    if (state === 'deleted') return COLORS.deleted;
    if (isFocused) return COLORS.focus;
    return COLORS.default;
  };

  return (
    <div className="ll-node-container">
      <div
        className={`ll-node ${state}`}
        style={{ backgroundColor: getColor() }}
      >
        <div className="ll-node-value">{value}</div>
        <div className="ll-node-pointer">→</div>
      </div>
      {isHead && <span className="ll-label ll-head-label">HEAD</span>}
      {label && <span className="ll-label">{label}</span>}
    </div>
  );
}

// ===== LINKED LIST VISUALIZATION COMPONENT =====
// Main component showing the list with nodes and connections
function LinkedListVisual({ nodes, headIdx, focusIdx, operations }) {
  return (
    <div className="ll-visual">
      <div className="ll-title">Singly Linked List Visualization</div>
      
      <div className="ll-lane">
        {nodes.map((node, idx) => (
          <div key={idx} className="ll-node-wrapper">
            <ListNode
              value={node}
              isHead={idx === headIdx}
              isFocused={idx === focusIdx}
              state={node === null ? 'deleted' : 'normal'}
              label={`[${idx}]`}
            />
            {idx < nodes.length - 1 && (
              <div className="ll-arrow">
                {nodes[idx + 1] !== null ? '→' : '→ ∅'}
              </div>
            )}
          </div>
        ))}
        <div className="ll-null-pointer">∅ (null)</div>
      </div>

      {/* Operations Log */}
      <div className="ll-operations-log">
        <div className="ll-log-title">Operations Log:</div>
        {operations.length === 0 ? (
          <div className="ll-log-entry">No operations yet</div>
        ) : (
          operations.slice(-5).map((op, idx) => (
            <div key={idx} className="ll-log-entry">
              {op}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== OPERATION PANEL COMPONENT =====
// Controls for performing operations on the linked list
function OpPanel({ onInsertAtHead, onInsertAtTail, onDeleteHead, onSearch, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert'); // insert, delete, search, init
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="ll-op-panel">
      <div className="ll-tabs">
        <button
          className={`ll-tab ${tab === 'insert' ? 'active' : ''}`}
          onClick={() => setTab('insert')}
          disabled={running}
        >
          📥 Insert
        </button>
        <button
          className={`ll-tab ${tab === 'delete' ? 'active' : ''}`}
          onClick={() => setTab('delete')}
          disabled={running}
        >
          📤 Delete
        </button>
        <button
          className={`ll-tab ${tab === 'search' ? 'active' : ''}`}
          onClick={() => setTab('search')}
          disabled={running}
        >
          🔍 Search
        </button>
        <button
          className={`ll-tab ${tab === 'init' ? 'active' : ''}`}
          onClick={() => setTab('init')}
          disabled={running}
        >
          ⚙️ Init
        </button>
      </div>

      <div className="ll-content">
        {tab === 'insert' && (
          <div>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              disabled={running}
            />
            <button
              onClick={() => {
                if (inputValue) {
                  onInsertAtHead(parseInt(inputValue));
                  setInputValue('');
                }
              }}
              disabled={running || !inputValue}
              className="ll-btn"
            >
              Insert at Head - O(1)
            </button>
            <button
              onClick={() => {
                if (inputValue) {
                  onInsertAtTail(parseInt(inputValue));
                  setInputValue('');
                }
              }}
              disabled={running || !inputValue}
              className="ll-btn"
            >
              Insert at Tail - O(n)
            </button>
          </div>
        )}

        {tab === 'delete' && (
          <div>
            <button
              onClick={onDeleteHead}
              disabled={running}
              className="ll-btn ll-btn-danger"
            >
              Delete from Head - O(1)
            </button>
          </div>
        )}

        {tab === 'search' && (
          <div>
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter value to search"
              disabled={running}
            />
            <button
              onClick={() => {
                if (searchValue) {
                  onSearch(parseInt(searchValue));
                  setSearchValue('');
                }
              }}
              disabled={running || !searchValue}
              className="ll-btn"
            >
              Search - O(n)
            </button>
          </div>
        )}

        {tab === 'init' && (
          <div>
            <button onClick={onRandom} disabled={running} className="ll-btn">
              Random List (5 nodes)
            </button>
            <button onClick={onReset} disabled={running} className="ll-btn ll-btn-reset">
              Clear & Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== STATE PANEL COMPONENT =====
// Shows current state information
function StatePanel({ list, size, operations }) {
  const head = list && list.length > 0 ? list[0] : null;
  const tail = list && list.length > 0 ? list[list.length - 1] : null;

  return (
    <div className="ll-state-panel">
      <div className="ll-state-title">List State:</div>
      <div className="ll-state-rows">
        <div className="ll-state-row">
          <span className="ll-state-label">Head</span>
          <span className="ll-state-val" style={{ color: COLORS.head }}>
            {head !== null ? head : '∅'}
          </span>
        </div>
        <div className="ll-state-row">
          <span className="ll-state-label">Tail</span>
          <span className="ll-state-val" style={{ color: '#fcd34d' }}>
            {tail !== null ? tail : '∅'}
          </span>
        </div>
        <div className="ll-state-row">
          <span className="ll-state-label">Size</span>
          <span className="ll-state-val" style={{ color: COLORS.default }}>
            {size}
          </span>
        </div>
        <div className="ll-state-row">
          <span className="ll-state-label">Operations</span>
          <span className="ll-state-val">{operations.length}</span>
        </div>
        <div className="ll-state-row">
          <span className="ll-state-label">isEmpty()</span>
          <span className="ll-state-val" style={{ color: size === 0 ? '#10b981' : '#ef4444' }}>
            {size === 0 ? 'true' : 'false'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER COMPONENT =====
// Entry point for Linked List visualization
export default function LinkedListVisualizer() {
  const [list, setList] = useState([15, 28, 7, 42]);
  const [focusIdx, setFocusIdx] = useState(0);
  const [operations, setOperations] = useState([]);
  const [running, setRunning] = useState(false);

  const addOperation = useCallback((op) => {
    setOperations((prev) => [...prev, op]);
  }, []);

  const handleInsertAtHead = useCallback(
    (value) => {
      setRunning(true);
      setTimeout(() => {
        setList((prev) => [value, ...prev]);
        addOperation(`Inserted ${value} at HEAD - O(1)`);
        setRunning(false);
      }, 400);
    },
    [addOperation]
  );

  const handleInsertAtTail = useCallback(
    (value) => {
      setRunning(true);
      setTimeout(() => {
        setList((prev) => [...prev, value]);
        addOperation(`Inserted ${value} at TAIL - O(n) [traversed ${list.length} nodes]`);
        setRunning(false);
      }, 400);
    },
    [list.length, addOperation]
  );

  const handleDeleteHead = useCallback(() => {
    if (list.length === 0) {
      alert('List is empty!');
      return;
    }
    setRunning(true);
    setTimeout(() => {
      const deleted = list[0];
      setList((prev) => prev.slice(1));
      addOperation(`Deleted HEAD (${deleted}) - O(1)`);
      setRunning(false);
    }, 400);
  }, [list, addOperation]);

  const handleSearch = useCallback(
    (value) => {
      setRunning(true);
      let position = -1;
      let steps = 0;

      const searchStep = () => {
        if (steps < list.length) {
          setFocusIdx(steps);
          if (list[steps] === value) {
            position = steps;
          }
          steps++;
          setTimeout(searchStep, 300);
        } else {
          if (position !== -1) {
            addOperation(`Found ${value} at position ${position} - O(n) [${steps} steps]`);
          } else {
            addOperation(`${value} not found in list - O(n) [searched ${steps} nodes]`);
          }
          setRunning(false);
        }
      };

      searchStep();
    },
    [list, addOperation]
  );

  const handleRandom = useCallback(() => {
    const randomList = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setList(randomList);
    setOperations(['List initialized with random values']);
    setFocusIdx(0);
  }, []);

  const handleReset = useCallback(() => {
    setList([]);
    setOperations([]);
    setFocusIdx(0);
  }, []);

  return (
    <div className="ll-root">
      <div className="ll-header">
        <h1>🔗 Singly Linked List</h1>
        <div className="ll-badges">
          <span className="ll-badge">Intermediate</span>
          <span className="ll-badge">O(n) Search</span>
        </div>
      </div>

      <div className="ll-container">
        <div className="ll-left">
          <LinkedListVisual
            nodes={list}
            headIdx={0}
            focusIdx={focusIdx}
            operations={operations}
          />
        </div>

        <div className="ll-right">
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

      {/* Code Display */}
      <div className="ll-code-section">
        <details>
          <summary>📝 Code Examples (Click to expand)</summary>
          <div className="ll-code-tabs">
            {Object.entries(CODE_SNIPPETS).map(([lang, code]) => (
              <details key={lang}>
                <summary className="ll-code-lang">{lang.toUpperCase()}</summary>
                <pre className="ll-code-block">{code}</pre>
              </details>
            ))}
          </div>
        </details>
      </div>

      {/* Comparison Box */}
      <div className="ll-comparison">
        <h3>Singly Linked List vs Array</h3>
        <table className="ll-comparison-table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Linked List</th>
              <th>Array</th>
              <th>Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Insert at Head</td>
              <td className="ll-good">O(1)</td>
              <td>O(n)</td>
              <td>🏆 LL is faster</td>
            </tr>
            <tr>
              <td>Insert at Tail</td>
              <td>O(n)</td>
              <td className="ll-good">O(1)</td>
              <td>🏆 Array is faster</td>
            </tr>
            <tr>
              <td>Delete from Head</td>
              <td className="ll-good">O(1)</td>
              <td>O(n)</td>
              <td>🏆 LL is faster</td>
            </tr>
            <tr>
              <td>Random Access</td>
              <td>O(n)</td>
              <td className="ll-good">O(1)</td>
              <td>🏆 Array is faster</td>
            </tr>
            <tr>
              <td>Search</td>
              <td>O(n)</td>
              <td>O(n)</td>
              <td>Same</td>
            </tr>
            <tr>
              <td>Space</td>
              <td>O(n) + pointers</td>
              <td className="ll-good">O(n)</td>
              <td>🏆 Array uses less memory</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
