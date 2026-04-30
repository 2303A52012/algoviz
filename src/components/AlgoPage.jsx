import React, { useState, useRef, useCallback } from 'react';
import { getById, CATEGORIES } from '../registry';
import CodeViewer from './CodeViewer';
import './AlgoPage.css';

const SPEED_MAP    = { 1: 800, 2: 350, 3: 120, 4: 40, 5: 6 };
const SPEED_LABELS = { 1: 'Slow', 2: 'Moderate', 3: 'Medium', 4: 'Fast', 5: 'Instant' };

const DIFF_COLOR = {
  beginner:     'var(--diff-beginner)',
  intermediate: 'var(--diff-intermediate)',
  advanced:     'var(--diff-advanced)',
};

export default function AlgoPage({ algoId, onBack }) {
  const meta = getById(algoId);

  const [stepIdx, setStepIdx]         = useState(0);
  const [totalSteps, setTotalSteps]   = useState(0);
  const [isRunning, setIsRunning]     = useState(false);
  const [isPaused, setIsPaused]       = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [speed, setSpeed]             = useState(3);
  const [log, setLog]                 = useState('Configure input and press Run inside the visualizer.');
  const [stats, setStats]             = useState({ comparisons: 0, swaps: 0, steps: 0 });

  const timerRef   = useRef(null);
  const speedRef   = useRef(3);
  const stepsRef   = useRef([]);
  const idxRef     = useRef(0);
  const statsRef   = useRef({ comparisons: 0, swaps: 0, steps: 0 });
  const codeRef    = useRef(null);

  // Called by visualizer with its generated steps
  const handleRunSteps = useCallback((steps) => {
    clearTimeout(timerRef.current);
    stepsRef.current = steps;
    idxRef.current   = 0;
    statsRef.current = { comparisons: 0, swaps: 0, steps: 0 };
    setStepIdx(0);
    setTotalSteps(steps.length);
    setStats({ comparisons: 0, swaps: 0, steps: 0 });
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(null);

    const tick = () => {
      const s   = stepsRef.current;
      const i   = idxRef.current;
      if (i >= s.length) { setIsRunning(false); setIsPaused(false); return; }

      const step = s[i];
      idxRef.current = i + 1;

      const st = statsRef.current;
      st.steps++;
      if (step.type === 'compare') st.comparisons++;
      if (step.type === 'swap')    st.swaps++;
      statsRef.current = { ...st };

      setCurrentStep(step);
      setStepIdx(i + 1);
      setStats({ ...st });
      setLog(step.msg || '');

      if (step.done) { setIsRunning(false); setIsPaused(false); return; }
      timerRef.current = setTimeout(tick, SPEED_MAP[speedRef.current] || 120);
    };

    tick();
  }, []);

  const handlePause = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
    const tick = () => {
      const s = stepsRef.current;
      const i = idxRef.current;
      if (i >= s.length) { setIsRunning(false); setIsPaused(false); return; }

      const step = s[i];
      idxRef.current = i + 1;
      const st = statsRef.current;
      st.steps++;
      if (step.type === 'compare') st.comparisons++;
      if (step.type === 'swap')    st.swaps++;
      statsRef.current = { ...st };

      setCurrentStep(step);
      setStepIdx(i + 1);
      setStats({ ...st });
      setLog(step.msg || '');

      if (step.done) { setIsRunning(false); setIsPaused(false); return; }
      timerRef.current = setTimeout(tick, SPEED_MAP[speedRef.current] || 120);
    };
    tick();
  };

  const handleReset = useCallback(() => {
    clearTimeout(timerRef.current);
    stepsRef.current = [];
    idxRef.current   = 0;
    statsRef.current = { comparisons: 0, swaps: 0, steps: 0 };
    setStepIdx(0);
    setTotalSteps(0);
    setCurrentStep(null);
    setIsRunning(false);
    setIsPaused(false);
    setStats({ comparisons: 0, swaps: 0, steps: 0 });
    setLog('Reset. Configure input and press Run.');
  }, []);

  const handleSpeedChange = (e) => {
    const s = parseInt(e.target.value);
    setSpeed(s);
    speedRef.current = s;
  };

  const handlePauseResume = () => {
    if (isRunning) handlePause();
    else if (isPaused) handleResume();
  };

  if (!meta) {
    return (
      <div className="algo-page-error">
        <p>Algorithm not found: {algoId}</p>
        <button onClick={onBack}>Back to Home</button>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === meta.category);

  const VisualizerModule = React.lazy(() =>
    import(`../algos/${meta.category}/${meta.id}/Visualizer.jsx`)
  );

  return (
    <div className="algo-page">

      {/* Header */}
      <div className="algo-page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="algo-title-area">
          <span className="algo-page-emoji">{meta.emoji}</span>
          <div>
            <h1 className="algo-page-title">{meta.label}</h1>
            <div className="algo-page-tags">
              {cat && (
                <span className="tag" style={{ color: cat.color, borderColor: cat.color + '55' }}>
                  {cat.label}
                </span>
              )}
              <span className="tag" style={{ color: DIFF_COLOR[meta.difficulty], borderColor: DIFF_COLOR[meta.difficulty] + '55' }}>
                {meta.difficulty}
              </span>
              <span className="tag tag-complexity">{meta.timeComplexity?.average || "—"}</span>
              <span className="tag">space {meta.spaceComplexity || "—"}</span>
              {meta?.stable != null && (
                <span className="tag">{meta.stable ? '✓ stable' : '✗ unstable'}</span>
              )}
              {meta.codeSnippets && (
                <button
                  className="tag tag-code"
                  onClick={() => {
                    codeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{ cursor: 'pointer', background: 'rgba(37, 99, 235, 0.1)', borderColor: 'var(--accent-blue)' }}
                >
                  ◆ Code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visualization area */}
      <div className="viz-area">
        <React.Suspense fallback={<div className="viz-loading">Loading visualizer...</div>}>
          <VisualizerModule
            isRunning={isRunning}
            isPaused={isPaused}
            currentStep={currentStep}
            stepIdx={stepIdx}
            onRunSteps={handleRunSteps}
            onReset={handleReset}
            speed={speed}
          />
        </React.Suspense>
      </div>

      {/* Global speed + pause controls */}
      <div className="algo-controls">
        <div className="controls-left">
          {(isRunning || isPaused) && (
            <button
              className={`ctrl-btn ${isRunning ? 'ctrl-pause' : 'ctrl-resume'}`}
              onClick={handlePauseResume}
            >
              {isRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
          )}
          <button className="ctrl-btn ctrl-reset" onClick={handleReset} disabled={isRunning}>
            ↺ Reset
          </button>
        </div>
        <div className="controls-right">
          <div className="speed-control">
            <span className="ctrl-label">Speed</span>
            <input
              type="range" min="1" max="5" step="1"
              value={speed} onChange={handleSpeedChange}
            />
            <span className="speed-label">{SPEED_LABELS[speed]}</span>
          </div>
        </div>
      </div>

      {/* Step log */}
      <div className="step-log">
        <span className="step-log-num">
          {totalSteps > 0 ? `${stepIdx} / ${totalSteps}` : '—'}
        </span>
        <span className="step-log-msg">{log}</span>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { val: stats.comparisons, label: 'Comparisons' },
          { val: stats.swaps,       label: 'Swaps'       },
          { val: stats.steps,       label: 'Total Steps' },
        ].map(({ val, label }) => (
          <div key={label} className="stat-item">
            <span className="stat-val">{val}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Info panels */}
      <div className="info-panels">
        <div className="info-panel">
          <div className="info-panel-title">What it does</div>
          <p className="info-panel-body">{meta.description}</p>
        </div>
        <div className="info-panel info-panel-accent" style={{ '--accent': cat?.color || 'var(--blue)' }}>
          <div className="info-panel-title">Key insight</div>
          <p className="info-panel-body">{meta.keyInsight}</p>
        </div>
        <div className="info-panel">
          <div className="info-panel-title">Use cases</div>
          <ul className="use-cases-list">
            {meta.useCases.map(u => <li key={u}>{u}</li>)}
          </ul>
        </div>
      </div>

      {/* Complexity */}
      <div className="complexity-panel">
        <div className="panel-title">Complexity</div>
        <div className="complexity-grid">
          {[
            ['Best',    meta.timeComplexity?.best    || '—'],
            ['Average', meta.timeComplexity?.average || '—'],
            ['Worst',   meta.timeComplexity?.worst  || '—'],
            ['Space',   meta.spaceComplexity       ],
          ].map(([label, val]) => (
            <div key={label} className="complexity-cell">
              <span className="complexity-label">{label}</span>
              <span className={`complexity-val ${
                val.includes('n²') ? 'bad' :
                val === 'O(1)' || val.includes('log') ? 'good' : 'ok'
              }`}>{val}</span>
            </div>
          ))}
          {meta?.stable != null && (
            <div className="complexity-cell">
              <span className="complexity-label">Stable</span>
              <span className={`complexity-val ${meta.stable ? 'good' : 'bad'}`}>
                {meta.stable ? 'Yes' : 'No'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Code Implementation */}
      {meta.codeSnippets && (
        <div ref={codeRef} className="code-section">
          <CodeViewer 
            codeSnippets={meta.codeSnippets}
            algoLabel={meta.label}
          />
        </div>
      )}

    </div>
  );
}
