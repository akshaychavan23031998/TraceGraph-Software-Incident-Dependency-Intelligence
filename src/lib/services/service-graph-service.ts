import "server-only";

import {
  ServiceRepository,
  type DependencyDepth,
} from "@/lib/repositories/service-repository";
import type {
  BlastRadius,
  DependencyPathResult,
  DependencyTraversal,
  ServiceDetails,
  ServiceExperts,
  ServiceReference,
} from "@/types/api";
import type { Service } from "@/types/graph";

export class ServiceGraphService {
  constructor(private readonly repository = new ServiceRepository()) {}

  listServices(): Promise<Service[]> {
    return this.repository.list();
  }

  getServiceDetails(serviceId: string): Promise<ServiceDetails | null> {
    return this.repository.getDetails(serviceId);
  }

  async getDependencies(
    serviceId: string,
    maxDepth: DependencyDepth,
  ): Promise<DependencyTraversal | null> {
    const service = await this.repository.findById(serviceId);

    if (!service) {
      return null;
    }

    const paths = await this.repository.findDependencyPaths(serviceId, maxDepth);
    const uniquePaths = new Map(
      paths.map((path) => [path.nodes.map((node) => node.id).join("->"), path]),
    );

    return {
      serviceId,
      maxDepth,
      paths: [...uniquePaths.values()],
    };
  }

  async getBlastRadius(serviceId: string): Promise<BlastRadius | null> {
    const failedService = await this.repository.findById(serviceId);

    if (!failedService) {
      return null;
    }

    const paths = await this.repository.findUpstreamServices(serviceId);
    const nearestByService = new Map<string, (typeof paths)[number]>();

    for (const affected of paths) {
      const existing = nearestByService.get(affected.id);
      if (!existing || affected.hops < existing.hops) {
        nearestByService.set(affected.id, affected);
      }
    }

    return {
      failedService: { id: failedService.id, name: failedService.name },
      affectedServices: [...nearestByService.values()].sort(
        (left, right) => left.hops - right.hops || left.name.localeCompare(right.name),
      ),
    };
  }

  async findPath(fromId: string, toId: string): Promise<DependencyPathResult | null> {
    const [fromService, toService] = await Promise.all([
      this.repository.findById(fromId),
      this.repository.findById(toId),
    ]);

    if (!fromService || !toService) {
      return null;
    }

    const from: ServiceReference = { id: fromService.id, name: fromService.name };
    const to: ServiceReference = { id: toService.id, name: toService.name };

    if (fromId === toId) {
      return { from, to, hopCount: 0, path: [from] };
    }

    const path = await this.repository.findShortestPath(fromId, toId);

    return {
      from,
      to,
      hopCount: path?.hopCount ?? null,
      path: path?.nodes ?? [],
    };
  }

  async findExperts(serviceId: string): Promise<ServiceExperts | null> {
    const service = await this.repository.findById(serviceId);

    if (!service) {
      return null;
    }

    return {
      service: { id: service.id, name: service.name },
      experts: await this.repository.findExperts(serviceId),
    };
  }
}

