import React, { useState } from 'react';
import { CATEGORIES, REGISTRY, DS_REGISTRY, DS_CATEGORY, getByCategory } from '../registry';
import './HomePage.css';

const DIFFICULTY_COLOR = {
  beginner:     'var(--diff-beginner)',
  intermediate: 'var(--diff-intermediate)',
  advanced:     'var(--diff-advanced)',
};

const DIFFICULTY_LABEL = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

// Mini preview thumbnails — static SVG sketches per visualStyle
function PreviewThumb({ visualStyle, color }) {
  const c = color;
  const dim = '#1a2540';
  const mid = color + '55';

  const thumbs = {
    'bars': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {[12,22,8,30,18,26,10,20].map((h, i) => (
          <rect key={i} x={i*7+1} y={36-h} width={5} height={h}
            fill={i===2||i===3 ? c : dim} rx="1"/>
        ))}
      </svg>
    ),
    'bars-sweep': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {[8,12,18,22,10,26,14,30].map((h, i) => (
          <rect key={i} x={i*7+1} y={36-h} width={5} height={h}
            fill={i<3 ? c+'88' : i===3 ? c : dim} rx="1"/>
        ))}
        <line x1="22" y1="4" x2="22" y2="36" stroke={c} strokeWidth="1.5" strokeDasharray="2,2"/>
      </svg>
    ),
    'bars-split': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {[8,14,18,22,26,30,10,20].map((h, i) => (
          <rect key={i} x={i*7+1} y={36-h} width={5} height={h}
            fill={i<4 ? c+'99' : dim} rx="1"/>
        ))}
        <line x1="30" y1="2" x2="30" y2="36" stroke={c} strokeWidth="1" strokeDasharray="3,2"/>
        <text x="6" y="10" fill={c} fontSize="6">sorted</text>
      </svg>
    ),
    'tree': (
      <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <rect x="22" y="2" width="16" height="9" rx="2" fill={c+'33'} stroke={c} strokeWidth="1"/>
        <text x="30" y="10" textAnchor="middle" fill={c} fontSize="6">arr</text>
        <line x1="24" y1="11" x2="14" y2="20" stroke={c+'66'} strokeWidth="1"/>
        <line x1="36" y1="11" x2="46" y2="20" stroke={c+'66'} strokeWidth="1"/>
        <rect x="5" y="20" width="18" height="8" rx="2" fill={c+'22'} stroke={c+'88'} strokeWidth="1"/>
        <rect x="37" y="20" width="18" height="8" rx="2" fill={c+'22'} stroke={c+'88'} strokeWidth="1"/>
        <line x1="11" y1="28" x2="8" y2="34" stroke={c+'44'} strokeWidth="1"/>
        <line x1="18" y1="28" x2="22" y2="34" stroke={c+'44'} strokeWidth="1"/>
        <rect x="4" y="34" width="8" height="5" rx="1" fill={dim} stroke={c+'44'} strokeWidth="1"/>
        <rect x="18" y="34" width="8" height="5" rx="1" fill={dim} stroke={c+'44'} strokeWidth="1"/>
      </svg>
    ),
    'partition': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="10" width="22" height="22" rx="2" fill="#1e3050" stroke={c+'44'} strokeWidth="1"/>
        <rect x="25" y="2" width="10" height="30" rx="2" fill={c+'66'} stroke={c} strokeWidth="1.5"/>
        <rect x="37" y="10" width="22" height="22" rx="2" fill="#1e3050" stroke={c+'44'} strokeWidth="1"/>
        <text x="12" y="24" textAnchor="middle" fill={c+'88'} fontSize="7">left</text>
        <text x="30" y="20" textAnchor="middle" fill={c} fontSize="6">pivot</text>
        <text x="48" y="24" textAnchor="middle" fill={c+'88'} fontSize="7">right</text>
      </svg>
    ),
    'heap-tree': (
      <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="8" r="7" fill={c+'33'} stroke={c} strokeWidth="1.5"/>
        <text x="30" y="12" textAnchor="middle" fill={c} fontSize="8">9</text>
        <line x1="24" y1="14" x2="16" y2="22" stroke={c+'66'} strokeWidth="1"/>
        <line x1="36" y1="14" x2="44" y2="22" stroke={c+'66'} strokeWidth="1"/>
        <circle cx="16" cy="27" r="5" fill={c+'22'} stroke={c+'88'} strokeWidth="1"/>
        <text x="16" y="30" textAnchor="middle" fill={c+'aa'} fontSize="7">7</text>
        <circle cx="44" cy="27" r="5" fill={c+'22'} stroke={c+'88'} strokeWidth="1"/>
        <text x="44" y="30" textAnchor="middle" fill={c+'aa'} fontSize="7">5</text>
        <line x1="12" y1="32" x2="8" y2="38" stroke={c+'33'} strokeWidth="1"/>
        <circle cx="8" cy="38" r="3" fill={dim} stroke={c+'33'} strokeWidth="1"/>
      </svg>
    ),
    'bars-gap': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {[20,10,28,14,24,8,30,18].map((h, i) => (
          <rect key={i} x={i*7+1} y={36-h} width={5} height={h}
            fill={i===0||i===4 ? c : dim} rx="1"/>
        ))}
        <path d={`M 3 4 Q 17 0 31 4`} fill="none" stroke={c+'88'} strokeWidth="1.5"/>
        <text x="16" y="14" textAnchor="middle" fill={c+'88'} fontSize="6">gap=4</text>
      </svg>
    ),
    'buckets': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <rect x={i*11+3} y="12" width="9" height="20" rx="1" fill={dim} stroke={c+'44'} strokeWidth="1"/>
            <rect x={i*11+3} y={36-[12,20,8,16,24][i]} width="9" height={[12,20,8,16,24][i]} rx="1" fill={c+'66'}/>
            <text x={i*11+7} y="10" textAnchor="middle" fill={c+'88'} fontSize="6">{i}</text>
          </g>
        ))}
      </svg>
    ),
    'digit-buckets': (
      <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={i*11+3} y="8" width="9" height="28" rx="1" fill={dim} stroke={c+'44'} strokeWidth="1"/>
        ))}
        {[[1,0],[2,1],[0,2],[3,3],[4,4]].map(([b,idx]) => (
          <rect key={idx} x={b*11+4} y={16+idx*2} width="7" height="6" rx="1" fill={c+'88'}/>
        ))}
        <text x="30" y="6" textAnchor="middle" fill={c+'66'} fontSize="5">digit pass</text>
      </svg>
    ),
    'scanner': (
      <svg viewBox="0 0 60 28" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={i} x={i*7+1} y="8" width="6" height="16" rx="1"
            fill={i<4 ? c+'44' : i===4 ? c : dim} stroke={i===4?c:'none'} strokeWidth="1"/>
        ))}
        <polygon points="29,2 33,2 31,7" fill={c}/>
      </svg>
    ),
    'range-shrink': (
      <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="20" x2="55" y2="20" stroke={dim} strokeWidth="2"/>
        <line x1="5" y1="20" x2="55" y2="20" stroke={c+'44'} strokeWidth="2"/>
        <line x1="12" y1="15" x2="48" y2="15" stroke={c+'88'} strokeWidth="2"/>
        <line x1="22" y1="10" x2="38" y2="10" stroke={c} strokeWidth="2.5"/>
        <circle cx="30" cy="10" r="3" fill={c}/>
        <text x="30" y="8" textAnchor="middle" fill={c} fontSize="5">mid</text>
        <text x="5" y="26" fill={c+'88'} fontSize="5">lo</text>
        <text x="52" y="26" fill={c+'88'} fontSize="5">hi</text>
      </svg>
    ),
    'jump-blocks': (
      <svg viewBox="0 0 60 28" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={i} x={i*7+1} y="8" width="6" height="16" rx="1"
            fill={i<4 ? dim : i<8 ? c+'44' : dim}
            stroke={i===3||i===7?c+'66':'none'} strokeWidth="1"/>
        ))}
        <path d="M4 6 Q10 1 18 6" fill="none" stroke={c+'66'} strokeWidth="1.5"/>
        <path d="M18 6 Q24 1 32 6" fill="none" stroke={c} strokeWidth="1.5"/>
        <text x="25" y="5" fill={c+'88'} fontSize="5">jump</text>
      </svg>
    ),
    'probe': (
      <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="20" x2="55" y2="20" stroke={c+'33'} strokeWidth="6" strokeLinecap="round"/>
        <circle cx="38" cy="20" r="4" fill={c} stroke="none"/>
        <text x="38" y="28" textAnchor="middle" fill={c} fontSize="5">probe</text>
        <text x="30" y="10" textAnchor="middle" fill={c+'88'} fontSize="5">formula</text>
        <line x1="30" y1="12" x2="38" y2="16" stroke={c+'66'} strokeWidth="1"/>
      </svg>
    ),
    'three-zones': (
      <svg viewBox="0 0 60 28" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="6" width="16" height="18" rx="2" fill={c+'22'} stroke={c+'66'} strokeWidth="1"/>
        <rect x="20" y="6" width="20" height="18" rx="2" fill={c+'44'} stroke={c} strokeWidth="1.5"/>
        <rect x="42" y="6" width="16" height="18" rx="2" fill={c+'22'} stroke={c+'66'} strokeWidth="1"/>
        <text x="10" y="18" textAnchor="middle" fill={c+'88'} fontSize="6">L</text>
        <text x="30" y="18" textAnchor="middle" fill={c} fontSize="6">mid</text>
        <text x="50" y="18" textAnchor="middle" fill={c+'88'} fontSize="6">R</text>
      </svg>
    ),
    'grid-wave': (
      <svg viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
        {Array.from({length:6},(_,r)=>Array.from({length:8},(_,c)=>{
          const dist=Math.abs(r-2)+Math.abs(c-3);
          const fill=dist===0?'#22c55e':dist===1?c:dist===2?c+'88':dist===3?c+'44':dim;
          return <rect key={`${r}-${c}`} x={c*7+1} y={r*7+1} width="6" height="6" rx="1" fill={fill}/>;
        }))
        }
      </svg>
    ),
    'grid-snake': (
      <svg viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
        {Array.from({length:6},(_,r)=>Array.from({length:8},(_,c)=>{
          const path=[[2,3],[2,4],[2,5],[3,5],[4,5],[4,4],[4,3]];
          const onPath=path.some(([pr,pc])=>pr===r&&pc===c);
          const isStart=r===2&&c===3;
          return <rect key={`${r}-${c}`} x={c*7+1} y={r*7+1} width="6" height="6" rx="1"
            fill={isStart?'#22c55e':onPath?c:dim}/>;
        }))}
      </svg>
    ),
    'grid-distance': (
      <svg viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
        {[[0,'S'],[1,'1'],[2,'2'],[3,'3'],[99,''],[2,'2'],[3,'3'],[4,'4'],
          [99,''],[99,''],[3,'3'],[4,'4'],[5,'5']].map(([d,label],i)=>{
          const r=Math.floor(i/4),col=i%4;
          const fill=d===0?'#22c55e':d===99?dim:c+Math.max(22,Math.min(99,99-d*15)).toString(16).padStart(2,'0');
          return <g key={i}>
            <rect x={col*14+2} y={r*14+2} width="12" height="12" rx="1" fill={fill}/>
            <text x={col*14+8} y={r*14+11} textAnchor="middle" fill="#fff" fontSize="5">{label}</text>
          </g>;
        })}
      </svg>
    ),
    'grid-heuristic': (
      <svg viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
        {Array.from({length:6},(_,r)=>Array.from({length:8},(_,c)=>{
          const h=Math.abs(r-5)+Math.abs(c-7);
          const visited=h<4;
          const path=(r===2&&c===3)||(r===2&&c===4)||(r===3&&c===5)||(r===4&&c===6)||(r===5&&c===7);
          const fill=path?c:visited?c+'44':dim;
          return <rect key={`${r}-${c}`} x={c*7+1} y={r*7+1} width="6" height="6" rx="1" fill={fill}/>;
        }))}
      </svg>
    ),
  };

  return (
    <div className="preview-thumb">
      {thumbs[visualStyle] || (
        <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
          <text x="30" y="22" textAnchor="middle" fill={color+'66'} fontSize="10">?</text>
        </svg>
      )}
    </div>
  );
}

