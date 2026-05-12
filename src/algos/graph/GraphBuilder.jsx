import React, { useState, useRef, useCallback } from 'react';
import { NODE_LABELS } from './graphPresets';
import './GraphBuilder.css';

const MODES = [
  { id: 'addNode', icon: '⊕', label: 'Add Node' },
  { id: 'addEdge', icon: '⟷', label: 'Add Edge' },
  { id: 'move',    icon: '✥',  label: 'Move' },
  { id: 'setWeight', icon: '⚖', label: 'Set Weight', weightedOnly: true },
  { id: 'setStart',icon: '▶',  label: 'Set Start' },
  { id: 'setEnd',  icon: '⬛', label: 'Set End' },
  { id: 'delete',  icon: '✕',  label: 'Delete' },
];

const INSTRUCTIONS = {
  addNode:  'Click on the canvas to place a new node',
  addEdge:  'Click a source node, then click a target node to connect them',
  move:     'Click and drag any node to reposition it',
  setWeight: 'Click an edge to change its weight',
  setStart: 'Click a node to make it the Start node',
  setEnd:   'Click a node to make it the End node',
  delete:   'Click a node or edge to delete it',
};

export default function GraphBuilder({ nodes, edges, startNode, endNode, onChange, disabled, weighted }) {
  const svgRef  = useRef(null);
  const [mode, setMode]               = useState('addNode');
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging]         = useState(null); // { id, ox, oy }
  const [mousePos, setMousePos]         = useState({ x: 0, y: 0 });
  const [hoveredEdge, setHoveredEdge]   = useState(null);
  const [editingWeight, setEditingWeight] = useState(null); // { a, b, weight, px, py }

  const getSVGCoords = useCallback((e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(25, Math.min(815, ((e.clientX - rect.left) / rect.width) * 840)),
      y: Math.max(25, Math.min(375, ((e.clientY - rect.top)  / rect.height) * 400)),
    };
  }, []);

  const nextLabel = () => {
    const used = new Set(nodes.map(n => n.id));
    return NODE_LABELS.split('').find(l => !used.has(l)) || `N${nodes.length}`;
  };

  const edgeKey = (a, b) => [a, b].sort().join('-');

  const handleSVGClick = (e) => {
    if (disabled) return;
    if (e.target !== svgRef.current && e.target.tagName !== 'rect' && e.target.tagName !== 'circle' && !e.target.classList.contains('gb-bg')) return;
    if (e.target.tagName === 'circle') return;
    if (mode !== 'addNode') return;
    const { x, y } = getSVGCoords(e);
    const id = nextLabel();
    const newNodes = [...nodes, { id, x, y }];
    onChange({
      nodes: newNodes, edges,
      startNode: nodes.length === 0 ? id : startNode,
      endNode:   nodes.length === 1 && !endNode ? id : endNode,
    });
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (disabled) return;
    if (mode === 'addEdge') {
      if (!selectedNode) { setSelectedNode(nodeId); return; }
      if (selectedNode === nodeId) { setSelectedNode(null); return; }
      const ek = edgeKey(selectedNode, nodeId);
      const exists = edges.some(([a,b]) => edgeKey(a,b) === ek);
      if (!exists) {
        const newEdge = weighted ? [selectedNode, nodeId, 1] : [selectedNode, nodeId];
        onChange({ nodes, edges: [...edges, newEdge], startNode, endNode });
      }
      setSelectedNode(null);
    } else if (mode === 'setStart') {
      onChange({ nodes, edges, startNode: nodeId, endNode });
    } else if (mode === 'setEnd') {
      onChange({ nodes, edges, startNode, endNode: nodeId });
    } else if (mode === 'delete') {
      onChange({
        nodes: nodes.filter(n => n.id !== nodeId),
        edges: edges.filter(([a,b]) => a !== nodeId && b !== nodeId),
        startNode: startNode === nodeId ? null : startNode,
        endNode:   endNode   === nodeId ? null : endNode,
      });
      setSelectedNode(null);
    }
  };

  const handleEdgeClick = (e, a, b) => {
    e.stopPropagation();
    if (disabled) return;
    if (mode === 'delete') {
      const ek = edgeKey(a, b);
      onChange({ nodes, edges: edges.filter(([x,y]) => edgeKey(x,y) !== ek), startNode, endNode });
    } else if (mode === 'setWeight' && weighted) {
      const edge = edges.find(([x,y]) => edgeKey(x,y) === edgeKey(a,b));
      const { x, y } = getSVGCoords(e);
      setEditingWeight({ a, b, weight: edge[2] || 1, px: x, py: y });
    }
  };

  const handleUpdateWeight = (newWeight) => {
    if (!editingWeight) return;
    const { a, b } = editingWeight;
    const ek = edgeKey(a, b);
    const w = Math.max(1, Math.min(99, parseInt(newWeight) || 1));
    onChange({
      nodes,
      edges: edges.map(e => edgeKey(e[0], e[1]) === ek ? [e[0], e[1], w] : e),
      startNode, endNode
    });
    setEditingWeight(null);
  };

  const handleNodeMouseDown = (e, nodeId) => {
    if (disabled || mode !== 'move') return;
    e.stopPropagation(); e.preventDefault();
    const { x, y } = getSVGCoords(e);
    const node = nodes.find(n => n.id === nodeId);
    setDragging({ id: nodeId, ox: x - node.x, oy: y - node.y });
  };

  const handleMouseMove = (e) => {
    const coords = getSVGCoords(e);
    setMousePos(coords);
    if (!dragging) return;
    onChange({
      nodes: nodes.map(n => n.id === dragging.id ? { ...n, x: coords.x - dragging.ox, y: coords.y - dragging.oy } : n),
      edges, startNode, endNode,
    });
  };

  const handleMouseUp = () => setDragging(null);

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const getNodeColor = (id) => {
    if (id === startNode) return { fill: '#16a34a', stroke: '#4ade80' };
    if (id === endNode)   return { fill: '#dc2626', stroke: '#f87171' };
    if (id === selectedNode) return { fill: '#7c3aed', stroke: '#a78bfa' };
    return { fill: '#1e3a5f', stroke: '#3b82f6' };
  };

  const getCursor = () => {
    if (mode === 'move')    return dragging ? 'grabbing' : 'grab';
    if (mode === 'addNode') return 'crosshair';
    return 'pointer';
  };

  return (
    <div className="gb-root">
      {/* Toolbar */}
      <div className="gb-toolbar">
        <div className="gb-modes">
          {MODES.filter(m => !m.weightedOnly || weighted).map(m => (
            <button
              key={m.id}
              className={`gb-mode-btn ${mode === m.id ? 'gb-active' : ''}`}
              onClick={() => { setMode(m.id); setSelectedNode(null); setEditingWeight(null); }}
              title={m.label}
            >
              <span className="gb-mode-icon">{m.icon}</span>
              <span className="gb-mode-label">{m.label}</span>
            </button>
          ))}
        </div>
        <button
          className="gb-clear-btn"
          onClick={() => { onChange({ nodes: [], edges: [], startNode: null, endNode: null }); setSelectedNode(null); }}
        >
          ✕ Clear All
        </button>
      </div>

      {/* Instruction bar */}
      <div className="gb-instruction">
        <span className="gb-inst-dot" />
        {INSTRUCTIONS[mode]}
        {selectedNode && mode === 'addEdge' && (
          <span className="gb-inst-sel"> — Source: <b>{selectedNode}</b>, now click target</span>
        )}
      </div>

      <div className="gb-canvas-wrapper" style={{ position: 'relative' }}>
        {editingWeight && (
          <div 
            className="gb-floating-weight"
            style={{ 
              left: `${(editingWeight.px / 840) * 100}%`, 
              top: `${(editingWeight.py / 400) * 100}%` 
            }}
          >
            <div className="gb-fw-header">
              <span>Edge {editingWeight.a}-{editingWeight.b} Weight</span>
              <button onClick={() => setEditingWeight(null)}>✕</button>
            </div>
            <div className="gb-fw-body">
              <button className="gb-fw-step" onClick={() => handleUpdateWeight(editingWeight.weight - 1)}>−</button>
              <input
                type="number"
                min="1" max="99"
                autoFocus
                defaultValue={editingWeight.weight}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateWeight(e.target.value);
                  if (e.key === 'Escape') setEditingWeight(null);
                }}
                onBlur={(e) => {
                  if (editingWeight) handleUpdateWeight(e.target.value);
                }}
              />
              <button className="gb-fw-step" onClick={() => handleUpdateWeight(editingWeight.weight + 1)}>+</button>
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          className="gb-svg"
          viewBox="0 0 840 400"
          onClick={handleSVGClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: getCursor() }}
        >
          <rect width="840" height="400" fill="#080f1e" className="gb-bg" />
          {/* Grid dots */}
          {Array.from({ length: 17 }, (_, xi) =>
            Array.from({ length: 9 }, (_, yi) => (
              <circle key={`${xi}-${yi}`} cx={xi * 52 + 24} cy={yi * 48 + 20}
                r={1.5} fill="#1e293b" pointerEvents="none" />
            ))
          )}

          {/* Edges */}
          {edges.map(([a, b, w]) => {
            const na = nodeMap[a]; const nb = nodeMap[b];
            if (!na || !nb) return null;
            const ek = edgeKey(a, b);
            const isHovered = hoveredEdge === ek;
            const isEditing = editingWeight && edgeKey(editingWeight.a, editingWeight.b) === ek;
            
            const mx = (na.x + nb.x) / 2;
            const my = (na.y + nb.y) / 2;

            return (
              <g key={ek}>
                <line
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={isEditing ? '#f59e0b' : (isHovered && mode === 'delete' ? '#ef4444' : '#3b82f6')}
                  strokeWidth={isHovered || isEditing ? 3 : 2}
                  strokeOpacity={isHovered || isEditing ? 1 : 0.5}
                  onClick={(e) => handleEdgeClick(e, a, b)}
                  onMouseEnter={() => setHoveredEdge(ek)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  style={{ cursor: (mode === 'delete' || (mode === 'setWeight' && weighted)) ? 'pointer' : 'default' }}
                />
                {weighted && w !== undefined && (
                  <g pointerEvents="none">
                    <rect x={mx - 10} y={my - 8} width={20} height={16} rx={4} fill="#0f172a" opacity={0.8} />
                    <text x={mx} y={my + 4} textAnchor="middle" fontSize={10} fontWeight="700" fill="#94a3b8">
                      {w}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {selectedNode && mode === 'addEdge' && nodeMap[selectedNode] && (
            <line
              x1={nodeMap[selectedNode].x} y1={nodeMap[selectedNode].y}
              x2={mousePos.x} y2={mousePos.y}
              stroke="#a78bfa" strokeWidth="2" strokeDasharray="6,4"
              pointerEvents="none"
            />
          )}

          {nodes.map(n => {
            const col = getNodeColor(n.id);
            return (
              <g key={n.id}
                onClick={(e) => handleNodeClick(e, n.id)}
                onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
              >
                {(n.id === startNode || n.id === endNode || n.id === selectedNode) && (
                  <circle cx={n.x} cy={n.y} r={26} fill={col.stroke} opacity={0.18} />
                )}
                <circle cx={n.x} cy={n.y} r={20} fill={col.fill} stroke={col.stroke} strokeWidth={2.5} />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={14} fontWeight="800" fill="#fff" pointerEvents="none">
                  {n.id}
                </text>
                {n.id === startNode && <text x={n.x} y={n.y + 36} textAnchor="middle" fontSize={9} fill="#4ade80" pointerEvents="none">START</text>}
                {n.id === endNode && <text x={n.x} y={n.y + 36} textAnchor="middle" fontSize={9} fill="#f87171" pointerEvents="none">END</text>}
              </g>
            );
          })}

          {nodes.length === 0 && (
            <text x="420" y="200" textAnchor="middle" fontSize={15} fill="#334155">
              Click anywhere to add your first node
            </text>
          )}
        </svg>
      </div>

      {/* Validation hints */}
      <div className="gb-hints">
        {!startNode && <span className="gb-hint-warn">⚠ Set a Start node</span>}
        {!endNode   && <span className="gb-hint-warn">⚠ Set an End node</span>}
        {startNode  && <span className="gb-hint-ok">▶ Start: {startNode}</span>}
        {endNode    && <span className="gb-hint-ok">⬛ End: {endNode}</span>}
        {nodes.length > 0 && <span className="gb-hint-info">Nodes: {nodes.length} · Edges: {edges.length}</span>}
      </div>
    </div>
  );
}
