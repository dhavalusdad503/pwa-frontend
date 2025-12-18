import { CreateUserSchemaType } from "@/types";
import { BaseApiClient } from "@api/BaseApiClient";
import { ResponseData } from "@api/types";


export class UserRepository extends BaseApiClient {
  private readonly basePath = '/user/create';

  constructor() {
    super();
  }

  async createUser(data: CreateUserSchemaType): Promise<ResponseData<{id: string}>> {
    const response = await this.post(`${this.basePath}`, data);
    return response.data;
  }

}

export const userRepository = new UserRepository();