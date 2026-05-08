import React from 'react';
import './Pseudocode.css';

export default function Pseudocode({ code, activeLine }) {
  if (!code || code.length === 0) return null;

  return (
    <div className="pseudo-container">
      <div className="pseudo-header">
        <span className="pseudo-title">Pseudocode Tracking</span>
      </div>
      <div className="pseudo-body">
        {code.map((line, index) => {
          const isActive = activeLine === index;
          return (
            <div key={index} className={`pseudo-line ${isActive ? 'active' : ''}`}>
              <span className="pseudo-line-num">{index + 1}</span>
              <span className="pseudo-line-content">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
