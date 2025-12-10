// Export the base client and singleton
export { BaseApiClient, apiClient } from '@api/BaseApiClient';

// Export all repositories
export { visitRepository, VisitRepository } from '@api/repositories/visit';
export { authRepository, AuthRepository } from '@api/repositories/auth';

// Re-export legacy axios methods for backward compatibility
export {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosPatch,
  axiosDelete,
  PERMISSION_ERROR,
  PERMISSION_QUERY_KEYS_NAME
} from '@api/axios';

// Export default axios instance
export { default as axiosInstance } from '@api/axios';
