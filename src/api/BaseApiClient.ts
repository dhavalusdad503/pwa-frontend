import { queryClient } from '@api/QueryProvider';
import { tokenStorage } from '@api/tokenStorage';
import { BASE_URL } from '@constant/index';
import { dispatchSetUser } from '@redux/dispatch/user.dispatch';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

export const PERMISSION_QUERY_KEYS_NAME = {
  GET_USER_PERMISSION: 'permissions'
};

export const PERMISSION_ERROR = 'You do not have permission to perform this action';

interface QueuedRequest {
  resolve: (value?: string | null) => void;
  reject: (reason?: AxiosError) => void;
}

export class BaseApiClient {
  protected axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  constructor(baseURL: string = `${BASE_URL}/api`) {
    this.axiosInstance = axios.create({ baseURL });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      async (request) => {
        try {
          const accessToken = await tokenStorage.getAccessToken();
          if (accessToken) {
            request.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.error('Failed to retrieve access token from IndexedDB:', error);
          // Continue without token - the request will fail with 401 if auth is required
        }
        return request;
      },
      (error) => Promise.reject(error)
    );
  }

  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 403 - Forbidden (permission errors)
        if (error.response?.status === 403) {
          if (error.response.data?.message === PERMISSION_ERROR) {
            queryClient.invalidateQueries({
              queryKey: [PERMISSION_QUERY_KEYS_NAME.GET_USER_PERMISSION]
            });
          }
          return Promise.reject(error);
        }

        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          let refreshToken: string | null = null;
          try {
            refreshToken = await tokenStorage.getRefreshToken();
          } catch (error) {
            console.error('Failed to retrieve refresh token from IndexedDB:', error);
            return Promise.reject(error);
          }

          // If already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          // Mark this request as retried BEFORE starting refresh
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Call refresh endpoint using base axios (not intercepted instance)
            const response = await axios.post(
              `${BASE_URL}/api/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            const { token: accessToken, refreshToken: newRefreshToken } = response.data;

            // Store new tokens
            await tokenStorage.setTokens({ accessToken });
            await tokenStorage.setRefreshToken(newRefreshToken);

            dispatchSetUser({
              token: accessToken,
              refreshToken: newRefreshToken
            });

            // Process queued requests
            this.processQueue(null, accessToken);
            this.isRefreshing = false;

            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Process queued requests with error
            this.processQueue(refreshError as AxiosError, null);
            this.isRefreshing = false;

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: AxiosError | null = null, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // ============================================
  // HTTP Methods
  // ============================================

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create singleton instance for backward compatibility
export const apiClient = new BaseApiClient();

// Export default instance
export default apiClient.getInstance();
