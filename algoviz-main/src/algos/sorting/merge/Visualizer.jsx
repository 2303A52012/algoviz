import React, { useState, useEffect, useMemo } from 'react';
import { generateSteps, generateDefaultInput, parseCustomInput } from './steps';
import './Visualizer.css';

const NODE_COLORS = {
  waiting:  { fill: '#111827', stroke: '#1e3a5f', text: '#4a6080' },
  active:   { fill: '#1e3a5f', stroke: '#3b82f6', text: '#93c5fd' },
  split:    { fill: '#0f172a', stroke: '#1e3a5f', text: '#334155' },
  merging:  { fill: '#2d1b6e', stroke: '#7c3aed', text: '#d8b4fe' },
  done:     { fill: '#14532d', stroke: '#16a34a', text: '#86efac' },
};

const NODE_W = 72;
const NODE_H = 36;
const LEVEL_H = 72;
const H_PAD = 16;

// Compute x positions for each node using tree layout
function computeLayout(nodes, rootId, canvasWidth) {
  const positions = {};
  const maxDepth = Math.max(...Object.values(nodes).map(n => n.depth));
  const levels = Array.from({ length: maxDepth + 1 }, () => []);

  // BFS to assign level order
  const queue = [rootId];
  while (queue.length) {
    const id = queue.shift();
    const nd = nodes[id];
    levels[nd.depth].push(id);
    if (nd.leftId  !== null) queue.push(nd.leftId);
    if (nd.rightId !== null) queue.push(nd.rightId);
  }

  // Space nodes evenly per level
  levels.forEach((levelNodes, depth) => {
    const count = levelNodes.length;
    const spacing = canvasWidth / (count + 1);
    levelNodes.forEach((id, i) => {
      positions[id] = {
        x: spacing * (i + 1),
        y: depth * LEVEL_H + 30,
      };
    });
  });

  return positions;
}

