import { axiosPost } from '@api/axios';
import { authQueryKey } from '@api/common/auth.querykey';
import { User } from '@api/types/user.dto';
import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useMutation } from '@/api';

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token?: string;
    user: User;
  };
  role?: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
  type?: string;
}
// For login auth operations
export const useLogin = (
  options?: UseMutationOptions<LoginResponse, AxiosError, LoginCredentials>
) => {
  return useMutation({
    mutationKey: authQueryKey.login(),
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      const response = await axiosPost(`/auth/login`, {
        data: credentials
      });

      return response.data;
    },
    showToast: true,
    ...options
  });
};
