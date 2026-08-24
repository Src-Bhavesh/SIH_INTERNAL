// ═══════════════════════════════════════════════════════════════
// SurakshaOS — Evacuation Route Engine (Dijkstra)
// Models building as a weighted graph and calculates shortest
// safe evacuation routes with dynamic rerouting.
// ═══════════════════════════════════════════════════════════════

import { GraphNode, GraphEdge, EvacuationRoute } from '../types';

interface DijkstraResult {
  distances: Map<string, number>;
  previous: Map<string, string | null>;
}

class PriorityQueue {
  private items: { nodeId: string; priority: number }[] = [];

  enqueue(nodeId: string, priority: number) {
    this.items.push({ nodeId, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): { nodeId: string; priority: number } | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export class EvacuationEngine {
  private nodes: Map<string, GraphNode>;
  private adjacencyList: Map<string, { nodeId: string; weight: number; edgeId: string }[]>;
  private edges: GraphEdge[];

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.nodes = new Map(nodes.map(n => [n.id, n]));
    this.edges = edges;
    this.adjacencyList = new Map();

    // Build adjacency list
    for (const node of nodes) {
      this.adjacencyList.set(node.id, []);
    }

    for (const edge of edges) {
      if (!edge.isBlocked) {
        this.adjacencyList.get(edge.from)?.push({ nodeId: edge.to, weight: edge.weight, edgeId: edge.id });
        this.adjacencyList.get(edge.to)?.push({ nodeId: edge.from, weight: edge.weight, edgeId: edge.id });
      }
    }
  }

  /**
   * Run Dijkstra's algorithm from a source node
   */
  private dijkstra(sourceId: string): DijkstraResult {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const pq = new PriorityQueue();

    // Initialize
    for (const [nodeId] of this.nodes) {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
    }
    distances.set(sourceId, 0);
    pq.enqueue(sourceId, 0);

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!;
      const currentDist = distances.get(current.nodeId)!;

      // Skip if we already found a shorter path
      if (currentDist < current.priority) continue;

      const neighbors = this.adjacencyList.get(current.nodeId) || [];
      for (const neighbor of neighbors) {
        const newDist = currentDist + neighbor.weight;
        if (newDist < (distances.get(neighbor.nodeId) || Infinity)) {
          distances.set(neighbor.nodeId, newDist);
          previous.set(neighbor.nodeId, current.nodeId);
          pq.enqueue(neighbor.nodeId, newDist);
        }
      }
    }

    return { distances, previous };
  }

  /**
   * Calculate the shortest evacuation route from a room to any exit
   */
  calculateRoute(fromNodeId: string, blockedEdgeIds: string[] = []): EvacuationRoute | null {
    // Rebuild adjacency list with blocked edges
    this.rebuildAdjacencyList(blockedEdgeIds);

    const result = this.dijkstra(fromNodeId);

    // Find the nearest exit or assembly point
    let bestExit: GraphNode | null = null;
    let bestDistance = Infinity;

    for (const [nodeId, node] of this.nodes) {
      if (node.type === 'exit' || node.type === 'assembly_point') {
        const dist = result.distances.get(nodeId) || Infinity;
        if (dist < bestDistance) {
          bestDistance = dist;
          bestExit = node;
        }
      }
    }

    if (!bestExit || bestDistance === Infinity) {
      return null; // No reachable exit
    }

    // Reconstruct path
    const path: GraphNode[] = [];
    let current: string | null = bestExit.id;
    while (current) {
      const node = this.nodes.get(current);
      if (node) path.unshift(node);
      current = result.previous.get(current) || null;
    }

    // Find the assembly point connected to this exit
    let assemblyPoint = 'Assembly Point';
    for (const [, node] of this.nodes) {
      if (node.type === 'assembly_point') {
        const dist = result.distances.get(node.id) || Infinity;
        if (dist < Infinity) {
          assemblyPoint = node.label;
          // Include assembly point in path if not already the exit
          if (node.id !== bestExit.id && !path.find(p => p.id === node.id)) {
            path.push(node);
          }
          break;
        }
      }
    }

    return {
      path,
      totalWeight: bestDistance,
      exitNode: bestExit,
      assemblyPoint,
    };
  }

  /**
   * Recalculate route with specific exits blocked
   */
  recalculateWithBlockedExits(fromNodeId: string, blockedExitNodeIds: string[]): EvacuationRoute | null {
    // Block all edges leading to blocked exits
    const blockedEdgeIds: string[] = [];
    for (const edge of this.edges) {
      if (blockedExitNodeIds.includes(edge.to) || blockedExitNodeIds.includes(edge.from)) {
        blockedEdgeIds.push(edge.id);
      }
    }
    return this.calculateRoute(fromNodeId, blockedEdgeIds);
  }

  private rebuildAdjacencyList(blockedEdgeIds: string[]) {
    const blockedSet = new Set(blockedEdgeIds);
    this.adjacencyList = new Map();
    
    for (const [nodeId] of this.nodes) {
      this.adjacencyList.set(nodeId, []);
    }

    for (const edge of this.edges) {
      if (!edge.isBlocked && !blockedSet.has(edge.id)) {
        this.adjacencyList.get(edge.from)?.push({ nodeId: edge.to, weight: edge.weight, edgeId: edge.id });
        this.adjacencyList.get(edge.to)?.push({ nodeId: edge.from, weight: edge.weight, edgeId: edge.id });
      }
    }
  }

  /**
   * Get all available exit nodes
   */
  getExitNodes(): GraphNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === 'exit');
  }

  /**
   * Get all nodes in the graph
   */
  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get all edges (respecting blocks)
   */
  getAllEdges(): GraphEdge[] {
    return this.edges;
  }
}
