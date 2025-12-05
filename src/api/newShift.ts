import { axiosGet, axiosPost } from '@api/axios';
import { shiftQueryKey } from '@api/common/shift.querykey';
import { useMutation, useQuery } from '@api/index';
import { getAllForms } from '@/db';

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

export const useLocalVisits = () => {
  return useQuery({
    queryKey: ['local-visits'],
    queryFn: async () => {
      const data = await getAllForms();
      return { data }; 
    },
    staleTime: 0, 
    cacheTime: 0,
  });
};

export const useFetchAllVisits = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['fetch-all-visits'],
    queryFn: async () => {
      const response = await axiosGet('/visit');
      return response; 
    },
    enabled,
    staleTime: 0,
    cacheTime: 0,
    retry: false,
  });
};

export const useFetchUpdatedVisits = (lastSyncEpoch: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['fetch-updated-visits', lastSyncEpoch],
    queryFn: async () => {
      const response = await axiosGet(`/visit/updated/${lastSyncEpoch}`);
      return response; 
    },
    enabled: enabled && lastSyncEpoch > 0,
    staleTime: 0,
    cacheTime: 0,
    retry: false,
  });
};
