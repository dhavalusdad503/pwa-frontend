import { useMutation } from '@/api';
import { axiosPost } from '@/api/axios';
import { shiftQueryKey } from '@/api/common/shift.querykey';

// For login auth operations
export const useCreateShift = () => {
  return useMutation({
    mutationKey: shiftQueryKey.createShift(),
    mutationFn: async (data: object) => {
      const response = await axiosPost('/visit/create', data);
      return response.data;
    },
    showToast: true
  });
};
// export const useLogin = (
//   options?: UseMutationOptions<LoginResponse, AxiosError, LoginCredentials>
// ) => {
//   return useMutation({
//     mutationKey: authQueryKey.login(),
//     mutationFn: async (
//       credentials: LoginCredentials
//     ): Promise<LoginResponse> => {
//       const response = await axiosPost(`/auth/login`, {
//         data: credentials
//       });

//       return response.data;
//     },
//     showToast: true,
//     ...options
//   });
// };
