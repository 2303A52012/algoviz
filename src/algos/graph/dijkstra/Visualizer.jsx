import React, { useState, useEffect, useCallback } from 'react';
import {
  ROWS, COLS, START, END, WEIGHT_COST,
  createEmptyGrid, createRandomGrid, generateSteps,
} from './steps';
import './Visualizer.css';


function key(r, c) { return `${r},${c}`; }

// ---- Priority Queue Panel ----
function PQPanel({ pq, distMap }) {
  const show = pq.slice(0, 12);
  return (
    <div className="dijkstra-pq-panel">
      <div className="dijkstra-panel-title">
        Priority Queue (Min-Heap) <span className="dijkstra-panel-count">{pq.length}</span>
      </div>
      <div className="dijkstra-pq-items">
        {show.length === 0 && (
          <span className="dijkstra-pq-empty">empty</span>
        )}
        {show.map((item, i) => {
          const { k, d } = item;
          const [r, c] = k.split(',').map(Number);
          return (
            <div key={`${k}-${d}-${i}`} className={`dijkstra-pq-item ${i === 0 ? 'dijkstra-pq-front' : ''}`}>
              <span className="dijkstra-qi-pos">({r},{c})</span>
              <span className="dijkstra-qi-dist">d={d}</span>
            </div>
          );
        })}
        {pq.length > 12 && (
          <span className="dijkstra-pq-more">+{pq.length - 12} more</span>
        )}
      </div>
      <div className="dijkstra-panel-hint">← process min distance first</div>
    </div>
  );
}

// ---- Stats panel ----
function StatsPanel({ visitedCount, pathLength, currentDist, done, found, totalCost }) {
  return (
    <div className="dijkstra-stats-panel">
      <div className="dijkstra-stat">
        <span className="dijkstra-stat-val">{visitedCount}</span>
        <span className="dijkstra-stat-label">Finalized</span>
      </div>
      <div className="dijkstra-stat">
        <span className="dijkstra-stat-val">{currentDist ?? '—'}</span>
        <span className="dijkstra-stat-label">Current Cost</span>
      </div>
      <div className="dijkstra-stat">
        <span className={`dijkstra-stat-val ${done && found ? 'dijkstra-stat-found' : done ? 'dijkstra-stat-nf' : ''}`}>
          {done && found ? totalCost : '—'}
        </span>
        <span className="dijkstra-stat-label">Total Cost</span>
      </div>
    </div>
  );
}

