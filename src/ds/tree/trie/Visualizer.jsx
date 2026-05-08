import React, { useState, useCallback } from 'react';
import './Visualizer.css';


// ===== TRIE NODE =====
function newTrieNode(char = '') {
  return { char, isEnd: false, children: {}, id: Math.random().toString(36).slice(2) };
}

// Helpers for layout
function getLeafCount(node) {
  if (!node) return 0;
  const keys = Object.keys(node.children);
  if (keys.length === 0) return 1;
  let sum = 0;
  for (const k of keys) sum += getLeafCount(node.children[k]);
  return sum;
}

// N-ary proportional layout
function layoutTrie(node, depth = 0, left = 0, right = 1, positions = {}) {
  if (!node) return positions;
  
  const mid = (left + right) / 2;
  positions[node.id] = { x: mid, y: depth };

  const keys = Object.keys(node.children).sort();
  if (keys.length > 0) {
    const totalLeaves = getLeafCount(node);
    let currentLeft = left;
    const width = right - left;
    
    for (const k of keys) {
      const child = node.children[k];
      const childLeaves = getLeafCount(child);
      const childRatio = childLeaves / totalLeaves;
      const childWidth = width * childRatio;
      
      layoutTrie(child, depth + 1, currentLeft, currentLeft + childWidth, positions);
      currentLeft += childWidth;
    }
  }
  return positions;
}

// ===== COMPONENTS =====

const NODE_R = 18;
const V_GAP = 60;
const H_GAP_BASE = 40;

