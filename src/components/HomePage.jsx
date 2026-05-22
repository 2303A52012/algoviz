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
    'cpu-sched': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {/* Mini Gantt bars */}
        {[[2,14,10],[14,8,22],[24,18,10],[44,12,10]].map(([x,w,h],i) => (
          <rect key={i} x={x} y={36-h} width={w} height={h} rx="1"
            fill={i===1?c:c+'66'} opacity={i===1?1:.7}/>
        ))}
        {/* CPU box */}
        <rect x="2" y="2" width="16" height="12" rx="2" fill={c+'22'} stroke={c} strokeWidth="1"/>
        <text x="10" y="11" textAnchor="middle" fill={c} fontSize="6" fontWeight="bold">CPU</text>
        {/* Queue */}
        {[0,1,2].map(i => <rect key={i} x={22+i*10} y="4" width="8" height="8" rx="1" fill={c+'44'} stroke={c+'66'} strokeWidth="1"/>)}
        <text x="55" y="10" textAnchor="middle" fill={c+'88'} fontSize="5">Q</text>
      </svg>
    ),
    'disk-sched': (
      <svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        {/* Track line */}
        <line x1="4" y1="28" x2="56" y2="28" stroke={dim} strokeWidth="2"/>
        {/* Head movement path */}
        <polyline points="8,28 28,12 16,20 48,8 38,16 52,28"
          fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2,1.5"/>
        {/* Dots */}
        {[8,28,16,48,38,52].map((x,i) => (
          <circle key={i} cx={x} cy={i%2===0?28:[12,20,8,16][Math.floor(i/2)]} r="1.5"
            fill={i===0?c:c+'88'}/>
        ))}
        {/* Moving head */}
        <circle cx="28" cy="12" r="3" fill={c} opacity=".9">
          <animate attributeName="cx" values="8;28;16;48;38;52" dur="3s" repeatCount="indefinite"/>
        </circle>
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

function ItemCard({ item, categoryColor, onSelect }) {
  const isDS = item.category === 'ds';
  const isLocked = isDS && item.status === 'under-construction';

  return (
    <button
      className={`algo-card ${isLocked ? 'algo-card-locked' : ''}`}
      style={{
        '--card-color': categoryColor,
        opacity: isLocked ? 0.7 : 1
      }}
      onClick={() => !isLocked && onSelect(item)}
      disabled={isLocked}
    >
      {isLocked && (
        <div className="algo-card-badge">🔨 Under Construction</div>
      )}

      <div className="algo-card-top">
        {item.visualStyle ? (
          <PreviewThumb visualStyle={item.visualStyle} color={categoryColor} />
        ) : (
          <div className="preview-thumb-ds">
            <span className="ds-icon-placeholder">{item.emoji}</span>
          </div>
        )}
        <div className="algo-card-info">
          <div className="algo-card-header">
            <span className="algo-emoji">{item.emoji}</span>
            <span className="algo-label">{item.label}</span>
          </div>
          <span
            className="algo-difficulty"
            style={{ color: DIFFICULTY_COLOR[item.difficulty] || 'var(--text-muted)' }}
          >
            {DIFFICULTY_LABEL[item.difficulty] || item.difficulty}
          </span>
        </div>
      </div>

      <div className="algo-complexity">
        {isDS ? (
          Object.entries(item.complexities || {}).slice(0, 2).map(([op, val]) => (
            <span key={op} className="complexity-avg" style={{ color: categoryColor }}>
              {op}: {val}
            </span>
          ))
        ) : (
          <>
            <span className="complexity-avg">{item.timeComplexity?.average}</span>
            <span className="complexity-space">space {item.spaceComplexity}</span>
          </>
        )}
      </div>

      <p className="algo-desc">{item.description}</p>

      <div className="algo-card-footer">
        <span className="algo-insight">
          {isDS ? (
            `⚡ ${item.operations?.slice(0, 3).join(' · ')}${item.operations?.length > 3 ? ' …' : ''}`
          ) : (
            `💡 ${item.keyInsight}`
          )}
        </span>
      </div>

      <div className="algo-card-cta" style={{ color: categoryColor }}>
        {isLocked ? 'Coming Soon' : isDS ? 'Explore →' : 'Visualize →'}
      </div>
    </button>
  );
}

export default function HomePage({ onSelectAlgo, onSelectDS, onSelectOS }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');

  const fullRegistry = [...REGISTRY, ...DS_REGISTRY];

  const filteredItems = search.trim()
    ? fullRegistry.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
      )
    : null;

  const visibleCategories = activeCategory
    ? CATEGORIES.filter(c => c.id === activeCategory)
    : CATEGORIES;

  const handleSelect = (item) => {
    if (item.category === 'ds') {
      onSelectDS(item.id);
    } else {
      onSelectAlgo(item.id);
    }
  };

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
          Explore data structures interactively.
        </p>

        <div className="hero-stats">
          {[
            [REGISTRY.length.toString(), 'Algorithms'],
            [DS_REGISTRY.length.toString(), 'Structures'],
            [CATEGORIES.length.toString(), 'Categories'],
            ['∞', 'Free']
          ].map(([v, l]) => (
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
          placeholder="Search algorithms & structures..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search algorithms and data structures"
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
                <p className="category-desc">{filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found</p>
              </div>
            </div>
          </div>
          <div className="algo-grid">
            {filteredItems.length === 0 && (
              <div style={{ padding: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
                No results found for "{search}".
              </div>
            )}
            {filteredItems.map(item => (
              <ItemCard
                key={`${item.category}-${item.id}`}
                item={item}
                categoryColor={CATEGORIES.find(c => c.id === item.category)?.color || 'var(--blue-light)'}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main sections */}
      {!search.trim() && visibleCategories.map(cat => (
        <section key={cat.id} className="category-section">
          <div className="category-header" style={{ '--cat-color': cat.color }}>
            <div className="category-title-row">
              <span className="cat-icon-big">{cat.icon}</span>
              <div>
                <h2 className="category-title" style={{ color: cat.color }}>{cat.label} {cat.id !== 'ds' ? 'Algorithms' : ''}</h2>
                <p className="category-desc">{cat.desc}</p>
              </div>
            </div>
            <span className="category-count">{getByCategory(cat.id).length} {cat.id === 'ds' ? 'structures' : 'algorithms'}</span>
          </div>

          <div className="algo-grid">
            {getByCategory(cat.id).map(item => (
              <ItemCard
                key={`${item.category}-${item.id}`}
                item={item}
                categoryColor={cat.color}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>
      ))}

    </div>
  );
}
