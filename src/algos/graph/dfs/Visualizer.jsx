import React, { useState, useEffect, useCallback } from 'react';
import {
  ROWS, COLS, START, END,
  createEmptyGrid, createRandomWallGrid, generateSteps,
} from './steps';
import './Visualizer.css';

function key(r, c) { return `${r},${c}`; }

// ---- Stack panel ----
function StackPanel({ stack, current }) {
  // Show top of stack at top (LIFO visual)
  const display = [...stack].reverse().slice(0, 14);
  return (
    <div className="dfs-stack-panel">
      <div className="dfs-panel-title">
        Stack <span className="dfs-panel-count">{stack.length}</span>
      </div>
      <div className="dfs-stack-items">
        {display.length === 0 && (
          <span className="dfs-stack-empty">empty</span>
        )}
        {display.map((k, i) => {
          const [r, c] = k.split(',').map(Number);
          const isTop = i === 0;
          return (
            <div key={`${k}-${i}`} className={`dfs-stack-item ${isTop ? 'dfs-stack-top' : ''}`}>
              <span className="dfs-si-arrow">{isTop ? '→' : ' '}</span>
              <span className="dfs-si-pos">({r},{c})</span>
            </div>
          );
        })}
        {stack.length > 14 && (
          <span className="dfs-stack-more">+{stack.length - 14} more</span>
        )}
      </div>
      <div className="dfs-panel-hint">← pop from top</div>
    </div>
  );
}

