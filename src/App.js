import React, { useState } from 'react';
import HomePage from './components/HomePage';
import AlgoPage from './components/AlgoPage';
import { getById, CATEGORIES } from './registry';
import './styles/global.css';
import './styles/App.css';

export default function App() {
  const [currentAlgo, setCurrentAlgo] = useState(null); // null = homepage

  const goHome  = () => setCurrentAlgo(null);
  const goTo    = (algoId) => setCurrentAlgo(algoId);

  const meta = currentAlgo ? getById(currentAlgo) : null;
  const cat  = meta ? CATEGORIES.find(c => c.id === meta.category) : null;

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <button className="brand" onClick={goHome}>
          <span className="brand-title">AlgoViz</span>
          <span className="brand-sub">v2.0</span>
        </button>

        <nav className="header-nav">
          {CATEGORIES.map(c => (
            <button key={c.id} className="nav-item" style={{ '--c': c.color }} onClick={() => {
              goHome();
              // scroll to category after navigation
              setTimeout(() => {
                const el = document.getElementById(`cat-${c.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </nav>
      </header>

      {/* BREADCRUMB */}
      {currentAlgo && (
        <div className="breadcrumb">
          <button className="bc-btn" onClick={goHome}>Home</button>
          <span className="bc-sep">/</span>
          {cat && <>
            <span className="bc-cat" style={{ color: cat.color }}>{cat.label}</span>
            <span className="bc-sep">/</span>
          </>}
          <span className="bc-current">{meta?.label}</span>
        </div>
      )}

      {/* MAIN */}
      <main className="app-main">
        {!currentAlgo
          ? <HomePage onSelect={goTo} />
          : <AlgoPage algoId={currentAlgo} onBack={goHome} />
        }
      </main>

      <footer className="app-footer">
        <span>AlgoViz v2 &mdash; SR University, Warangal</span>
        <span>Each algorithm, its own visualization</span>
      </footer>
    </div>
  );
}
