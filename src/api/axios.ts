/**
 * Legacy axios exports for backward compatibility
 * New code should use BaseApiClient or repository pattern
 */
import { apiClient, PERMISSION_ERROR, PERMISSION_QUERY_KEYS_NAME } from './BaseApiClient';
import { AxiosRequestConfig } from 'axios';

// Re-export constants
export { PERMISSION_ERROR, PERMISSION_QUERY_KEYS_NAME };

// Export methods that use the configured instance (backward compatibility)
export const axiosGet = async (url: string, config?: AxiosRequestConfig) => {
  return apiClient.get(url, config);
};

export const axiosPost = async (
  url: string,
  { data, ...config }: { data?: object } & AxiosRequestConfig = {}
) => {
  return apiClient.post(url, data, config);
};

export const axiosPatch = async (
  url: string,
  { data, ...config }: { data?: object } & AxiosRequestConfig = {}
) => {
  return apiClient.patch(url, data, config);
};

export const axiosPut = async (
  url: string,
  { data, ...config }: { data?: object } & AxiosRequestConfig = {}
) => {
  return apiClient.put(url, data, config);
};

export const axiosDelete = async (url: string, config?: AxiosRequestConfig) => {
  return apiClient.delete(url, config);
};

// Export the configured instance for direct use if needed
export default apiClient.getInstance();
