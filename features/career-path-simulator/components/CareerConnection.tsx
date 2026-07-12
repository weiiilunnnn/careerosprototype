"use client";

import type { CareerEdge, CareerNodeData } from "../types";

export default function CareerConnection({
  edge,
  from,
  to,
  active,
  faded,
}: {
  edge: CareerEdge;
  from: CareerNodeData;
  to: CareerNodeData;
  active: boolean;
  faded: boolean;
}) {
  const startX = from.x + 232;
  const startY = from.y + 61;
  const endX = to.x;
  const endY = to.y + 61;
  const curve = Math.max(86, (endX - startX) * 0.42);
  const d = `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;

  return (
    <g className={faded ? "opacity-25" : "opacity-100"} style={{ transition: "opacity .2s ease" }}>
      <path
        d={d}
        fill="none"
        stroke={active ? edge.generated ? "#7C3AED" : "#E00046" : edge.generated ? "#A78BFA" : "#DDE3EC"}
        strokeDasharray={edge.generated ? "6 8" : undefined}
        strokeLinecap="round"
        strokeWidth={active ? 3.2 : 1.55}
      />
      <circle
        cx={endX}
        cy={endY}
        fill={active ? edge.generated ? "#7C3AED" : "#E00046" : edge.generated ? "#A78BFA" : "#DDE3EC"}
        r={active ? 5 : 3.5}
      />
    </g>
  );
}
