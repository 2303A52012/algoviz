import React, { useState, useCallback } from 'react';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const BST_PSEUDOCODES = {
  insert: [
    "function insert(node, value) {",
    "  if node == null return new Node(value)",
    "  if value < node.value {",
    "    node.left = insert(node.left, value)",
    "  } else if value > node.value {",
    "    node.right = insert(node.right, value)",
    "  }",
    "  return node",
    "}"
  ],
  delete: [
    "function delete(node, value) {",
    "  if node == null return null",
    "  if value < node.value: node.left = delete(node.left, value)",
    "  else if value > node.value: node.right = delete(node.right, value)",
    "  else {",
    "    if node.left == null return node.right",
    "    if node.right == null return node.left",
    "    succ = findMin(node.right)",
    "    node.value = succ.value",
    "    node.right = delete(node.right, succ.value)",
    "  }",
    "  return node",
    "}"
  ],
  search: [
    "function search(node, target) {",
    "  if node == null return false",
    "  if target == node.value return true",
    "  if target < node.value {",
    "    return search(node.left, target)",
    "  } else {",
    "    return search(node.right, target)",
    "  }",
    "}"
  ],
  validate: [
    "function isValidBST(node, min, max) {",
    "  if node == null return true",
    "  if node.value <= min or node.value >= max {",
    "    return false",
    "  }",
    "  return isValidBST(node.left, min, node.value)",
    "      && isValidBST(node.right, node.value, max)",
    "}"
  ],
  inorder: [
    "function inorder(node) {",
    "  if node == null return",
    "  inorder(node.left)",
    "  visit(node)",
    "  inorder(node.right)",
    "}"
  ],
  preorder: [
    "function preorder(node) {",
    "  if node == null return",
    "  visit(node)",
    "  preorder(node.left)",
    "  preorder(node.right)",
    "}"
  ],
  postorder: [
    "function postorder(node) {",
    "  if node == null return",
    "  postorder(node.left)",
    "  postorder(node.right)",
    "  visit(node)",
    "}"
  ],
  levelorder: [
    "function levelOrder(root) {",
    "  if root == null return",
    "  queue.push(root)",
    "  while queue is not empty {",
    "    curr = queue.shift()",
    "    visit(curr)",
    "    if curr.left != null queue.push(curr.left)",
    "    if curr.right != null queue.push(curr.right)",
    "  }",
    "}"
  ],
  default: [
    "// Select an operation to see pseudocode"
  ]
};

// ===== BST OPERATIONS =====
function newNode(val) {
  return { val, left: null, right: null, id: Math.random().toString(36).slice(2) };
}

function bstInsert(node, val) {
  if (!node) return newNode(val);
  if (val < node.val) return { ...node, left: bstInsert(node.left, val) };
  if (val > node.val) return { ...node, right: bstInsert(node.right, val) };
  return node; // duplicate
}

function bstDelete(node, val) {
  if (!node) return null;
  if (val < node.val) return { ...node, left: bstDelete(node.left, val) };
  if (val > node.val) return { ...node, right: bstDelete(node.right, val) };
  // Found: 3 cases
  if (!node.left) return node.right;
  if (!node.right) return node.left;
  // Two children: find in-order successor (min of right subtree)
  let succ = node.right;
  while (succ.left) succ = succ.left;
  return { ...node, val: succ.val, id: node.id, right: bstDelete(node.right, succ.val) };
}

function bstSearch(node, val, path = []) {
  if (!node) return { found: false, path };
  path.push(node.id);
  if (val === node.val) return { found: true, path, node };
  if (val < node.val) return bstSearch(node.left, val, path);
  return bstSearch(node.right, val, path);
}

function bstMin(node) { if (!node) return null; while (node.left) node = node.left; return node.val; }
function bstMax(node) { if (!node) return null; while (node.right) node = node.right; return node.val; }

function getHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}
function getSize(node) {
  if (!node) return 0;
  return 1 + getSize(node.left) + getSize(node.right);
}

function isBalanced(node) {
  if (!node) return true;
  const lh = getHeight(node.left), rh = getHeight(node.right);
  return Math.abs(lh - rh) <= 1 && isBalanced(node.left) && isBalanced(node.right);
}

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;
  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);
}

// ===== SVG LAYOUT =====
// Reingold-Tilford style fixed-spacing layout
const NODE_R = 24;
const V_GAP  = 72;
const NODE_X_GAP = 58;

let leafCounter = 0;

function assignX(node, positions = {}) {
  if (!node) return positions;
  if (!node.left && !node.right) {
    positions[node.id] = { x: leafCounter * NODE_X_GAP + NODE_R + 16 };
    leafCounter++;
    return positions;
  }
  assignX(node.left, positions);
  assignX(node.right, positions);
  const lx = node.left  ? positions[node.left.id].x  : null;
  const rx = node.right ? positions[node.right.id].x : null;
  if (lx !== null && rx !== null) positions[node.id] = { x: (lx + rx) / 2 };
  else if (lx !== null)           positions[node.id] = { x: lx };
  else                            positions[node.id] = { x: rx };
  return positions;
}

