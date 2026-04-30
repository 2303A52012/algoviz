import React, { useState, useRef } from 'react';
import './Visualizer.css';

const VISIBLE_LIMIT = 8; // max plates shown at once
const INITIAL_STACK = [3, 17, 42, 8]; // bottom to top

const PLATE_COLORS = [
  { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
  { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  { bg: '#2d1f08', border: '#f59e0b', text: '#fcd34d' },
  { bg: '#083344', border: '#06b6d4', text: '#67e8f9' },
  { bg: '#4a0d2a', border: '#ec4899', text: '#f9a8d4' },
  { bg: '#1a0a2e', border: '#8b5cf6', text: '#c4b5fd' },
  { bg: '#14532d', border: '#16a34a', text: '#4ade80' },
];

function useStepRunner() {
  const timerRef = useRef(null);
  const run = (steps, delay = 400, onDone) => {
    clearTimeout(timerRef.current);
    let i = 0;
    const tick = () => {
      if (i >= steps.length) { onDone?.(); return; }
      steps[i++]();
      timerRef.current = setTimeout(tick, delay);
    };
    tick();
  };
  const stop = () => clearTimeout(timerRef.current);
  return { run, stop };
}

// ---- Single Plate ----
function Plate({ value, colorIdx, state, isTop }) {
  const color = PLATE_COLORS[colorIdx % PLATE_COLORS.length];
  const stateStyle = {
    pushing:  { transform: 'translateY(-10px)', boxShadow: `0 0 20px ${color.border}88` },
    popping:  { transform: 'translateY(-18px)', opacity: 0.2 },
    peeking:  { transform: 'scale(1.04)',       boxShadow: `0 0 22px ${color.border}` },
    sinking:  { transform: 'translateY(10px)',  opacity: 0.4 },
    rising:   { transform: 'translateY(-8px)',  opacity: 0.6 },
    overflow: { background: '#7f1d1d !important', borderColor: '#ef4444' },
    default:  {},
  };

  return (
    <div
      className={`sk-plate sk-plate-${state}`}
      style={{
        background: color.bg,
        border: `2px solid ${color.border}`,
        color: color.text,
        transition: 'all 0.3s ease',
        ...(stateStyle[state] || {}),
      }}
    >
      <span className="sk-plate-val">{value}</span>
      {isTop && state !== 'popping' && state !== 'sinking' && (
        <span className="sk-plate-top-label">← TOP</span>
      )}
    </div>
  );
}

// ---- Hidden block at base ----
function HiddenBlock({ count }) {
  if (count <= 0) return null;
  return (
    <div className="sk-hidden-block">
      <span className="sk-hidden-icon">▒</span>
      <span className="sk-hidden-text">
        {count} element{count !== 1 ? 's' : ''} hidden below
      </span>
      <span className="sk-hidden-hint">(pop to reveal)</span>
    </div>
  );
}

// ---- Stack Visual ----
function StackVisual({ stack, topState, overflowing, underflowing }) {
  const total   = stack.length;
  const hidden  = Math.max(0, total - VISIBLE_LIMIT);
  // visible = top VISIBLE_LIMIT items (highest indices)
  const visible = stack.slice(hidden); // bottom-to-top order

  return (
    <div className="sk-visual">
      {/* Total / visible counter */}
      <div className="sk-counter-bar">
        <span className="sk-counter-total">
          Total: <b>{total}</b>
        </span>
        <span className="sk-counter-visible">
          Showing: <b>{visible.length}</b> of <b>{total}</b>
        </span>
        {hidden > 0 && (
          <span className="sk-counter-hidden">
            Hidden: <b>{hidden}</b>
          </span>
        )}
      </div>

      {/* Warnings */}
      {overflowing  && <div className="sk-overflow-warn">⚠ Already empty — nothing to pop!</div>}
      {underflowing && <div className="sk-underflow-warn">⚠ Stack is empty!</div>}

      {/* Stack container */}
      <div className="sk-container">
        {/* Empty slots at top (only when stack has < VISIBLE_LIMIT) */}
        {visible.length < VISIBLE_LIMIT && Array.from(
          { length: VISIBLE_LIMIT - visible.length }, (_, i) => (
            <div key={`empty-${i}`} className="sk-empty-slot">
              <span className="sk-empty-label">—</span>
            </div>
          )
        )}

        {/* Visible plates — rendered top-to-bottom (reversed) */}
        {[...visible].reverse().map((item, revIdx) => {
          const actualIdx = visible.length - 1 - revIdx; // index within visible array
          const isTop     = actualIdx === visible.length - 1;
          return (
            <Plate
              key={item.id}
              value={item.val}
              colorIdx={item.colorIdx}
              state={isTop ? topState : 'default'}
              isTop={isTop}
            />
          );
        })}

        {/* Hidden block */}
        <HiddenBlock count={hidden} />

        {/* Base */}
        <div className="sk-base">
          <span className="sk-base-label">STACK BASE</span>
        </div>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div className="sk-empty-state">isEmpty() → <span style={{color:'var(--green-light)'}}>true</span></div>
      )}
    </div>
  );
}

