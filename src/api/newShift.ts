import { axiosPost } from '@api/axios';
import { shiftQueryKey } from '@api/common/shift.querykey';
import { useMutation } from '@api/index';

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
