import { VisitCardResponse } from '@api/types/supervisor.dto';
import Button from '@lib/Common/Button';
import CommonFilter from '@lib/Common/Filter';
import Icon from '@lib/Common/Icon';
import NoDataFound from '@lib/Common/NoDataFound';
import Skeleton from '@lib/Common/Skeleton';

import VisitCard from '../Card';

import useSuperVisorDashboard from './hooks';
import { FilterDataType } from './types';

const SupervisorDashboard = () => {
  const {
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
  } = useSuperVisorDashboard();

  return (
    <div className="w-full px-4">
      <div className="flex items-center flex-wrap gap-5 mb-3">
        <h4 className="text-lg font-semibold text-blackdark">Recent Visits</h4>
        <div className="relative ml-auto">
          <Button
            buttonRef={filterButtonRef}
            variant="none"
            icon={
              !isVisible ? (
                <Icon name="dropdownArrow" />
              ) : (
                <Icon name="dropdownUpArrow" />
              )
            }
            className="rounded-lg border-primary border border-solid sm:py-4 py-3 sm:px-6 px-4"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}>
            Filter By
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-white text-xs font-semibold bg-primary rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {isVisible && (
            <CommonFilter<FilterDataType>
              fields={filterFields}
              isLoading={isLoading}
              defaultValues={filters}
              onApply={handleApplyFilter}
              onClear={() => {
                setFilters({});
                setIsVisible(false);
              }}
              onClose={() => setIsVisible(false)}
              buttonRef={filterButtonRef}
            />
          )}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-190px)] overflow-y-auto bg-white rounded p-2 scroll-disable">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