// ---- Operation panel ----
function OpPanel({ onPush, onPop, onPeek, onReset, onRandom, onCustomInit, disabled }) {
  const [val, setVal]       = useState('');
  const [op, setOp]         = useState('push');
  const [customSize, setCustomSize] = useState('');

  const ops = [
    { id: 'push',   label: 'Push',  icon: '↓' },
    { id: 'pop',    label: 'Pop',   icon: '↑' },
    { id: 'peek',   label: 'Peek',  icon: '👁' },
    { id: 'custom', label: 'Init',  icon: '⚙' },
  ];

  const hints = {
    push:   'O(1) — add to top. Unlimited capacity.',
    pop:    'O(1) — remove from top. Hidden elements slide back up.',
    peek:   'O(1) — view top without removing.',
    custom: 'Initialize stack with N random elements to explore the hidden block.',
  };

  const handleGo = () => {
    if (op === 'push') {
      const v = parseInt(val);
      onPush(isNaN(v) ? Math.floor(Math.random() * 90) + 5 : v);
      setVal('');
    }
    if (op === 'pop')  onPop();
    if (op === 'peek') onPeek();
    if (op === 'custom') {
      const n = parseInt(customSize);
      if (!isNaN(n) && n > 0 && n <= 50) onCustomInit(n);
    }
  };

  return (
    <div className="sk-op-panel">
      <div className="sk-op-tabs">
        {ops.map(o => (
          <button
            key={o.id}
            className={`sk-op-tab ${op === o.id ? 'active' : ''}`}
            onClick={() => setOp(o.id)}
            disabled={disabled}
          >
            <span className="sk-op-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>

      <div className="sk-op-inputs">
        {op === 'push' && (
          <div className="sk-input-group">
            <label>Value <span className="sk-input-hint-inline">(blank = random)</span></label>
            <input
              type="number" className="sk-input"
              placeholder="e.g. 42"
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              disabled={disabled}
            />
          </div>
        )}

        {op === 'custom' && (
          <div className="sk-input-group">
            <label>Stack size <span className="sk-input-hint-inline">(1–50)</span></label>
            <input
              type="number" className="sk-input"
              placeholder="e.g. 12"
              value={customSize}
              onChange={e => setCustomSize(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              disabled={disabled}
              min="1" max="50"
            />
          </div>
        )}

        <button className="sk-go-btn" onClick={handleGo} disabled={disabled}>
          {op === 'push'   ? '↓ Push'
          : op === 'pop'   ? '↑ Pop'
          : op === 'peek'  ? '👁 Peek'
          : '⚙ Initialize'}
        </button>

        <button className="sk-rand-btn" onClick={onRandom} disabled={disabled}>
          ⚡ Random
        </button>

        <button className="sk-reset-btn" onClick={onReset} disabled={disabled}>
          ↺ Reset
        </button>
      </div>

      <div className="sk-op-hint">{hints[op]}</div>
    </div>
  );
}

// ---- State info panel ----
function StatePanel({ stack }) {
  const total = stack.length;
  const top   = total > 0 ? stack[total - 1].val : null;
  return (
    <div className="sk-state-panel">
      <div className="sk-state-row">
        <span className="sk-state-label">Top</span>
        <span className="sk-state-val">{top ?? '—'}</span>
      </div>
      <div className="sk-state-row">
        <span className="sk-state-label">Size</span>
        <span className="sk-state-val">{total}</span>
      </div>
      <div className="sk-state-row">
        <span className="sk-state-label">Visible</span>
        <span className="sk-state-val">{Math.min(total, VISIBLE_LIMIT)}</span>
      </div>
      <div className="sk-state-row">
        <span className="sk-state-label">Hidden</span>
        <span className="sk-state-val sk-hidden-val">
          {Math.max(0, total - VISIBLE_LIMIT)}
        </span>
      </div>
      <div className="sk-state-row">
        <span className="sk-state-label">isEmpty()</span>
        <span className={`sk-state-val ${total === 0 ? 'sk-true' : 'sk-false'}`}>
          {total === 0 ? 'true' : 'false'}
        </span>
      </div>
    </div>
  );
}

// ---- Main component ----
export default function Visualizer() {
  const colorCounter = useRef(0);

  const makeItem = (val) => ({
    id: Date.now() + Math.random(),
    val,
    colorIdx: colorCounter.current++,
  });

  const [stack, setStack]       = useState(() => INITIAL_STACK.map(v => makeItem(v)));
  const [topState, setTopState] = useState('default');
  const [log, setLog]           = useState('Push to add elements. Stack shows top 8 — extras compress into the hidden block at base.');
  const [running, setRunning]   = useState(false);
  const [overflowing, setOverflowing]   = useState(false);
  const [underflowing, setUnderflowing] = useState(false);
  const { run, stop } = useStepRunner();

  const clearWarnings = () => { setOverflowing(false); setUnderflowing(false); };

  // PUSH
  const handlePush = (val) => {
    clearWarnings();
    setRunning(true);
    const newItem = makeItem(val);
    const willHide = stack.length >= VISIBLE_LIMIT;

    run([
      () => {
        if (willHide) setTopState('sinking'); // old top sinks
        setStack(prev => [...prev, newItem]);
        setTopState('pushing');
        setLog(
          willHide
            ? 'Pushing ' + val + '... bottom visible plate sinks into hidden block.'
            : 'Pushing ' + val + ' onto the stack...'
        );
      },
      () => {
        setTopState('default');
        const newTotal = stack.length + 1;
        const newHidden = Math.max(0, newTotal - VISIBLE_LIMIT);
        setLog(
          '✓ Pushed ' + val + '. Total: ' + newTotal +
          (newHidden > 0 ? '. Hidden: ' + newHidden + ' elements below.' : '. All visible.')
        );
        setRunning(false);
      },
    ], 420);
  };

  // POP
  const handlePop = () => {
    clearWarnings();
    if (stack.length === 0) {
      setUnderflowing(true);
      setLog('✗ Stack Underflow! Stack is empty — nothing to pop.');
      setTimeout(() => setUnderflowing(false), 2000);
      return;
    }
    setRunning(true);
    const topVal  = stack[stack.length - 1].val;
    const hadHidden = stack.length > VISIBLE_LIMIT;

    run([
      () => {
        setTopState('popping');
        setLog('Popping ' + topVal + ' from top...' + (hadHidden ? ' Hidden element will rise up.' : ''));
      },
      () => {
        setStack(prev => prev.slice(0, -1));
        setTopState(hadHidden ? 'rising' : 'default');
      },
      () => {
        setTopState('default');
        const newTotal = stack.length - 1;
        const newHidden = Math.max(0, newTotal - VISIBLE_LIMIT);
        setLog(
          '✓ Popped ' + topVal + '. Total: ' + newTotal +
          (newHidden > 0 ? '. Still ' + newHidden + ' hidden.' : hadHidden ? '. All elements now visible!' : '.')
        );
        setRunning(false);
      },
    ], 400);
  };

  // PEEK
  const handlePeek = () => {
    clearWarnings();
    if (stack.length === 0) {
      setLog('Stack is empty — nothing to peek. isEmpty() → true.');
      return;
    }
    const topVal = stack[stack.length - 1].val;
    setRunning(true);
    run([
      () => { setTopState('peeking'); setLog('Peeking at top element...'); },
      () => { setLog('✓ Top = ' + topVal + '. Not removed. O(1). Total size = ' + stack.length + '.'); },
      () => { setTopState('default'); setRunning(false); },
    ], 500);
  };

  // CUSTOM INIT — initialize stack with N random elements
  const handleCustomInit = (n) => {
    stop();
    colorCounter.current = 0;
    setRunning(false);
    setTopState('default');
    clearWarnings();
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
    setStack(values.map(v => makeItem(v)));
    const hidden = Math.max(0, n - VISIBLE_LIMIT);
    setLog(
      'Initialized stack with ' + n + ' elements. ' +
      (hidden > 0
        ? 'Showing top ' + VISIBLE_LIMIT + '. ' + hidden + ' hidden in the block below.'
        : 'All ' + n + ' elements visible.')
    );
  };

  // RANDOM
  const handleRandom = () => {
    stop();
    colorCounter.current = 0;
    setRunning(false);
    setTopState('default');
    clearWarnings();
    const size   = 3 + Math.floor(Math.random() * 10); // 3–12 elements
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    setStack(values.map(v => makeItem(v)));
    const hidden = Math.max(0, size - VISIBLE_LIMIT);
    setLog(
      '⚡ Random stack: ' + size + ' elements. ' +
      (hidden > 0 ? hidden + ' hidden below.' : 'All visible.')
    );
  };

  // RESET
  const handleReset = () => {
    stop();
    colorCounter.current = 0;
    setStack(INITIAL_STACK.map(v => makeItem(v)));
    setTopState('default');
    clearWarnings();
    setRunning(false);
    setLog('Reset to initial state.');
  };

  return (
    <div className="sk-root">
      <div className="sk-main-layout">
        {/* Left: stack visual */}
        <StackVisual
          stack={stack}
          topState={topState}
          overflowing={overflowing}
          underflowing={underflowing}
        />

        {/* Right: controls + state */}
        <div className="sk-right-panel">
          <OpPanel
            onPush={handlePush}
            onPop={handlePop}
            onPeek={handlePeek}
            onReset={handleReset}
            onRandom={handleRandom}
            onCustomInit={handleCustomInit}
            disabled={running}
          />

          <StatePanel stack={stack} />

          {/* LIFO reminder */}
          <div className="sk-lifo-box">
            <span className="sk-lifo-title">LIFO Principle</span>
            <div className="sk-lifo-diagram">
              <span className="sk-lifo-push">Push →</span>
              <div className="sk-lifo-arrow-box">TOP</div>
              <span className="sk-lifo-pop">← Pop</span>
            </div>
            <span className="sk-lifo-desc">
              Last In, First Out — only the top is ever touched
            </span>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="sk-log">
        <span className="sk-log-msg">{log}</span>
      </div>

      {/* Complexity */}
      <div className="sk-complexity-row">
        {[
          { op: 'Push',    val: 'O(1)', good: true  },
          { op: 'Pop',     val: 'O(1)', good: true  },
          { op: 'Peek',    val: 'O(1)', good: true  },
          { op: 'isEmpty', val: 'O(1)', good: true  },
          { op: 'Search',  val: 'O(n)', good: false },
        ].map(({ op, val, good }) => (
          <div key={op} className="sk-complexity-chip">
            <span className="sk-chip-op">{op}</span>
            <span className={`sk-chip-val ${good ? 'good' : 'bad'}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
