import { BaseApiClient } from '@api/BaseApiClient';
import { AxiosResponse } from 'axios';

import type { NewShiftSchemaType } from '@/types';
import { AllVisitsResponse } from '@api/types/visits.dto';
import { ResponseData } from '@api/types';
import { transformedColumns } from '@helper/index';

export class VisitRepository extends BaseApiClient {
  private readonly basePath = '/visit';

  constructor() {
    super(); // Inherits all interceptors and HTTP methods
  }

  async create(data: FormData): Promise<AxiosResponse> {
    return this.post(`${this.basePath}`, data);
  }

  async bulkCreate(data: FormData): Promise<AxiosResponse> {
    return this.post(`${this.basePath}/bulk-create`, data);
  }

  async getAll(params?: object): Promise<ResponseData<AllVisitsResponse>> {
    const { columns } = params as { columns?: string[] };
    const response = await this.get(this.basePath, {
      params: {
        ...params,
        ...(columns && transformedColumns(columns))
      }
    });

    return response.data;
  }

  async getUpdated(lastSyncEpoch: number): Promise<AxiosResponse> {
    return this.get(`${this.basePath}/updated/${lastSyncEpoch}`);
  }

  async getById(id: string): Promise<AxiosResponse> {
    return this.get(`${this.basePath}/${id}`);
  }

  async update(
    id: string,
    data: Partial<NewShiftSchemaType>
  ): Promise<AxiosResponse> {
    return this.put(`${this.basePath}/${id}`, data);
  }

  async deleteVisit(id: string): Promise<AxiosResponse> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

// Export singleton instance
export const visitRepository = new VisitRepository();
