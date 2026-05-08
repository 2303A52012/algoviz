import React, { useState, useCallback } from 'react';
import Pseudocode from '../../components/Pseudocode';
import './Visualizer.css';

const HASHMAP_PSEUDOCODES = {
  put: [
    "function put(key, value) {",
    "  index = hash(key) % capacity",
    "  chain = table[index]",
    "  for node in chain {",
    "    if node.key == key {",
    "      node.value = value",
    "      return",
    "    }",
    "  }",
    "  chain.push({key, value})",
    "}"
  ],
  get: [
    "function get(key) {",
    "  index = hash(key) % capacity",
    "  chain = table[index]",
    "  for node in chain {",
    "    if node.key == key {",
    "      return node.value",
    "    }",
    "  }",
    "  return null",
    "}"
  ],
  remove: [
    "function remove(key) {",
    "  index = hash(key) % capacity",
    "  chain = table[index]",
    "  for i = 0 to chain.length - 1 {",
    "    if chain[i].key == key {",
    "      chain.removeAt(i)",
    "      return",
    "    }",
    "  }",
    "}"
  ],
  default: [
    "// Select an operation to see pseudocode"
  ]
};

// ===== CONSTANTS & HELPERS =====
const TABLE_SIZE = 7; // Small prime number for visualization

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i)) % TABLE_SIZE;
  }
  return hash;
}

// ===== COMPONENTS =====

function HashAnimationBanner({ hashCalc }) {
  if (!hashCalc) return <div className="hash-calc-banner">Enter a key to see hash calculation</div>;
  
  return (
    <div className={`hash-calc-banner ${hashCalc.active ? 'active' : ''}`}>
      <span className="hash-calc-func">hash("{hashCalc.key}") % {TABLE_SIZE}</span>
      <span>=</span>
      <span className="hash-calc-result">{hashCalc.index}</span>
    </div>
  );
}

