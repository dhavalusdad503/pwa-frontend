import { useMemo, useRef, useState } from 'react';

import { SUPERVISOR_KEYS_NAME } from '@api/common/supervisor.queryKey';
import {
  getCaregiverList,
  getPatientList,
  useInfiniteVisitsQuery
} from '@api/supervisor';
import { VisitCardResponse } from '@api/types/supervisor.dto';
import { FIELD_TYPE } from '@constant/index';
import { useInfiniteScroll } from '@hooks/useInfiniteQuery';

import { InfiniteQueryResponse } from '@/types';

import { FilterDataType } from '../types';

export interface FilterStateType {
  caregiverId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
}
const useSuperVisorDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState<FilterDataType>({});

  const columns = ['id','serviceType','notes','createdAt','updatedAt','address'];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteVisitsQuery({
      ...(filters?.caregiver ? { caregiverId: filters.caregiver?.value } : {}),
      ...(filters?.patient ? { patientId: filters.patient?.value } : {}),
      ...(filters?.dateRange?.startDate
        ? { startDate: filters?.dateRange?.startDate }
        : {}),
      ...(filters?.dateRange?.endDate
        ? { endDate: filters?.dateRange?.endDate }
        : {}),
      columns
    });

  const loaderRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const filterFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPE.ASYNC_SELECT,
        name: 'caregiver',
        label: 'Caregiver',
        fetchOptions: getCaregiverList,
        queryKey: SUPERVISOR_KEYS_NAME.GET_CAREGIVER_LIST,
        queryFn: getCaregiverList,
        isMulti: false
      },
      {
        type: FIELD_TYPE.ASYNC_SELECT,
        name: 'patient',
        label: 'Patient',
        fetchOptions: getCaregiverList,
        queryKey: SUPERVISOR_KEYS_NAME.GET_PATIENT_LIST,
        queryFn: getPatientList,
        isMulti: false
      },
      {
        type: FIELD_TYPE.DATE_RANGE,
        name: 'dateRange',
        label: 'Visit Date',
        maxDate: new Date()
      }
    ];
  }, []);

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    triggerRef: loaderRef,
    rootRef: scrollContainerRef
  });

  const visits = useMemo(
    () =>
      (data as InfiniteQueryResponse<VisitCardResponse>)?.pages.flatMap(
        (page) => page
      ) ?? [],
    [data]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.caregiver) count++;
    if (filters.patient) count++;
    if (filters.dateRange?.startDate || filters.dateRange?.endDate) count++;
    return count;
  }, [filters]);

  const handleApplyFilter = (vals: FilterDataType) => {
    setIsVisible(false);
    setFilters({ ...vals });
  };

  return {
    visits,
    loaderRef,
    scrollContainerRef,
    isFetchingNextPage,
    hasNextPage,
    isVisible,
    filterButtonRef,
    handleToggle,
    filterFields,
    filters,
    activeFilterCount,
    handleApplyFilter,
    isLoading,
    setFilters,
    setIsVisible
  };
};

export default useSuperVisorDashboard;
