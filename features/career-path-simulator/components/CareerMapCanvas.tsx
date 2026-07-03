"use client";

import { Maximize2, Minimize2, Minus, Plus, RotateCcw, ScanSearch } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { CareerEdge, CareerNodeData } from "../types";
import CareerConnection from "./CareerConnection";
import CareerNode from "./CareerNode";
import MiniMap from "./MiniMap";

const canvasSize = { width: 4300, height: 2400 };

export default function CareerMapCanvas({
  nodes,
  edges,
  visibleIds,
  selectedId,
  expandedIds,
  titleForNode,
  zoom,
  pan,
  expandAll,
  focusMode,
  onZoomChange,
  onPanChange,
  onSelectNode,
  onToggleNode,
  onDeleteNode,
  onExpandAll,
  onCollapseBranches,
  onFocusPath,
  onBasePath,
  selectedNode,
  activePathIds,
  activeEdgeIds,
  miniMapBottomOffset = 24,
}: {
  nodes: CareerNodeData[];
  edges: CareerEdge[];
  visibleIds: Set<string>;
  selectedId: string;
  expandedIds: Set<string>;
  titleForNode: (node: CareerNodeData) => string;
  zoom: number;
  pan: { x: number; y: number };
  expandAll: boolean;
  focusMode: boolean;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onSelectNode: (nodeId: string) => void;
  onToggleNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onExpandAll: () => void;
  onCollapseBranches: () => void;
  onFocusPath: () => void;
  onBasePath: () => void;
  selectedNode: CareerNodeData;
  activePathIds: Set<string>;
  activeEdgeIds: Set<string>;
  miniMapBottomOffset?: number;
}) {
  const canvasRef = useRef<HTMLElement | null>(null);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const visibleNodes = useMemo(() => nodes.filter((node) => visibleIds.has(node.id)), [nodes, visibleIds]);
  const layoutNodes = useMemo(() => {
    const columnTolerance = 250;
    const minimumGap = 196;
    const columns: CareerNodeData[][] = [];

    [...visibleNodes]
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .forEach((node) => {
        const column = columns.find((items) => Math.abs(items[0].x - node.x) < columnTolerance);
        if (column) {
          column.push(node);
        } else {
          columns.push([node]);
        }
      });

    return columns.flatMap((column) => {
      let nextY = 24;
      return column
        .sort((a, b) => a.y - b.y)
        .map((node) => {
          const y = Math.max(node.y, nextY);
          nextY = y + minimumGap;
          return { ...node, y };
        });
    });
  }, [visibleNodes]);
  const nodeMap = useMemo(() => new Map(layoutNodes.map((node) => [node.id, node])), [layoutNodes]);
  const visibleEdges = edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to));

  function clampPan(nextPan: { x: number; y: number }, nextZoom = zoom) {
    const viewportWidth = canvasRef.current?.clientWidth ?? 1080;
    const viewportHeight = canvasRef.current?.clientHeight ?? 640;
    const minX = Math.min(260, viewportWidth - canvasSize.width * nextZoom - 260);
    const minY = Math.min(220, viewportHeight - canvasSize.height * nextZoom - 220);
    return {
      x: Math.min(360, Math.max(minX, nextPan.x)),
      y: Math.min(300, Math.max(minY, nextPan.y)),
    };
  }

  function zoomBy(delta: number) {
    const nextZoom = Math.min(1.35, Math.max(0.2, Number((zoom + delta).toFixed(2))));
    onZoomChange(nextZoom);
    onPanChange(clampPan(pan, nextZoom));
  }

  function fitToScreen() {
    const viewportWidth = canvasRef.current?.clientWidth ?? 1080;
    const viewportHeight = canvasRef.current?.clientHeight ?? 640;
    const nextZoom = Math.max(0.2, Math.min(0.78, Number(Math.min((viewportWidth - 96) / canvasSize.width, (viewportHeight - 96) / canvasSize.height).toFixed(2))));
    onZoomChange(nextZoom);
    onPanChange(clampPan({
      x: Math.round((viewportWidth - canvasSize.width * nextZoom) / 2),
      y: Math.round((viewportHeight - canvasSize.height * nextZoom) / 2),
    }, nextZoom));
  }

  function resetView() {
    const nextZoom = 0.74;
    onZoomChange(nextZoom);
    onPanChange(clampPan({ x: 108, y: 150 }, nextZoom));
  }

  function focusSelected() {
    if (!selectedNode) return;
    const nextZoom = Math.max(0.72, zoom);
    onZoomChange(nextZoom);
    const renderNode = nodeMap.get(selectedNode.id) ?? selectedNode;
    onPanChange(clampPan({ x: 500 - renderNode.x * nextZoom, y: 320 - renderNode.y * nextZoom }, nextZoom));
  }

  return (
    <section ref={canvasRef} className="relative min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#E4E8F0] bg-[#FBFCFE] shadow-[0_18px_46px_rgba(8,20,51,0.07)]">
      <div className="absolute left-4 top-4 z-20 flex max-w-[calc(100%-8rem)] flex-wrap items-center gap-2 md:left-5 md:top-5">
        <div className="flex rounded-2xl border border-[#E7EAF1] bg-white/92 p-1 shadow-[0_10px_22px_rgba(8,20,51,0.07)] backdrop-blur">
          <button type="button" onClick={() => zoomBy(0.07)} className="sim-canvas-button" aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => zoomBy(-0.07)} className="sim-canvas-button" aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={resetView} className="sim-canvas-button" aria-label="Reset view">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={fitToScreen} className="sim-canvas-button" aria-label="Fit to screen">
            <ScanSearch className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden flex-wrap gap-1 rounded-2xl border border-[#E7EAF1] bg-white/92 p-1 shadow-[0_10px_22px_rgba(8,20,51,0.07)] backdrop-blur sm:flex">
          <button type="button" onClick={onExpandAll} className="sim-canvas-text-button">
            <Maximize2 className="h-4 w-4" />
            {expandAll ? "Expanded" : "Expand"}
          </button>
          <button type="button" onClick={onCollapseBranches} className="sim-canvas-text-button">
            <Minimize2 className="h-4 w-4" />
            Collapse
          </button>
          <button type="button" onClick={onFocusPath} className="sim-canvas-text-button">
            {focusMode ? "Focused" : "Focus path"}
          </button>
          <button type="button" onClick={focusSelected} className="sim-canvas-text-button">
            Center
          </button>
          <button type="button" onClick={onBasePath} className="sim-canvas-text-button">
            Base
          </button>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 rounded-full border bg-white/92 px-3 py-1.5 text-xs font-semibold text-[#59657A] shadow-sm backdrop-blur md:right-5 md:top-5" style={{ borderColor: "#E5E8F0" }}>
        {Math.round(zoom * 100)}%
      </div>

      <div
        className={`h-full w-full touch-none overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onWheel={(event) => {
          if (Math.abs(event.deltaY) < 8) return;
          event.preventDefault();
          zoomBy(event.deltaY > 0 ? -0.04 : 0.04);
        }}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button, input, textarea, [role='button']")) return;
          dragStart.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={(event) => {
          if (!dragStart.current) return;
          onPanChange(clampPan({
            x: dragStart.current.panX + event.clientX - dragStart.current.x,
            y: dragStart.current.panY + event.clientY - dragStart.current.y,
          }));
        }}
        onPointerUp={() => {
          dragStart.current = null;
          setDragging(false);
        }}
        onPointerCancel={() => {
          dragStart.current = null;
          setDragging(false);
        }}
      >
        <div
          className={`relative origin-top-left ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            backgroundImage: "radial-gradient(circle, rgba(8,20,51,0.075) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        >
          <svg className="absolute inset-0 h-full w-full overflow-visible" width={canvasSize.width} height={canvasSize.height} aria-hidden>
            {visibleEdges.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              return (
                <CareerConnection
                  key={edge.id}
                  edge={edge}
                  from={from}
                  to={to}
                  active={activeEdgeIds.has(edge.id)}
                  faded={activePathIds.size > 1 && !activeEdgeIds.has(edge.id)}
                />
              );
            })}
          </svg>

          {layoutNodes.map((node) => (
            <CareerNode
              key={node.id}
              node={node}
              selected={node.id === selectedId}
              active={activePathIds.has(node.id)}
              faded={activePathIds.size > 1 && !activePathIds.has(node.id)}
              expanded={expandedIds.has(node.id)}
              title={titleForNode(node)}
              onSelect={() => onSelectNode(node.id)}
              onToggle={() => onToggleNode(node.id)}
              onDelete={node.isCustom ? () => onDeleteNode(node.id) : undefined}
            />
          ))}
        </div>
      </div>

      <MiniMap nodes={nodes} edges={edges} visibleIds={visibleIds} selectedId={selectedId} bottomOffset={miniMapBottomOffset} />

      <style>{`
        .sim-canvas-button {
          display: inline-grid;
          height: 32px;
          width: 32px;
          place-items: center;
          border-radius: 11px;
          border: 0;
          background: transparent;
          color: #081433;
          box-shadow: none;
          transition: color .18s ease, border-color .18s ease, background .18s ease;
        }
        .sim-canvas-button:hover {
          border-color: #F04D7A;
          background: #FFF7FA;
          color: #E00046;
        }
        .sim-canvas-text-button {
          display: inline-flex;
          min-height: 32px;
          align-items: center;
          gap: 8px;
          border-radius: 11px;
          border: 0;
          background: transparent;
          padding: 0 9px;
          color: #081433;
          font-size: 11px;
          font-weight: 700;
          box-shadow: none;
          transition: color .18s ease, border-color .18s ease, background .18s ease;
        }
        .sim-canvas-text-button:hover {
          border-color: #F04D7A;
          background: #FFF7FA;
          color: #E00046;
        }
      `}</style>
    </section>
  );
}
