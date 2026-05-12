import React, { useState, useEffect } from 'react';
import { GRAPH_PRESETS, getRandomPreset } from '../graphPresets';
import { DEFAULT_PRESET, generateSteps } from './steps';
import GraphBuilder from '../GraphBuilder';
import './Visualizer.css';

/* ─── Graph Canvas (read-only display) ─────── */
function GraphCanvas({ nodes, edges, visitedSet, queue, path, current, activeEdge }) {
  const pathSet  = new Set(path);
  const queueSet = new Set(queue);
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
    if (queueSet.has(id))    return 'frontier';
    return 'unvisited';
  };
  const colors = {
    current:  '#f59e0b', path: '#10b981', visited: '#1e3a8a',
    frontier: '#6d28d9', unvisited: '#1e293b',
  };
  const strokes = {
    current: '#fbbf24', path: '#34d399', visited: '#3b82f6',
    frontier: '#8b5cf6', unvisited: '#334155',
  };

  // Compute viewBox to fit all nodes with padding
  const xs = nodes.map(n => n.x); const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs, 0) - 40; const maxX = Math.max(...xs, 100) + 40;
  const minY = Math.min(...ys, 0) - 40; const maxY = Math.max(...ys, 100) + 40;
  const vb = nodes.length ? `${minX} ${minY} ${maxX - minX} ${maxY - minY}` : '0 0 840 240';

  return (
    <svg className="bfs-graph-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="bfs-glow"><feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {edges.map(([a, b]) => {
        const na = nodeMap[a]; const nb = nodeMap[b]; if (!na || !nb) return null;
        const ek = edgeKey(a, b);
        const ip = pathEdges.has(ek); const ia = ek === activeKey;
        return <line key={ek} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
          stroke={ip ? '#10b981' : ia ? '#f59e0b' : '#334155'}
          strokeWidth={ip ? 3 : ia ? 2.5 : 1.5} strokeOpacity={ip || ia ? 1 : 0.5} />;
      })}
      {nodes.map(n => {
        const st = getNodeState(n.id);
        const hasGlow = st !== 'unvisited';
        return (
          <g key={n.id}>
            {hasGlow && <circle cx={n.x} cy={n.y} r={24} fill={colors[st]} opacity={0.15} />}
            <circle cx={n.x} cy={n.y} r={19} fill={colors[st]} stroke={strokes[st]} strokeWidth={2}
              filter={hasGlow ? 'url(#bfs-glow)' : undefined} />
            <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight="800"
              fill={st === 'unvisited' ? '#94a3b8' : '#fff'} pointerEvents="none">{n.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Queue Panel ────────────────────────────── */
function QueuePanel({ queue }) {
  return (
    <div className="bfs-queue-panel">
      <div className="bfs-panel-header">
        <span className="bfs-panel-icon">⬛</span>
        <span className="bfs-panel-title">Queue</span>
        <span className="bfs-panel-badge">{queue.length}</span>
        <span className="bfs-panel-hint">FIFO — dequeue from front</span>
      </div>
      <div className="bfs-queue-track">
        {queue.length === 0 ? <span className="bfs-ds-empty">empty</span> :
          queue.map((node, i) => (
            <div key={`${node}-${i}`} className={`bfs-queue-cell ${i === 0 ? 'bfs-queue-front' : ''}`}>
              <span className="bfs-ds-node-label">{node}</span>
              {i === 0 && <span className="bfs-front-tag">front</span>}
              {i === queue.length - 1 && queue.length > 1 && <span className="bfs-rear-tag">rear</span>}
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── Visited Array ──────────────────────────── */
function VisitedArray({ visitedSet, nodes }) {
  return (
    <div className="bfs-visited-array-panel">
      <div className="bfs-panel-header">
        <span className="bfs-panel-icon">📋</span>
        <span className="bfs-panel-title">Visited Array</span>
        <span className="bfs-panel-hint">0 = not visited &nbsp;|&nbsp; 1 = visited</span>
      </div>
      <div className="bfs-visited-track">
        {nodes.map(n => (
          <div key={n.id} className={`bfs-visited-cell ${visitedSet.has(n.id) ? 'bfs-vis-yes' : 'bfs-vis-no'}`}>
            <span className="bfs-vis-node">{n.id}</span>
            <span className="bfs-vis-bit">{visitedSet.has(n.id) ? '1' : '0'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Visited Sequence ───────────────────────── */
function VisitedSequence({ visitedSeq }) {
  return (
    <div className="bfs-seq-panel">
      <div className="bfs-panel-header">
        <span className="bfs-panel-icon">🔢</span>
        <span className="bfs-panel-title">Visited Sequence</span>
        <span className="bfs-panel-hint">Order nodes were dequeued &amp; visited</span>
      </div>
      <div className="bfs-seq-track">
        {visitedSeq.length === 0 ? <span className="bfs-ds-empty">none yet</span> :
          visitedSeq.map((node, i) => (
            <React.Fragment key={`${node}-${i}`}>
              <div className={`bfs-seq-cell ${i === visitedSeq.length-1 ? 'bfs-seq-latest' : ''}`}>
                <span className="bfs-seq-idx">{i+1}</span>
                <span className="bfs-seq-node">{node}</span>
              </div>
              {i < visitedSeq.length-1 && <span className="bfs-seq-arrow">→</span>}
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
  const [mode, setMode] = useState('view'); // 'view' | 'custom'
  const [customView, setCustomView] = useState('build'); // 'build' | 'run'
  const [vizState, setVizState] = useState({
    visitedSet: new Set(), visitedSeq: [], queue: [],
    path: [], current: null, activeEdge: null, done: false, found: false, msg: '',
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({ visitedSet: new Set(), visitedSeq: [], queue: [], path: [], current: null, activeEdge: null, done: false, found: false, msg: '' });
      return;
    }
    setVizState({
      visitedSet: currentStep.visitedSet || new Set(),
      visitedSeq: currentStep.visitedSeq || [],
      queue:      currentStep.queue      || [],
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
    setStartNode(p.start); setEndNode(p.end);
    handleReset();
  };

  const handleRandom = () => {
    // Ensure different from current
    let p;
    do { p = getRandomPreset(); } while (p.name === preset?.name && GRAPH_PRESETS.length > 1);
    applyPreset(p);
  };

  const handleCustomChange = ({ nodes, edges, startNode: s, endNode: e }) => {
    setGraphNodes(nodes); setGraphEdges(edges);
    setStartNode(s); setEndNode(e);
    handleReset();
  };

  const handleRun = () => {
    if (!startNode || !endNode) return alert('Please set both Start and End nodes first!');
    if (graphNodes.length < 2) return alert('Add at least 2 nodes!');
    if (mode === 'custom') setCustomView('run'); // switch to animated canvas
    onRunSteps(generateSteps(graphNodes, graphEdges, startNode, endNode));
  };

  const handleReset = () => {
    onReset();
    setVizState({ visitedSet: new Set(), visitedSeq: [], queue: [], path: [], current: null, activeEdge: null, done: false, found: false, msg: '' });
    // stay in 'run' view after reset so user can change start/end and re-run
  };

  const handleBackToEdit = () => {
    handleReset();
    setCustomView('build');
  };

  const displayNodes = mode === 'custom' ? graphNodes : graphNodes;

  return (
    <div className="bfs-root">
      {/* Top bar */}
      <div className="bfs-topbar">
        <div className="bfs-topbar-left">
          <button className="bfs-btn bfs-btn-run" onClick={handleRun} disabled={isRunning || isPaused || mode === 'custom'}>
            ▶ Run BFS
          </button>
          <button className="bfs-btn bfs-btn-reset" onClick={handleReset} disabled={isRunning}>
            ↺ Reset
          </button>
          <button className="bfs-btn bfs-btn-random" onClick={handleRandom} disabled={isRunning} title="Load a random graph preset">
            🎲 Random Graph
          </button>
          <button
            className={`bfs-btn ${mode === 'custom' ? 'bfs-btn-custom-active' : 'bfs-btn-custom'}`}
            onClick={() => { setMode(m => m === 'custom' ? 'view' : 'custom'); setCustomView('build'); handleReset(); }}
            disabled={isRunning}
          >
            {mode === 'custom' ? '✓ Custom Mode' : '✏ Custom Graph'}
          </button>
        </div>
        <div className="bfs-topbar-info">
          <span className="bfs-info-chip">Start: <b>{startNode || '—'}</b></span>
          <span className="bfs-info-chip">End: <b>{endNode || '—'}</b></span>
          <span className="bfs-info-chip">Nodes: <b>{graphNodes.length}</b></span>
          <span className="bfs-info-chip">Edges: <b>{graphEdges.length}</b></span>
        </div>
      </div>

      {/* Preset pills */}
      {mode !== 'custom' && (
        <div className="bfs-presets">
          {GRAPH_PRESETS.map(p => (
            <button
              key={p.name}
              className={`bfs-preset-pill ${preset?.name === p.name ? 'bfs-preset-active' : ''}`}
              onClick={() => applyPreset(p)} disabled={isRunning}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Status message */}
      {vizState.msg && (
        <div className={`bfs-msg ${vizState.found ? 'bfs-msg-found' : vizState.done ? 'bfs-msg-notfound' : ''}`}>
          {vizState.msg}
        </div>
      )}

      {/* Custom mode toolbar */}
      {mode === 'custom' && customView === 'build' && (
        <div className="bfs-custom-run-bar">
          <span className="bfs-custom-hint">Build your graph, then run BFS:</span>
          <button className="bfs-btn bfs-btn-run" onClick={handleRun}
            disabled={isRunning || isPaused || !startNode || !endNode || graphNodes.length < 2}>
            ▶ Run BFS on Custom Graph
          </button>
          <button className="bfs-btn bfs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      )}

      {mode === 'custom' && customView === 'run' && (
        <div className="bfs-custom-run-bar">
          <button className="bfs-btn bfs-btn-edit" onClick={handleBackToEdit} disabled={isRunning}>
            ✏ Edit Graph
          </button>
          <button className="bfs-btn bfs-btn-run" onClick={handleRun}
            disabled={isRunning || isPaused || !startNode || !endNode}>
            ▶ Re-run BFS
          </button>
          <button className="bfs-btn bfs-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
          <span className="bfs-custom-hint">Tip: change Start/End nodes and re-run without rebuilding</span>
        </div>
      )}

      {/* Graph canvas — always animated; GraphBuilder only in build sub-mode */}
      {mode === 'custom' && customView === 'build' ? (
        <GraphBuilder
          nodes={graphNodes} edges={graphEdges}
          startNode={startNode} endNode={endNode}
          onChange={handleCustomChange}
          disabled={isRunning}
        />
      ) : (
        <div className="bfs-canvas-wrap">
          <GraphCanvas
            nodes={graphNodes} edges={graphEdges}
            visitedSet={vizState.visitedSet} queue={vizState.queue}
            path={vizState.path} current={vizState.current} activeEdge={vizState.activeEdge}
          />
        </div>
      )}

      {/* Data structure panels — always shown during/after run */}
      {(vizState.visitedSeq.length > 0 || vizState.queue.length > 0) && (
        <>
          <QueuePanel queue={vizState.queue} />
          <VisitedArray visitedSet={vizState.visitedSet} nodes={displayNodes} />
          <VisitedSequence visitedSeq={vizState.visitedSeq} />
        </>
      )}

      {/* Show panels placeholder before run */}
      {vizState.visitedSeq.length === 0 && vizState.queue.length === 0 && !vizState.done && (
        <>
          <QueuePanel queue={[]} />
          <VisitedArray visitedSet={new Set()} nodes={displayNodes} />
          <VisitedSequence visitedSeq={[]} />
        </>
      )}

      {/* Legend */}
      <div className="bfs-legend">
        {[
          { cls: 'bfs-leg-start',    label: 'Start' },
          { cls: 'bfs-leg-end',      label: 'End' },
          { cls: 'bfs-leg-current',  label: 'Current' },
          { cls: 'bfs-leg-frontier', label: 'In Queue' },
          { cls: 'bfs-leg-visited',  label: 'Visited' },
          { cls: 'bfs-leg-path',     label: 'Shortest path' },
        ].map(({ cls, label }) => (
          <span key={label} className="bfs-legend-item">
            <span className={`bfs-legend-dot ${cls}`} />{label}
          </span>
        ))}
      </div>
    </div>
  );
}