// ---- Grid ----
function Grid({ grid, visitedSet, frontierSet, path, current, distMap, showDist }) {
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
    if (base === 'weight') return 'weight';
    if (visitedSet.has(k))  return 'visited';
    if (frontierSet.has(k)) return 'frontier';
    return 'empty';
  };

  return (
    <div className="dijkstra-grid" style={{ '--cols': COLS, '--rows': ROWS }}>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const type = getCellType(r, c);
          const k    = key(r, c);
          const dist = distMap[k];
          return (
            <div
              key={k}
              className={`dijkstra-cell dijkstra-cell-${type}`}
            >
              {showDist && dist !== undefined && (type === 'visited' || type === 'current' || type === 'path' || type === 'path-end') && (
                <span className="dijkstra-cell-dist">{dist}</span>
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
  const [showDist, setShowDist] = useState(true);
  const [brushMode, setBrushMode] = useState('wall'); // 'wall' or 'weight'
  
  const [vizState, setVizState] = useState({
    visitedSet:  new Set(),
    frontierSet: new Set(),
    queue:       [],
    path:        [],
    current:     null,
    distMap:     {},
    done:        false,
    found:       false,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
visitedSet: new Set(), frontierSet: new Set(),
        queue: [], path: [], current: null, distMap: {},
        done: false, found: false,
      });
      return;
    }
    setVizState(prev => ({
      visitedSet:  currentStep.visitedSet  || new Set(),
      frontierSet: currentStep.frontierSet || new Set(),
      queue:       currentStep.queue       || [],
      path:        currentStep.path        || [],
      current:     currentStep.current     || null,
      distMap:     currentStep.distMap     || {},
      done:        currentStep.done        || false,
      found:       currentStep.type === 'found',
    }));
  }, [currentStep]);

  const toggleCell = useCallback((r, c) => {
    if (isRunning) return;
    if (grid[r][c] === 'start' || grid[r][c] === 'end') return;
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      if (next[r][c] === brushMode) {
        next[r][c] = 'empty'; // Erase if same brush
      } else {
        next[r][c] = brushMode; // Apply current brush
      }
      return next;
    });
  }, [grid, isRunning, brushMode]);

  const handleRun = () => {
    const steps = generateSteps(grid);
    onRunSteps(steps);
  };

  const handleReset = () => {
    onReset();
    setVizState({
      visitedSet: new Set(), frontierSet: new Set(),
      queue: [], path: [], current: null, distMap: {},
      done: false, found: false,
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

  const currentDist = vizState.current ? vizState.distMap[vizState.current] : undefined;
  const totalCost = vizState.done && vizState.found ? vizState.distMap[key(END.r, END.c)] : undefined;

  return (
    <div className="dijkstra-root">
      {/* Top bar */}
      <div className="dijkstra-topbar">
        <div className="dijkstra-topbar-left">
          <button className="dijkstra-btn dijkstra-btn-run"
            onClick={handleRun} disabled={isRunning || isPaused}>
            ▶ Run Dijkstra
          </button>
          <button className="dijkstra-btn dijkstra-btn-reset"
            onClick={handleReset} disabled={isRunning}>
            ↺ Reset Path
          </button>
          <button className="dijkstra-btn dijkstra-btn-secondary"
            onClick={handleRandom} disabled={isRunning}>
            ⚡ Random Maze
          </button>
          <button className="dijkstra-btn dijkstra-btn-secondary"
            onClick={handleClear} disabled={isRunning}>
            ✕ Clear
          </button>
        </div>
        <div className="dijkstra-topbar-right">
          <div className="dijkstra-brush-toggle">
            <button className={`dijkstra-brush-btn ${brushMode === 'wall' ? 'active' : ''}`}
              onClick={() => setBrushMode('wall')} disabled={isRunning}>
              🧱 Draw Walls
            </button>
            <button className={`dijkstra-brush-btn ${brushMode === 'weight' ? 'active' : ''}`}
              onClick={() => setBrushMode('weight')} disabled={isRunning}>
              🟫 Draw Mud (Cost: {WEIGHT_COST})
            </button>
          </div>
          <label className="dijkstra-toggle-label" style={{ marginLeft: '12px' }}>
            <input type="checkbox" checked={showDist}
              onChange={e => setShowDist(e.target.checked)} />
            Show Cost
          </label>
        </div>
      </div>

      <p className="dijkstra-grid-hint">Select a brush above, then click or drag on the grid to draw.</p>

      {/* Main layout: grid + side panels */}
      <div className="dijkstra-main-layout">
        {/* Grid */}
        <div
          className="dijkstra-grid-wrap"
          onMouseLeave={() => setMouseDown(false)}
        >
          <Grid
            grid={grid}
            visitedSet={vizState.visitedSet}
            frontierSet={vizState.frontierSet}
            path={vizState.path}
            current={vizState.current}
            distMap={vizState.distMap}
            showDist={showDist}
          />
          {/* Overlay click/drag handlers */}
          <div
            className="dijkstra-grid-overlay"
            style={{ '--cols': COLS, '--rows': ROWS }}
            onMouseLeave={() => setMouseDown(false)}
          >
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="dijkstra-overlay-cell"
                  onMouseDown={() => { setMouseDown(true); toggleCell(r, c); }}
                  onMouseEnter={() => { if (mouseDown) toggleCell(r, c); }}
                  onMouseUp={() => setMouseDown(false)}
                />
              ))
            )}
          </div>
        </div>

        {/* Side panels */}
        <div className="dijkstra-side-panels">
          <StatsPanel
            visitedCount={vizState.visitedSet.size}
            pathLength={vizState.path.length}
            currentDist={currentDist}
            done={vizState.done}
            found={vizState.found}
            totalCost={totalCost}
          />
          <PQPanel
            pq={vizState.queue}
            distMap={vizState.distMap}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="dijkstra-legend">
        {[
          { cls: 'dijkstra-cell-start',    label: 'Start'    },
          { cls: 'dijkstra-cell-end',      label: 'End'      },
          { cls: 'dijkstra-cell-wall',     label: 'Wall (Impassable)' },
          { cls: 'dijkstra-cell-weight',   label: `Mud (Cost ${WEIGHT_COST})` },
          { cls: 'dijkstra-cell-current',  label: 'Current Node'  },
          { cls: 'dijkstra-cell-frontier', label: 'In PQ (Frontier)' },
          { cls: 'dijkstra-cell-visited',  label: 'Finalized (Shortest Path Known)'  },
          { cls: 'dijkstra-cell-path',     label: 'Final Shortest Path' },
        ].map(({ cls, label }) => (
          <span key={label} className="dijkstra-legend-item">
            <span className={`dijkstra-legend-dot ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}





