import React from 'react';
export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset, speed }) {
  return (
    <div style={{ padding: '48px', textAlign: 'center', color: '#4a6080', fontFamily: 'monospace', fontSize: '14px', lineHeight: '2' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚧</div>
      <div><b style={{ color: '#7dd3fc' }}>astar</b> visualizer — coming soon</div>
      <div style={{ fontSize: '11px', marginTop: '8px' }}>Steps engine is ready. UI in progress.</div>
    </div>
  );
}