function HashTable({ table, hlBucket, hlNodeKey, cmpNodeKey, foundNodeKey }) {
  return (
    <div className="hash-table-scroll">
      <div className="hash-buckets">
        {table.map((chain, idx) => (
          <div key={idx} className={`hash-bucket-row ${hlBucket === idx ? 'highlight' : ''}`}>
            <div className="hash-bucket-idx">{idx}</div>
            
            <div className="hash-chain">
              {chain.length === 0 ? (
                <span className="hash-empty-chain">null</span>
              ) : (
                chain.map((node, i) => {
                  let cls = 'hash-node';
                  if (node.k === foundNodeKey) cls += ' found';
                  else if (node.k === hlNodeKey) cls += ' highlight';
                  else if (node.k === cmpNodeKey) cls += ' compare';

                  return (
                    <React.Fragment key={node.k}>
                      <div className="hash-node-wrap">
                        <div className={cls}>
                          <div className="hash-node-key">{node.k}</div>
                          <div className="hash-node-val">{node.v}</div>
                        </div>
                      </div>
                      {i < chain.length - 1 && <span className="hash-arrow">→</span>}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpPanel({ onPut, onGet, onRemove, onClear, running }) {
  const [tab, setTab] = useState('put');
  const [k, setK] = useState('');
  const [v, setV] = useState('');

  return (
    <div className="hash-op-panel">
      <div className="hash-tabs">
        {['put', 'get', 'remove'].map(t => (
          <button key={t} className={`hash-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} disabled={running}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="hash-tab-content">
        {tab === 'put' && (
          <div className="hash-tab-form">
            <input type="text" value={k} onChange={e => setK(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder="Key (e.g. apple)" disabled={running} maxLength={8} />
            <input type="text" value={v} onChange={e => setV(e.target.value)} placeholder="Value (e.g. 100)" disabled={running} maxLength={10} />
            <button className="hash-btn" onClick={() => { if(k && v) { onPut(k, v); setK(''); setV(''); }}} disabled={running || !k || !v}>
              Put(key, val)
            </button>
            <button className="hash-btn" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-dim)' }} onClick={() => onPut(Math.random().toString(36).substring(2, 6).replace(/[^a-z]/g, '') || 'x', Math.floor(Math.random() * 1000).toString())} disabled={running}>
              Random Put
            </button>
            <button className="hash-btn hash-btn-reset" onClick={onClear} disabled={running}>Clear Map</button>
          </div>
        )}
        {tab === 'get' && (
          <div className="hash-tab-form">
            <input type="text" value={k} onChange={e => setK(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder="Key to search" disabled={running} maxLength={8} />
            <button className="hash-btn" onClick={() => { if(k) { onGet(k); setK(''); }}} disabled={running || !k}>
              Get(key)
            </button>
          </div>
        )}
        {tab === 'remove' && (
          <div className="hash-tab-form">
            <input type="text" value={k} onChange={e => setK(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder="Key to remove" disabled={running} maxLength={8} />
            <button className="hash-btn hash-btn-danger" onClick={() => { if(k) { onRemove(k); setK(''); }}} disabled={running || !k}>
              Remove(key)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MAIN VISUALIZER =====
export default function HashMapVisualizer() {
  const [table, setTable] = useState(() => {
    const t = Array.from({ length: TABLE_SIZE }, () => []);
    // Initial data
    const initData = [['cat', '10'], ['dog', '20'], ['bat', '30'], ['rat', '40']];
    for (const [k, v] of initData) {
      t[simpleHash(k)].push({ k, v });
    }
    return t;
  });

  const [hashCalc, setHashCalc] = useState(null);
  const [hlBucket, setHlBucket] = useState(null);
  const [hlNodeKey, setHlNodeKey] = useState(null);
  const [cmpNodeKey, setCmpNodeKey] = useState(null);
  const [foundNodeKey, setFoundNodeKey] = useState(null);
  
  const [ops, setOps] = useState(['Initialized Hash Map']);
  const [itemCount, setItemCount] = useState(4);
  const [running, setRunning] = useState(false);
  const [activeCode, setActiveCode] = useState('default');
  const [activeLine, setActiveLine] = useState(0);

  const addOp = useCallback(msg => setOps(p => [...p, msg]), []);

  const runAnimation = async (action, key, val = null) => {
    setRunning(true);
    setActiveCode(action);
    setActiveLine(1);
    setFoundNodeKey(null); setHlNodeKey(null); setCmpNodeKey(null); setHlBucket(null);
    
    // 1. Calculate Hash
    const index = simpleHash(key);
    setHashCalc({ key, index, active: true });
    addOp(`Calculated hash("${key}") % ${TABLE_SIZE} = ${index}`);
    await new Promise(r => setTimeout(r, 800));
    setHashCalc({ key, index, active: false });

    // 2. Highlight Bucket
    setActiveLine(2);
    setHlBucket(index);
    const chain = [...table[index]]; // copy chain
    addOp(`Jumped to bucket [${index}] in O(1) time.`);
    await new Promise(r => setTimeout(r, 800));

    // 3. Traverse Chain
    let foundIdx = -1;
    for (let i = 0; i < chain.length; i++) {
      setActiveLine(3);
      setCmpNodeKey(chain[i].k);
      addOp(`Comparing with key '${chain[i].k}'...`);
      await new Promise(r => setTimeout(r, 600));
      
      setActiveLine(4);
      if (chain[i].k === key) {
        foundIdx = i;
        setFoundNodeKey(key);
        setCmpNodeKey(null);
        addOp(`Key '${key}' found!`);
        await new Promise(r => setTimeout(r, 600));
        break;
      }
    }

    // 4. Perform Action
    const newTable = table.map(r => [...r]);
    
    if (action === 'put') {
      if (foundIdx !== -1) {
        setActiveLine(5);
        newTable[index][foundIdx].v = val;
        addOp(`Updated value for '${key}' to '${val}'.`);
      } else {
        setActiveLine(9);
        newTable[index].push({ k: key, v: val });
        setItemCount(c => c + 1);
        setHlNodeKey(key);
        addOp(`Inserted new key-value pair [${key}: ${val}].`);
      }
    } else if (action === 'get') {
      if (foundIdx === -1) {
        setActiveLine(8);
        setCmpNodeKey(null);
        addOp(`Key '${key}' not found in map.`);
      } else {
        setActiveLine(5);
      }
    } else if (action === 'remove') {
      if (foundIdx !== -1) {
        setActiveLine(5);
        newTable[index].splice(foundIdx, 1);
        setItemCount(c => c - 1);
        setFoundNodeKey(null);
        addOp(`Removed key '${key}' from map.`);
      } else {
        setCmpNodeKey(null);
        addOp(`Key '${key}' not found. Cannot remove.`);
      }
    }

    setTable(newTable);
    
    setTimeout(() => {
      setHlBucket(null); setFoundNodeKey(null); setHlNodeKey(null); setCmpNodeKey(null);
      setRunning(false);
    }, 1000);
  };

  const handlePut = (k, v) => runAnimation('put', k, v);
  const handleGet = (k) => runAnimation('get', k);
  const handleRemove = (k) => runAnimation('remove', k);
  
  const handleClear = () => {
    setTable(Array.from({ length: TABLE_SIZE }, () => []));
    setItemCount(0);
    setOps(['Cleared Hash Map']);
    setHashCalc(null); setHlBucket(null); setFoundNodeKey(null); setHlNodeKey(null); setCmpNodeKey(null);
    setActiveCode('default');
    setActiveLine(0);
  };

  const loadFactor = (itemCount / TABLE_SIZE).toFixed(2);

  return (
    <div className="hash-root">
      <div className="hash-header">
        <div>
          <h2 className="hash-title">🗄️ Hash Map (Separate Chaining)</h2>
          <p className="hash-desc">Maps keys to array indices using a hash function. Collisions are handled by storing a Linked List at each bucket.</p>
        </div>
        <div className="hash-badges">
          <span className="hash-badge">O(1) Average</span>
          <span className="hash-badge">Load Factor: {loadFactor}</span>
        </div>
      </div>

      <div className="hash-content">
        <div className="hash-visual">
          <div className="hash-visual-title">Array of Buckets</div>
          
          <HashAnimationBanner hashCalc={hashCalc} />
          
          <HashTable 
            table={table} hlBucket={hlBucket} 
            hlNodeKey={hlNodeKey} cmpNodeKey={cmpNodeKey} foundNodeKey={foundNodeKey} 
          />
          
          <div className="hash-log">
            <div className="hash-log-label">Operation Log</div>
            <div className="hash-log-items">
              {ops.slice(-4).map((op, idx) => <div key={idx} className="hash-log-item">{op}</div>)}
            </div>
          </div>
        </div>

        <div className="hash-controls">
          <OpPanel 
            onPut={handlePut} onGet={handleGet} onRemove={handleRemove} onClear={handleClear}
            running={running} 
          />
          
          <div className="hash-state-panel">
            <div className="hash-state-row">
              <span className="hash-state-label">Table Size (Buckets)</span>
              <span className="hash-state-val">{TABLE_SIZE}</span>
            </div>
            <div className="hash-state-row">
              <span className="hash-state-label">Total Items</span>
              <span className="hash-state-val" style={{ color: 'var(--teal-light)' }}>{itemCount}</span>
            </div>
            <div className="hash-state-row">
              <span className="hash-state-label">Load Factor (Items/Size)</span>
              <span className="hash-state-val" style={{ color: loadFactor > 0.75 ? 'var(--red-light)' : 'var(--green-light)' }}>
                {loadFactor}
              </span>
            </div>
            <p style={{fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4}}>
              *If Load Factor &gt; 0.75, a real hash map would double its size and rehash all items.
            </p>
          </div>
        </div>
      </div>
      
      <div className="hash-code-wrap" style={{ marginTop: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
        <Pseudocode code={HASHMAP_PSEUDOCODES[activeCode]} activeLine={activeLine} />
      </div>
    </div>
  );
}