function TreeSVG({ nodes, nodeStates, activeNodeId, currentStep, canvasWidth }) {
  const rootId = 0;
  const positions = useMemo(
    () => computeLayout(nodes, rootId, canvasWidth),
    [nodes, canvasWidth]
  );

  const maxDepth = Math.max(...Object.values(nodes).map(n => n.depth));
  const svgHeight = (maxDepth + 1) * LEVEL_H + 60;

  const getColors = (id) => {
    const state = nodeStates[id] || 'waiting';
    if (id === activeNodeId) return NODE_COLORS.active;
    return NODE_COLORS[state] || NODE_COLORS.waiting;
  };

  // Get label for node (subarray values from current arr state)
  const getLabel = (nd, currentArr) => {
    if (!currentArr) return `[${nd.lo}..${nd.hi}]`;
    const sub = currentArr.slice(nd.lo, nd.hi + 1);
    if (sub.length <= 4) return sub.join(',');
    return sub.slice(0, 3).join(',') + '…';
  };

  const currentArr = currentStep?.arr;

  return (
    <svg
      width={canvasWidth}
      height={svgHeight}
      className="mg-tree-svg"
      style={{ display: 'block' }}
    >
      {/* Draw edges first */}
      {Object.values(nodes).map(nd => {
        const pos = positions[nd.id];
        if (!pos) return null;
        const edges = [];
        if (nd.leftId !== null && positions[nd.leftId]) {
          const lp = positions[nd.leftId];
          const state = nodeStates[nd.leftId] || 'waiting';
          const edgeColor = state === 'done' ? '#16a34a44'
            : state === 'merging' ? '#7c3aed44'
            : state === 'active' ? '#3b82f655'
            : '#1e3a5f44';
          edges.push(
            <line key={`l-${nd.id}`}
              x1={pos.x} y1={pos.y + NODE_H / 2}
              x2={lp.x} y2={lp.y - NODE_H / 2}
              stroke={edgeColor} strokeWidth="1.5"
            />
          );
        }
        if (nd.rightId !== null && positions[nd.rightId]) {
          const rp = positions[nd.rightId];
          const state = nodeStates[nd.rightId] || 'waiting';
          const edgeColor = state === 'done' ? '#16a34a44'
            : state === 'merging' ? '#7c3aed44'
            : state === 'active' ? '#3b82f655'
            : '#1e3a5f44';
          edges.push(
            <line key={`r-${nd.id}`}
              x1={pos.x} y1={pos.y + NODE_H / 2}
              x2={rp.x} y2={rp.y - NODE_H / 2}
              stroke={edgeColor} strokeWidth="1.5"
            />
          );
        }
        return edges;
      })}

      {/* Draw nodes */}
      {Object.values(nodes).map(nd => {
        const pos = positions[nd.id];
        if (!pos) return null;
        const colors = getColors(nd.id);
        const isActive = nd.id === activeNodeId;
        const label = getLabel(nd, currentArr);
        const rangeLabel = nd.lo === nd.hi ? `[${nd.lo}]` : `[${nd.lo}..${nd.hi}]`;

        return (
          <g key={nd.id}
            transform={`translate(${pos.x - NODE_W / 2}, ${pos.y - NODE_H / 2})`}>
            <rect
              width={NODE_W} height={NODE_H}
              rx="6"
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={isActive ? 2 : 1}
            />
            {isActive && (
              <rect
                width={NODE_W} height={NODE_H}
                rx="6" fill="none"
                stroke={colors.stroke}
                strokeWidth="1"
                opacity="0.4"
                transform="translate(-3,-3) scale(1.08,1.17)"
              />
            )}
            <text
              x={NODE_W / 2} y={14}
              textAnchor="middle"
              fill={colors.text}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
            >
              {label}
            </text>
            <text
              x={NODE_W / 2} y={27}
              textAnchor="middle"
              fill={colors.text}
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              opacity="0.6"
            >
              {rangeLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Merge visualizer — shows left/right arrays being compared
function MergePanel({ step }) {
  if (!step || !['merge-start','merge-compare','merge-place'].includes(step.type)) return null;
  const { left, right, leftPointer, rightPointer, arr, lo, hi, justPlaced } = step;

  return (
    <div className="mg-merge-panel">
      <div className="mg-merge-side">
        <span className="mg-merge-side-title">Left half</span>
        <div className="mg-merge-cells">
          {left.map((v, i) => (
            <div key={i} className={`mg-merge-cell ${i === leftPointer ? 'mg-cell-active' : i < (leftPointer ?? 0) ? 'mg-cell-used' : ''}`}>
              {v}
            </div>
          ))}
        </div>
      </div>

      <div className="mg-merge-arrow">
        <span>merge</span>
        <span className="mg-merge-arrow-icon">→</span>
      </div>

      <div className="mg-merge-side">
        <span className="mg-merge-side-title">Right half</span>
        <div className="mg-merge-cells">
          {right.map((v, i) => (
            <div key={i} className={`mg-merge-cell ${i === rightPointer ? 'mg-cell-active' : i < (rightPointer ?? 0) ? 'mg-cell-used' : ''}`}>
              {v}
            </div>
          ))}
        </div>
      </div>

      <div className="mg-merge-arrow">
        <span>result</span>
        <span className="mg-merge-arrow-icon">→</span>
      </div>

      <div className="mg-merge-side">
        <span className="mg-merge-side-title">Merged</span>
        <div className="mg-merge-cells">
          {arr && Array.from({ length: hi - lo + 1 }, (_, i) => {
            const filled = lo + i < (justPlaced !== undefined ? justPlaced + 1 : lo);
            return (
              <div key={i} className={`mg-merge-cell ${filled ? 'mg-cell-done' : 'mg-cell-empty'} ${lo + i === justPlaced ? 'mg-cell-just' : ''}`}>
                {filled ? arr[lo + i] : '·'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Final array bars
function ArrayBars({ arr, step }) {
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const getBarColor = (i) => {
    if (!step) return '#1e3a6e';
    if (step.type === 'done') return '#16a34a';
    if (step.type === 'merge-done' && i >= step.lo && i <= step.hi) return '#16a34a';
    if (step.type === 'merge-place' && i === step.justPlaced) return '#a855f7';
    if (step.phase === 'merge' && step.lo !== undefined && i >= step.lo && i <= step.hi) return '#1e3a5f';
    if (step.nodeStates) {
      const activeNode = step.nodes?.[step.activeNodeId];
      if (activeNode && i >= activeNode.lo && i <= activeNode.hi) return '#1e3a5f';
    }
    return '#111827';
  };

  return (
    <div className="mg-array-bars" style={{ '--n': n }}>
      {arr.map((val, i) => (
        <div key={i} className="mg-bar-col">
          <div
            className="mg-bar"
            style={{
              height: `${Math.max(8, (val / maxVal) * 80)}px`,
              background: getBarColor(i),
              transition: 'height 0.1s ease, background 0.15s',
            }}
          >
            <span className="mg-bar-val">{val}</span>
          </div>
          <span className="mg-bar-idx">{i}</span>
        </div>
      ))}
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const defaultArr = generateDefaultInput();
  const [arr, setArr]             = useState(defaultArr);
  const [inputOpen, setInputOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customErr, setCustomErr]     = useState('');
  const [vizState, setVizState]   = useState({
    arr: defaultArr,
    nodes: {},
    nodeStates: {},
    activeNodeId: -1,
    phase: 'idle',
    currentStep: null,
  });
  const [canvasWidth, setCanvasWidth] = useState(680);
  const containerRef = React.useRef(null);

  // Measure container width for tree layout
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      if (w > 0) setCanvasWidth(Math.max(400, w - 32));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!currentStep) {
      setVizState({
        arr, nodes: {}, nodeStates: {}, activeNodeId: -1, phase: 'idle', currentStep: null,
      });
      return;
    }
    setVizState({
      arr:          currentStep.arr         || arr,
      nodes:        currentStep.nodes       || {},
      nodeStates:   currentStep.nodeStates  || {},
      activeNodeId: currentStep.activeNodeId ?? -1,
      phase:        currentStep.phase        || 'idle',
      currentStep,
    });
  }, [currentStep]); // eslint-disable-line

  const handleRun = () => onRunSteps(generateSteps(arr));

  const handleReset = () => {
    onReset();
    setVizState({ arr, nodes: {}, nodeStates: {}, activeNodeId: -1, phase: 'idle', currentStep: null });
  };

  const handleNewArray = () => {
    const size = 6 + Math.floor(Math.random() * 5);
    const a = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 10);
    setArr(a);
    onReset();
    setVizState({ arr: a, nodes: {}, nodeStates: {}, activeNodeId: -1, phase: 'idle', currentStep: null });
  };

  const handleLoadCustom = () => {
    setCustomErr('');
    try {
      const parsed = parseCustomInput(customInput);
      setArr(parsed);
      onReset();
      setVizState({ arr: parsed, nodes: {}, nodeStates: {}, activeNodeId: -1, phase: 'idle', currentStep: null });
      setInputOpen(false);
      setCustomInput('');
    } catch (e) { setCustomErr(e.message); }
  };

  const phaseLabel = { idle: '—', split: '↓ Splitting', merge: '↑ Merging', done: '✓ Done' };

  return (
    <div className="mg-root">
      {/* Top bar */}
      <div className="mg-topbar">
        <button className={`mg-custom-toggle ${inputOpen ? 'open' : ''}`}
          onClick={() => setInputOpen(o => !o)} disabled={isRunning}>
          ✏ Custom Input {inputOpen ? '▲' : '▼'}
        </button>
        <div className="mg-phase-badge" data-phase={vizState.phase}>
          {phaseLabel[vizState.phase] || '—'}
        </div>
        <div className="mg-topbar-right">
          <button className="mg-btn mg-btn-secondary" onClick={handleNewArray} disabled={isRunning}>⚡ Random</button>
          <button className="mg-btn mg-btn-run" onClick={handleRun} disabled={isRunning || isPaused}>▶ Run</button>
          <button className="mg-btn mg-btn-reset" onClick={handleReset} disabled={isRunning}>↺ Reset</button>
        </div>
      </div>

      {inputOpen && (
        <div className="mg-custom-panel">
          <div className="mg-custom-row">
            <input type="text" className="mg-custom-input"
              placeholder="e.g. 38, 27, 43, 3, 9, 82, 10, 25"
              value={customInput} onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoadCustom()} />
            <button className="mg-btn mg-btn-run" onClick={handleLoadCustom}>Load</button>
          </div>
          {customErr && <span className="mg-err">{customErr}</span>}
          <span className="mg-hint">2–16 numbers, comma-separated, values 1–999</span>
        </div>
      )}

      {/* Tree area */}
      <div className="mg-tree-area" ref={containerRef}>
        {Object.keys(vizState.nodes).length > 0 ? (
          <TreeSVG
            nodes={vizState.nodes}
            nodeStates={vizState.nodeStates}
            activeNodeId={vizState.activeNodeId}
            currentStep={vizState.currentStep}
            canvasWidth={canvasWidth}
          />
        ) : (
          <div className="mg-tree-placeholder">
            <span>Press ▶ Run to see the recursive call tree</span>
          </div>
        )}
      </div>

      {/* Merge panel (only visible during merge phase) */}
      <MergePanel step={vizState.currentStep} />

      {/* Array bars */}
      <div className="mg-array-section">
        <span className="mg-array-title">Array state</span>
        <ArrayBars arr={vizState.arr} step={vizState.currentStep} />
      </div>

      {/* Legend */}
      <div className="mg-legend">
        {[
          { color: NODE_COLORS.active.stroke,  label: 'Active node'  },
          { color: NODE_COLORS.split.stroke,   label: 'Split'        },
          { color: NODE_COLORS.merging.stroke, label: 'Merging'      },
          { color: NODE_COLORS.done.stroke,    label: 'Merged ✓'     },
        ].map(({ color, label }) => (
          <span key={label} className="mg-legend-item">
            <span className="mg-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
