import { InfinitePageResponse } from "@/types";
import { AxiosResponse } from "axios";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: Partial<T> | Partial<T>[];
  error?: string;
  timestamp?: string;
}



export type AxiosApiResponse<T> = AxiosResponse<ApiResponse<T>>;


export interface ResponseData<T> {
  success: boolean;
  message: string;
  data: Partial<T> | Partial<T>[] | PaginatedData<T> | PaginatedData<T>[] | InfinitePageResponse<T>[];
}

export interface PaginatedData<T> {
  rows: Partial<T>[];
  total: number;
  currentPage: number;
  pageSize: number;
  [key: string]: any;
}