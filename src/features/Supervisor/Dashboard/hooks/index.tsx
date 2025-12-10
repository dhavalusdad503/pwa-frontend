import { useMemo, useRef, useState } from 'react';

import { useInfiniteVisitsQuery } from '@api/supervisor';
import { VisitCardResponse } from '@api/types/supervisor.dto';
import { useInfiniteScroll } from '@hooks/useInfiniteQuery';

import { InfiniteQueryResponse } from '@/types';

export interface FilterStateType {
  caregiverId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
}
const useSuperVisorDashboard = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStateType>({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteVisitsQuery({ ...activeFilter });

  const loaderRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        (page) => page.data
      ) ?? [],
    [data]
  );

  return {
    visits,
    loaderRef,
    scrollContainerRef,
    isFetchingNextPage,
    hasNextPage,
    setActiveFilter
  };
};

export default useSuperVisorDashboard;