function TrieSVG({ root, hlPath, hlNode, foundNode }) {
  if (!root || Object.keys(root.children).length === 0) {
    return <div className="trie-svg-empty">Trie is empty — insert a word to start</div>;
  }

  const getDepth = n => {
    if (!n) return 0;
    const keys = Object.keys(n.children);
    if (keys.length === 0) return 1;
    return 1 + Math.max(...keys.map(k => getDepth(n.children[k])));
  };

  const height = getDepth(root);
  const leafCount = getLeafCount(root);
  
  const positions = layoutTrie(root);
  
  const svgW = Math.max(300, H_GAP_BASE * leafCount + 40);
  const svgH = height * V_GAP + NODE_R * 2 + 20;

  const getXY = id => {
    const p = positions[id];
    return { x: p.x * svgW, y: p.y * V_GAP + NODE_R + 10 };
  };

  const edges = [];
  const nodes = [];

  const traverse = (node) => {
    const pos = getXY(node.id);
    nodes.push({ ...pos, id: node.id, char: node.char, isEnd: node.isEnd });
    
    for (const k in node.children) {
      const child = node.children[k];
      const cpos = getXY(child.id);
      
      // Determine if edge is active in highlight path
      const isPath = hlPath && hlPath.includes(node.id) && hlPath.includes(child.id);
      
      edges.push({ 
        id: `${node.id}-${child.id}`, 
        x1: pos.x, y1: pos.y, x2: cpos.x, y2: cpos.y,
        isPath 
      });
      traverse(child);
    }
  };
  traverse(root);

  return (
    <div className="trie-svg-scroll">
      <svg width={svgW} height={svgH} style={{ minWidth: svgW, display: 'block' }}>
        {edges.map(e => (
          <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
            stroke={e.isPath ? '#be185d' : '#334d7a'} 
            strokeWidth={e.isPath ? "4" : "2"} 
            strokeLinecap="round" 
            style={{ transition: 'all 0.3s' }}
          />
        ))}
        {nodes.map(n => {
          const isRoot = n.char === 'ROOT';
          const isHl = n.id === hlNode;
          const isPath = hlPath?.includes(n.id);
          const isFound = n.id === foundNode;
          
          let fill = '#1a3060', stroke = '#3b82f6', text = '#bfdbfe';
          
          if (isRoot) { fill = '#0f172a'; stroke = '#475569'; text = '#94a3b8'; }
          else if (isFound) { fill = '#0a2d15'; stroke = '#22c55e'; text = '#86efac'; }
          else if (isHl) { fill = '#4c0519'; stroke = '#be185d'; text = '#fbcfe8'; }
          else if (isPath) { fill = '#280b18'; stroke = '#9d174d'; text = '#fbcfe8'; }
          else if (n.isEnd) { stroke = '#eab308'; text = '#fef08a'; } // Word end style

          return (
            <g key={n.id} style={{ transition: 'all 0.3s ease' }}>
              <circle cx={n.x} cy={n.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={n.isEnd && !isRoot ? "3" : "2"} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill={text} fontSize={isRoot ? "10" : "14"} fontWeight="bold" fontFamily="monospace">
                {isRoot ? '*' : n.char}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OpPanel({ onInsert, onSearch, onPrefix, onClear, running }) {
  const [tab, setTab] = useState('insert');
  const [val, setVal] = useState('');

  return (
    <div className="trie-op-panel">
      <div className="trie-tabs">
        {['insert', 'search', 'prefix'].map(t => (
          <button key={t} className={`trie-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="trie-tab-content">
        {tab === 'insert' && (
          <div className="trie-tab-form">
            <input type="text" value={val} onChange={e => setVal(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder="word (a-z)" disabled={running} maxLength={10} />
            <button className="trie-btn" onClick={() => { if(val) { onInsert(val); setVal(''); }}} disabled={running || !val}>
              Insert Word — O(L)
            </button>
            <button className="trie-btn" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-dim)' }} onClick={() => onInsert(Math.random().toString(36).substring(2, 7).replace(/[^a-z]/g, '') || 'a')} disabled={running}>
              Random Word
            </button>
            <button className="trie-btn trie-btn-reset" onClick={onClear} disabled={running}>Clear Trie</button>
          </div>
        )}
        {tab === 'search' && (
          <div className="trie-tab-form">
            <input type="text" value={val} onChange={e => setVal(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder="word (a-z)" disabled={running} maxLength={10} />
            <button className="trie-btn" onClick={() => { if(val) { onSearch(val); setVal(''); }}} disabled={running || !val}>
              Search Word — O(L)
            </button>
          </div>
        )}
        {tab === 'prefix' && (
          <div className="trie-tab-form">
            <input type="text" value={val} onChange={e => setVal(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder="prefix (a-z)" disabled={running} maxLength={10} />
            <button className="trie-btn" onClick={() => { if(val) { onPrefix(val); setVal(''); }}} disabled={running || !val}>
              Search Prefix — O(L)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function TrieVisualizer() {
  const [root, setRoot] = useState(() => {
    const r = newTrieNode('ROOT');
    // Pre-populate
    const words = ['cat', 'car', 'cart', 'dog'];
    for (const w of words) {
      let curr = r;
      for (const char of w) {
        if (!curr.children[char]) curr.children[char] = newTrieNode(char);
        curr = curr.children[char];
      }
      curr.isEnd = true;
    }
    return r;
  });

  const [hlPath, setHlPath] = useState([]);
  const [hlNode, setHlNode] = useState(null);
  const [foundNode, setFoundNode] = useState(null);
  
  const [ops, setOps] = useState(['Initialized with: cat, car, cart, dog']);
  const [wordCount, setWordCount] = useState(4);
  const [running, setRunning] = useState(false);

  const addOp = useCallback(msg => setOps(p => [...p, msg]), []);

  const runAnimation = async (word, isInsert, isPrefixSearch) => {
    setRunning(true);
    setFoundNode(null);
    setHlPath([]); setHlNode(null);

    const r = { ...root }; // shallow copy for trigger
    let curr = r;
    const path = [curr.id];
    setHlPath([...path]);
    setHlNode(curr.id);
    await new Promise(res => setTimeout(res, 400));

    let createdNew = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!curr.children[char]) {
        if (isInsert) {
          curr.children[char] = newTrieNode(char);
          createdNew = true;
          addOp(`Added node '${char}'`);
        } else {
          addOp(`Character '${char}' not found. ${isPrefixSearch ? 'Prefix' : 'Word'} does not exist.`);
          setHlNode(null);
          setRunning(false);
          return;
        }
      }
      
      curr = curr.children[char];
      path.push(curr.id);
      
      setHlPath([...path]);
      setHlNode(curr.id);
      // Force re-render to show new node immediately during insert
      setRoot({ ...r }); 
      await new Promise(res => setTimeout(res, 400));
    }

    if (isInsert) {
      if (!curr.isEnd) {
        curr.isEnd = true;
        setWordCount(c => c + 1);
        addOp(`Marked '${word[word.length-1]}' as End of Word.`);
      } else {
        addOp(`Word '${word}' already exists.`);
      }
      setFoundNode(curr.id);
    } else if (isPrefixSearch) {
      addOp(`Prefix '${word}' found!`);
      setFoundNode(curr.id);
    } else {
      if (curr.isEnd) {
        addOp(`Word '${word}' found!`);
        setFoundNode(curr.id);
      } else {
        addOp(`Path exists, but '${word}' is not marked as End of Word.`);
      }
    }

    setRoot({ ...r });
    setTimeout(() => {
      setHlPath([]); setHlNode(null); setRunning(false);
    }, 1500);
  };

  const handleInsert = (word) => runAnimation(word, true, false);
  const handleSearch = (word) => runAnimation(word, false, false);
  const handlePrefix = (word) => runAnimation(word, false, true);
  
  const handleClear = () => {
    setRoot(newTrieNode('ROOT'));
    setWordCount(0);
    setOps(['Cleared Trie']);
    setHlPath([]); setHlNode(null); setFoundNode(null);
  };

  return (
    <div className="trie-root">
      <div className="trie-header">
        <div>
          <h2 className="trie-title">🔤 Trie (Prefix Tree)</h2>
          <p className="trie-desc">A tree for strings. Each node represents one character. Paths down the tree form words.</p>
        </div>
        <div className="trie-badges">
          <span className="trie-badge">O(L) Operations</span>
          <span className="trie-badge">Fast Autocomplete</span>
        </div>
      </div>

      <div className="trie-content">
        <div className="trie-visual">
          <div className="trie-visual-title">Trie Visualization</div>
          <TrieSVG root={root} hlPath={hlPath} hlNode={hlNode} foundNode={foundNode} />
          
          <div className="trie-log">
            <div className="trie-log-label">Operation Log</div>
            <div className="trie-log-items">
              {ops.slice(-5).map((op, idx) => <div key={idx} className="trie-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="trie-controls">
          <OpPanel 
            onInsert={handleInsert} onSearch={handleSearch} onPrefix={handlePrefix} onClear={handleClear}
            running={running} 
          />
          
          <div className="trie-state-panel">
            <div className="trie-state-row">
              <span className="trie-state-label">Words Stored</span>
              <span className="trie-state-val" style={{ color: 'var(--pink-light)' }}>{wordCount}</span>
            </div>
          </div>

          <div className="trie-legend">
            <div className="trie-legend-title">Node Legend</div>
            <div className="trie-legend-row">
              <span className="trie-legend-node" style={{ borderColor: '#3b82f6', background: '#1a3060' }}></span>
              Normal Character Node
            </div>
            <div className="trie-legend-row">
              <span className="trie-legend-node" style={{ borderColor: '#eab308', borderWidth: '3px', background: '#1a3060' }}></span>
              End of Word Node (Valid Word)
            </div>
            <div className="trie-legend-row">
              <span className="trie-legend-node" style={{ borderColor: '#be185d', background: '#4c0519' }}></span>
              Active Search/Insert Node
            </div>
          </div>
        </div>
      </div>
      
       
    </div>
  );
}





