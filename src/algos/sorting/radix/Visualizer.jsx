import React, { useState, useCallback } from 'react';
import { generateSteps } from './steps';
import './Visualizer.css';

export default function Visualizer({ isRunning, isPaused, currentStep, onRunSteps, onReset, speed }) {
  // ===== STATE MANAGEMENT =====
  // Initial array for demonstration (positive integers)
  const [input, setInput] = useState([170, 45, 75, 90, 2, 8, 25, 56, 120, 88]);
  // String representation of array for user input
  const [customInput, setCustomInput] = useState('170, 45, 75, 90, 2, 8, 25, 56, 120, 88');

  // ===== HANDLE RANDOMIZE BUTTON =====
  // Generates a random array of positive integers for demonstration
  const handleRandomize = () => {
    // Generate array size between 8-12 elements
    const size = Math.floor(Math.random() * 5) + 8;
    // Generate random 3-digit numbers (10-999)
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 900) + 10);
    // Update state and reset visualization
    setInput(arr);
    setCustomInput(arr.join(', '));
    onReset();  // Reset to start animation from scratch
  };

  // ===== HANDLE FEED BUTTON =====
  // Parses user input and loads custom array
  const handleFeed = useCallback(() => {
    try {
      // Parse comma-separated input and convert to integers
      const arr = customInput
        .split(',')
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x) && x >= 0);  // Remove invalid/negative values
      
      // Validate we have valid input
      if (arr.length > 0) {
        setInput(arr);
        onReset();  // Reset visualization
      }
    } catch (e) {
      console.error('Invalid input');
    }
  }, [customInput, onReset]);

  // ===== HANDLE RUN BUTTON =====
  // Generates all animation steps and starts visualization
  const handleRun = () => {
    const steps = generateSteps(input);
    onRunSteps(steps);  // Trigger animation in parent component
  };

  // ===== GET CURRENT DISPLAY DATA =====
  // Use current animation step data, or initial input if not running
  const displayArr = currentStep?.arr || input;
  const highlightedIndices = currentStep?.indices || [];
  const buckets = currentStep?.buckets;  // Current bucket state (null outside distribution/collection)
  const pass = currentStep?.pass;  // Which pass we're on (1, 2, 3...)
  const digit = currentStep?.digit;  // Digit position being sorted (1, 10, 100, ...)

  // ===== COLOR LOGIC FOR EACH BAR =====
  // Returns appropriate color based on current animation step
  const getBarColor = (i) => {
    // If this element is highlighted
    if (highlightedIndices.includes(i)) {
      // Yellow if distributing (pulling from array to bucket)
      if (currentStep?.type === 'distribute') return '#fbbf24';
      // Green if collecting (placing from bucket back to array)
      if (currentStep?.type === 'collect') return '#10b981';
      // Light blue for other highlighted states
      return '#4dabf7';
    }
    // Normal blue for unhighlighted elements
    return '#60a5fa';
  };

  return (
    <div className="radix-visualizer">
      {/* ===== CONTROLS SECTION ===== */}
      <div className="viz-controls-panel">
        {/* Custom array input field */}
        <div className="control-group">
          <label>📋 Custom Array (positive integers)</label>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="170, 45, 75, 90, 2, 8, 25"
            disabled={isRunning}  // Disable while animation running
            className="custom-array-input"
          />
        </div>

        {/* Action buttons */}
        <div className="control-buttons">
          {/* Load custom array */}
          <button onClick={handleFeed} disabled={isRunning} className="btn-secondary">
            ➤ Feed
          </button>
          {/* Generate random array */}
          <button onClick={handleRandomize} disabled={isRunning} className="btn-secondary">
            🎲 Random
          </button>
          {/* Start animation */}
          <button onClick={handleRun} disabled={isRunning} className="btn-primary">
            ▶ Start Sort
          </button>
          {/* Reset to initial state */}
          <button onClick={onReset} disabled={isRunning} className="btn-secondary">
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ===== VISUALIZATION SECTION ===== */}
      <div className="radix-display">
        <h3 className="viz-title">🔡 Radix Sort - Array View</h3>

        {/* Pass information badge */}
        {pass > 0 && (
          <div className="pass-info">
            <div className="pass-label">Pass {pass}</div>
            <div className="digit-label">Digit Position: {digit}</div>
          </div>
        )}

        {/* Array bars visualization */}
        <div className="array-container">
          {displayArr.map((val, i) => (
            <div key={i} className="element-box">
              {/* Bar with dynamic height and color */}
              <div
                className="element-bar"
                style={{
                  backgroundColor: getBarColor(i),  // Color changes based on algorithm state
                  height: `${(val / Math.max(...displayArr, 1000)) * 100}%`,  // Height proportional to value
                  transition: 'all 0.15s ease',  // Smooth animations
                }}
              />
              {/* Value label below bar */}
              <div className="element-label">{val}</div>
            </div>
          ))}
        </div>

        {/* Buckets display (shows during distribute/collect phases) */}
        {buckets && (
          <div className="buckets-section">
            <h4>📦 Buckets</h4>
            {/* Grid with 10 buckets (0-9) */}
            <div className="buckets-grid">
              {buckets.map((bucket, bucketNum) => (
                <div key={bucketNum} className="bucket">
                  {/* Bucket digit label */}
                  <div className="bucket-label">{bucketNum}</div>
                  {/* Items currently in this bucket */}
                  <div className="bucket-items">
                    {bucket.map((num, idx) => (
                      <div key={idx} className="bucket-item">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current step message and statistics */}
        {currentStep?.msg && (
          <div className={`message ${currentStep?.type}`}>
            {/* Detailed explanation of current action */}
            <div className="msg-text">{currentStep.msg}</div>
            {/* Statistics tracking */}
            <div className="msg-stats">
              Comparisons: <strong>{currentStep.comparisons || 0}</strong> | Moves:{' '}
              <strong>{currentStep.moves || 0}</strong>
            </div>
          </div>
        )}
      </div>

      {/* ===== INFO PANEL ===== */}
      <div className="info-panel">
        <p>
          💡 <strong>Radix Sort:</strong> Sorts numbers digit-by-digit. For each digit position, distributes numbers
          into buckets (0-9), then collects them back in order.
        </p>
        <p>
          ⏱️ <strong>Time Complexity:</strong> O(nk) where n is array size and k is number of digits.
        </p>
      </div>
    </div>
  );
}
