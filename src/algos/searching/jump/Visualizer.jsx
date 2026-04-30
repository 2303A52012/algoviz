import React, { useState, useCallback } from 'react';
import { generateSteps } from './steps';
import './Visualizer.css';

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset, speed }) {
  // ===== STATE MANAGEMENT =====
  // Initial array and target for demonstration
  const [input, setInput] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]);
  const [target, setTarget] = useState(11);
  
  // User input fields for custom array and target
  const [customArray, setCustomArray] = useState('1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23');
  const [customTarget, setCustomTarget] = useState('11');

  // ===== HANDLE RANDOMIZE BUTTON =====
  // Generates a new random sorted array with random gaps and picks a random target
  const handleRandomize = () => {
    // Generate random array size between 8-15 elements
    const arraySize = Math.floor(Math.random() * 8) + 8;
    
    // Build sorted array by starting at random value and adding random gaps
    const sorted = [];
    let current = Math.floor(Math.random() * 10) + 1;  // Start between 1-10
    for (let i = 0; i < arraySize; i++) {
      sorted.push(current);
      current += Math.floor(Math.random() * 5) + 1;  // Add gap of 1-5
    }
    
    // Select a random target that actually exists in the array
    const newTarget = sorted[Math.floor(Math.random() * sorted.length)];
    
    // Update all state and reset the visualization
    setInput(sorted);
    setTarget(newTarget);
    setCustomArray(sorted.join(', '));
    setCustomTarget(newTarget.toString());
    onReset();  // Reset animation to start fresh
  };

  // ===== HANDLE FEED BUTTON =====
  // Parses user input and loads custom array and target
  const handleFeed = useCallback(() => {
    try {
      // Parse comma-separated array input and convert to numbers
      const arr = customArray
        .split(',')
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x));  // Remove any non-numeric values
      
      // Parse target as integer
      const tgt = parseInt(customTarget.trim());
      
      // Validate we have valid data before updating
      if (arr.length > 0 && !isNaN(tgt)) {
        setInput(arr);
        setTarget(tgt);
      }
    } catch (e) {
      console.error('Invalid input');
    }
  }, [customArray, customTarget]);

  // ===== HANDLE RUN BUTTON =====
  // Generates all steps and triggers animation
  const handleRun = () => {
    const steps = generateSteps({ arr: input, target });
    onRunSteps(steps);
  };

  // ===== GET CURRENT DISPLAY DATA =====
  // Use current animation step data, or original input if animation not started
  const displayArr = currentStep?.arr || input;
  const highlightedIndices = currentStep?.indices || [];
  const blockStart = currentStep?.blockStart;
  const blockEnd = currentStep?.blockEnd;
  const found = currentStep?.found;

  // ===== COLOR LOGIC FOR EACH BAR =====
  // Returns appropriate color based on current step state
  const getBarColor = (i) => {
    // Green if found
    if (found && highlightedIndices.includes(i)) {
      return '#10b981';
    }
    // Yellow if currently being checked
    if (highlightedIndices.includes(i)) {
      return '#fbbf24';
    }
    // Blue if within the block we're searching in
    if (blockStart !== undefined && blockEnd !== undefined && i >= blockStart && i <= blockEnd) {
      return '#60a5fa';
    }
    // Gray for normal/unsearched elements
    return '#6b7280';
  };

  return (
    <div className="jump-visualizer">
      {/* ===== CONTROLS SECTION ===== */}
      <div className="viz-controls-panel">
        {/* Custom array input field */}
        <div className="control-group">
          <label>📋 Custom Array</label>
          <input
            type="text"
            value={customArray}
            onChange={(e) => setCustomArray(e.target.value)}
            placeholder="1, 3, 5, 7, 9, 11, 13"
            disabled={isRunning}  // Disable during animation
            className="custom-array-input"
          />
        </div>

        {/* Target value input field */}
        <div className="control-group">
          <label>🎯 Target Value</label>
          <input
            type="number"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
            placeholder="11"
            disabled={isRunning}  // Disable during animation
            className="custom-target-input"
          />
        </div>

        {/* Action buttons */}
        <div className="control-buttons">
          {/* Feed button: load custom input */}
          <button onClick={handleFeed} disabled={isRunning} className="btn-secondary">
            ➤ Feed
          </button>
          {/* Randomize button: generate random sorted array */}
          <button onClick={handleRandomize} disabled={isRunning} className="btn-secondary">
            🎲 Random
          </button>
          {/* Run button: start animation */}
          <button onClick={handleRun} disabled={isRunning} className="btn-primary">
            ▶ Start Search
          </button>
          {/* Reset button: clear animation and go back to start */}
          <button onClick={onReset} disabled={isRunning} className="btn-secondary">
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ===== VISUALIZATION SECTION ===== */}
      <div className="jump-display">
        <h3 className="viz-title">🦘 Array Elements</h3>

        {/* Array bars container */}
        <div className="array-container">
          {displayArr.map((val, i) => (
            <div key={i} className="element-box">
              {/* Bar with dynamic height and color */}
              <div
                className="element-bar"
                style={{
                  backgroundColor: getBarColor(i),  // Color changes based on algorithm state
                  height: `${(val / Math.max(...displayArr, 100)) * 100}%`,  // Height proportional to value
                  transition: 'all 0.15s ease',  // Smooth color transitions
                }}
              />
              {/* Value label below bar */}
              <div className="element-label">{val}</div>
              {/* Index label at bottom */}
              <div className="element-index">[{i}]</div>
            </div>
          ))}
        </div>

        {/* Block indicator shows current search range */}
        {blockStart !== undefined && blockEnd !== undefined && !found && (
          <div className="block-indicator">
            <div className="indicator-text">
              🔍 Searching block: indices {blockStart}–{blockEnd}
            </div>
          </div>
        )}

        {/* Current step message and statistics */}
        {currentStep?.msg && (
          <div className={`message ${found ? 'found' : currentStep?.type}`}>
            <div className="msg-text">{currentStep.msg}</div>
            {/* Display comparison and jump statistics */}
            <div className="msg-stats">
              Comparisons: <strong>{currentStep.comparisons || 0}</strong> | Jumps:{' '}
              <strong>{currentStep.jumps || 0}</strong>
            </div>
          </div>
        )}
      </div>

      {/* ===== INFO PANEL ===== */}
      <div className="info-panel">
        <p>
          💡 <strong>Jump Search:</strong> Divides array into blocks of size √n, jumps through blocks until finding the
          target block, then linearly searches within it.
        </p>
        <p>
          ⏱️ <strong>Time Complexity:</strong> O(√n) — optimal balance between jumps and linear search
        </p>
      </div>
    </div>
  );
}
