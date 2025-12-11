import { transformedColumns } from '@helper/index';

import { axiosGet } from './axios';
import { userQueryKeyMap } from './common/user.queryKey';

import { useQuery } from '.';

export const useGetUserList = (params: object) => {
  const columns = [
    'id',
    'firstName',
    'lastName',
    'email',
    'phone',
    'createdAt'
  ];

  return useQuery({
    queryKey: userQueryKeyMap.userList(params),
    queryFn: async () => {
      const response = await axiosGet(`/user`, {
        params: {
          ...params,
          ...transformedColumns(columns)
        }
      });
      return response.data;
    },
    experimental_prefetchInRender: true
  });
};
