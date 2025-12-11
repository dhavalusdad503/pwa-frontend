import { useEffect } from 'react';

import { useLocalVisits } from '@api/newShift';
import { ROUTES } from '@constant/routesPath';
import AppointmentCard from '@features/HomeVisits/AppointmentCard';
import { useDataTable } from '@hooks/useDataTable';
import { useOfflineSync } from '@hooks/useOfflineFormSync';
import Button from '@lib/Common/Button';
import { Pagination } from '@lib/Common/Pagination';
import { useNavigate } from 'react-router-dom';

import { NewShiftSchemaType } from '@/types';

const HomeVisits = () => {
  const Navigate = useNavigate();
  const { synced, isOnline, triggerSync } = useOfflineSync();
  const { data: localVisitsData, refetch } = useLocalVisits();
  // Custom useQuery unwraps { data } so we get the array directly
  const localShifts =
    (localVisitsData as unknown as NewShiftSchemaType[]) || [];

  const {
    data,
    totalCount,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize
  } = useDataTable(localShifts);

  useEffect(() => {
    if (isOnline && synced) {
      refetch();
    } else if (!isOnline) {
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
      <div className="w-full mx-auto px-4">
        <div className="flex items-center justify-between my-2">
          <h4 className="text-xl font-semibold text-blackdark">Visits</h4>
          <Button
            type="submit"
            variant="outline"
            title="+ New Shift"
            className="w-xxs ! !font-bold !leading-5 "
            onClick={handleNewShift}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.map((shift, index) => (
            <AppointmentCard key={shift.id || index} {...shift} />
          ))}
        </div>
        <div className="fixed bottom-0 left-0 w-full py-4 flex flex-col items-baseline-last px-3">
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
