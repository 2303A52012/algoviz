import React from 'react';
import { getDSById, CATEGORIES, DS_CATEGORY } from '../registry';
import './DSPage.css';

export default function DSPage({ dsId, onBack }) {
  const meta = getDSById(dsId);

  if (!meta) {
    return (
      <div className="ds-page-error">
        <p>Data structure not found: {dsId}</p>
        <button onClick={onBack}>Back to Home</button>
      </div>
    );
  }

  // Lazy-load the DS-specific Visualizer
  // DS visualizers are fully self-contained — they own their own operation panel,
  // animation state, and controls. DSPage just provides the shell + info panels.
  const VisualizerModule = React.lazy(() => {
    // Handle nested paths like linked-list/sll
    const pathMap = {
      sll:      'linked-list/sll',
      dll:      'linked-list/dll',
      cll:      'linked-list/cll',
      dcll:     'linked-list/dcll',
      binary:   'tree/binary',
      bst:      'tree/bst',
      'graph-ds': 'graph-ds',
    };
    const folder = pathMap[meta.id] || meta.id;
    return import(`../ds/${folder}/Visualizer.jsx`);
  });

  return (
    <div className="ds-page">

      {/* Header */}
      <div className="ds-page-header">
        <button className="ds-back-btn" onClick={onBack}>← Back</button>
        <div className="ds-title-area">
          <span className="ds-page-emoji">{meta.emoji}</span>
          <div>
            <h1 className="ds-page-title">{meta.label}</h1>
            <div className="ds-page-tags">
              <span className="ds-tag ds-tag-category">{DS_CATEGORY.icon} Data Structure</span>
              <span className="ds-tag ds-tag-diff">{meta.difficulty}</span>
              {meta.operations?.map(op => (
                <span key={op} className="ds-tag">{op}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer — fully self-contained */}
      <div className="ds-viz-area">
        <React.Suspense fallback={<div className="ds-viz-loading">Loading visualizer...</div>}>
          <VisualizerModule />
        </React.Suspense>
      </div>

      {/* Info panels */}
      <div className="ds-info-panels">
        <div className="ds-info-panel">
          <div className="ds-panel-title">What it is</div>
          <p className="ds-panel-body">{meta.description}</p>
        </div>

        <div className="ds-info-panel ds-info-accent" style={{ "--accent": "var(--teal)" }}>
          <div className="ds-panel-title">Key insight</div>
          <p className="ds-panel-body">{meta.keyInsight}</p>
        </div>

        <div className="ds-info-panel">
          <div className="ds-panel-title">Use cases</div>
          <ul className="ds-use-cases">
            {meta.useCases?.map(u => <li key={u}>{u}</li>)}
          </ul>
        </div>
      </div>

      {/* Complexity table */}
      {meta.complexities && (
        <div className="ds-complexity-panel">
          <div className="ds-panel-title">Operation complexities</div>
          <div className="ds-complexity-grid">
            {Object.entries(meta.complexities).map(([op, val]) => (
              <div key={op} className="ds-complexity-cell">
                <span className="ds-op-label">{op}</span>
                <span className={`ds-op-val ${
                  val === 'O(1)'     ? 'good' :
                  val.includes('log')? 'ok'   : 'bad'
                }`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
