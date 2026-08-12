import neo4j, { type Integer, type Node, type Path } from "neo4j-driver";

export const toNativeNumber = (value: number | Integer): number =>
  neo4j.isInt(value) ? value.toNumber() : value;

export const nodeProperties = <T>(node: Node): T =>
  ({ ...node.properties }) as T;

export const pathNodes = (path: Path): Node[] => [
  path.start,
  ...path.segments.map((segment) => segment.end),
];
