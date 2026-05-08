import React, { useState, useCallback } from 'react';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const AVL_PSEUDOCODES = {
  insert: [
    "function insert(node, value) {",
    "  if node == null return new Node(value)",
    "  if value < node.value",
    "    node.left = insert(node.left, value)",
    "  else if value > node.value",
    "    node.right = insert(node.right, value)",
    "  else return node",
    "  updateHeight(node)",
    "  balance = getBalance(node)",
    "  if balance > 1 && value < node.left.value",
    "    return rightRotate(node)",
    "  if balance < -1 && value > node.right.value",
    "    return leftRotate(node)",
    "  if balance > 1 && value > node.left.value {",
    "    node.left = leftRotate(node.left)",
    "    return rightRotate(node)",
    "  }",
    "  if balance < -1 && value < node.right.value {",
    "    node.right = rightRotate(node.right)",
    "    return leftRotate(node)",
    "  }",
    "  return node",
    "}"
  ],
  default: [
    "// Select an operation to see pseudocode"
  ]
};

// ===== AVL NODE =====
function newNode(val) {
  return { val, left: null, right: null, height: 1, id: Math.random().toString(36).slice(2) };
}

function getHeight(node) { return node ? node.height : 0; }
function getBalance(node) { return node ? getHeight(node.left) - getHeight(node.right) : 0; }
function updateHeight(node) {
  if (node) node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

// Rotations (return new root)
function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function leftRotate(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

// Reingold-Tilford inspired layout (similar to BST)
function layoutTree(node, depth = 0, positions = {}, leafCounter = { count: 0 }) {
  if (!node) return positions;
  layoutTree(node.left, depth + 1, positions, leafCounter);
  const x = node.left || node.right ? leafCounter.count++ : leafCounter.count++;
  positions[node.id] = { x, y: depth };
  layoutTree(node.right, depth + 1, positions, leafCounter);
  return positions;
}

// ===== COMPONENTS =====
const NODE_R = 18;
const V_GAP = 60;
const H_GAP_BASE = 58;

function TreeSVG({ root, hlNode, cmpNode, rotationMsg }) {
  if (!root) return <div className="avl-svg-empty">Tree is empty</div>;

  const positions = layoutTree(root);
  const height = getHeight(root);
  
  const xs = Object.values(positions).map(p => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  
  const width = (maxX - minX + 1) * H_GAP_BASE;
  const svgW = Math.max(300, width + 100);
  const svgH = height * V_GAP + NODE_R * 2 + 60; // extra space for BF labels

  const xOffset = svgW / 2 - ((maxX + minX) * H_GAP_BASE) / 2;

  const getXY = id => {
    const p = positions[id];
    return { x: p.x * H_GAP_BASE + xOffset, y: p.y * V_GAP + NODE_R + 30 };
  };

  const edges = [];
  const nodes = [];

  const traverse = (node) => {
    const pos = getXY(node.id);
    const bf = getBalance(node);
    nodes.push({ ...pos, val: node.val, id: node.id, bf });
    
    if (node.left) {
      const cpos = getXY(node.left.id);
      edges.push({ id: `${node.id}-L`, x1: pos.x, y1: pos.y, x2: cpos.x, y2: cpos.y });
      traverse(node.left);
    }
    if (node.right) {
      const cpos = getXY(node.right.id);
      edges.push({ id: `${node.id}-R`, x1: pos.x, y1: pos.y, x2: cpos.x, y2: cpos.y });
      traverse(node.right);
    }
  };
  traverse(root);

  return (
    <div className="avl-svg-scroll">
      <svg width={svgW} height={svgH} style={{ minWidth: svgW, display: 'block' }}>
        {edges.map(e => (
          <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
            stroke="#3b82f6" strokeWidth="2" opacity="0.6" 
            style={{ transition: 'all 0.4s' }}
          />
        ))}
        {nodes.map(n => {
          const isHl = n.id === hlNode;
          const isCmp = n.id === cmpNode;
          
          let fill = '#1e3a8a', stroke = '#3b82f6', text = '#bfdbfe';
          if (isCmp) { fill = '#1e3a8a'; stroke = '#60a5fa'; text = 'white'; }
          if (isHl) { fill = '#064e3b'; stroke = '#10b981'; text = '#a7f3d0'; }
          
          const isUnbalanced = n.bf > 1 || n.bf < -1;
          const bfColor = isUnbalanced ? '#ef4444' : '#64748b'; // red if unbalanced

          return (
            <g key={n.id} style={{ transition: 'all 0.4s ease' }}>
              <circle cx={n.x} cy={n.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth="2" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fill={text} fontSize="14" fontWeight="bold" fontFamily="monospace">
                {n.val}
              </text>
              {/* Balance Factor Label */}
              <text x={n.x} y={n.y - NODE_R - 5} textAnchor="middle" fill={bfColor} fontSize="11" fontWeight="bold" fontFamily="monospace">
                BF: {n.bf > 0 ? '+'+n.bf : n.bf}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OpPanel({ onInsert, onClear, running }) {
  const [val, setVal] = useState('');

  return (
    <div className="avl-op-panel">
      <div className="avl-tab-content">
        <div className="avl-tab-form">
          <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value to insert" disabled={running} />
          <button className="avl-btn" onClick={() => { if(val) { onInsert(+val); setVal(''); }}} disabled={running || !val}>
            Insert Node — O(log n)
          </button>
          <button className="avl-btn" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-dim)' }} onClick={() => onInsert(Math.floor(Math.random() * 100) + 1)} disabled={running}>
            Random Insert
          </button>
          <button className="avl-btn avl-btn-reset" onClick={onClear} disabled={running}>Clear Tree</button>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function AVLVisualizer() {
  const [root, setRoot] = useState(() => {
    let r = newNode(30);
    r.left = newNode(20);
    r.right = newNode(40);
    r.left.left = newNode(10);
    r.left.right = newNode(25);
    updateHeight(r.left); updateHeight(r);
    return r;
  });

  const [hlNode, setHlNode] = useState(null);
  const [cmpNode, setCmpNode] = useState(null);
  const [ops, setOps] = useState(['Initialized balanced AVL Tree']);
  const [running, setRunning] = useState(false);
  const [rotMsg, setRotMsg] = useState('');
  const [activeCode, setActiveCode] = useState('default');
  const [activeLine, setActiveLine] = useState(0);

  const addOp = useCallback(msg => setOps(p => [...p, msg]), []);

  // Deep copy tree helper
  const cloneTree = (node) => {
    if (!node) return null;
    const n = { ...node };
    n.left = cloneTree(node.left);
    n.right = cloneTree(node.right);
    return n;
  };

  const runInsert = async (val) => {
    setRunning(true);
    setActiveCode('insert');
    setActiveLine(1);
    setRotMsg('');
    let currentTree = cloneTree(root);
    
    const steps = []; // We will collect steps and run them

    const insertRec = (node, val) => {
      if (!node) {
        const n = newNode(val);
        steps.push({ tree: cloneTree(currentTree), hl: n.id, line: 2, msg: `Inserted ${val} as new leaf.` });
        return n;
      }

      steps.push({ tree: cloneTree(currentTree), cmp: node.id, line: 3, msg: `Comparing ${val} with ${node.val}...` });

      if (val < node.val) {
        steps.push({ tree: cloneTree(currentTree), cmp: node.id, line: 4, msg: `Going left...` });
        node.left = insertRec(node.left, val);
      } else if (val > node.val) {
        steps.push({ tree: cloneTree(currentTree), cmp: node.id, line: 6, msg: `Going right...` });
        node.right = insertRec(node.right, val);
      } else {
        steps.push({ tree: cloneTree(currentTree), hl: node.id, line: 7, msg: `${val} already exists.` });
        return node;
      }

      updateHeight(node);
      const balance = getBalance(node);
      
      // We push a step to show the updated balance factors propagating upwards
      steps.push({ tree: cloneTree(currentTree), hl: node.id, line: 9, msg: `Updating height/balance for ${node.val}. BF = ${balance}` });

      // Left Left Case
      if (balance > 1 && val < node.left.val) {
        steps.push({ tree: cloneTree(currentTree), hl: node.id, rot: 'LL Rotation (Right Rotate)', line: 11, msg: `Imbalance at ${node.val} (LL Case). Performing Right Rotation.` });
        return rightRotate(node);
      }

      // Right Right Case
      if (balance < -1 && val > node.right.val) {
        steps.push({ tree: cloneTree(currentTree), hl: node.id, rot: 'RR Rotation (Left Rotate)', line: 13, msg: `Imbalance at ${node.val} (RR Case). Performing Left Rotation.` });
        return leftRotate(node);
      }

      // Left Right Case
      if (balance > 1 && val > node.left.val) {
        steps.push({ tree: cloneTree(currentTree), hl: node.left.id, rot: 'LR Phase 1 (Left Rotate child)', line: 15, msg: `Imbalance at ${node.val} (LR Case). Step 1: Left Rotate child ${node.left.val}.` });
        node.left = leftRotate(node.left);
        steps.push({ tree: cloneTree(currentTree), hl: node.id, rot: 'LR Phase 2 (Right Rotate parent)', line: 16, msg: `LR Case Step 2: Right Rotate parent ${node.val}.` });
        return rightRotate(node);
      }

      // Right Left Case
      if (balance < -1 && val < node.right.val) {
        steps.push({ tree: cloneTree(currentTree), hl: node.right.id, rot: 'RL Phase 1 (Right Rotate child)', line: 19, msg: `Imbalance at ${node.val} (RL Case). Step 1: Right Rotate child ${node.right.val}.` });
        node.right = rightRotate(node.right);
        steps.push({ tree: cloneTree(currentTree), hl: node.id, rot: 'RL Phase 2 (Left Rotate parent)', line: 20, msg: `RL Case Step 2: Left Rotate parent ${node.val}.` });
        return leftRotate(node);
      }

      steps.push({ tree: cloneTree(currentTree), hl: node.id, line: 22, msg: `Node ${node.val} is balanced.` });
      return node;
    };

    if (!currentTree) {
      currentTree = newNode(val);
      steps.push({ tree: cloneTree(currentTree), hl: currentTree.id, line: 2, msg: `Inserted ${val} as root.` });
    } else {
      currentTree = insertRec(currentTree, val);
    }

    steps.push({ tree: cloneTree(currentTree), line: 23, msg: `Insertion of ${val} complete. Tree is balanced.` });

    // Run animation steps
    for (const step of steps) {
      if (step.line !== undefined) setActiveLine(step.line);
      setRoot(step.tree);
      setHlNode(step.hl || null);
      setCmpNode(step.cmp || null);
      if (step.msg) addOp(step.msg);
      if (step.rot) setRotMsg(step.rot);
      else setRotMsg('');
      
      // Delay longer for rotations so user can see them
      await new Promise(r => setTimeout(r, step.rot ? 1200 : 600));
    }

    setHlNode(null); setCmpNode(null); setRotMsg('');
    setRunning(false);
  };

  const handleClear = () => {
    setRoot(null);
    setOps(['Cleared AVL Tree']);
    setHlNode(null); setCmpNode(null); setRotMsg('');
    setActiveCode('default');
    setActiveLine(0);
  };

  return (
    <div className="avl-root">
      <div className="avl-header">
        <div>
          <h2 className="avl-title">⚖️ AVL Tree</h2>
          <p className="avl-desc">A self-balancing Binary Search Tree. Nodes track their Balance Factor (BF = Height Left - Height Right).</p>
        </div>
        <div className="avl-badges">
          <span className="avl-badge">O(log n) Guarantee</span>
          <span className="avl-badge">Strictly Balanced</span>
        </div>
      </div>

      <div className="avl-content">
        <div className="avl-visual">
          <div className="avl-visual-title">Tree Visualization</div>
          
          <TreeSVG root={root} hlNode={hlNode} cmpNode={cmpNode} />
          
          <div className="avl-log">
            <div className="avl-log-label">Operation Log</div>
            <div className="avl-log-items">
              {ops.slice(-4).map((op, idx) => <div key={idx} className="avl-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="avl-controls">
          <OpPanel onInsert={runInsert} onClear={handleClear} running={running} />
          
          {rotMsg && <div className="avl-rot-badge">{rotMsg}</div>}

          <div className="avl-legend">
            <div className="avl-legend-title">Balance Factor (BF) Rules</div>
            <div className="avl-legend-row">
              <span className="avl-legend-node" style={{ borderColor: '#64748b', background: 'transparent' }}></span>
              <b>BF = 0, 1, or -1:</b> Balanced.
            </div>
            <div className="avl-legend-row">
              <span className="avl-legend-node" style={{ borderColor: '#ef4444', background: 'transparent' }}></span>
              <b>BF &gt; 1 or &lt; -1:</b> Unbalanced! Requires rotation.
            </div>
          </div>
        </div>
      </div>
      
      <div className="avl-code-wrap" style={{ marginTop: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
        <Pseudocode code={AVL_PSEUDOCODES[activeCode]} activeLine={activeLine} />
      </div>
    </div>
  );
}
