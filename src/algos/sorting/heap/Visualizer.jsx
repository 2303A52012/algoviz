import React, { useState, useRef } from 'react';
import { generateSteps } from './steps';
import './Visualizer.css';

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset, speed }) {
  // ===== STATE MANAGEMENT =====
  // Current array being sorted
  const [input, setInput] = useState([9, 5, 8, 1, 2]);
  // Size slider for randomized arrays
  const [arraySize, setArraySize] = useState(5);
  // Track current phase for UI (building heap or extracting)
  const [phase, setPhase] = useState('idle');
  // String representation of array for custom input
  const [customInput, setCustomInput] = useState('9, 5, 8, 1, 2');

  // ===== HANDLE RANDOMIZE BUTTON =====
  // Generate random array of specified size
  const handleRandomize = () => {
    // Create array with random integers 1-100
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setInput(newArr);
    setCustomInput(newArr.join(', '));
  };

  // ===== HANDLE CUSTOM ARRAY INPUT =====
  // Parse user input and load custom array
  const handleCustomArraySubmit = () => {
    try {
      // Parse comma-separated values
      const arr = customInput
        .split(',')
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x));  // Remove invalid values
      
      // Validate and update
      if (arr.length > 0) {
        setInput(arr);
        setArraySize(arr.length);  // Update size slider
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  // ===== HANDLE RUN BUTTON =====
  // Generate steps and start visualization
  const handleRun = () => {
    const steps = generateSteps(input);
    setPhase('building');  // Start in building phase
    onRunSteps(steps);  // Trigger animation in parent
  };

  // ===== GET CURRENT DISPLAY DATA =====
  // Use current animation step or initial input
  const displayArr = currentStep?.arr || input;
  const highlightedIndices = currentStep?.indices || [];

  // ===== COLOR LOGIC FOR ARRAY BARS =====
  // Returns appropriate color based on operation type
  const getBarColor = (i) => {
    if (highlightedIndices.includes(i)) {
      if (currentStep?.type === 'swap') return '#ff6b6b';  // Red for swap
      if (currentStep?.type === 'compare') return '#ffd93d';  // Yellow for compare
      return '#4dabf7';  // Light blue for other
    }
    return '#7dd3fc';  // Gray for normal
  };

  // ===== BUILD TREE NODES FROM ARRAY =====
  // Convert array representation to tree node objects
  // Tree stored as array: parent i has children 2i+1 (left) and 2i+2 (right)
  const buildTreeNodes = (arr) => {
    if (arr.length === 0) return [];
    return arr.map((val, idx) => ({
      val,  // Value at this node
      idx,  // Index in array
      left: 2 * idx + 1,  // Left child index
      right: 2 * idx + 2,  // Right child index
    }));
  };

  const treeNodes = buildTreeNodes(displayArr);
  
  // ===== COLOR LOGIC FOR TREE NODES =====
  const getNodeColor = (idx) => {
    if (highlightedIndices.includes(idx)) {
      if (currentStep?.type === 'swap') return '#ff6b6b';  // Red for swap
      if (currentStep?.type === 'compare') return '#ffd93d';  // Yellow for compare
      return '#4dabf7';  // Light blue
    }
    return '#7dd3fc';  // Gray
  };

  // ===== CALCULATE TREE POSITIONS FOR SVG =====
  // Maps array indices to x,y coordinates for binary tree layout
  const getNodePosition = (idx, depth) => {
    // Calculate tree dimensions
    const maxDepth = Math.ceil(Math.log2(displayArr.length + 1));
    const width = 500;  // SVG width
    const height = 300;  // SVG height
    const yGap = height / (maxDepth + 1);  // Vertical spacing
    const xGap = width / Math.pow(2, depth + 1);  // Horizontal spacing

    // Calculate position: nodes at depth spread across width
    const x = width / Math.pow(2, depth) + xGap * (idx - (Math.pow(2, depth) - 1));
    const y = (depth + 1) * yGap;

    return { x, y };
  };

  // ===== GET TREE DEPTH =====
  // Depth formula: floor(log2(idx + 1))
  const getDepth = (idx) => Math.floor(Math.log2(idx + 1));

  return (
    <div className="heap-visualizer">
      {/* ===== CONTROLS SECTION ===== */}
      <div className="viz-controls-panel">
        {/* Custom array input */}
        <div className="control-group">
          <label>📋 Custom Array Feeder</label>
          <div className="feeder-input-group">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="9, 5, 8, 1, 2"
              disabled={isRunning}
              className="custom-array-input"
            />
            <button 
              onClick={handleCustomArraySubmit} 
              disabled={isRunning}
              className="btn-feed"
            >
              ➤ Feed
            </button>
          </div>
        </div>

        {/* Array size slider */}
        <div className="control-group">
          <label>Array Size: {arraySize}</label>
          <input
            type="range"
            min="3"
            max="12"
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        {/* Action buttons */}
        <div className="control-buttons">
          <button onClick={handleRandomize} disabled={isRunning} className="btn-secondary">
            🎲 Random
          </button>
          <button onClick={handleRun} disabled={isRunning} className="btn-primary">
            ▶ Run Heap Sort
          </button>
          <button onClick={onReset} disabled={isRunning} className="btn-secondary">
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ===== VISUALIZATION SECTION ===== */}
      <div className="viz-main-container">
        {/* ===== TREE VISUALIZATION ===== */}
        <div className="tree-section">
          <h3 className="section-title">🌳 Heap Tree</h3>
          <svg className="heap-tree" width="100%" height="260" viewBox="0 0 500 260">
            {/* DRAW EDGES (parent-child connections) */}
            {treeNodes.map((node) => {
              const pos = getNodePosition(node.idx, getDepth(node.idx));
              const edges = [];

              // Draw edge to left child if it exists
              if (node.left < displayArr.length) {
                const leftPos = getNodePosition(node.left, getDepth(node.left));
                edges.push(
                  <line
                    key={`edge-left-${node.idx}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={leftPos.x}
                    y2={leftPos.y}
                    // Highlight edge if either endpoint is highlighted
                    stroke={highlightedIndices.includes(node.idx) || highlightedIndices.includes(node.left) ? '#ffd93d' : '#4a6080'}
                    strokeWidth="2"
                    opacity="0.6"
                  />
                );
              }

              // Draw edge to right child if it exists
              if (node.right < displayArr.length) {
                const rightPos = getNodePosition(node.right, getDepth(node.right));
                edges.push(
                  <line
                    key={`edge-right-${node.idx}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={rightPos.x}
                    y2={rightPos.y}
                    // Highlight edge if either endpoint is highlighted
                    stroke={highlightedIndices.includes(node.idx) || highlightedIndices.includes(node.right) ? '#ffd93d' : '#4a6080'}
                    strokeWidth="2"
                    opacity="0.6"
                  />
                );
              }

              return edges;
            })}

            {/* DRAW NODES (circles with values) */}
            {treeNodes.map((node) => {
              const pos = getNodePosition(node.idx, getDepth(node.idx));
              const nodeRadius = 18;  // Circle radius

              return (
                <g key={`node-${node.idx}`}>
                  {/* Circle for node */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeRadius}
                    fill={getNodeColor(node.idx)}  // Color based on state
                    stroke={highlightedIndices.includes(node.idx) ? '#fff' : '#2a3748'}
                    strokeWidth={highlightedIndices.includes(node.idx) ? '2' : '1'}
                    opacity={highlightedIndices.includes(node.idx) ? '1' : '0.8'}
                  />
                  {/* Value text inside node */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fill="#000"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {node.val}
                  </text>
                </g>
              );
            })}
          </svg>
          {/* Legend explaining heap property */}
          <div className="tree-legend">
            <small>Max Heap Property: Parent ≥ Children</small>
          </div>
        </div>

        {/* ===== BAR CHART VISUALIZATION ===== */}
        <div className="bars-section">
          <h3 className="section-title">📊 Array Values</h3>
          <div className="bars-container">
            {displayArr.map((val, i) => (
              <div key={i} className="bar-wrapper">
                {/* Bar with dynamic height and color */}
                <div
                  className="bar"
                  style={{
                    height: `${(val / Math.max(...displayArr, 100)) * 100}%`,  // Height proportional to value
                    backgroundColor: getBarColor(i),  // Color based on state
                    transition: 'all 0.1s ease',  // Smooth transitions
                  }}
                />
                {/* Value label below bar */}
                <div className="bar-label">{val}</div>
                {/* Index label at bottom */}
                <div className="bar-index">[{i}]</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MESSAGE AND STATISTICS ===== */}
      {currentStep?.msg && (
        <div className="viz-message">
          {/* Current action description */}
          <div className="msg-text">{currentStep.msg}</div>
          {/* Statistics tracking */}
          <div className="msg-stats">
            Comparisons: <strong>{currentStep.comparisons || 0}</strong> | Swaps: <strong>{currentStep.swaps || 0}</strong>
          </div>
        </div>
      )}

      {/* ===== INFO PANEL ===== */}
      <div className="heap-info">
        <p>
          💡 <strong>Index Formula:</strong> Parent i → Left: 2i+1, Right: 2i+2
        </p>
      </div>
    </div>
  );
}


