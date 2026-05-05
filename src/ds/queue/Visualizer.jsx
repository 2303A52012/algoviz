import React, { useState, useRef } from 'react';
import './Visualizer.css';

const VISIBLE_LIMIT = 7; // max cells shown at once
const INITIAL_QUEUE = [11, 34, 7, 52, 23]; // front to rear

const CELL_COLORS = [
  { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  { bg: '#2d1b6e', border: '#a855f7', text: '#d8b4fe' },
  { bg: '#0f2d1a', border: '#22c55e', text: '#86efac' },
  { bg: '#2d1f08', border: '#f59e0b', text: '#fcd34d' },
  { bg: '#083344', border: '#06b6d4', text: '#67e8f9' },
  { bg: '#4a0d2a', border: '#ec4899', text: '#f9a8d4' },
  { bg: '#14532d', border: '#16a34a', text: '#4ade80' },
  { bg: '#1a0a2e', border: '#8b5cf6', text: '#c4b5fd' },
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

// ---- Single Queue Cell ----
function QueueCell({ value, colorIdx, state, isFront, isRear }) {
  const color = CELL_COLORS[colorIdx % CELL_COLORS.length];
  const stateStyles = {
    default:   {},
    enqueuing: { transform: 'translateX(10px)', boxShadow: `0 0 18px ${color.border}88` },
    dequeuing: { transform: 'translateX(-10px)', opacity: 0.2 },
    peeking:   { transform: 'scale(1.06)',       boxShadow: `0 0 22px ${color.border}` },
    default:   {},
  };

  return (
    <div className="qu-cell-wrap">
      {/* Front / Rear labels above */}
      <div className="qu-cell-labels">
        {isFront && <span className="qu-label qu-label-front">FRONT</span>}
        {isRear  && <span className="qu-label qu-label-rear">REAR</span>}
        {!isFront && !isRear && <span className="qu-label-empty" />}
      </div>

      {/* The cell */}
      <div
        className={`qu-cell qu-cell-${state}`}
        style={{
          background: color.bg,
          border: `2px solid ${color.border}`,
          color: color.text,
          transition: 'all 0.3s ease',
          ...(stateStyles[state] || {}),
        }}
      >
        <span className="qu-cell-val">{value}</span>
      </div>

      {/* Arrow to next (except last) */}
      <div className="qu-cell-arrow">→</div>
    </div>
  );
}

// ---- Hidden block on the rear side ----
function HiddenRearBlock({ count }) {
  if (count <= 0) return null;
  return (
    <div className="qu-hidden-block qu-hidden-rear">
      <span className="qu-hidden-icon">▒</span>
      <span className="qu-hidden-text">{count} more at rear</span>
      <span className="qu-hidden-hint">(dequeue to reveal)</span>
    </div>
  );
}

// ---- Queue Lane Visual ----
function QueueVisual({ queue, frontState, rearState, underflowing }) {
  const total   = queue.length;
  // Always show the FRONT side — visible = first VISIBLE_LIMIT items (front to rear)
  const hiddenRear = Math.max(0, total - VISIBLE_LIMIT);
  const visible    = queue.slice(0, Math.min(total, VISIBLE_LIMIT)); // front-to-rear

  return (
    <div className="qu-visual">

      {/* Counter bar */}
      <div className="qu-counter-bar">
        <span>Total: <b>{total}</b></span>
        <span>Showing: <b>{Math.min(total, VISIBLE_LIMIT)}</b> of <b>{total}</b></span>
        {hiddenRear > 0 && <span className="qu-hidden-count">Hidden at rear: <b>{hiddenRear}</b></span>}
      </div>

      {/* Underflow warning */}
      {underflowing && (
        <div className="qu-underflow-warn">⚠ Queue is empty — nothing to dequeue!</div>
      )}

      {/* ENQUEUE label on right */}
      <div className="qu-side-labels">
        <span className="qu-side-dequeue">← DEQUEUE (front)</span>
        <span className="qu-side-enqueue">ENQUEUE (rear) →</span>
      </div>

      {/* Lane */}
      <div className="qu-lane">
        {/* Exit arrow on left */}
        <div className="qu-exit-arrow">
          <div className="qu-exit-box">OUT</div>
          <span className="qu-exit-chevron">◀</span>
        </div>

        {/* Lane track */}
        <div className="qu-track">
          {total === 0 ? (
            <div className="qu-empty-state">Queue is empty — isEmpty() → true</div>
          ) : (
            <>
              {/* Visible cells front→rear */}
              {visible.map((item, i) => {
                const isFront = i === 0;
                const isRear  = i === visible.length - 1 && hiddenRear === 0;
                const state   = isFront ? frontState : isRear ? rearState : 'default';
                return (
                  <QueueCell
                    key={item.id}
                    value={item.val}
                    colorIdx={item.colorIdx}
                    state={state}
                    isFront={isFront}
                    isRear={isRear}
                  />
                );
              })}

              {/* Hidden rear block */}
              {hiddenRear > 0 && <HiddenRearBlock count={hiddenRear} />}
            </>
          )}
        </div>

        {/* Entry arrow on right */}
        <div className="qu-entry-arrow">
          <span className="qu-entry-chevron">▶</span>
          <div className="qu-entry-box">IN</div>
        </div>
      </div>

      {/* Pointer row */}
      <div className="qu-pointer-row">
        <div className="qu-ptr qu-ptr-front">
          <span className="qu-ptr-arrow">↑</span>
          <span className="qu-ptr-label">front={total > 0 ? 0 : -1}</span>
        </div>
        <div className="qu-ptr qu-ptr-rear">
          <span className="qu-ptr-arrow">↑</span>
          <span className="qu-ptr-label">rear={total - 1}</span>
        </div>
      </div>
    </div>
  );
}

// ---- Operation Panel ----
function OpPanel({ onEnqueue, onDequeue, onPeek, onReset, onRandom, onCustomInit, disabled }) {
  const [val, setVal]       = useState('');
  const [op, setOp]         = useState('enqueue');
  const [customSize, setCustomSize] = useState('');

  const ops = [
    { id: 'enqueue', label: 'Enqueue', icon: '▶' },
    { id: 'dequeue', label: 'Dequeue', icon: '◀' },
    { id: 'peek',    label: 'Peek',    icon: '👁' },
    { id: 'custom',  label: 'Init',    icon: '⚙' },
  ];

  const hints = {
    enqueue: 'O(1) — add to rear. Element joins the back of the line.',
    dequeue: 'O(1) — remove from front. First element in is first out.',
    peek:    'O(1) — view front element without removing it.',
    custom:  'Initialize queue with N random elements (1–50).',
  };

  const handleGo = () => {
    if (op === 'enqueue') {
      const v = parseInt(val);
      onEnqueue(isNaN(v) ? Math.floor(Math.random() * 90) + 5 : v);
      setVal('');
    }
    if (op === 'dequeue') onDequeue();
    if (op === 'peek')    onPeek();
    if (op === 'custom') {
      const n = parseInt(customSize);
      if (!isNaN(n) && n > 0 && n <= 50) onCustomInit(n);
    }
  };

  return (
    <div className="qu-op-panel">
      <div className="qu-op-tabs">
        {ops.map(o => (
          <button
            key={o.id}
            className={`qu-op-tab ${op === o.id ? 'active' : ''}`}
            onClick={() => setOp(o.id)}
            disabled={disabled}
          >
            <span className="qu-op-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>

      <div className="qu-op-inputs">
        {op === 'enqueue' && (
          <div className="qu-input-group">
            <label>Value <span className="qu-hint-inline">(blank = random)</span></label>
            <input
              type="number" className="qu-input"
              placeholder="e.g. 42"
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              disabled={disabled}
            />
          </div>
        )}

        {op === 'custom' && (
          <div className="qu-input-group">
            <label>Queue size <span className="qu-hint-inline">(1–50)</span></label>
            <input
              type="number" className="qu-input"
              placeholder="e.g. 10"
              value={customSize}
              onChange={e => setCustomSize(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              disabled={disabled}
              min="1" max="50"
            />
          </div>
        )}

        <button className="qu-go-btn" onClick={handleGo} disabled={disabled}>
          {op === 'enqueue' ? '▶ Enqueue'
          : op === 'dequeue' ? '◀ Dequeue'
          : op === 'peek'    ? '👁 Peek'
          : '⚙ Initialize'}
        </button>
        <button className="qu-rand-btn" onClick={onRandom} disabled={disabled}>⚡ Random</button>
        <button className="qu-reset-btn" onClick={onReset}  disabled={disabled}>↺ Reset</button>
      </div>

      <div className="qu-op-hint">{hints[op]}</div>
    </div>
  );
}

// ---- State Panel ----
function StatePanel({ queue }) {
  const total = queue.length;
  const front = total > 0 ? queue[0].val : null;
  const rear  = total > 0 ? queue[total - 1].val : null;
  return (
    <div className="qu-state-panel">
      {[
        { label: 'Front',    val: front ?? '—', color: 'var(--green-light)' },
        { label: 'Rear',     val: rear  ?? '—', color: '#fcd34d'            },
        { label: 'Size',     val: total,         color: 'var(--blue-light)'  },
        { label: 'Visible',  val: Math.min(total, VISIBLE_LIMIT), color: 'var(--blue-light)' },
        { label: 'Hidden',   val: Math.max(0, total - VISIBLE_LIMIT), color: '#fcd34d' },
        { label: 'isEmpty()', val: total === 0 ? 'true' : 'false',
          color: total === 0 ? 'var(--green-light)' : 'var(--red-light)' },
      ].map(({ label, val, color }) => (
        <div key={label} className="qu-state-row">
          <span className="qu-state-label">{label}</span>
          <span className="qu-state-val" style={{ color }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Main ----
export default function Visualizer() {
  const colorCounter = useRef(0);

  const makeItem = (val) => ({
    id: Date.now() + Math.random(),
    val,
    colorIdx: colorCounter.current++,
  });

  const [queue, setQueue]         = useState(() => INITIAL_QUEUE.map(v => makeItem(v)));
  const [frontState, setFrontState] = useState('default');
  const [rearState, setRearState]   = useState('default');
  const [log, setLog]               = useState('Enqueue adds to rear ▶, Dequeue removes from front ◀. FIFO — fair order.');
  const [running, setRunning]       = useState(false);
  const [underflowing, setUnderflowing] = useState(false);
  const { run, stop } = useStepRunner();

  // ENQUEUE
  const handleEnqueue = (val) => {
    setUnderflowing(false);
    setRunning(true);
    const newItem = makeItem(val);
    const willHide = queue.length >= VISIBLE_LIMIT;

    run([
      () => {
        setQueue(prev => [...prev, newItem]);
        setRearState('enqueuing');
        setLog(
          willHide
            ? 'Enqueuing ' + val + ' at rear... (exceeds visible limit, added to hidden block)'
            : 'Enqueuing ' + val + ' at rear of queue...'
        );
      },
      () => {
        setRearState('default');
        const newTotal = queue.length + 1;
        const hidden   = Math.max(0, newTotal - VISIBLE_LIMIT);
        setLog(
          '✓ Enqueued ' + val + ' at rear. Total: ' + newTotal +
          (hidden > 0 ? '. ' + hidden + ' hidden at rear.' : '.')
        );
        setRunning(false);
      },
    ], 420);
  };

  // DEQUEUE
  const handleDequeue = () => {
    setUnderflowing(false);
    if (queue.length === 0) {
      setUnderflowing(true);
      setLog('✗ Queue is empty — nothing to dequeue!');
      setTimeout(() => setUnderflowing(false), 2000);
      return;
    }
    setRunning(true);
    const frontVal  = queue[0].val;
    const hadHidden = queue.length > VISIBLE_LIMIT;

    run([
      () => {
        setFrontState('dequeuing');
        setLog('Dequeuing ' + frontVal + ' from front...' + (hadHidden ? ' Hidden element will shift into view.' : ''));
      },
      () => {
        setQueue(prev => prev.slice(1));
        setFrontState('default');
      },
      () => {
        const newTotal = queue.length - 1;
        const hidden   = Math.max(0, newTotal - VISIBLE_LIMIT);
        setLog(
          '✓ Dequeued ' + frontVal + '. Total: ' + newTotal +
          (hidden > 0 ? '. Still ' + hidden + ' hidden.' : hadHidden ? '. All now visible!' : '.')
        );
        setRunning(false);
      },
    ], 400);
  };

  // PEEK
  const handlePeek = () => {
    setUnderflowing(false);
    if (queue.length === 0) {
      setLog('Queue is empty — nothing to peek. isEmpty() → true.');
      return;
    }
    const frontVal = queue[0].val;
    setRunning(true);
    run([
      () => { setFrontState('peeking'); setLog('Peeking at front element...'); },
      () => { setLog('✓ Front = ' + frontVal + '. Not removed. O(1). Queue size = ' + queue.length + '.'); },
      () => { setFrontState('default'); setRunning(false); },
    ], 500);
  };

  // CUSTOM INIT
  const handleCustomInit = (n) => {
    stop();
    colorCounter.current = 0;
    setRunning(false);
    setFrontState('default');
    setRearState('default');
    setUnderflowing(false);
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
    setQueue(values.map(v => makeItem(v)));
    const hidden = Math.max(0, n - VISIBLE_LIMIT);
    setLog(
      'Initialized with ' + n + ' elements. ' +
      (hidden > 0 ? 'Showing front ' + VISIBLE_LIMIT + '. ' + hidden + ' hidden at rear.' : 'All visible.')
    );
  };

  // RANDOM
  const handleRandom = () => {
    stop();
    colorCounter.current = 0;
    setRunning(false);
    setFrontState('default');
    setRearState('default');
    setUnderflowing(false);
    const size   = 3 + Math.floor(Math.random() * 10);
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    setQueue(values.map(v => makeItem(v)));
    const hidden = Math.max(0, size - VISIBLE_LIMIT);
    setLog('⚡ Random queue: ' + size + ' elements. ' + (hidden > 0 ? hidden + ' hidden at rear.' : 'All visible.'));
  };

  // RESET
  const handleReset = () => {
    stop();
    colorCounter.current = 0;
    setQueue(INITIAL_QUEUE.map(v => makeItem(v)));
    setFrontState('default');
    setRearState('default');
    setUnderflowing(false);
    setRunning(false);
    setLog('Reset to initial state.');
  };

  return (
    <div className="qu-root">
      <QueueVisual
        queue={queue}
        frontState={frontState}
        rearState={rearState}
        underflowing={underflowing}
      />

      <div className="qu-bottom-layout">
        <OpPanel
          onEnqueue={handleEnqueue}
          onDequeue={handleDequeue}
          onPeek={handlePeek}
          onReset={handleReset}
          onRandom={handleRandom}
          onCustomInit={handleCustomInit}
          disabled={running}
        />
        <StatePanel queue={queue} />
      </div>

      {/* FIFO vs LIFO reminder */}
      <div className="qu-fifo-box">
        <div className="qu-fifo-row">
          <div className="qu-fifo-item">
            <span className="qu-fifo-title">Queue (FIFO)</span>
            <div className="qu-fifo-diagram">
              <span className="qu-fifo-in">IN →</span>
              <div className="qu-fifo-track">
                <span>3</span><span>2</span><span>1</span>
              </div>
              <span className="qu-fifo-out">→ OUT</span>
            </div>
            <span className="qu-fifo-desc">First In, First Out</span>
          </div>
          <div className="qu-fifo-vs">VS</div>
          <div className="qu-fifo-item">
            <span className="qu-fifo-title qu-lifo-title">Stack (LIFO)</span>
            <div className="qu-fifo-diagram">
              <span className="qu-fifo-in">IN ↓</span>
              <div className="qu-lifo-track">
                <span>3</span><span>2</span><span>1</span>
              </div>
              <span className="qu-fifo-out">↑ OUT</span>
            </div>
            <span className="qu-fifo-desc">Last In, First Out</span>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="qu-log">
        <span className="qu-log-msg">{log}</span>
      </div>

      {/* Complexity */}
      <div className="qu-complexity-row">
        {[
          { op: 'Enqueue', val: 'O(1)', good: true  },
          { op: 'Dequeue', val: 'O(1)', good: true  },
          { op: 'Peek',    val: 'O(1)', good: true  },
          { op: 'isEmpty', val: 'O(1)', good: true  },
          { op: 'Search',  val: 'O(n)', good: false },
        ].map(({ op, val, good }) => (
          <div key={op} className="qu-complexity-chip">
            <span className="qu-chip-op">{op}</span>
            <span className={`qu-chip-val ${good ? 'good' : 'bad'}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