function AlgoCard({ algo, categoryColor, onSelect }) {
  return (
    <button
      className="algo-card"
      style={{ '--card-color': categoryColor }}
      onClick={() => onSelect(algo.id)}
    >
      <div className="algo-card-top">
        <PreviewThumb visualStyle={algo.visualStyle} color={categoryColor} />
        <div className="algo-card-info">
          <div className="algo-card-header">
            <span className="algo-emoji">{algo.emoji}</span>
            <span className="algo-label">{algo.label}</span>
          </div>
          <span
            className="algo-difficulty"
            style={{ color: DIFFICULTY_COLOR[algo.difficulty] }}
          >
            {DIFFICULTY_LABEL[algo.difficulty]}
          </span>
        </div>
      </div>

      <div className="algo-complexity">
        <span className="complexity-avg">{algo.timeComplexity.average}</span>
        <span className="complexity-space">space {algo.spaceComplexity}</span>
      </div>

      <p className="algo-desc">{algo.description}</p>

      <div className="algo-card-footer">
        <span className="algo-insight">💡 {algo.keyInsight}</span>
      </div>

      <div className="algo-card-cta" style={{ color: categoryColor }}>
        Visualize →
      </div>
    </button>
  );
}

export default function HomePage({ onSelectAlgo, onSelectDS }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');

  const filteredRegistry = search.trim()
    ? REGISTRY.filter(a =>
        a.label.toLowerCase().includes(search.toLowerCase()) ||
        (a.description && a.description.toLowerCase().includes(search.toLowerCase()))
      )
    : null;

  const visibleCategories = activeCategory
    ? CATEGORIES.filter(c => c.id === activeCategory)
    : CATEGORIES;

  return (
    <div className="home-root">

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <p className="hero-label">// interactive dsa learning tool</p>
        <h1 className="hero-title">
          See exactly how<br />
          <span className="hero-accent">algorithms think</span>
        </h1>
        <p className="hero-desc">
          Every algorithm has its own unique visualization — watch Merge Sort build a tree,
          see BFS expand in waves, observe Quick Sort partition around its pivot.
          Not just colored bars — the actual structure behind each algorithm.
        </p>

        <div className="hero-stats">
          {[['18', 'Algorithms'], ['5', 'Vis. Styles'], ['3', 'Categories'], ['∞', 'Free']].map(([v, l]) => (
            <div key={l} className="hero-stat">
              <span className="hero-stat-val">{v}</span>
              <span className="hero-stat-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category filter pills + Search */}
      <div className="category-pills-search-row">
      <div className="category-pills">
        <button
          className={`pill ${!activeCategory ? 'pill-active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`pill ${activeCategory === cat.id ? 'pill-active' : ''}`}
            style={{ '--pill-color': cat.color }}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
        <input
          className="algo-search-bar"
          type="text"
          placeholder="Search algorithms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search algorithms"
        />
      </div>

      {/* Search results */}
      {search.trim() && (
        <section className="category-section">
          <div className="category-header" style={{ '--cat-color': 'var(--blue-light)' }}>
            <div className="category-title-row">
              <span className="cat-icon-big">🔍</span>
              <div>
                <h2 className="category-title" style={{ color: 'var(--blue-light)' }}>Search Results</h2>
                <p className="category-desc">{filteredRegistry.length} algorithm{filteredRegistry.length !== 1 ? 's' : ''} found</p>
              </div>
            </div>
          </div>
          <div className="algo-grid">
            {filteredRegistry.length === 0 && (
              <div style={{ padding: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
                No algorithms found for "{search}".
              </div>
            )}
            {filteredRegistry.map(algo => (
              <AlgoCard
                key={algo.id}
                algo={algo}
                categoryColor={CATEGORIES.find(c => c.id === algo.category)?.color || 'var(--blue-light)'}
                onSelect={onSelectAlgo}
              />
            ))}
          </div>
        </section>
      )}

      {/* Algorithm sections */}
      {!search.trim() && visibleCategories.map(cat => (
        <section key={cat.id} className="category-section">
          <div className="category-header" style={{ '--cat-color': cat.color }}>
            <div className="category-title-row">
              <span className="cat-icon-big">{cat.icon}</span>
              <div>
                <h2 className="category-title" style={{ color: cat.color }}>{cat.label} Algorithms</h2>
                <p className="category-desc">{cat.desc}</p>
              </div>
            </div>
            <span className="category-count">{getByCategory(cat.id).length} algorithms</span>
          </div>

          <div className="algo-grid">
            {getByCategory(cat.id).map(algo => (
              <AlgoCard
                key={algo.id}
                algo={algo}
                categoryColor={cat.color}
                onSelect={onSelectAlgo}
              />
            ))}
          </div>
        </section>
      ))}

      {/* ===== DATA STRUCTURES SECTION ===== */}
      {!search.trim() && (
        <section className="category-section">
          <div className="category-header" style={{ '--cat-color': 'var(--cat-tree)' }}>
            <div className="category-title-row">
              <span className="cat-icon-big">⬛</span>
              <div>
                <h2 className="category-title" style={{ color: 'var(--cat-tree)' }}>
                  Data Structures
                </h2>
                <p className="category-desc">
                  Interactive — add, delete, search and traverse each structure
                </p>
              </div>
            </div>
            <span className="category-count">{DS_REGISTRY.length} structures</span>
          </div>

          <div className="algo-grid">
            {DS_REGISTRY.map(ds => (
              <button
                key={ds.id}
                className="algo-card"
                style={{ '--card-color': 'var(--cat-tree)' }}
                onClick={() => onSelectDS(ds.id)}
              >
                <div className="algo-card-top">
                  <div className="algo-card-info">
                    <div className="algo-card-header">
                      <span className="algo-emoji">{ds.emoji}</span>
                      <span className="algo-label">{ds.label}</span>
                    </div>
                    <span
                      className="algo-difficulty"
                      style={{ color: `var(--diff-${ds.difficulty})` }}
                    >
                      {ds.difficulty}
                    </span>
                  </div>
                </div>
                <div className="algo-complexity">
                  {Object.entries(ds.complexities || {}).slice(0, 2).map(([op, val]) => (
                    <span key={op} className="complexity-avg" style={{ color: 'var(--cat-tree)' }}>
                      {op}: {val}
                    </span>
                  ))}
                </div>
                <p className="algo-desc">{ds.description}</p>
                <div className="algo-card-footer">
                  <span className="algo-insight">
                    ⚡ {ds.operations?.slice(0, 4).join(' · ')}
                    {ds.operations?.length > 4 ? ' …' : ''}
                  </span>
                </div>
                <div className="algo-card-cta" style={{ color: 'var(--cat-tree)' }}>
                  Explore →
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
