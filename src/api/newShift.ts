import { axiosGet, axiosPost } from '@api/axios';
import { shiftQueryKey } from '@api/common/shift.querykey';
import { useMutation, useQuery } from '@api/index';


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

export const useGetUserShifts = () => {
  return useQuery({
    queryKey: ['get-user-shifts'],
    queryFn: async () => {
      const response = await axiosGet('/visit');
      return response.data;
    },
    showToast: true
  });
};
