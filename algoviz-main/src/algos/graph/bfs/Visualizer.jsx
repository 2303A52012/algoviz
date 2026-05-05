import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ROWS, COLS, START, END,
  createEmptyGrid, createRandomWallGrid, generateSteps,
} from './steps';
import './Visualizer.css';

function key(r, c) { return `${r},${c}`; }

// ---- Queue panel ----
function QueuePanel({ queue, distMap, arr }) {
  const show = queue.slice(0, 12);
  return (
    <div className="bfs-queue-panel">
      <div className="bfs-panel-title">
        Queue <span className="bfs-panel-count">{queue.length}</span>
      </div>
      <div className="bfs-queue-items">
        {show.length === 0 && (
          <span className="bfs-queue-empty">empty</span>
        )}
        {show.map((k, i) => {
          const [r, c] = k.split(',').map(Number);
          const dist = distMap[k] ?? '?';
          return (
            <div key={k} className={`bfs-queue-item ${i === 0 ? 'bfs-queue-front' : ''}`}>
              <span className="bfs-qi-pos">({r},{c})</span>
              <span className="bfs-qi-dist">d={dist}</span>
            </div>
          );
        })}
        {queue.length > 12 && (
          <span className="bfs-queue-more">+{queue.length - 12} more</span>
        )}
      </div>
      <div className="bfs-panel-hint">← dequeue from front</div>
    </div>
  );
}

// ---- Stats panel ----
function StatsPanel({ visitedCount, pathLength, currentDist, done, found }) {
  return (
    <div className="bfs-stats-panel">
      <div className="bfs-stat">
        <span className="bfs-stat-val">{visitedCount}</span>
        <span className="bfs-stat-label">Visited</span>
      </div>
      <div className="bfs-stat">
        <span className="bfs-stat-val">{currentDist ?? '—'}</span>
        <span className="bfs-stat-label">Current dist</span>
      </div>
      <div className="bfs-stat">
        <span className={`bfs-stat-val ${done && found ? 'bfs-stat-found' : done ? 'bfs-stat-nf' : ''}`}>
          {done && found ? pathLength : '—'}
        </span>
        <span className="bfs-stat-label">Path length</span>
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
    if (base === 'wall')  return 'wall';
    if (base === 'start') return 'start';
    if (base === 'end')   return pathSet.has(k) ? 'path-end' : 'end';
    if (pathSet.has(k))   return 'path';
    if (k === currentKey) return 'current';
    if (frontierSet.has(k)) return 'frontier';
    if (visitedSet.has(k))  return 'visited';
    return 'empty';
  };

  return (
    <div className="bfs-grid" style={{ '--cols': COLS, '--rows': ROWS }}>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const type = getCellType(r, c);
          const k    = key(r, c);
          const dist = distMap[k];
          return (
            <div
              key={k}
              className={`bfs-cell bfs-cell-${type}`}
              onClick={() => {}} // handled by parent
            >
              {showDist && dist !== undefined && type === 'visited' && (
                <span className="bfs-cell-dist">{dist}</span>
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
  const [showDist, setShowDist] = useState(false);
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
    setVizState({
      visitedSet:  currentStep.visitedSet  || new Set(),
      frontierSet: currentStep.frontierSet || new Set(),
      queue:       currentStep.queue       || [],
      path:        currentStep.path        || [],
      current:     currentStep.current     || null,
      distMap:     currentStep.distMap     || {},
      done:        currentStep.done        || false,
      found:       currentStep.type === 'found',
    });
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
      queue: [], path: [], current: null, distMap: {},
      done: false, found: false,
    });
  };

  const handleClear = () => {
    handleReset();
    setGrid(createEmptyGrid());
  };

  const handleRandomWalls = () => {
    handleReset();
    setGrid(createRandomWallGrid());
  };

  const currentDist = vizState.current ? vizState.distMap[vizState.current] : undefined;

  return (
    <div className="bfs-root">
      {/* Top bar */}
      <div className="bfs-topbar">
        <div className="bfs-topbar-left">
          <button className="bfs-btn bfs-btn-run"
            onClick={handleRun} disabled={isRunning || isPaused}>
            ▶ Run BFS
          </button>
          <button className="bfs-btn bfs-btn-reset"
            onClick={handleReset} disabled={isRunning}>
            ↺ Reset Path
          </button>
          <button className="bfs-btn bfs-btn-secondary"
            onClick={handleRandomWalls} disabled={isRunning}>
            ⚡ Random Walls
          </button>
          <button className="bfs-btn bfs-btn-secondary"
            onClick={handleClear} disabled={isRunning}>
            ✕ Clear
          </button>
        </div>
        <div className="bfs-topbar-right">
          <label className="bfs-toggle-label">
            <input type="checkbox" checked={showDist}
              onChange={e => setShowDist(e.target.checked)} />
            Show distances
          </label>
        </div>
      </div>

      <p className="bfs-grid-hint">Click or drag cells to draw / erase walls</p>

      {/* Main layout: grid + side panels */}
      <div className="bfs-main-layout">
        {/* Grid */}
        <div
          className="bfs-grid-wrap"
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
            className="bfs-grid-overlay"
            style={{ '--cols': COLS, '--rows': ROWS }}
            onMouseLeave={() => setMouseDown(false)}
          >
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="bfs-overlay-cell"
                  onMouseDown={() => { setMouseDown(true); toggleCell(r, c); }}
                  onMouseEnter={() => { if (mouseDown) toggleCell(r, c); }}
                  onMouseUp={() => setMouseDown(false)}
                />
              ))
            )}
          </div>
        </div>

        {/* Side panels */}
        <div className="bfs-side-panels">
          <StatsPanel
            visitedCount={vizState.visitedSet.size}
            pathLength={vizState.path.length}
            currentDist={currentDist}
            done={vizState.done}
            found={vizState.found}
          />
          <QueuePanel
            queue={vizState.queue}
            distMap={vizState.distMap}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="bfs-legend">
        {[
          { cls: 'bfs-cell-start',    label: 'Start'    },
          { cls: 'bfs-cell-end',      label: 'End'      },
          { cls: 'bfs-cell-wall',     label: 'Wall'     },
          { cls: 'bfs-cell-current',  label: 'Current'  },
          { cls: 'bfs-cell-frontier', label: 'Frontier (queue)' },
          { cls: 'bfs-cell-visited',  label: 'Visited'  },
          { cls: 'bfs-cell-path',     label: 'Shortest path' },
        ].map(({ cls, label }) => (
          <span key={label} className="bfs-legend-item">
            <span className={`bfs-legend-dot ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