// ---- Path depth indicator ----
function PathDepthPanel({ pathStack, stackDepth, backtrackedCount }) {
  return (
    <div className="dfs-depth-panel">
      <div className="dfs-depth-row">
        <div className="dfs-depth-stat">
          <span className="dfs-depth-val">{pathStack.length}</span>
          <span className="dfs-depth-label">Path depth</span>
        </div>
        <div className="dfs-depth-stat">
          <span className="dfs-depth-val">{stackDepth}</span>
          <span className="dfs-depth-label">Stack size</span>
        </div>
        <div className="dfs-depth-stat">
          <span className="dfs-depth-val dfs-backtrack-val">{backtrackedCount}</span>
          <span className="dfs-depth-label">Backtracked</span>
        </div>
      </div>
      {/* Depth bar */}
      <div className="dfs-depth-bar-wrap">
        <span className="dfs-depth-bar-label">Depth</span>
        <div className="dfs-depth-bar">
          <div
            className="dfs-depth-fill"
            style={{ width: `${Math.min(100, (pathStack.length / (ROWS * COLS)) * 100 * 4)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ---- Comparison callout ----
function BFSvsDFS({ found, pathLen, visitedCount }) {
  if (!found) return null;
  return (
    <div className="dfs-compare-box">
      <span className="dfs-compare-title">DFS vs BFS reminder</span>
      <span className="dfs-compare-body">
        DFS found a path of length <b>{pathLen}</b> after visiting <b>{visitedCount}</b> cells.
        BFS would guarantee the <i>shortest</i> path — DFS does not.
      </span>
    </div>
  );
}

// ---- Grid ----
function Grid({ grid, visitedSet, backtrackedSet, pathStack, path, current }) {
  const pathSet     = new Set(path);
  const pathStackSet = new Set(pathStack);
  const currentKey  = current;

  const getCellType = (r, c) => {
    const k    = key(r, c);
    const base = grid[r][c];
    if (base === 'wall')  return 'wall';
    if (base === 'start') return 'start';
    if (base === 'end')   return pathSet.has(k) ? 'path-end' : 'end';
    if (pathSet.has(k))   return 'path';
    if (k === currentKey) return 'current';
    if (pathStackSet.has(k) && !backtrackedSet.has(k)) return 'path-active';
    if (backtrackedSet.has(k)) return 'backtracked';
    if (visitedSet.has(k)) return 'visited';
    return 'empty';
  };

  return (
    <div className="dfs-grid" style={{ '--cols': COLS, '--rows': ROWS }}>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const type = getCellType(r, c);
          return (
            <div key={`${r}-${c}`} className={`dfs-cell dfs-cell-${type}`} />
          );
        })
      )}
    </div>
  );
}

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset }) {
  const [grid, setGrid]       = useState(() => createEmptyGrid());
  const [mouseDown, setMouseDown] = useState(false);
  const [vizState, setVizState] = useState({
    visitedSet:     new Set(),
    backtrackedSet: new Set(),
    stack:          [],
    pathStack:      [],
    path:           [],
    current:        null,
    stackDepth:     0,
    done:           false,
    found:          false,
  });

  useEffect(() => {
    if (!currentStep) {
      setVizState({
        visitedSet: new Set(), backtrackedSet: new Set(),
        stack: [], pathStack: [], path: [],
        current: null, stackDepth: 0, done: false, found: false,
      });
      return;
    }
    setVizState({
      visitedSet:     currentStep.visitedSet     || new Set(),
      backtrackedSet: currentStep.backtrackedSet || new Set(),
      stack:          currentStep.stack          || [],
      pathStack:      currentStep.pathStack      || [],
      path:           currentStep.path           || [],
      current:        currentStep.current        || null,
      stackDepth:     currentStep.stackDepth     || 0,
      done:           currentStep.done           || false,
      found:          currentStep.type === 'found',
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

  const handleRun = () => onRunSteps(generateSteps(grid));

  const handleReset = () => {
    onReset();
    setVizState({
      visitedSet: new Set(), backtrackedSet: new Set(),
      stack: [], pathStack: [], path: [],
      current: null, stackDepth: 0, done: false, found: false,
    });
  };

  const handleClear = () => { handleReset(); setGrid(createEmptyGrid()); };
  const handleRandomWalls = () => { handleReset(); setGrid(createRandomWallGrid()); };

  return (
    <div className="dfs-root">
      {/* Top bar */}
      <div className="dfs-topbar">
        <div className="dfs-topbar-left">
          <button className="dfs-btn dfs-btn-run"
            onClick={handleRun} disabled={isRunning || isPaused}>
            ▶ Run DFS
          </button>
          <button className="dfs-btn dfs-btn-reset"
            onClick={handleReset} disabled={isRunning}>
            ↺ Reset Path
          </button>
          <button className="dfs-btn dfs-btn-secondary"
            onClick={handleRandomWalls} disabled={isRunning}>
            ⚡ Random Walls
          </button>
          <button className="dfs-btn dfs-btn-secondary"
            onClick={handleClear} disabled={isRunning}>
            ✕ Clear
          </button>
        </div>
      </div>

      <p className="dfs-grid-hint">Click or drag cells to draw / erase walls</p>

      {/* Main layout: grid + side panels */}
      <div className="dfs-main-layout">
        {/* Grid + overlay */}
        <div
          className="dfs-grid-wrap"
          onMouseLeave={() => setMouseDown(false)}
        >
          <Grid
            grid={grid}
            visitedSet={vizState.visitedSet}
            backtrackedSet={vizState.backtrackedSet}
            pathStack={vizState.pathStack}
            path={vizState.path}
            current={vizState.current}
          />
          <div
            className="dfs-grid-overlay"
            style={{ '--cols': COLS, '--rows': ROWS }}
            onMouseLeave={() => setMouseDown(false)}
          >
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="dfs-overlay-cell"
                  onMouseDown={() => { setMouseDown(true); toggleCell(r, c); }}
                  onMouseEnter={() => { if (mouseDown) toggleCell(r, c); }}
                  onMouseUp={() => setMouseDown(false)}
                />
              ))
            )}
          </div>
        </div>

        {/* Side panels */}
        <div className="dfs-side-panels">
          <PathDepthPanel
            pathStack={vizState.pathStack}
            stackDepth={vizState.stackDepth}
            backtrackedCount={vizState.backtrackedSet.size}
          />
          <StackPanel
            stack={vizState.stack}
            current={vizState.current}
          />
        </div>
      </div>

      {/* BFS vs DFS reminder when done */}
      <BFSvsDFS
        found={vizState.found}
        pathLen={vizState.path.length}
        visitedCount={vizState.visitedSet.size}
      />

      {/* Legend */}
      <div className="dfs-legend">
        {[
          { cls: 'dfs-cell-start',       label: 'Start'         },
          { cls: 'dfs-cell-end',         label: 'End'           },
          { cls: 'dfs-cell-wall',        label: 'Wall'          },
          { cls: 'dfs-cell-current',     label: 'Current'       },
          { cls: 'dfs-cell-path-active', label: 'Current path'  },
          { cls: 'dfs-cell-backtracked', label: 'Backtracked'   },
          { cls: 'dfs-cell-visited',     label: 'Visited'       },
          { cls: 'dfs-cell-path',        label: 'Final path'    },
        ].map(({ cls, label }) => (
          <span key={label} className="dfs-legend-item">
            <span className={`dfs-legend-dot ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
