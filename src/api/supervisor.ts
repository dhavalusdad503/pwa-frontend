import { axiosGet } from '@api/axios';
import { supervisorQueryKeyMap } from '@api/common/supervisor.queryKey';
import { useInfiniteQuery } from '@api/index';
import { combineName } from '@helper/index';

import { InfinitePageResponse } from '@/types';

import { VisitCardResponse } from './types/supervisor.dto';
import { visitRepository } from './repositories';

export const useInfiniteVisitsQuery = (param?: object) => {
  return useInfiniteQuery<InfinitePageResponse<VisitCardResponse>>({
    queryKey: supervisorQueryKeyMap.visitsListsBySupervisor({ param }),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await visitRepository.getAll({
        ...param,
        page: pageParam,
        limit: 20
      });
      console.log("this is response data",response.data);
      return response.data.rows;
    },
   
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore || lastPage.data.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    refetchOnMount: false
  });
};

export const getCaregiverList = async (params: {
  limit?: number;
  page?: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: string;
}) => {
  try {
    const res = await axiosGet('/user', {
      params: {
        ...params,
        limit: params.limit || 20
      }
    });

    let caregiverList = [];
    let hasMore = false;

    caregiverList = res?.data?.data?.data || [];
    hasMore = res.data?.data?.hasMore || false;

    const transformedList = caregiverList.map(
      (item: { id: string; firstName: string; lastName: string }) => {
        return {
          label: combineName({ names: [item.firstName, item.lastName] }),
          value: item.id,
          data: item
        };
      }
    );

    return {
      data: transformedList,
      hasMore: hasMore
    };
  } catch (error) {
    console.error('Failed to get caregiver list:', error);
    return {
      data: [],
      hasMore: false
    };
  }
};
export const getPatientList = async (params: {
  limit?: number;
  page?: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: string;
}) => {
  try {
    const res = await axiosGet('/patient', {
      params: {
        ...params,
        limit: params.limit || 20
      }
    });

    let patientList = [];
    let hasMore = false;

    patientList = res?.data?.data?.data || [];
    hasMore = res.data?.data?.hasMore || false;

    const transformedList = patientList?.map(
      (item: { id: string; name: string }) => {
        return {
          label: item.name || '-',
          value: item.id,
          data: item
        };
      }
    );

    return {
      data: transformedList,
      hasMore: hasMore
    };
  } catch (error) {
    console.error('Failed to get patient list:', error);
    return {
      data: [],
      hasMore: false
    };
  }
};
