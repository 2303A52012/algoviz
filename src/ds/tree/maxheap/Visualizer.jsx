import React, { useState, useCallback } from 'react';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const MAXHEAP_PSEUDOCODES = {
  insert: [
    "function insert(heap, value) {",
    "  heap.push(value)",
    "  i = heap.length - 1",
    "  while i > 0 {",
    "    p = parent(i)",
    "    if heap[i] > heap[p] {",
    "      swap(heap[i], heap[p])",
    "      i = p",
    "    } else {",
    "      break",
    "    }",
    "  }",
    "}"
  ],
  extract: [
    "function extractMax(heap) {",
    "  if heap.length == 0 return null",
    "  if heap.length == 1 return heap.pop()",
    "  max = heap[0]",
    "  heap[0] = heap.pop()",
    "  i = 0",
    "  while true {",
    "    target = i",
    "    if left(i) < len && heap[left(i)] > heap[target]",
    "      target = left(i)",
    "    if right(i) < len && heap[right(i)] > heap[target]",
    "      target = right(i)",
    "    if target != i {",
    "      swap(heap[i], heap[target])",
    "      i = target",
    "    } else {",
    "      break",
    "    }",
    "  }",
    "  return max",
    "}"
  ],
  default: [
    "// Select an operation to see pseudocode"
  ]
};

// ===== CONSTANTS =====
const NODE_R = 20;
const V_GAP = 60;
const H_GAP_BASE = 24;

// Math helpers
const parentIdx = i => Math.floor((i - 1) / 2);
const leftIdx = i => 2 * i + 1;
const rightIdx = i => 2 * i + 2;

// Layout algorithm for complete binary tree (heap)
function layoutHeap(heap, positions = {}, idx = 0, depth = 0, left = 0, right = 1) {
  if (idx >= heap.length) return positions;
  const mid = (left + right) / 2;
  positions[idx] = { x: mid, y: depth };
  layoutHeap(heap, positions, leftIdx(idx), depth + 1, left, mid);
  layoutHeap(heap, positions, rightIdx(idx), depth + 1, mid, right);
  return positions;
}

// ===== COMPONENTS =====

