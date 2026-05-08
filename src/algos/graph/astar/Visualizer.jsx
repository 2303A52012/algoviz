import React, { useState, useEffect, useCallback } from 'react';
import {
  ROWS, COLS, START, END,
  createEmptyGrid, createRandomGrid, generateSteps,
} from './steps';
import Pseudocode from '../../../components/Pseudocode';
import './Visualizer.css';

const ASTAR_PSEUDOCODE = [
  "function aStar(graph, start, target) {",
  "  pq = new PriorityQueue()",
  "  pq.enqueue(start, 0)",
  "  g = {start: 0}",
  "  while !pq.isEmpty() {",
  "    curr = pq.dequeue()",
  "    if curr == target return g[curr]",
  "    if curr in visited continue",
  "    visited.add(curr)",
  "    for neighbor in getNeighbors(curr) {",
  "      newG = g[curr] + cost(curr, neighbor)",
  "      if newG < g[neighbor] {",
  "        g[neighbor] = newG",
  "        f = newG + heuristic(neighbor, target)",
  "        pq.enqueue(neighbor, f)",
  "      }",
  "    }",
  "  }",
  "  return -1",
  "}"
];

function key(r, c) { return `${r},${c}`; }

// ---- Priority Queue Panel ----
function PQPanel({ pq }) {
  const show = pq.slice(0, 12);
  return (
    <div className="astar-pq-panel">
      <div className="astar-panel-title">
        Priority Queue (Min f) <span className="astar-panel-count">{pq.length}</span>
      </div>
      <div className="astar-pq-items">
        {show.length === 0 && (
          <span className="astar-pq-empty">empty</span>
        )}
        {show.map((item, i) => {
          const { k, f, g, h } = item;
          const [r, c] = k.split(',').map(Number);
          return (
            <div key={`${k}-${f}-${i}`} className={`astar-pq-item ${i === 0 ? 'astar-pq-front' : ''}`}>
              <span className="astar-qi-pos">({r},{c})</span>
              <span className="astar-qi-gh">
                <span className="astar-cell-g">g={g}</span>
                <span className="astar-cell-h">h={h}</span>
              </span>
              <span className="astar-qi-f">f={f}</span>
            </div>
          );
        })}
        {pq.length > 12 && (
          <span className="astar-pq-more">+{pq.length - 12} more</span>
        )}
      </div>
      <div className="astar-panel-hint">← process min f = g + h first</div>
    </div>
  );
}

// ---- Stats panel ----
function StatsPanel({ visitedCount, pathLength, done, found, totalCost }) {
  return (
    <div className="astar-stats-panel">
      <div className="astar-stat">
        <span className="astar-stat-val">{visitedCount}</span>
        <span className="astar-stat-label">Finalized</span>
      </div>
      <div className="astar-stat">
        <span className={`astar-stat-val ${done && found ? 'astar-stat-found' : done ? 'astar-stat-nf' : ''}`}>
          {done && found ? totalCost : '—'}
        </span>
        <span className="astar-stat-label">Total Cost</span>
      </div>
    </div>
  );
}

