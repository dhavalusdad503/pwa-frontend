import { axiosGet, axiosPost } from '@api/axios';
import { authQueryKey } from '@api/common/auth.querykey';
import { User } from '@api/types/user.dto';
import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useMutation, useQuery } from '@/api';

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    refreshToken?: string;
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

export const useValidateLink = (params: { token: string | null }) => {
  return useQuery({
    queryKey: ['validate-link'],
    queryFn: async () => {
      const response = await axiosGet(`/auth/validate-token`, { params });
      return response.data;
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: authQueryKey.resetPassword(),
    mutationFn: async (data: {
      token: string | null;
      new_password: string;
    }) => {
      const response = await axiosPost('/auth/reset-password', {
        data
      });
      return response.data;
    },
    showToast: true
  });
};
export const useForgetPassword = () => {
  return useMutation({
    mutationKey: authQueryKey.forgetPassword(),
    mutationFn: async (data: { email: string }) => {
      const response = await axiosPost('/auth/forget-password', {
        data
      });
      return response.data;
    },
    showToast: true
  });
};

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data: {
    refreshToken?: string;
    token?: string;
  };
  role?: string;
}

export const useRefreshToken = (
  options?: UseMutationOptions<
    RefreshTokenResponse,
    AxiosError,
    { refreshToken?: string }
  >
) => {
  return useMutation({
    mutationKey: authQueryKey.refreshToken(),
    mutationFn: async (data: {
      refreshToken?: string;
    }): Promise<LoginResponse> => {
      const response = await axiosPost(`/auth/refresh`, {
        data
      });

      return response.data;
    },
    showToast: true,
    ...options
  });
};