function layoutBST(root) {
  leafCounter = 0;
  return assignX(root, {});
}

function TreeSVG({ root, highlightIds, searchStep, newId }) {
  if (!root) return (
    <div className="bst-svg-empty">Empty BST — insert a value to start</div>
  );

  const height = getHeight(root);
  const positions = layoutBST(root);

  const allX = Object.values(positions).map(p => p.x);
  const svgW = Math.max(400, Math.max(...allX) + NODE_R + 32);
  const svgH = height * V_GAP + NODE_R * 2 + 32;

  const getXY = (id, depth) => {
    const p = positions[id];
    return { x: p ? p.x : svgW / 2, y: depth * V_GAP + NODE_R + 16 };
  };

  const edges = [], nodes = [];
  const bfsTraverse = (node, depth = 0) => {
    if (!node) return;
    const pos = getXY(node.id, depth);
    if (node.left) {
      const lp = getXY(node.left.id, depth + 1);
      edges.push({ x1: pos.x, y1: pos.y, x2: lp.x, y2: lp.y, id: node.id + 'l' });
    }
    if (node.right) {
      const rp = getXY(node.right.id, depth + 1);
      edges.push({ x1: pos.x, y1: pos.y, x2: rp.x, y2: rp.y, id: node.id + 'r' });
    }
    nodes.push({ ...pos, id: node.id, val: node.val, depth });
    bfsTraverse(node.left, depth + 1);
    bfsTraverse(node.right, depth + 1);
  };
  bfsTraverse(root);

  return (
    <div className="bst-svg-scroll">
      <svg width={svgW} height={svgH} style={{ minWidth: svgW, display: 'block' }}>
        {/* Edge lines */}
        {edges.map(e => (
          <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={highlightIds?.includes(e.id.replace(/[lr]$/, '')) ? '#f59e0b66' : '#2a4070'}
            strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {nodes.map(n => {
          const isHL   = highlightIds?.includes(n.id);
          const isNew  = n.id === newId;
          const isRoot = n.id === root?.id;
          const fill   = isHL ? '#2d200a' : isNew ? '#0a2d15' : isRoot ? '#0d2a18' : '#1a3060';
          const stroke = isHL ? '#f59e0b' : isNew ? '#22c55e' : isRoot ? '#22c55e' : '#3b82f6';
          const tc     = isHL ? '#fcd34d' : isNew ? '#86efac' : isRoot ? '#86efac' : '#93c5fd';
          return (
            <g key={n.id} style={{ transition: 'all 0.35s ease' }}>
              <circle cx={n.x} cy={n.y} r={NODE_R}
                fill={fill} stroke={stroke} strokeWidth="2.5" />
              <text x={n.x} y={n.y + 5} textAnchor="middle"
                fill={tc} fontSize="13" fontWeight="bold" fontFamily="monospace"
                style={{ userSelect: 'none' }}>
                {n.val}
              </text>
            </g>
          );
        })}
        {/* L/R Edge labels */}
        {edges.map(e => {
          const mx = (e.x1 + e.x2) / 2;
          const my = (e.y1 + e.y2) / 2;
          const isLeft = e.x2 < e.x1;
          return (
            <text key={e.id + 'lbl'} x={mx + (isLeft ? -12 : 12)} y={my - 4}
              textAnchor="middle" fill="#2a4070" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {isLeft ? 'L' : 'R'}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ===== OP PANEL =====
function OpPanel({ onInsert, onDelete, onSearch, onTraverse, onValidate, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [val, setVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="bst-op-panel">
      <div className="bst-tabs">
        {['insert','delete','search','traverse','init'].map(t => (
          <button key={t} className={`bst-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="bst-tab-content">
        {tab === 'insert' && (
          <div className="bst-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" disabled={running} />
            <button className="bst-btn" onClick={() => { if(val) { onInsert(+val); setVal(''); }}} disabled={running || !val}>
              BST Insert — O(log n) avg
            </button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="bst-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value to delete" disabled={running} />
            <button className="bst-btn bst-btn-danger" onClick={() => { if(val) { onDelete(+val); setVal(''); }}} disabled={running || !val}>
              BST Delete (3 cases) — O(log n)
            </button>
          </div>
        )}
        {tab === 'search' && (
          <div className="bst-tab-form">
            <input type="number" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Value to find" disabled={running} />
            <button className="bst-btn" onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); }}} disabled={running || !searchVal}>
              BST Search — O(log n) avg
            </button>
            <button className="bst-btn bst-btn-teal" onClick={onValidate} disabled={running}>
              Validate BST Property
            </button>
          </div>
        )}
        {tab === 'traverse' && (
          <div className="bst-tab-form">
            <button className="bst-btn" onClick={() => onTraverse('inorder')} disabled={running}>
              Inorder (sorted output) ↑
            </button>
            <button className="bst-btn" onClick={() => onTraverse('preorder')} disabled={running}>Preorder</button>
            <button className="bst-btn" onClick={() => onTraverse('postorder')} disabled={running}>Postorder</button>
            <button className="bst-btn bst-btn-amber" onClick={() => onTraverse('levelorder')} disabled={running}>
              Level-order (BFS)
            </button>
          </div>
        )}
        {tab === 'init' && (
          <div className="bst-tab-form">
            <button className="bst-btn" onClick={onRandom} disabled={running}>Random BST (7 values)</button>
            <button className="bst-btn bst-btn-reset" onClick={onReset} disabled={running}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatePanel({ root, ops }) {
  const h = getHeight(root);
  const size = getSize(root);
  const balanced = isBalanced(root);
  const valid = isValidBST(root);
  return (
    <div className="bst-state-panel">
      {[
        ['Root', root?.val ?? '∅', 'var(--green-light)'],
        ['Min', root ? bstMin(root) : '∅', 'var(--blue-light)'],
        ['Max', root ? bstMax(root) : '∅', 'var(--blue-light)'],
        ['Height', h, 'var(--blue-light)'],
        ['Size', size, 'var(--text-secondary)'],
        ['Is Balanced', balanced ? 'true' : 'false', balanced ? 'var(--green-light)' : 'var(--red-light)'],
        ['Valid BST', valid ? 'true' : 'false', valid ? 'var(--green-light)' : 'var(--red-light)'],
        ['Ops', ops.length, 'var(--text-secondary)'],
      ].map(([label, val, color]) => (
        <div key={label} className="bst-state-row">
          <span className="bst-state-label">{label}</span>
          <span className="bst-state-val" style={{ color }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ===== MAIN =====
const INIT_VALS = [50, 30, 70, 20, 40, 60, 80];

export default function BSTVisualizer() {
  const buildInit = () => {
    let r = null;
    INIT_VALS.forEach(v => { r = bstInsert(r, v); });
    return r;
  };

  const [root, setRoot] = useState(() => buildInit());
  const [highlightIds, setHighlightIds] = useState([]);
  const [newId, setNewId] = useState(null);
  const [ops, setOps] = useState([`Initialized with [${INIT_VALS.join(', ')}]`]);
  const [traverseResult, setTraverseResult] = useState('');
  const [running, setRunning] = useState(false);
  const [activeCode, setActiveCode] = useState('default');
  const [activeLine, setActiveLine] = useState(0);

  const addOp = useCallback(op => setOps(p => [...p, op]), []);

  const handleInsert = useCallback(val => {
    setActiveCode('insert');
    setActiveLine(1);
    let insertedId = null;
    setRoot(r => {
      const before = new Set();
      const collectIds = n => { if (!n) return; before.add(n.id); collectIds(n.left); collectIds(n.right); };
      collectIds(r);
      const newRoot = bstInsert(r, val);
      const after = new Set();
      const collectAfter = n => { if (!n) return; after.add(n.id); collectAfter(n.left); collectAfter(n.right); };
      collectAfter(newRoot);
      for (const id of after) { if (!before.has(id)) { insertedId = id; break; } }
      setNewId(insertedId);
      setActiveLine(7);
      setTimeout(() => { setNewId(null); setActiveLine(8); }, 1000);
      return newRoot;
    });
    addOp(`BST Insert: ${val} — O(log n) avg`);
  }, [addOp]);

  const handleDelete = useCallback(val => {
    setActiveCode('delete');
    setActiveLine(1);
    setRoot(r => bstDelete(r, val));
    addOp(`BST Delete: ${val} (using in-order successor if 2 children)`);
    setActiveLine(12);
  }, [addOp]);

  const handleSearch = useCallback(val => {
    setActiveCode('search');
    setActiveLine(1);
    setRunning(true); setHighlightIds([]); setTraverseResult('');
    const { found, path } = bstSearch(root, val);
    let i = 0;
    const tick = () => {
      if (i < path.length) {
        setHighlightIds(path.slice(0, i + 1));
        setActiveLine(4);
        i++;
        setTimeout(tick, 350);
      } else {
        setActiveLine(found ? 2 : 1);
        addOp(found
          ? `Found ${val} — path length ${path.length} — O(log n) avg`
          : `Not found: ${val} — searched ${path.length} nodes`);
        setTimeout(() => { setHighlightIds([]); setRunning(false); }, 700);
      }
    };
    tick();
  }, [root, addOp]);

  const handleTraverse = useCallback(type => {
    setActiveCode(type);
    setActiveLine(0);
    setRunning(true); setHighlightIds([]); setTraverseResult('');
    const order = [];
    const inorder   = n => { if (!n) return; inorder(n.left); order.push(n); inorder(n.right); };
    const preorder  = n => { if (!n) return; order.push(n); preorder(n.left); preorder(n.right); };
    const postorder = n => { if (!n) return; postorder(n.left); postorder(n.right); order.push(n); };
    const levelorder= n => { if (!n) return; const q=[n]; while(q.length){const c=q.shift();order.push(c);if(c.left)q.push(c.left);if(c.right)q.push(c.right);} };

    if (type === 'inorder')    inorder(root);
    if (type === 'preorder')   preorder(root);
    if (type === 'postorder')  postorder(root);
    if (type === 'levelorder') levelorder(root);

    let i = 0;
    const tick = () => {
      if (i < order.length) {
        setHighlightIds([order[i].id]);
        setTraverseResult(order.slice(0, i+1).map(n => n.val).join(' → '));
        setActiveLine(type === 'inorder' ? 3 : type === 'preorder' ? 2 : type === 'postorder' ? 4 : 5);
        i++;
        setTimeout(tick, 300);
      } else {
        addOp(`${type.charAt(0).toUpperCase()+type.slice(1)}: [${order.map(n=>n.val).join(', ')}]`);
        setTimeout(() => { setHighlightIds([]); setRunning(false); }, 600);
      }
    };
    tick();
  }, [root, addOp]);

  const handleValidate = useCallback(() => {
    setActiveCode('validate');
    setActiveLine(0);
    const valid = isValidBST(root);
    setActiveLine(6);
    addOp(valid ? '✅ Valid BST: all left < node < right holds everywhere' : '❌ NOT a valid BST!');
  }, [root, addOp]);

  const handleRandom = useCallback(() => {
    const vals = Array.from({length: 7}, () => Math.floor(Math.random() * 90) + 10);
    let r = null;
    [...new Set(vals)].forEach(v => { r = bstInsert(r, v); });
    setRoot(r); setOps([`Random BST: [${vals.join(', ')}]`]);
    setHighlightIds([]); setTraverseResult('');
    setActiveCode('default');
    setActiveLine(0);
  }, []);

  const handleReset = useCallback(() => {
    setRoot(null); setOps([]); setHighlightIds([]); setTraverseResult('');
    setActiveCode('default');
    setActiveLine(0);
  }, []);

  return (
    <div className="bst-root">
      <div className="bst-header">
        <div>
          <h2 className="bst-title">🔍🌲 Binary Search Tree</h2>
          <p className="bst-desc">Ordered binary tree — left &lt; node &lt; right, O(log n) avg search/insert/delete</p>
        </div>
        <div className="bst-badges">
          <span className="bst-badge">Intermediate</span>
          <span className="bst-badge">BST Ordered</span>
          <span className="bst-badge">O(log n) avg</span>
        </div>
      </div>

      <div className="bst-content">
        <div className="bst-visual">
          <div className="bst-visual-title">
            BST Visualization (L &lt; parent &lt; R)
            {traverseResult && <span className="bst-traverse-result">{traverseResult}</span>}
          </div>
          <TreeSVG root={root} highlightIds={highlightIds} newId={newId} />
          <div className="bst-log">
            <div className="bst-log-label">Recent Ops:</div>
            <div className="bst-log-items">
              {ops.slice(-4).map((op, i) => <div key={i} className="bst-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="bst-controls">
          <OpPanel
            onInsert={handleInsert} onDelete={handleDelete}
            onSearch={handleSearch} onTraverse={handleTraverse}
            onValidate={handleValidate} onRandom={handleRandom}
            onReset={handleReset} running={running}
          />
          <StatePanel root={root} ops={ops} />
        </div>
      </div>

      {/* BST Property Panel */}
      <div className="bst-property-panel">
        <div className="bst-property-title">⚡ BST Delete — 3 Cases</div>
        <div className="bst-property-grid">
          {[
            ['Case 1: Leaf', 'Node has no children', 'Simply remove the node'],
            ['Case 2: One child', 'Node has left OR right child', 'Replace node with its child'],
            ['Case 3: Two children', 'Node has both children', 'Replace with in-order successor (min of right subtree)'],
          ].map(([title, cond, action]) => (
            <div key={title} className="bst-case-item">
              <div className="bst-case-title">{title}</div>
              <div className="bst-case-cond">{cond}</div>
              <div className="bst-case-action">→ {action}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bst-code-wrap" style={{ marginTop: '16px' }}>
        <Pseudocode code={BST_PSEUDOCODES[activeCode]} activeLine={activeLine} />
      </div>
    </div>
  );
}
