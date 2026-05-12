import React, { useState, useEffect } from 'react';
import { GRAPH_PRESETS, getRandomPreset } from '../graphPresets';
import { DEFAULT_PRESET, generateSteps } from './steps';
import GraphBuilder from '../GraphBuilder';
import './Visualizer.css';

/* ─── Weighted Graph Canvas ──────────────────── */
function GraphCanvas({ nodes, edges, visitedSet, inQueue, path, current, activeEdge, dist }) {
  const pathSet  = new Set(path);
  const edgeKey  = (a, b) => [a, b].sort().join('-');
  const activeKey = activeEdge ? edgeKey(...activeEdge) : null;
  const pathEdges = new Set();
  for (let i = 0; i < path.length - 1; i++) pathEdges.add(edgeKey(path[i], path[i+1]));
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const getState = (id) => {
    if (id === current)     return 'current';
    if (pathSet.has(id))    return 'path';
    if (visitedSet.has(id)) return 'settled';
    if (inQueue.has(id))    return 'inqueue';
    return 'unvisited';
  };
  const colors  = { current:'#f59e0b', path:'#10b981', settled:'#1e3a8a', inqueue:'#7c2d9e', unvisited:'#1e293b' };
  const strokes = { current:'#fbbf24', path:'#34d399', settled:'#3b82f6', inqueue:'#c084fc', unvisited:'#334155' };

  const xs = nodes.map(n => n.x); const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs,0)-60; const maxX = Math.max(...xs,100)+60;
  const minY = Math.min(...ys,0)-50; const maxY = Math.max(...ys,100)+60;
  const vb = nodes.length ? `${minX} ${minY} ${maxX-minX} ${maxY-minY}` : '0 0 840 260';

  return (
    <svg className="dijk-graph-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="dijk-glow"><feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Edges with weight labels */}
      {edges.map(([a, b, w = 1]) => {
        const na=nodeMap[a]; const nb=nodeMap[b]; if(!na||!nb) return null;
        const ek=edgeKey(a,b); const ip=pathEdges.has(ek); const ia=ek===activeKey;
        const mx=(na.x+nb.x)/2; const my=(na.y+nb.y)/2;
        return (
          <g key={ek}>
            <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={ip?'#10b981':ia?'#f59e0b':'#334155'}
              strokeWidth={ip?3.5:ia?2.5:1.5} strokeOpacity={ip||ia?1:0.45}/>
            <rect x={mx-10} y={my-9} width={20} height={16} rx={4} fill="#0f172a" opacity={0.85}/>
            <text x={mx} y={my+3} textAnchor="middle" fontSize={10} fontWeight="700"
              fill={ip?'#34d399':ia?'#fbbf24':'#64748b'} pointerEvents="none">{w}</text>
          </g>
        );
      })}
      {/* Nodes */}
      {nodes.map(n => {
        const st=getState(n.id); const hasGlow=st!=='unvisited';
        const d=dist[n.id];
        return (
          <g key={n.id}>
            {hasGlow && <circle cx={n.x} cy={n.y} r={25} fill={colors[st]} opacity={0.15}/>}
            <circle cx={n.x} cy={n.y} r={20} fill={colors[st]} stroke={strokes[st]} strokeWidth={2}
              filter={hasGlow?'url(#dijk-glow)':undefined}/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight="800"
              fill={st==='unvisited'?'#94a3b8':'#fff'} pointerEvents="none">{n.id}</text>
            {/* Distance label above node */}
            {d !== undefined && d !== Infinity && (
              <text x={n.x} y={n.y-27} textAnchor="middle" fontSize={10} fontWeight="700"
                fill={st==='path'?'#34d399':'#67e8f9'} pointerEvents="none"
                style={{background:'#0f172a'}}>d={d}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Priority Queue Panel ───────────────────── */
function PQPanel({ pq, nodes }) {
  const sorted = [...pq].sort((a,b) => a.d - b.d).slice(0, 10);
  return (
    <div className="dijk-pq-panel">
      <div className="dijk-panel-header">
        <span className="dijk-panel-icon">⚡</span>
        <span className="dijk-panel-title">Priority Queue (Min-Heap)</span>
        <span className="dijk-panel-badge">{pq.length}</span>
        <span className="dijk-panel-hint">Sorted by distance — smallest first</span>
      </div>
      <div className="dijk-pq-track">
        {sorted.length === 0 ? <span className="dijk-ds-empty">empty</span> :
          sorted.map((item, i) => (
            <div key={`${item.id}-${i}`} className={`dijk-pq-cell ${i===0?'dijk-pq-min':''}`}>
              {i===0 && <span className="dijk-min-tag">min</span>}
              <span className="dijk-pq-node">{item.id}</span>
              <span className="dijk-pq-dist">d={item.d}</span>
            </div>
          ))}
        {pq.length > 10 && <span className="dijk-pq-more">+{pq.length-10} more</span>}
      </div>
    </div>
  );
}

/* ─── Distance Table ─────────────────────────── */
function DistTable({ dist, nodes, visitedSet, current }) {
  return (
    <div className="dijk-dist-panel">
      <div className="dijk-panel-header">
        <span className="dijk-panel-icon">📊</span>
        <span className="dijk-panel-title">Distance Table</span>
        <span className="dijk-panel-hint">Shortest known dist from start</span>
      </div>
      <div className="dijk-dist-track">
        {nodes.map(n => {
          const d = dist[n.id];
          const settled = visitedSet.has(n.id);
          const isCur = n.id === current;
          return (
            <div key={n.id} className={`dijk-dist-cell ${settled?'dijk-dist-settled':''} ${isCur?'dijk-dist-current':''}`}>
              <span className="dijk-dist-node">{n.id}</span>
              <span className="dijk-dist-val">{d===Infinity?'∞':d}</span>
              {settled && <span className="dijk-dist-lock">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Visualizer ────────────────────────── */
export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const [preset,     setPreset]     = useState(DEFAULT_PRESET);
  const [graphNodes, setGraphNodes] = useState(DEFAULT_PRESET.nodes);
  const [graphEdges, setGraphEdges] = useState(DEFAULT_PRESET.edges);
  const [startNode,  setStartNode]  = useState(DEFAULT_PRESET.start);
  const [endNode,    setEndNode]    = useState(DEFAULT_PRESET.end);
  const [mode,       setMode]       = useState('view');
  const [customView, setCustomView] = useState('build');
  const [vizState,   setVizState]   = useState({
    visitedSet: new Set(), inQueue: new Set(), pq: [], dist: {},
    path: [], current: null, activeEdge: null, done: false, found: false, msg: '',
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({ visitedSet: new Set(), inQueue: new Set(), pq: [], dist: {},
        path: [], current: null, activeEdge: null, done: false, found: false, msg: '' });
      return;
    }
    setVizState({
      visitedSet: currentStep.visitedSet || new Set(),
      inQueue:    currentStep.inQueue    || new Set(),
      pq:         currentStep.pq         || [],
      dist:       currentStep.dist       || {},
      path:       currentStep.path       || [],
      current:    currentStep.current    || null,
      activeEdge: currentStep.activeEdge || null,
      done:       currentStep.done       || false,
      found:      currentStep.type === 'found',
      msg:        currentStep.msg        || '',
    });
  }, [currentStep]);

  const applyPreset = (p) => {
    setPreset(p); setGraphNodes(p.nodes); setGraphEdges(p.edges);
    setStartNode(p.start); setEndNode(p.end); handleReset();
  };
  const handleRandom = () => {
    let p; do { p = getRandomPreset(); } while (p.name === preset?.name && GRAPH_PRESETS.length > 1);
    applyPreset(p);
  };
  const handleCustomChange = ({ nodes, edges, startNode: s, endNode: e }) => {
    setGraphNodes(nodes); setGraphEdges(edges); setStartNode(s); setEndNode(e); handleReset();
  };
  const handleRun = () => {
    if (!startNode || !endNode) return alert('Set both Start and End nodes!');
    if (graphNodes.length < 2)  return alert('Add at least 2 nodes!');
    if (mode === 'custom') setCustomView('run');
    onRunSteps(generateSteps(graphNodes, graphEdges, startNode, endNode));
  };
  const handleReset = () => {
    onReset();
    setVizState({ visitedSet: new Set(), inQueue: new Set(), pq: [], dist: {},
      path: [], current: null, activeEdge: null, done: false, found: false, msg: '' });
  };
  const handleBackToEdit = () => { handleReset(); setCustomView('build'); };

  const showPanels = vizState.pq.length > 0 || vizState.visitedSet.size > 0 || vizState.done;

  return (
    <div className="dijk-root">
      {/* Top bar */}
      <div className="dijk-topbar">
        <div className="dijk-topbar-left">
          <button className="dijk-btn dijk-btn-run" onClick={handleRun}
            disabled={isRunning || isPaused || (mode==='custom' && customView==='build')}>▶ Run Dijkstra</button>
          <button className="dijk-btn dijk-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <button className="dijk-btn dijk-btn-random" onClick={handleRandom} disabled={isRunning}>🎲 Random Graph</button>
          <button className={`dijk-btn ${mode==='custom'?'dijk-btn-custom-active':'dijk-btn-custom'}`}
            onClick={() => { setMode(m=>m==='custom'?'view':'custom'); setCustomView('build'); handleReset(); }}
            disabled={isRunning}>
            {mode==='custom'?'✓ Custom Mode':'✏ Custom Graph'}
          </button>
        </div>
        <div className="dijk-topbar-info">
          <span className="dijk-info-chip">Start: <b>{startNode||'—'}</b></span>
          <span className="dijk-info-chip">End: <b>{endNode||'—'}</b></span>
          <span className="dijk-info-chip">Nodes: <b>{graphNodes.length}</b></span>
          <span className="dijk-info-chip">Edges: <b>{graphEdges.length}</b></span>
        </div>
      </div>

      {/* Preset pills */}
      {mode !== 'custom' && (
        <div className="dijk-presets">
          {GRAPH_PRESETS.map(p => (
            <button key={p.name} className={`dijk-preset-pill ${preset?.name===p.name?'dijk-preset-active':''}`}
              onClick={() => applyPreset(p)} disabled={isRunning}>{p.name}</button>
          ))}
        </div>
      )}

      {/* Status */}
      {vizState.msg && (
        <div className={`dijk-msg ${vizState.found?'dijk-msg-found':vizState.done?'dijk-msg-notfound':''}`}>{vizState.msg}</div>
      )}

      {/* Custom build toolbar */}
      {mode === 'custom' && customView === 'build' && (
        <div className="dijk-custom-bar">
          <span className="dijk-custom-hint">Build your weighted graph, then run Dijkstra:</span>
          <button className="dijk-btn dijk-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||!startNode||!endNode||graphNodes.length<2}>▶ Run Dijkstra</button>
          <button className="dijk-btn dijk-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      )}

      {/* Custom run toolbar */}
      {mode === 'custom' && customView === 'run' && (
        <div className="dijk-custom-bar">
          <button className="dijk-btn dijk-btn-edit" onClick={handleBackToEdit} disabled={isRunning}>✏ Edit Graph</button>
          <button className="dijk-btn dijk-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||!startNode||!endNode}>▶ Re-run</button>
          <button className="dijk-btn dijk-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <span className="dijk-custom-hint">Change Start/End and re-run</span>
        </div>
      )}

      {/* Canvas */}
      {mode === 'custom' && customView === 'build' ? (
        <GraphBuilder nodes={graphNodes} edges={graphEdges} startNode={startNode} endNode={endNode}
          onChange={handleCustomChange} disabled={isRunning} weighted />
      ) : (
        <div className="dijk-canvas-wrap">
          <GraphCanvas nodes={graphNodes} edges={graphEdges}
            visitedSet={vizState.visitedSet} inQueue={vizState.inQueue}
            path={vizState.path} current={vizState.current} activeEdge={vizState.activeEdge}
            dist={vizState.dist}/>
        </div>
      )}

      {/* Panels */}
      {showPanels && (
        <>
          <PQPanel pq={vizState.pq} nodes={graphNodes}/>
          <DistTable dist={vizState.dist} nodes={graphNodes} visitedSet={vizState.visitedSet} current={vizState.current}/>
        </>
      )}
      {!showPanels && (
        <>
          <PQPanel pq={[]} nodes={graphNodes}/>
          <DistTable dist={Object.fromEntries(graphNodes.map(n=>[n.id,Infinity]))} nodes={graphNodes} visitedSet={new Set()} current={null}/>
        </>
      )}

      {/* Legend */}
      <div className="dijk-legend">
        {[{cls:'dijk-leg-start',label:'Start'},{cls:'dijk-leg-end',label:'End'},
          {cls:'dijk-leg-current',label:'Current (min)'},{cls:'dijk-leg-inqueue',label:'In PQ'},
          {cls:'dijk-leg-settled',label:'Settled'},{cls:'dijk-leg-path',label:'Optimal path'}
        ].map(({cls,label}) => (
          <span key={label} className="dijk-legend-item">
            <span className={`dijk-legend-dot ${cls}`}/>{label}
          </span>
        ))}
      </div>
    </div>
  );
}
