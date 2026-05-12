import React, { useState, useEffect } from 'react';
import { GRAPH_PRESETS, getRandomPreset } from '../graphPresets';
import { DEFAULT_PRESET, generateSteps } from './steps';
import GraphBuilder from '../GraphBuilder';
import './Visualizer.css';

/* ─── Graph Canvas ───────────────────────────── */
function GraphCanvas({ nodes, edges, visitedSet, stack, path, current, activeEdge }) {
  const pathSet  = new Set(path);
  const stackSet = new Set(stack);
  const edgeKey  = (a, b) => [a, b].sort().join('-');
  const activeKey = activeEdge ? edgeKey(...activeEdge) : null;
  const pathEdges = new Set();
  for (let i = 0; i < path.length - 1; i++) pathEdges.add(edgeKey(path[i], path[i+1]));
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const getNodeState = (id) => {
    if (id === current)      return 'current';
    if (pathSet.has(id))     return 'path';
    if (visitedSet.has(id))  return 'visited';
    if (stackSet.has(id))    return 'instack';
    return 'unvisited';
  };
  const colors  = { current:'#a855f7', path:'#f59e0b', visited:'#1e1a36', instack:'#3b0764', unvisited:'#1e293b' };
  const strokes = { current:'#c084fc', path:'#fbbf24', visited:'#6d28d9', instack:'#9333ea', unvisited:'#334155' };

  const xs = nodes.map(n => n.x); const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs, 0)-40; const maxX = Math.max(...xs,100)+40;
  const minY = Math.min(...ys, 0)-40; const maxY = Math.max(...ys,100)+40;
  const vb = nodes.length ? `${minX} ${minY} ${maxX-minX} ${maxY-minY}` : '0 0 840 240';

  return (
    <svg className="dfs-graph-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="dfs-glow"><feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {edges.map(([a,b]) => {
        const na=nodeMap[a]; const nb=nodeMap[b]; if(!na||!nb) return null;
        const ek=edgeKey(a,b); const ip=pathEdges.has(ek); const ia=ek===activeKey;
        return <line key={ek} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
          stroke={ip?'#f59e0b':ia?'#a855f7':'#334155'}
          strokeWidth={ip?3:ia?2.5:1.5} strokeOpacity={ip||ia?1:0.5}/>;
      })}
      {nodes.map(n => {
        const st=getNodeState(n.id); const hasGlow=st!=='unvisited';
        return (
          <g key={n.id}>
            {hasGlow && <circle cx={n.x} cy={n.y} r={24} fill={colors[st]} opacity={0.18}/>}
            <circle cx={n.x} cy={n.y} r={19} fill={colors[st]} stroke={strokes[st]} strokeWidth={2}
              filter={hasGlow?'url(#dfs-glow)':undefined}/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight="800"
              fill={st==='unvisited'?'#94a3b8':'#fff'} pointerEvents="none">{n.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Stack Panel ────────────────────────────── */
function StackPanel({ stack }) {
  const display = [...stack].reverse();
  return (
    <div className="dfs-stack-panel">
      <div className="dfs-panel-header">
        <span className="dfs-panel-icon">📚</span>
        <span className="dfs-panel-title">Stack</span>
        <span className="dfs-panel-badge">{stack.length}</span>
        <span className="dfs-panel-hint">LIFO — pop from top</span>
      </div>
      <div className="dfs-stack-track">
        {display.length === 0 ? <span className="dfs-ds-empty">empty</span> :
          display.map((node, i) => (
            <div key={`${node}-${i}`} className={`dfs-stack-cell ${i===0?'dfs-stack-top':''}`}>
              {i===0 && <span className="dfs-top-tag">TOP ↑</span>}
              <span className="dfs-ds-node-label">{node}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── Visited Array ──────────────────────────── */
function VisitedArray({ visitedSet, nodes }) {
  return (
    <div className="dfs-visited-array-panel">
      <div className="dfs-panel-header">
        <span className="dfs-panel-icon">📋</span>
        <span className="dfs-panel-title">Visited Array</span>
        <span className="dfs-panel-hint">0 = not visited &nbsp;|&nbsp; 1 = visited</span>
      </div>
      <div className="dfs-visited-track">
        {nodes.map(n => (
          <div key={n.id} className={`dfs-visited-cell ${visitedSet.has(n.id)?'dfs-vis-yes':'dfs-vis-no'}`}>
            <span className="dfs-vis-node">{n.id}</span>
            <span className="dfs-vis-bit">{visitedSet.has(n.id)?'1':'0'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Visited Sequence ───────────────────────── */
function VisitedSequence({ visitedSeq }) {
  return (
    <div className="dfs-seq-panel">
      <div className="dfs-panel-header">
        <span className="dfs-panel-icon">🔢</span>
        <span className="dfs-panel-title">Visited Sequence</span>
        <span className="dfs-panel-hint">Order nodes were popped &amp; visited</span>
      </div>
      <div className="dfs-seq-track">
        {visitedSeq.length===0 ? <span className="dfs-ds-empty">none yet</span> :
          visitedSeq.map((node,i) => (
            <React.Fragment key={`${node}-${i}`}>
              <div className={`dfs-seq-cell ${i===visitedSeq.length-1?'dfs-seq-latest':''}`}>
                <span className="dfs-seq-idx">{i+1}</span>
                <span className="dfs-seq-node">{node}</span>
              </div>
              {i<visitedSeq.length-1 && <span className="dfs-seq-arrow">→</span>}
            </React.Fragment>
          ))}
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
  const [mode, setMode] = useState('view');
  const [customView, setCustomView] = useState('build'); // 'build' | 'run'
  const [vizState, setVizState] = useState({
    visitedSet:new Set(), visitedSeq:[], stack:[], path:[], current:null, activeEdge:null, done:false, found:false, msg:'',
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({ visitedSet:new Set(), visitedSeq:[], stack:[], path:[], current:null, activeEdge:null, done:false, found:false, msg:'' });
      return;
    }
    setVizState({
      visitedSet: currentStep.visitedSet || new Set(),
      visitedSeq: currentStep.visitedSeq || [],
      stack:      currentStep.stack      || [],
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
    if (!startNode || !endNode) return alert('Please set both Start and End nodes!');
    if (graphNodes.length < 2) return alert('Add at least 2 nodes!');
    if (mode === 'custom') setCustomView('run'); // switch to animated canvas
    onRunSteps(generateSteps(graphNodes, graphEdges, startNode, endNode));
  };

  const handleReset = () => {
    onReset();
    setVizState({ visitedSet:new Set(), visitedSeq:[], stack:[], path:[], current:null, activeEdge:null, done:false, found:false, msg:'' });
  };

  const handleBackToEdit = () => {
    handleReset();
    setCustomView('build');
  };

  return (
    <div className="dfs-root">
      <div className="dfs-topbar">
        <div className="dfs-topbar-left">
          <button className="dfs-btn dfs-btn-run" onClick={handleRun} disabled={isRunning||isPaused||mode==='custom'}>▶ Run DFS</button>
          <button className="dfs-btn dfs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <button className="dfs-btn dfs-btn-random" onClick={handleRandom} disabled={isRunning}>🎲 Random Graph</button>
          <button className={`dfs-btn ${mode==='custom'?'dfs-btn-custom-active':'dfs-btn-custom'}`}
            onClick={() => { setMode(m => m==='custom'?'view':'custom'); setCustomView('build'); handleReset(); }} disabled={isRunning}>
            {mode==='custom'?'✓ Custom Mode':'✏ Custom Graph'}
          </button>
        </div>
        <div className="dfs-topbar-info">
          <span className="dfs-info-chip">Start: <b>{startNode||'—'}</b></span>
          <span className="dfs-info-chip">End: <b>{endNode||'—'}</b></span>
          <span className="dfs-info-chip">Nodes: <b>{graphNodes.length}</b></span>
          <span className="dfs-info-chip">Edges: <b>{graphEdges.length}</b></span>
        </div>
      </div>

      {mode !== 'custom' && (
        <div className="dfs-presets">
          {GRAPH_PRESETS.map(p => (
            <button key={p.name} className={`dfs-preset-pill ${preset?.name===p.name?'dfs-preset-active':''}`}
              onClick={() => applyPreset(p)} disabled={isRunning}>{p.name}</button>
          ))}
        </div>
      )}

      {vizState.msg && (
        <div className={`dfs-msg ${vizState.found?'dfs-msg-found':vizState.done?'dfs-msg-notfound':''}`}>{vizState.msg}</div>
      )}

      {/* Custom mode: build toolbar */}
      {mode === 'custom' && customView === 'build' && (
        <div className="dfs-custom-run-bar">
          <span className="dfs-custom-hint">Build your graph, then run DFS:</span>
          <button className="dfs-btn dfs-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||!startNode||!endNode||graphNodes.length<2}>
            ▶ Run DFS on Custom Graph
          </button>
          <button className="dfs-btn dfs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      )}

      {/* Custom mode: run toolbar */}
      {mode === 'custom' && customView === 'run' && (
        <div className="dfs-custom-run-bar">
          <button className="dfs-btn dfs-btn-edit" onClick={handleBackToEdit} disabled={isRunning}>
            ✏ Edit Graph
          </button>
          <button className="dfs-btn dfs-btn-run" onClick={handleRun}
            disabled={isRunning||isPaused||!startNode||!endNode}>
            ▶ Re-run DFS
          </button>
          <button className="dfs-btn dfs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <span className="dfs-custom-hint">Tip: change Start/End and re-run without rebuilding</span>
        </div>
      )}

      {/* Graph canvas — animated; GraphBuilder only when building */}
      {mode === 'custom' && customView === 'build' ? (
        <GraphBuilder nodes={graphNodes} edges={graphEdges} startNode={startNode} endNode={endNode}
          onChange={handleCustomChange} disabled={isRunning} />
      ) : (
        <div className="dfs-canvas-wrap">
          <GraphCanvas nodes={graphNodes} edges={graphEdges} visitedSet={vizState.visitedSet}
            stack={vizState.stack} path={vizState.path} current={vizState.current} activeEdge={vizState.activeEdge}/>
        </div>
      )}

      {(vizState.visitedSeq.length > 0 || vizState.stack.length > 0) && (
        <>
          <StackPanel stack={vizState.stack} />
          <VisitedArray visitedSet={vizState.visitedSet} nodes={graphNodes} />
          <VisitedSequence visitedSeq={vizState.visitedSeq} />
        </>
      )}
      {vizState.visitedSeq.length===0 && vizState.stack.length===0 && !vizState.done && (
        <>
          <StackPanel stack={[]} />
          <VisitedArray visitedSet={new Set()} nodes={graphNodes} />
          <VisitedSequence visitedSeq={[]} />
        </>
      )}

      {vizState.found && (
        <div className="dfs-note">⚠️ DFS does <strong>not</strong> guarantee the shortest path. Use BFS for shortest paths in unweighted graphs.</div>
      )}

      <div className="dfs-legend">
        {[
          {cls:'dfs-leg-start',label:'Start'},{cls:'dfs-leg-end',label:'End'},
          {cls:'dfs-leg-current',label:'Current'},{cls:'dfs-leg-instack',label:'In Stack'},
          {cls:'dfs-leg-visited',label:'Visited'},{cls:'dfs-leg-path',label:'DFS path'},
        ].map(({cls,label}) => (
          <span key={label} className="dfs-legend-item">
            <span className={`dfs-legend-dot ${cls}`}/>{label}
          </span>
        ))}
      </div>
    </div>
  );
}