// ---- Grid ----
function Grid({ grid, visitedSet, frontierSet, path, current, fMap, gMap, hMap, showHeuristics }) {
  const pathSet    = new Set(path);
  const currentKey = current;

  const getCellType = (r, c) => {
    const k = key(r, c);
    const base = grid[r][c];
    if (base === 'start') return 'start';
    if (base === 'end')   return pathSet.has(k) ? 'path-end' : 'end';
    if (pathSet.has(k))   return 'path';
    if (k === currentKey) return 'current';
    if (base === 'wall')  return 'wall';
    if (visitedSet.has(k))  return 'visited';
    if (frontierSet.has(k)) return 'frontier';
    return 'empty';
  };

  return (
    <div className="astar-grid" style={{ '--cols': COLS, '--rows': ROWS }}>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const type = getCellType(r, c);
          const k    = key(r, c);
          const f = fMap?.[k];
          const g = gMap?.[k];
          const h = hMap?.[k];

          const canShowVals = showHeuristics && f !== undefined && 
                              (type === 'visited' || type === 'frontier' || type === 'current' || type === 'path' || type === 'path-end' || type === 'start');

          return (
            <div
              key={k}
              className={`astar-cell astar-cell-${type}`}
            >
              {canShowVals && (
                <div className="astar-cell-costs">
                  <span className="astar-cell-f">{f}</span>
                  <span className="astar-cell-gh">
                    <span className="astar-cell-g">{g}</span>
                    <span className="astar-cell-h">{h}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const [grid, setGrid]         = useState(() => createEmptyGrid());
  const [mouseDown, setMouseDown] = useState(false);
  const [showHeuristics, setShowHeuristics] = useState(true);
  
  const [vizState, setVizState] = useState({
    visitedSet:  new Set(),
    frontierSet: new Set(),
    queue:       [],
    path:        [],
    current:     null,
    fMap:        {},
    gMap:        {},
    hMap:        {},
    done:        false,
    found:       false,
    activeLine:  0,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
visitedSet: new Set(), frontierSet: new Set(),
        queue: [], path: [], current: null, 
        fMap: {}, gMap: {}, hMap: {},
        done: false, found: false, activeLine: 0,
      });
      return;
    }
    setVizState(prev => ({
      visitedSet:  currentStep.visitedSet  || new Set(),
      frontierSet: currentStep.frontierSet || new Set(),
      queue:       currentStep.queue       || [],
      path:        currentStep.path        || [],
      current:     currentStep.current     || null,
      fMap:        currentStep.fMap        || {},
      gMap:        currentStep.gMap        || {},
      hMap:        currentStep.hMap        || {},
      done:        currentStep.done        || false,
      found:       currentStep.type === 'found',
      activeLine:  currentStep.activeLine  ?? prev.activeLine,
    }));
  }, [currentStep]);

  const toggleCell = useCallback((r, c) => {
    if (isRunning) return;
    if (grid[r][c] === 'start' || grid[r][c] === 'end') return;
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === 'wall' ? 'empty' : 'wall';
      return next;
    });
  }, [grid, isRunning]);

  const handleRun = () => {
    const steps = generateSteps(grid);
    onRunSteps(steps);
  };

  const handleReset = () => {
    onReset();
    setVizState({
      visitedSet: new Set(), frontierSet: new Set(),
      queue: [], path: [], current: null, 
      fMap: {}, gMap: {}, hMap: {},
      done: false, found: false, activeLine: 0,
    });
  };

  const handleClear = () => {
    handleReset();
    setGrid(createEmptyGrid());
  };

  const handleRandom = () => {
    handleReset();
    setGrid(createRandomGrid());
  };

  const totalCost = vizState.done && vizState.found ? vizState.gMap[key(END.r, END.c)] : undefined;

  return (
    <div className="astar-root">
      {/* Top bar */}
      <div className="astar-topbar">
        <div className="astar-topbar-left">
          <button className="astar-btn astar-btn-run"
            onClick={handleRun} disabled={isRunning || isPaused}>
            ▶ Run A* Search
          </button>
          <button className="astar-btn astar-btn-reset"
            onClick={handleReset} disabled={isRunning}>
            ↺ Reset Path
          </button>
          <button className="astar-btn astar-btn-secondary"
            onClick={handleRandom} disabled={isRunning}>
            ⚡ Random Maze
          </button>
          <button className="astar-btn astar-btn-secondary"
            onClick={handleClear} disabled={isRunning}>
            ✕ Clear
          </button>
        </div>
        <div className="astar-topbar-right">
          <label className="astar-toggle-label">
            <input type="checkbox" checked={showHeuristics}
              onChange={e => setShowHeuristics(e.target.checked)} />
            Show f=g+h
          </label>
        </div>
      </div>

      <p className="astar-grid-hint">Click or drag cells to draw / erase walls</p>

      {/* Main layout: grid + side panels */}
      <div className="astar-main-layout">
        {/* Grid */}
        <div
          className="astar-grid-wrap"
          onMouseLeave={() => setMouseDown(false)}
        >
          <Grid
            grid={grid}
            visitedSet={vizState.visitedSet}
            frontierSet={vizState.frontierSet}
            path={vizState.path}
            current={vizState.current}
            fMap={vizState.fMap}
            gMap={vizState.gMap}
            hMap={vizState.hMap}
            showHeuristics={showHeuristics}
          />
          {/* Overlay click/drag handlers */}
          <div
            className="astar-grid-overlay"
            style={{ '--cols': COLS, '--rows': ROWS }}
            onMouseLeave={() => setMouseDown(false)}
          >
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="astar-overlay-cell"
                  onMouseDown={() => { setMouseDown(true); toggleCell(r, c); }}
                  onMouseEnter={() => { if (mouseDown) toggleCell(r, c); }}
                  onMouseUp={() => setMouseDown(false)}
                />
              ))
            )}
          </div>
        </div>

        {/* Side panels */}
        <div className="astar-side-panels">
          <StatsPanel
            visitedCount={vizState.visitedSet.size}
            pathLength={vizState.path.length}
            done={vizState.done}
            found={vizState.found}
            totalCost={totalCost}
          />
          <PQPanel
            pq={vizState.queue}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="astar-legend">
        {[
          { cls: 'astar-cell-start',    label: 'Start'    },
          { cls: 'astar-cell-end',      label: 'End'      },
          { cls: 'astar-cell-wall',     label: 'Wall'     },
          { cls: 'astar-cell-current',  label: 'Current Node'  },
          { cls: 'astar-cell-frontier', label: 'In PQ (Frontier)' },
          { cls: 'astar-cell-visited',  label: 'Finalized'  },
          { cls: 'astar-cell-path',     label: 'Shortest Path' },
        ].map(({ cls, label }) => (
          <span key={label} className="astar-legend-item">
            <span className={`astar-legend-dot ${cls}`} />
            {label}
          </span>
        ))}
      </div>

      {/* ===== PSEUDOCODE TRACKER ===== */}
      <Pseudocode code={ASTAR_PSEUDOCODE} activeLine={vizState.activeLine} />
    </div>
  );
}
