import React, { useMemo, useRef } from 'react';

import Button from '../Button';
import Icon from '../Icon';

import { getActiveFilterCount } from './helper';

import CommonFilter, { type CommonFilterField } from '.';

import type { DefaultValues, FieldValues } from 'react-hook-form';

type Props<T extends FieldValues> = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onClearFilter: () => void;
  handleApplyFilter: (vals: T) => void;
  filterFields: CommonFilterField<T>[];
  defaultValues: DefaultValues<T>;
  isLoading: boolean;
};

const FilterButton = <T extends FieldValues>(props: Props<T>) => {
  // ** Props **
  const {
    isVisible,
    setIsVisible,
    onClearFilter,
    handleApplyFilter,
    defaultValues,
    filterFields,
    isLoading
  } = props;

  // ** Refs **
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // ** Helpers **
  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const activeFilterCount = useMemo(() => {
    const count = getActiveFilterCount({
      filterFields,
      filters: defaultValues
    });
    return count;
  }, [defaultValues]);

  return (
    <div className="relative">
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
        <CommonFilter
          fields={filterFields}
          isLoading={isLoading}
          defaultValues={defaultValues}
          onApply={handleApplyFilter}
          onClear={onClearFilter}
          onClose={() => setIsVisible(false)}
          buttonRef={filterButtonRef}
        />
      )}
    </div>
  );
};

export default FilterButton;
