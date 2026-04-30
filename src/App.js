import React, { useState } from 'react';
import HomePage from './components/HomePage';
import AlgoPage from './components/AlgoPage';
import DSPage   from './components/DSPage';
import { getById, getDSById, CATEGORIES, DS_CATEGORY } from './registry';
import './styles/global.css';
import './styles/App.css';

export default function App() {
  // route: null = home | { type:'algo', id } | { type:'ds', id }
  const [route, setRoute] = useState(null);

  const goHome    = () => setRoute(null);
  const goToAlgo  = (id) => setRoute({ type: 'algo', id });
  const goToDS    = (id) => setRoute({ type: 'ds',   id });

  const meta = route?.type === 'algo' ? getById(route.id)
             : route?.type === 'ds'   ? getDSById(route.id)
             : null;

  const cat = meta
    ? (route.type === 'ds'
        ? DS_CATEGORY
        : CATEGORIES.find(c => c.id === meta.category))
    : null;

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
            <button key={c.id} className="nav-item" style={{ '--c': c.color }}
              onClick={goHome}>
              {c.icon} {c.label}
            </button>
          ))}
          <button className="nav-item nav-item-ds" style={{ '--c': DS_CATEGORY.color }}
            onClick={goHome}>
            {DS_CATEGORY.icon} {DS_CATEGORY.label}
          </button>
        </nav>
      </header>

      {/* BREADCRUMB */}
      {route && (
        <div className="breadcrumb">
          <button className="bc-btn" onClick={goHome}>Home</button>
          <span className="bc-sep">/</span>
          {cat && (
            <>
              <span className="bc-cat" style={{ color: cat.color }}>{cat.label}</span>
              <span className="bc-sep">/</span>
            </>
          )}
          <span className="bc-current">{meta?.label}</span>
        </div>
      )}

      {/* MAIN */}
      <main className="app-main">
        {!route && (
          <HomePage onSelectAlgo={goToAlgo} onSelectDS={goToDS} />
        )}
        {route?.type === 'algo' && (
          <AlgoPage algoId={route.id} onBack={goHome} />
        )}
        {route?.type === 'ds' && (
          <DSPage dsId={route.id} onBack={goHome} />
        )}
      </main>

      <footer className="app-footer">
        <span>AlgoViz v2 &mdash; Palakurthi Lalith Prakash</span>
        <span>Each algorithm, its own visualization</span>
      </footer>
    </div>
  );
}
