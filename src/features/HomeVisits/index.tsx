import { useEffect } from 'react';

import { useLocalVisits } from '@api/newShift';
import { ROUTES } from '@constant/routesPath';
import AppointmentCard from '@features/HomeVisits/AppointmentCard';
import Button from '@lib/Common/Button';
import { useNavigate } from 'react-router-dom';


import { Pagination } from '@lib/Common/Pagination';
import { useDataTable } from '@hooks/useDataTable';
import { useOfflineSync } from '@hooks/useOfflineFormSync';

import { NewShiftSchemaType } from '@/types';

const HomeVisits = () => {
  const Navigate = useNavigate();
  const { synced, isOnline, isSyncing, triggerSync } = useOfflineSync();
  const { data: localVisitsData, refetch } = useLocalVisits();
  // Custom useQuery unwraps { data } so we get the array directly
  const localShifts = (localVisitsData as unknown as NewShiftSchemaType[]) || [];

  const {
    data,
    totalCount,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useDataTable(localShifts);

  useEffect(() => {
    if (synced) {
      refetch();
    }
  }, [synced, refetch]);

  const handleNewShift = () => {
    Navigate(ROUTES.NEW_SHIFT.path);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    if (isOnline) {
      triggerSync();
    }
  };

  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  return (
    <>
      <div className="max-w-438px w-full m-auto">
        <div className="flex flex-col gap-2.5 w-full items-center ">
          <h4 className="text-2xl font-bold text-blackdark">Home Visits</h4>
        </div>
        <div className="flex flex-col gap-2.5 w-full items-center ">
          <Button
            type="submit"
            variant="filled"
            title="+ New Shift"
            className="w-md ! !font-bold !leading-5 "
            onClick={handleNewShift}
          />
          <p className="text-base text-blackdark">Visit History</p>
          {data?.map((shift, index) => (
            <AppointmentCard key={shift.id || index} {...shift} />
          ))}
        </div>
        <div className="flex flex-col w-full items-center py-4  ">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            totalCount={totalCount}
          />
        </div>
      </div>
    </>
  );
};

export default HomeVisits;