function TreeSVG({ heap, hlIndices, compareIndices, swapIndices }) {
  if (heap.length === 0) return <div className="maxheap-svg-empty">Heap is empty</div>;

  const height = Math.floor(Math.log2(heap.length)) + 1;
  const positions = layoutHeap(heap);
  
  const svgW = Math.max(300, H_GAP_BASE * Math.pow(2, height));
  const svgH = height * V_GAP + NODE_R * 2 + 20;

  const getXY = idx => {
    const p = positions[idx];
    return { x: p.x * svgW, y: p.y * V_GAP + NODE_R + 10 };
  };

  const edges = [];
  const nodes = [];

  for (let i = 0; i < heap.length; i++) {
    const pos = getXY(i);
    nodes.push({ ...pos, val: heap[i], idx: i });
    
    const l = leftIdx(i);
    const r = rightIdx(i);
    
    if (l < heap.length) {
      const lpos = getXY(l);
      edges.push({ x1: pos.x, y1: pos.y, x2: lpos.x, y2: lpos.y, id: `${i}-${l}` });
    }
    if (r < heap.length) {
      const rpos = getXY(r);
      edges.push({ x1: pos.x, y1: pos.y, x2: rpos.x, y2: rpos.y, id: `${i}-${r}` });
    }
  }

  return (
    <div className="maxheap-svg-scroll">
      <svg width={svgW} height={svgH} style={{ minWidth: svgW }}>
        {edges.map(e => (
          <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
        ))}
        {nodes.map(n => {
          const isSwap = swapIndices?.includes(n.idx);
          const isCmp = compareIndices?.includes(n.idx);
          const isHl = hlIndices?.includes(n.idx);
          
          let fill = '#1e3a8a', stroke = '#3b82f6', text = '#bfdbfe'; // default
          if (isSwap) { fill = '#0f2d1a'; stroke = '#22c55e'; text = '#86efac'; }
          else if (isCmp) { fill = '#1e3a8a'; stroke = '#60a5fa'; text = 'white'; }
          else if (isHl) { fill = '#2d1b6e'; stroke = '#a855f7'; text = '#d8b4fe'; }

          return (
            <g key={n.idx} style={{ transition: 'all 0.3s ease' }}>
              <circle cx={n.x} cy={n.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth="2" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill={text} fontSize="13" fontWeight="bold" fontFamily="monospace">
                {n.val}
              </text>
              <text x={n.x + NODE_R + 5} y={n.y - NODE_R + 5} fill="#64748b" fontSize="10" fontFamily="monospace">
                {n.idx}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ArrayPanel({ heap, hlIndices, compareIndices, swapIndices }) {
  return (
    <div className="maxheap-array-panel">
      <div className="maxheap-array-title">Array Representation</div>
      <div className="maxheap-array-container">
        {heap.length === 0 && <div className="maxheap-svg-empty" style={{padding: '10px'}}>Empty array</div>}
        {heap.map((val, i) => {
          const isSwap = swapIndices?.includes(i);
          const isCmp = compareIndices?.includes(i);
          const isHl = hlIndices?.includes(i);
          let cls = 'maxheap-array-cell';
          if (isSwap) cls += ' swap';
          else if (isCmp) cls += ' compare';
          else if (isHl) cls += ' highlight';
          
          return (
            <div key={i} className="maxheap-array-cell-wrap">
              <div className="maxheap-array-index">{i}</div>
              <div className={cls}>{val}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OpPanel({ onInsert, onExtract, onClear, running }) {
  const [val, setVal] = useState('');

  return (
    <div className="maxheap-op-panel">
      <div className="maxheap-tab-content">
        <div className="maxheap-tab-form">
          <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value to insert" disabled={running} />
          <button className="maxheap-btn" onClick={() => { if(val) { onInsert(+val); setVal(''); }}} disabled={running || !val}>
            Insert & Bubble Up
          </button>
          <button className="maxheap-btn" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-dim)' }} onClick={() => onInsert(Math.floor(Math.random() * 100) + 1)} disabled={running}>
            Random Insert
          </button>
          
          <button className="maxheap-btn maxheap-btn-danger" onClick={onExtract} disabled={running}>
            Extract Top & Bubble Down
          </button>

          <button className="maxheap-btn maxheap-btn-reset" onClick={onClear} disabled={running}>
            Clear Heap
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function MaxHeapVisualizer() {
  const [heap, setHeap] = useState([40, 30, 20, 15, 10]);
  
  const [hlIndices, setHl] = useState([]);
  const [compareIndices, setCmp] = useState([]);
  const [swapIndices, setSwap] = useState([]);
  
  const [ops, setOps] = useState(['Initialized Max-Heap']);
  const [running, setRunning] = useState(false);
  const [activeCode, setActiveCode] = useState('default');
  const [activeLine, setActiveLine] = useState(0);

  const addOp = useCallback(msg => setOps(p => [...p, msg]), []);

  const runAnimation = async (steps, operationCode) => {
    setRunning(true);
    setActiveCode(operationCode);
    setActiveLine(1);
    for (const step of steps) {
      if (step.line !== undefined) setActiveLine(step.line);
      setHeap([...step.h]);
      setHl(step.hl || []);
      setCmp(step.cmp || []);
      setSwap(step.swap || []);
      if (step.msg) addOp(step.msg);
      await new Promise(r => setTimeout(r, 600));
    }
    setHl([]); setCmp([]); setSwap([]);
    setRunning(false);
  };

  const compare = (a, b) => a > b; // Max-Heap logic

  const handleInsert = async (val) => {
    const h = [...heap];
    const steps = [];
    
    h.push(val);
    let i = h.length - 1;
    steps.push({ h: [...h], hl: [i], line: 3, msg: `Inserted ${val} at end of array (index ${i})` });

    while (i > 0) {
      const p = parentIdx(i);
      steps.push({ h: [...h], cmp: [i, p], hl: [i], line: 6, msg: `Comparing child [${i}] (${h[i]}) with parent [${p}] (${h[p]})` });
      
      if (compare(h[i], h[p])) {
        // Swap
        let temp = h[i];
        h[i] = h[p];
        h[p] = temp;
        steps.push({ h: [...h], swap: [i, p], hl: [p], line: 7, msg: `Swapped! Child was larger than parent.` });
        i = p;
      } else {
        steps.push({ h: [...h], hl: [i], line: 10, msg: `Heap property satisfied.` });
        break;
      }
    }
    steps.push({ h: [...h], line: 12, msg: `Insert complete. O(log n)` });
    runAnimation(steps, 'insert');
  };

  const handleExtract = async () => {
    if (heap.length === 0) return;
    const h = [...heap];
    const steps = [];

    const top = h[0];
    if (h.length === 1) {
      h.pop();
      steps.push({ h: [], line: 3, msg: `Extracted ${top}. Heap is empty.` });
      runAnimation(steps, 'extract');
      return;
    }

    // Swap root with last
    h[0] = h.pop();
    steps.push({ h: [...h], swap: [0], line: 5, msg: `Extracted ${top}. Moved last element (${h[0]}) to root.` });

    let i = 0;
    while (true) {
      const l = leftIdx(i);
      const r = rightIdx(i);
      let target = i;
      steps.push({ h: [...h], line: 8, msg: `Evaluating children...` });

      if (l < h.length && compare(h[l], h[target])) target = l;
      if (r < h.length && compare(h[r], h[target])) target = r;

      if (target !== i) {
        steps.push({ h: [...h], cmp: [i, target], hl: [i], line: 14, msg: `Comparing [${i}] with best child [${target}]` });
        // Swap
        let temp = h[i];
        h[i] = h[target];
        h[target] = temp;
        steps.push({ h: [...h], swap: [i, target], hl: [target], line: 15, msg: `Bubbled down!` });
        i = target;
      } else {
        steps.push({ h: [...h], hl: [i], line: 18, msg: `Heap property satisfied.` });
        break;
      }
    }
    steps.push({ h: [...h], line: 21, msg: `Extract complete. O(log n)` });
    runAnimation(steps, 'extract');
  };

  const handleClear = () => { setHeap([]); setOps(['Cleared Max-Heap']); setActiveCode('default'); setActiveLine(0); };

  return (
    <div className="maxheap-root">
      <div className="maxheap-header">
        <div>
          <h2 className="maxheap-title">⬆️ Max-Heap</h2>
          <p className="maxheap-desc">Complete binary tree where parent is always larger than its children.</p>
        </div>
        <div className="maxheap-badges">
          <span className="maxheap-badge">Array-backed</span>
          <span className="maxheap-badge">O(log n) Insert/Extract</span>
        </div>
      </div>

      <div className="maxheap-content">
        <div className="maxheap-visual">
          <div className="maxheap-visual-title">Tree Representation</div>
          <TreeSVG heap={heap} hlIndices={hlIndices} compareIndices={compareIndices} swapIndices={swapIndices} />
          
          <ArrayPanel heap={heap} hlIndices={hlIndices} compareIndices={compareIndices} swapIndices={swapIndices} />
          
          <div className="maxheap-log">
            <div className="maxheap-log-label">Operation Log</div>
            <div className="maxheap-log-items">
              {ops.slice(-4).map((op, idx) => <div key={idx} className="maxheap-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="maxheap-controls">
          <OpPanel 
            onInsert={handleInsert} onExtract={handleExtract} onClear={handleClear}
            running={running} 
          />
          
          <div className="maxheap-formulas">
            <div className="maxheap-formulas-title">Array Index Formulas</div>
            <div className="maxheap-formula-row"><span>Parent of i</span> <span className="maxheap-formula-code">⌊(i - 1) / 2⌋</span></div>
            <div className="maxheap-formula-row"><span>Left Child of i</span> <span className="maxheap-formula-code">2i + 1</span></div>
            <div className="maxheap-formula-row"><span>Right Child of i</span> <span className="maxheap-formula-code">2i + 2</span></div>
          </div>
        </div>
      </div>
      
      <div className="maxheap-code-wrap" style={{ marginTop: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
        <Pseudocode code={MAXHEAP_PSEUDOCODES[activeCode]} activeLine={activeLine} />
      </div>
    </div>
  );
}
