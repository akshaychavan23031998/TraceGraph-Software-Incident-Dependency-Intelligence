"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { Criticality } from "@/types/graph";

export type TopologyFlowNode = Node<{
  label: string;
  language: string;
  criticality: Criticality;
  dimmed: boolean;
  emphasized: boolean;
}, "service">;

export function TopologyNode({ data, selected }: NodeProps<TopologyFlowNode>) {
  return <div className="topology-node" data-criticality={data.criticality} data-dimmed={data.dimmed} data-emphasized={data.emphasized || selected}><Handle type="target" position={Position.Left} className="topology-handle" /><p className="truncate text-xs font-semibold text-slate-100">{data.label}</p><div className="mt-2 flex items-center justify-between gap-3"><span className="text-[9px] text-slate-500">{data.language}</span><span className="topology-criticality">{data.criticality}</span></div><Handle type="source" position={Position.Right} className="topology-handle" /></div>;
}

