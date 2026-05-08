import React, { useState, useCallback, useMemo } from 'react';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const BTREE_PSEUDOCODES = {
  insert: [
    "function insertBFS(root, value) {",
    "  node = new Node(value)",
    "  if root == null return node",
    "  queue.push(root)",
    "  while queue is not empty {",
    "    curr = queue.shift()",
    "    if curr.left == null { curr.left = node; return root }",
    "    else queue.push(curr.left)",
    "    if curr.right == null { curr.right = node; return root }",
    "    else queue.push(curr.right)",
    "  }",
    "}"
  ],
  delete: [
    "function deleteNode(root, value) {",
    "  if root == null return null",
    "  target = findTarget(root, value)",
    "  deepest = findDeepestRightmost(root)",
    "  if target != null {",
    "    target.value = deepest.value",
    "    deleteDeepest(root, deepest)",
    "  }",
    "  return root",
    "}"
  ],
  search: [
    "function searchBFS(root, target) {",
    "  if root == null return false",
    "  queue.push(root)",
    "  while queue is not empty {",
    "    curr = queue.shift()",
    "    if curr.value == target return true",
    "    if curr.left != null queue.push(curr.left)",
    "    if curr.right != null queue.push(curr.right)",
    "  }",
    "  return false",
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

// ===== TREE DATA STRUCTURE =====
function newNode(val) {
  return { val, left: null, right: null, id: Math.random().toString(36).slice(2) };
}

function insertBFS(root, val) {
  // Level-order insert (fills tree level by level)
  const node = newNode(val);
  if (!root) return node;
  const queue = [root];
  while (queue.length) {
    const cur = queue.shift();
    if (!cur.left) { cur.left = node; return root; }
    else queue.push(cur.left);
    if (!cur.right) { cur.right = node; return root; }
    else queue.push(cur.right);
  }
  return root;
}

function deleteNodeBFS(root, val) {
  if (!root) return null;
  if (!root.left && !root.right) return root.val === val ? null : root;
  // Find deepest rightmost node and target
  let target = null;
  let deepest = null;
  const queue = [root];
  while (queue.length) {
    const cur = queue.shift();
    if (cur.val === val) target = cur;
    deepest = cur;
    if (cur.left) queue.push(cur.left);
    if (cur.right) queue.push(cur.right);
  }
  if (!target) return root;
  // Replace target value with deepest, then delete deepest
  target.val = deepest.val;
  const removeDeepest = (node, deep) => {
    if (!node) return null;
    if (node === deep) return null;
    node.left = removeDeepest(node.left, deep);
    node.right = removeDeepest(node.right, deep);
    return node;
  };
  return removeDeepest(root, deepest);
}

function cloneTree(node) {
  if (!node) return null;
  return { val: node.val, id: node.id, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function getHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getSize(node) {
  if (!node) return 0;
  return 1 + getSize(node.left) + getSize(node.right);
}

function collectNodes(node) {
  if (!node) return [];
  const result = [];
  const queue = [node];
  while (queue.length) {
    const cur = queue.shift();
    result.push(cur.val);
    if (cur.left) queue.push(cur.left);
    if (cur.right) queue.push(cur.right);
  }
  return result;
}

// ===== SVG TREE LAYOUT =====
// Reingold-Tilford style: assign leaf positions using a counter,
// then compute parents as midpoint of children. Each leaf gets
// at least NODE_X_GAP px of space → no squishing on large trees.
const NODE_R   = 24;
const V_GAP    = 72;   // vertical gap between levels
const NODE_X_GAP = 58; // minimum horizontal gap between leaf siblings

let leafCounter = 0;

function assignX(node, positions = {}) {
  if (!node) return positions;
  if (!node.left && !node.right) {
    // Leaf: take the next counter slot
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

function layoutTree(root) {
  leafCounter = 0;
  return assignX(root, {});
}

function TreeSVG({ root, highlightIds, insertId }) {
  const height = getHeight(root);
  if (!root) return (
    <div className="btree-svg-empty">Empty tree — insert a value to start</div>
  );

  const positions = layoutTree(root);

  // Determine canvas size from actual computed positions
  const allX = Object.values(positions).map(p => p.x);
  const svgW = Math.max(400, Math.max(...allX) + NODE_R + 32);
  const svgH = height * V_GAP + NODE_R * 2 + 32;

  const getXY = (id, depth) => {
    const p = positions[id];
    return {
      x: p ? p.x : svgW / 2,
      y: depth * V_GAP + NODE_R + 16,
    };
  };

  // Collect edges + nodes with depth via BFS
  const edges = [];
  const nodes = [];
  const bfsTraverse = (node, depth = 0) => {
    if (!node) return;
    const pos = getXY(node.id, depth);
    if (node.left) {
      const lpos = getXY(node.left.id, depth + 1);
      edges.push({ x1: pos.x, y1: pos.y, x2: lpos.x, y2: lpos.y, id: node.id + 'l' });
    }
    if (node.right) {
      const rpos = getXY(node.right.id, depth + 1);
      edges.push({ x1: pos.x, y1: pos.y, x2: rpos.x, y2: rpos.y, id: node.id + 'r' });
    }
    nodes.push({ ...pos, id: node.id, val: node.val, depth });
    bfsTraverse(node.left,  depth + 1);
    bfsTraverse(node.right, depth + 1);
  };
  bfsTraverse(root);

  return (
    <div className="btree-svg-scroll">
      <svg width={svgW} height={svgH} style={{ minWidth: svgW, display: 'block' }}>
        {/* Edges */}
        {edges.map(e => (
          <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#334d7a" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {/* Nodes */}
        {nodes.map(n => {
          const isHL  = highlightIds?.includes(n.id);
          const isNew = n.id === insertId;
          const isRt  = n.id === root?.id;
          const fill   = isHL ? '#2d1b6e' : isNew ? '#0f2d1a' : isRt ? '#0d2a18' : '#1a3060';
          const stroke = isHL ? '#a855f7' : isNew ? '#22c55e' : isRt ? '#22c55e' : '#3b82f6';
          const tc     = isHL ? '#d8b4fe' : isNew ? '#86efac' : isRt ? '#86efac' : '#93c5fd';
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
      </svg>
    </div>
  );
}


// ===== OP PANEL =====
function OpPanel({ onInsert, onDelete, onSearch, onTraverse, onRandom, onReset, running }) {
  const [tab, setTab] = useState('insert');
  const [val, setVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="btree-op-panel">
      <div className="btree-tabs">
        {['insert','delete','search','traverse','init'].map(t => (
          <button key={t} className={`btree-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="btree-tab-content">
        {tab === 'insert' && (
          <div className="btree-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" disabled={running} />
            <button className="btree-btn" onClick={() => { if(val) { onInsert(+val); setVal(''); }}} disabled={running || !val}>
              Insert (BFS level-order) — O(n)
            </button>
          </div>
        )}
        {tab === 'delete' && (
          <div className="btree-tab-form">
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value to delete" disabled={running} />
            <button className="btree-btn btree-btn-danger" onClick={() => { if(val) { onDelete(+val); setVal(''); }}} disabled={running || !val}>
              Delete Node — O(n)
            </button>
          </div>
        )}
        {tab === 'search' && (
          <div className="btree-tab-form">
            <input type="number" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Value to find" disabled={running} />
            <button className="btree-btn" onClick={() => { if(searchVal) { onSearch(+searchVal); setSearchVal(''); }}} disabled={running || !searchVal}>
              Search — O(n)
            </button>
          </div>
        )}
        {tab === 'traverse' && (
          <div className="btree-tab-form">
            <button className="btree-btn" onClick={() => onTraverse('inorder')}   disabled={running}>Inorder   (L → Root → R)</button>
            <button className="btree-btn" onClick={() => onTraverse('preorder')}  disabled={running}>Preorder  (Root → L → R)</button>
            <button className="btree-btn" onClick={() => onTraverse('postorder')} disabled={running}>Postorder (L → R → Root)</button>
            <button className="btree-btn btree-btn-teal" onClick={() => onTraverse('levelorder')} disabled={running}>Level-order (BFS)</button>
          </div>
        )}
        {tab === 'init' && (
          <div className="btree-tab-form">
            <button className="btree-btn" onClick={onRandom} disabled={running}>Random Tree (7 nodes)</button>
            <button className="btree-btn btree-btn-reset" onClick={onReset} disabled={running}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatePanel({ root, ops }) {
  const h = getHeight(root);
  const size = getSize(root);
  const isFull = (node) => {
    if (!node) return true;
    if (!node.left && !node.right) return true;
    if (node.left && node.right) return isFull(node.left) && isFull(node.right);
    return false;
  };
  return (
    <div className="btree-state-panel">
      {[
        ['Root', root?.val ?? '∅', 'var(--green-light)'],
        ['Height', h, 'var(--blue-light)'],
        ['Size', size, 'var(--blue-light)'],
        ['Is Full', isFull(root) ? 'true' : 'false', isFull(root) ? 'var(--green-light)' : 'var(--red-light)'],
        ['Ops', ops.length, 'var(--text-secondary)'],
      ].map(([label, val, color]) => (
        <div key={label} className="btree-state-row">
          <span className="btree-state-label">{label}</span>
          <span className="btree-state-val" style={{ color }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ===== MAIN VISUALIZER =====
const INIT_VALS = [40, 20, 60, 10, 30, 50, 70];

export default function BinaryTreeVisualizer() {
  const buildInitTree = () => {
    let r = null;
    INIT_VALS.forEach(v => { r = insertBFS(r, v); });
    return r;
  };

  const [root, setRoot] = useState(() => buildInitTree());
  const [highlightIds, setHighlightIds] = useState([]);
  const [insertId, setInsertId] = useState(null);
  const [ops, setOps] = useState([`Initialized with [${INIT_VALS.join(', ')}]`]);
  const [traverseResult, setTraverseResult] = useState('');
  const [running, setRunning] = useState(false);
  const [activeCode, setActiveCode] = useState('default');
  const [activeLine, setActiveLine] = useState(0);

  const addOp = useCallback(op => setOps(p => [...p, op]), []);

  const handleInsert = useCallback(val => {
    setActiveCode('insert');
    setActiveLine(1);
    const node = newNode(val);
    setRoot(r => {
      const newRoot = insertBFS(cloneTree(r), val);
      // find newly inserted node id
      const allIds = [];
      const q = [newRoot];
      while (q.length) {
        const cur = q.shift();
        allIds.push(cur.id);
        if (cur.left) q.push(cur.left);
        if (cur.right) q.push(cur.right);
      }
      setInsertId(allIds[allIds.length - 1]);
      setActiveLine(4);
      setTimeout(() => { setInsertId(null); setActiveLine(6); }, 1000);
      return newRoot;
    });
    addOp(`Inserted ${val} (BFS level-order) — O(n)`);
  }, [addOp]);

  const handleDelete = useCallback(val => {
    setActiveCode('delete');
    setActiveLine(1);
    setRoot(r => {
      const newRoot = deleteNodeBFS(cloneTree(r), val);
      return newRoot;
    });
    addOp(`Deleted node with value ${val}`);
    setActiveLine(4);
  }, [addOp]);

  const handleSearch = useCallback(val => {
    setActiveCode('search');
    setActiveLine(1);
    // BFS search — animate path
    setRunning(true); setHighlightIds([]);
    const found = [];
    const q = [root];
    while (q.length) {
      const cur = q.shift();
      found.push(cur.id);
      if (cur.val === val) break;
      if (cur.left) q.push(cur.left);
      if (cur.right) q.push(cur.right);
    }
    let i = 0;
    const tick = () => {
      if (i < found.length) {
        setHighlightIds(found.slice(0, i + 1));
        setActiveLine(5);
        i++;
        setTimeout(tick, 300);
      } else {
        const last = root && (() => {
          const q2 = [root]; let last = null;
          while (q2.length) { const c = q2.shift(); if (c.val === val) { last = c; break; } if (c.left) q2.push(c.left); if (c.right) q2.push(c.right); }
          return last;
        })();
        setActiveLine(last ? 6 : 10);
        addOp(last ? `Found ${val} — O(n) [${i} nodes visited]` : `Not found: ${val} — O(n) [${i} nodes searched]`);
        setTimeout(() => { setHighlightIds([]); setRunning(false); }, 800);
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
    const levelorder = n => { if (!n) return; const q = [n]; while (q.length) { const c = q.shift(); order.push(c); if (c.left) q.push(c.left); if (c.right) q.push(c.right); } };

    if (type === 'inorder')    inorder(root);
    if (type === 'preorder')   preorder(root);
    if (type === 'postorder')  postorder(root);
    if (type === 'levelorder') levelorder(root);

    let i = 0;
    const tick = () => {
      if (i < order.length) {
        setHighlightIds([order[i].id]);
        setTraverseResult(order.slice(0, i + 1).map(n => n.val).join(' → '));
        setActiveLine(type === 'inorder' ? 3 : type === 'preorder' ? 2 : type === 'postorder' ? 4 : 5);
        i++;
        setTimeout(tick, 350);
      } else {
        addOp(`${type.charAt(0).toUpperCase() + type.slice(1)}: [${order.map(n => n.val).join(', ')}]`);
        setTimeout(() => { setHighlightIds([]); setRunning(false); }, 600);
      }
    };
    tick();
  }, [root, addOp]);

  const handleRandom = useCallback(() => {
    const vals = Array.from({length: 7}, () => Math.floor(Math.random() * 90) + 10);
    let r = null;
    vals.forEach(v => { r = insertBFS(r, v); });
    setRoot(r);
    setOps([`Random tree: [${vals.join(', ')}]`]);
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
    <div className="btree-root">
      <div className="btree-header">
        <div>
          <h2 className="btree-title">🌲 Binary Tree</h2>
          <p className="btree-desc">Hierarchical structure — each node has at most two children, inserted level-order</p>
        </div>
        <div className="btree-badges">
          <span className="btree-badge">Intermediate</span>
          <span className="btree-badge">No Ordering</span>
          <span className="btree-badge">BFS Insert</span>
        </div>
      </div>

      <div className="btree-content">
        <div className="btree-visual">
          <div className="btree-visual-title">
            Tree Visualization
            {traverseResult && <span className="btree-traverse-result">{traverseResult}</span>}
          </div>
          <TreeSVG root={root} highlightIds={highlightIds} insertId={insertId} />
          <div className="btree-log">
            <div className="btree-log-label">Recent Ops:</div>
            <div className="btree-log-items">
              {ops.slice(-4).map((op, i) => <div key={i} className="btree-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="btree-controls">
          <OpPanel
            onInsert={handleInsert} onDelete={handleDelete}
            onSearch={handleSearch} onTraverse={handleTraverse}
            onRandom={handleRandom} onReset={handleReset}
            running={running}
          />
          <StatePanel root={root} ops={ops} />
        </div>
        </div>

      <div className="btree-code-wrap" style={{ marginTop: '16px' }}>
        <Pseudocode code={BTREE_PSEUDOCODES[activeCode]} activeLine={activeLine} />
      </div>
    </div>
  );
}
