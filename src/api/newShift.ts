import { shiftQueryKey } from '@api/common/shift.querykey';
import { useMutation, useQuery } from '@api/index';
import { visitRepository } from '@api/repositories';

import { getAllForms } from '@/db';
// const key = import.meta.env.VITE_SECRET_KEY;

export const useCreateShift = () => {
  return useMutation({
    mutationKey: shiftQueryKey.createShift(),
    mutationFn: async (data: FormData) => {
      const response = await visitRepository.create(data);
      return response.data;
    },
    showToast: true
  });
};

export const useCreateBulkShift = () => {
  return useMutation({
    mutationKey: shiftQueryKey.createBulkShift(),
    mutationFn: async (data: FormData) => {
      const response = await visitRepository.bulkCreate(data);
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
    networkMode: 'always'
  });
};

export const useFetchAllVisits = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['fetch-all-visits'],
    queryFn: async () => {
      const response = await visitRepository.getAll();
      return response;
    },
    enabled,
    staleTime: 0,
    retry: false
  });
};

export const useFetchUpdatedVisits = (
  lastSyncEpoch: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['fetch-updated-visits', lastSyncEpoch],
    queryFn: async () => {
      const response = await visitRepository.getUpdated(lastSyncEpoch);
      return response;
    },
    enabled: enabled && lastSyncEpoch > 0,
    staleTime: 0,
    cacheTime: 0,
    retry: false
  });
};

// export const useGetUserAddress = (data: { long: string; lat: string }) => {
//   return useQuery({
//     queryKey: ['get-user-location'],
//     queryFn: async () => {
//       const response = await axiosGet(
//         `https://api.opencagedata.com/geocode/v1/json?q=${data?.long}%2C+${data?.lat}&key=${key}`
//       );
//       return response.data;
//     },
//     enabled: false
//   });
// };
