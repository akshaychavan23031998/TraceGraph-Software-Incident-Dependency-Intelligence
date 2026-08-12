"use client";

import { Background, Controls, MarkerType, ReactFlow, ReactFlowProvider, useReactFlow, type Edge, type NodeMouseHandler } from "@xyflow/react";
import { Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { TopologyDetails } from "@/components/topology/topology-details";
import { TopologyLegend } from "@/components/topology/topology-legend";
import { TopologyNode as ServiceNode, type TopologyFlowNode } from "@/components/topology/topology-node";
import type { ServiceTopology, TopologyNode } from "@/types/api";

const nodeTypes = { service: ServiceNode };

function calculatePositions(topology: ServiceTopology): Map<string, { x: number; y: number }> {
  const incoming = new Map(topology.nodes.map((node) => [node.id, 0]));
  for (const edge of topology.edges) incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
  const levels = new Map<string, number>();
  const queue = topology.nodes.filter((node) => incoming.get(node.id) === 0).map((node) => node.id);
  for (const id of queue) levels.set(id, 0);
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    const nextLevel = (levels.get(current) ?? 0) + 1;
    for (const edge of topology.edges.filter((item) => item.source === current)) {
      levels.set(edge.target, Math.max(levels.get(edge.target) ?? 0, nextLevel));
      const remaining = (incoming.get(edge.target) ?? 1) - 1;
      incoming.set(edge.target, remaining);
      if (remaining === 0) queue.push(edge.target);
    }
  }
  for (const node of topology.nodes) if (!levels.has(node.id)) levels.set(node.id, 0);
  const columns = new Map<number, string[]>();
  for (const node of topology.nodes) { const level = Math.min(levels.get(node.id) ?? 0, 5); columns.set(level, [...(columns.get(level) ?? []), node.id]); }
  const positions = new Map<string, { x: number; y: number }>();
  for (const [level, ids] of columns) ids.sort().forEach((id, row) => positions.set(id, { x: level * 245, y: row * 112 }));
  return positions;
}

function TopologyWorkspace({ topology }: { topology: ServiceTopology }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { fitView } = useReactFlow();
  const positions = useMemo(() => calculatePositions(topology), [topology]);
  const neighborIds = useMemo(() => { const ids = new Set<string>(); if (selectedId) { ids.add(selectedId); for (const edge of topology.edges) if (edge.source === selectedId) ids.add(edge.target); else if (edge.target === selectedId) ids.add(edge.source); } return ids; }, [selectedId, topology.edges]);
  const nodes = useMemo<TopologyFlowNode[]>(() => topology.nodes.map((service) => ({ id: service.id, type: "service", position: positions.get(service.id) ?? { x: 0, y: 0 }, data: { label: service.name, language: service.language, criticality: service.criticality, dimmed: Boolean(selectedId && !neighborIds.has(service.id)), emphasized: service.id === selectedId }, selected: service.id === selectedId })), [neighborIds, positions, selectedId, topology.nodes]);
  const edges = useMemo<Edge[]>(() => topology.edges.map((edge, index) => { const related = selectedId === edge.source || selectedId === edge.target; return { id: `${edge.source}-${edge.target}-${index}`, source: edge.source, target: edge.target, markerEnd: { type: MarkerType.ArrowClosed, color: related ? "#5eead4" : "#526174" }, style: { stroke: related ? "#5eead4" : "#394657", strokeWidth: related ? 2 : 1.2, opacity: selectedId && !related ? 0.15 : 0.72 }, animated: related }; }), [selectedId, topology.edges]);
  const selected = topology.nodes.find((node) => node.id === selectedId) ?? null;
  const matches = search.trim() ? topology.nodes.filter((node) => node.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6) : [];
  const selectService = useCallback((service: TopologyNode) => { setSelectedId(service.id); setSearch(service.name); requestAnimationFrame(() => fitView({ nodes: [{ id: service.id }], duration: 450, maxZoom: 1.3, padding: 1.2 })); }, [fitView]);
  const onNodeClick: NodeMouseHandler<TopologyFlowNode> = useCallback((_event, node) => { const service = topology.nodes.find((item) => item.id === node.id); if (service) selectService(service); }, [selectService, topology.nodes]);

  return <div><div className="relative mb-4 max-w-md"><label htmlFor="topology-search" className="sr-only">Search topology services</label><Search aria-hidden="true" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input id="topology-search" className="search-input pr-10" placeholder="Search services..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" aria-label="Clear topology search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200" onClick={() => setSearch("")}><X size={15} /></button>}{search.trim() && <div className="topology-search-results">{matches.length ? matches.map((service) => <button type="button" key={service.id} onClick={() => selectService(service)}><span>{service.name}</span><span>{service.criticality}</span></button>) : <p>No services found.</p>}</div>}</div><div className="topology-layout"><section className="topology-canvas" aria-label="Interactive service dependency topology"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={onNodeClick} fitView fitViewOptions={{ padding: 0.16, maxZoom: 0.92 }} minZoom={0.25} maxZoom={1.8} nodesDraggable={false} proOptions={{ hideAttribution: true }}><Background color="#263142" gap={24} size={1} /><Controls showInteractive={false} position="bottom-left" /></ReactFlow></section><TopologyDetails service={selected} topology={topology} /></div><TopologyLegend /></div>;
}

export function TopologyCanvas({ topology }: { topology: ServiceTopology }) { return <ReactFlowProvider><TopologyWorkspace topology={topology} /></ReactFlowProvider>; }
