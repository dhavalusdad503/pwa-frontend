import { useQuery } from '@/api';
import { axiosGet } from '@/api/axios';

export const useClientTherapistAppointments = (params?: object) => {
  return useQuery({
    queryKey: calendarQueryKeys.clientTherapistAppointments(params),
    queryFn: async () => {
      const response = await axiosGet(
        `/appointments/client-therapist-appointments`,
        {
          params
        }
      );
      return response.data;
    }
  });
};
