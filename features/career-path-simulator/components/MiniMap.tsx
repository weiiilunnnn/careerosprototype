"use client";

import type { CareerEdge, CareerNodeData } from "../types";

export default function MiniMap({
  nodes,
  edges,
  visibleIds,
  selectedId,
  bottomOffset = 24,
}: {
  nodes: CareerNodeData[];
  edges: CareerEdge[];
  visibleIds: Set<string>;
  selectedId: string;
  bottomOffset?: number;
}) {
  const scale = 0.03;
  const offsetX = 10;
  const offsetY = 8;

  return (
    <div className="absolute right-5 z-20 hidden w-[164px] rounded-2xl border bg-white/88 p-2 shadow-[0_14px_30px_rgba(8,20,51,0.10)] backdrop-blur md:block" style={{ borderColor: "#E7EAF1", bottom: bottomOffset }}>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#59657A]">Mini-map</p>
      <svg width="144" height="80" viewBox="0 0 144 80" aria-hidden>
        {edges.map((edge) => {
          const from = nodes.find((item) => item.id === edge.from);
          const to = nodes.find((item) => item.id === edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={edge.id}
              x1={from.x * scale + offsetX}
              y1={from.y * scale + offsetY}
              x2={to.x * scale + offsetX}
              y2={to.y * scale + offsetY}
              stroke={visibleIds.has(edge.from) && visibleIds.has(edge.to) ? "#E00046" : "#CBD5E1"}
              strokeWidth="1.15"
            />
          );
        })}
        {nodes.map((node) => (
          <rect
            key={node.id}
            x={node.x * scale + offsetX - 2.5}
            y={node.y * scale + offsetY - 2.5}
            width={node.id === selectedId ? 7 : 5.5}
            height={node.id === selectedId ? 7 : 5.5}
            rx="2"
            fill={node.id === selectedId ? "#E00046" : visibleIds.has(node.id) ? "#081433" : "#CBD5E1"}
          />
        ))}
      </svg>
    </div>
  );
}
