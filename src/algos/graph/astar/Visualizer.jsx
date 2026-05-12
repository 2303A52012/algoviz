import React, { useState, useEffect } from 'react';
import { GRAPH_PRESETS, getRandomPreset } from '../graphPresets';
import { DEFAULT_PRESET, generateSteps } from './steps';
import GraphBuilder from '../GraphBuilder';
import './Visualizer.css';

/* ─── A* Graph Canvas ────────────────────────── */
function GraphCanvas({ nodes, edges, closedSet, inOpen, path, current, activeEdge, gScore, fScore }) {
  const pathSet  = new Set(path);
  const edgeKey  = (a, b) => [a, b].sort().join('-');
  const activeKey = activeEdge ? edgeKey(...activeEdge) : null;
  const pathEdges = new Set();
  for (let i = 0; i < path.length - 1; i++) pathEdges.add(edgeKey(path[i], path[i+1]));
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const getState = (id) => {
    if (id === current)    return 'current';
    if (pathSet.has(id))   return 'path';
    if (closedSet.has(id)) return 'closed';
    if (inOpen.has(id))    return 'open';
    return 'unvisited';
  };
  const colors  = { current:'#f59e0b', path:'#10b981', closed:'#312e81', open:'#6d28d9', unvisited:'#1e293b' };
  const strokes = { current:'#fbbf24', path:'#34d399', closed:'#818cf8', open:'#a78bfa', unvisited:'#334155' };

  const xs = nodes.map(n => n.x); const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs,0)-60; const maxX = Math.max(...xs,100)+60;
  const minY = Math.min(...ys,0)-60; const maxY = Math.max(...ys,100)+70;
  const vb = nodes.length ? `${minX} ${minY} ${maxX-minX} ${maxY-minY}` : '0 0 840 270';

  return (
    <svg className="astar-graph-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="astar-glow"><feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Weighted edges */}
      {edges.map(([a, b, w = 1]) => {
        const na=nodeMap[a]; const nb=nodeMap[b]; if(!na||!nb) return null;
        const ek=edgeKey(a,b); const ip=pathEdges.has(ek); const ia=ek===activeKey;
        const mx=(na.x+nb.x)/2; const my=(na.y+nb.y)/2;
        return (
          <g key={ek}>
            <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={ip?'#10b981':ia?'#f59e0b':'#334155'}
              strokeWidth={ip?3.5:ia?2.5:1.5} strokeOpacity={ip||ia?1:0.4}/>
            <rect x={mx-10} y={my-9} width={20} height={16} rx={4} fill="#0f172a" opacity={0.85}/>
            <text x={mx} y={my+3} textAnchor="middle" fontSize={10} fontWeight="700"
              fill={ip?'#34d399':ia?'#fbbf24':'#64748b'} pointerEvents="none">{w}</text>
          </g>
        );
      })}
      {/* Nodes with f-score label */}
      {nodes.map(n => {
        const st=getState(n.id); const hasGlow=st!=='unvisited';
        const f=fScore[n.id]; const g=gScore[n.id];
        return (
          <g key={n.id}>
            {hasGlow && <circle cx={n.x} cy={n.y} r={25} fill={colors[st]} opacity={0.18}/>}
            <circle cx={n.x} cy={n.y} r={20} fill={colors[st]} stroke={strokes[st]} strokeWidth={2}
              filter={hasGlow?'url(#astar-glow)':undefined}/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight="800"
              fill={st==='unvisited'?'#94a3b8':'#fff'} pointerEvents="none">{n.id}</text>
            {/* f-score above node */}
            {f !== undefined && f !== Infinity && (
              <text x={n.x} y={n.y-28} textAnchor="middle" fontSize={9} fontWeight="700"
                fill={st==='path'?'#34d399':'#a78bfa'} pointerEvents="none">f={f}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Score Table Panel ──────────────────────── */
function ScoreTable({ nodes, gScore, hScore, fScore, closedSet, inOpen, current }) {
  return (
    <div className="astar-score-panel">
      <div className="astar-panel-header">
        <span className="astar-panel-icon">📐</span>
        <span className="astar-panel-title">Score Table (f = g + h)</span>
        <span className="astar-panel-hint">g=actual cost · h=heuristic · f=total estimate</span>
      </div>
      <div className="astar-score-table-wrap">
        <table className="astar-score-table">
          <thead>
            <tr>
              <th>Node</th><th>g</th><th>h</th><th>f</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => {
              const g=gScore[n.id]; const h=hScore[n.id]; const f=fScore[n.id];
              const isClosed=closedSet.has(n.id); const isOpen=inOpen.has(n.id); const isCur=n.id===current;
              return (
                <tr key={n.id} className={`${isCur?'astar-row-cur':''} ${isClosed?'astar-row-closed':''} ${isOpen&&!isClosed?'astar-row-open':''}`}>
                  <td className="astar-td-node">{n.id}</td>
                  <td>{g===Infinity?'∞':g??'—'}</td>
                  <td className="astar-td-h">{h??'—'}</td>
                  <td className="astar-td-f">{f===Infinity?'∞':f??'—'}</td>
                  <td className="astar-td-status">
                    {isCur ? <span className="astar-badge astar-badge-cur">current</span>
                     : isClosed ? <span className="astar-badge astar-badge-closed">closed</span>
                     : isOpen   ? <span className="astar-badge astar-badge-open">open</span>
                     : <span className="astar-badge">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Open Set Panel ─────────────────────────── */
function OpenSetPanel({ openSet }) {
  const sorted = [...openSet].sort((a,b) => a.f - b.f).slice(0, 8);
  return (
    <div className="astar-open-panel">
      <div className="astar-panel-header">
        <span className="astar-panel-icon">🔮</span>
        <span className="astar-panel-title">Open Set</span>
        <span className="astar-panel-badge">{openSet.length}</span>
        <span className="astar-panel-hint">Priority by f-score</span>
      </div>
      <div className="astar-open-track">
        {sorted.length === 0 ? <span className="astar-ds-empty">empty</span> :
          sorted.map((item, i) => (
            <div key={`${item.id}-${i}`} className={`astar-open-cell ${i===0?'astar-open-best':''}`}>
              {i===0 && <span className="astar-best-tag">best</span>}
              <span className="astar-open-node">{item.id}</span>
              <span className="astar-open-scores">f={item.f}</span>
            </div>
          ))}
        {openSet.length > 8 && <span className="astar-open-more">+{openSet.length-8} more</span>}
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
    closedSet: new Set(), inOpen: new Set(), openSet: [],
    gScore: {}, hScore: {}, fScore: {},
    path: [], current: null, activeEdge: null, done: false, found: false, msg: '',
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({ closedSet:new Set(), inOpen:new Set(), openSet:[], gScore:{}, hScore:{}, fScore:{},
        path:[], current:null, activeEdge:null, done:false, found:false, msg:'' });
      return;
    }
    setVizState({
      closedSet:  currentStep.closedSet  || new Set(),
      inOpen:     currentStep.inOpen     || new Set(),
      openSet:    currentStep.openSet    || [],
      gScore:     currentStep.gScore     || {},
      hScore:     currentStep.hScore     || {},
      fScore:     currentStep.fScore     || {},
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
    if (graphNodes.length < 2) return alert('Add at least 2 nodes!');
    if (mode === 'custom') setCustomView('run');
    onRunSteps(generateSteps(graphNodes, graphEdges, startNode, endNode));
  };
  const handleReset = () => {
    onReset();
    setVizState({ closedSet:new Set(), inOpen:new Set(), openSet:[], gScore:{}, hScore:{}, fScore:{},
      path:[], current:null, activeEdge:null, done:false, found:false, msg:'' });
  };
  const handleBackToEdit = () => { handleReset(); setCustomView('build'); };

  const showPanels = vizState.openSet.length > 0 || vizState.closedSet.size > 0 || vizState.done;
  const emptyDist = Object.fromEntries(graphNodes.map(n => [n.id, Infinity]));
  const hInit = vizState.hScore && Object.keys(vizState.hScore).length > 0
    ? vizState.hScore : Object.fromEntries(graphNodes.map(n => [n.id, '?']));

  return (
    <div className="astar-root">
      <div className="astar-topbar">
        <div className="astar-topbar-left">
          <button className="astar-btn astar-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||(mode==='custom'&&customView==='build')}>▶ Run A*</button>
          <button className="astar-btn astar-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <button className="astar-btn astar-btn-random" onClick={handleRandom} disabled={isRunning}>🎲 Random Graph</button>
          <button className={`astar-btn ${mode==='custom'?'astar-btn-custom-active':'astar-btn-custom'}`}
            onClick={() => { setMode(m=>m==='custom'?'view':'custom'); setCustomView('build'); handleReset(); }}
            disabled={isRunning}>
            {mode==='custom'?'✓ Custom Mode':'✏ Custom Graph'}
          </button>
        </div>
        <div className="astar-topbar-info">
          <span className="astar-info-chip">Start: <b>{startNode||'—'}</b></span>
          <span className="astar-info-chip">End: <b>{endNode||'—'}</b></span>
          <span className="astar-info-chip">Nodes: <b>{graphNodes.length}</b></span>
          <span className="astar-info-chip">Heuristic: <b>Euclidean</b></span>
        </div>
      </div>

      {mode !== 'custom' && (
        <div className="astar-presets">
          {GRAPH_PRESETS.map(p => (
            <button key={p.name} className={`astar-preset-pill ${preset?.name===p.name?'astar-preset-active':''}`}
              onClick={() => applyPreset(p)} disabled={isRunning}>{p.name}</button>
          ))}
        </div>
      )}

      {vizState.msg && (
        <div className={`astar-msg ${vizState.found?'astar-msg-found':vizState.done?'astar-msg-notfound':''}`}>{vizState.msg}</div>
      )}

      {mode === 'custom' && customView === 'build' && (
        <div className="astar-custom-bar">
          <span className="astar-custom-hint">Build your graph, then run A*:</span>
          <button className="astar-btn astar-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||!startNode||!endNode||graphNodes.length<2}>▶ Run A*</button>
          <button className="astar-btn astar-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      )}
      {mode === 'custom' && customView === 'run' && (
        <div className="astar-custom-bar">
          <button className="astar-btn astar-btn-edit" onClick={handleBackToEdit} disabled={isRunning}>✏ Edit Graph</button>
          <button className="astar-btn astar-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||!startNode||!endNode}>▶ Re-run A*</button>
          <button className="astar-btn astar-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <span className="astar-custom-hint">Change Start/End and re-run</span>
        </div>
      )}

      {mode === 'custom' && customView === 'build' ? (
        <GraphBuilder nodes={graphNodes} edges={graphEdges} startNode={startNode} endNode={endNode}
          onChange={handleCustomChange} disabled={isRunning} weighted />
      ) : (
        <div className="astar-canvas-wrap">
          <GraphCanvas nodes={graphNodes} edges={graphEdges}
            closedSet={vizState.closedSet} inOpen={vizState.inOpen}
            path={vizState.path} current={vizState.current} activeEdge={vizState.activeEdge}
            gScore={vizState.gScore} fScore={vizState.fScore}/>
        </div>
      )}

      {showPanels && (
        <>
          <OpenSetPanel openSet={vizState.openSet}/>
          <ScoreTable nodes={graphNodes} gScore={vizState.gScore} hScore={hInit}
            fScore={vizState.fScore} closedSet={vizState.closedSet} inOpen={vizState.inOpen} current={vizState.current}/>
        </>
      )}
      {!showPanels && (
        <>
          <OpenSetPanel openSet={[]}/>
          <ScoreTable nodes={graphNodes} gScore={emptyDist} hScore={hInit}
            fScore={emptyDist} closedSet={new Set()} inOpen={new Set()} current={null}/>
        </>
      )}

      <div className="astar-legend">
        {[{cls:'astar-leg-start',label:'Start'},{cls:'astar-leg-end',label:'End'},
          {cls:'astar-leg-current',label:'Current'},{cls:'astar-leg-open',label:'Open (frontier)'},
          {cls:'astar-leg-closed',label:'Closed (settled)'},{cls:'astar-leg-path',label:'Optimal path'},
        ].map(({cls,label}) => (
          <span key={label} className="astar-legend-item">
            <span className={`astar-legend-dot ${cls}`}/>{label}
          </span>
        ))}
      </div>
    </div>
  );
}
