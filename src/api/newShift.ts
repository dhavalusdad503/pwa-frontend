import { useMutation } from '@/api';
import { axiosPost } from '@/api/axios';
import { shiftQueryKey } from '@/api/common/shift.querykey';

export const useCreateShift = () => {
  return useMutation({
    mutationKey: shiftQueryKey.createShift(),
    mutationFn: async (data: object) => {
      const response = await axiosPost('/visit/create', { data });
      return response.data;
    },
    showToast: true
  });
};
