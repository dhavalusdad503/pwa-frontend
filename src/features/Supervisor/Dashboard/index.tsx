import { VisitCardResponse } from '@api/types/supervisor.dto';
import NoDataFound from '@lib/Common/NoDataFound';
import Skeleton from '@lib/Common/Skeleton';

import VisitCard from '../Card';
import VisitsFilter from '../VisitsFilter';

import useSuperVisorDashboard from './hooks';

const SupervisorDashboard = () => {
  const {
    visits,
    loaderRef,
    scrollContainerRef,
    isFetchingNextPage,
    hasNextPage,
    setActiveFilter
  } = useSuperVisorDashboard();

  return (
    <div className="w-full mx-auto px-4">
      <VisitsFilter setActiveFilter={setActiveFilter} />

      <div className="flex flex-col gap-2.5 mt-1.5 p-2">
        <h4 className="text-lg font-semibold text-blackdark">Recent Visits</h4>
      </div>

      <div
        ref={scrollContainerRef}
        className="max-h-640px overflow-y-auto bg-white rounded p-2 scroll-disable">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {!visits && !isFetchingNextPage && <Skeleton count={6} />}

          {visits.map((visit: VisitCardResponse) => (
            <VisitCard key={visit.id} {...visit} />
          ))}
        </div>

        {visits.length === 0 && !isFetchingNextPage && <NoDataFound />}

        {(hasNextPage || isFetchingNextPage) && (
          <div
            ref={loaderRef}
            className="flex justify-center items-center py-4">
            {isFetchingNextPage ? 'Loading more...' : 'Scroll to load more...'}
          </div>
        )}
      </div>
    </div>
  );
};
export default SupervisorDashboard;
