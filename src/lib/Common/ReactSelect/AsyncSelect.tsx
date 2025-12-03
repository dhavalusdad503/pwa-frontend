/**
 * A customizable async select component that supports infinite scrolling and server-side search.
 * Built on top of react-select with additional features for handling async data loading.
 *
 * @features
 * - Infinite scrolling with automatic data fetching
 * - Server-side search with debouncing
 * - Customizable styles and themes
 * - Support for single and multi-select
 * - Loading states and error handling
 * - Option filtering and custom option rendering
 *
 * @type ValueType - Base type for select options with value, label, and optional properties
 * @type GetAllApiPropsType - Type for API request parameters
 * @type Option - Extended option type with additional properties like isNew, isChecked, etc.
 * @type AsyncSelectProps - Props interface extending react-select's SelectProps with async-specific properties
 *
 * @example
 * ```tsx
 * <CustomAsyncSelect
 *   queryKey={['users']}
 *   queryFn={fetchUsers}
 *   getNextPageParam={(lastPage) => lastPage.nextPage}
 *   label="Select Users"
 *   isMulti
 *   onChange={handleChange}
 * />
 * ```
 */

import React, { forwardRef, JSX, useEffect, useRef, useState } from 'react';

import {
  GetNextPageParamFunction,
  InfiniteData,
  QueryFunction,
  QueryKey,
  SkipToken,
  useInfiniteQuery
} from '@tanstack/react-query';
import { debounce } from 'lodash';
import { GroupBase, SelectInstance, StylesConfig } from 'react-select';

import SectionLoader from '../Loader/Spinner';

import AdvancedSelect, { SelectProps } from '.';

/**
 * Base type for select option values
 * Used as the fundamental structure for each option in the select
 */
export type ValueType =
  | {
      value?: string | boolean | number | null | undefined; // The actual value stored
      label?: string | React.ReactNode; // Display text/element
      isSelected?: boolean | undefined; // Selection state
    }
  | ValueType[]
  | null
  | undefined;

/**
 * Type for API request parameters
 * Used when fetching data from server
 */
export type GetAllApiPropsType = {
  search?: string; // Search query string
  page?: number; // Page number for pagination
  [key: string]: string | number | undefined; // Additional dynamic parameters
};

/**
 * Extended option type with additional properties
 * Used for enhanced functionality in the select
 */
// export type Option = {
//   isNew?: boolean; // Flag for newly created options
//   label: string; // Display text
//   value: string | number; // Option value
//   isSelected?: boolean; // Selection state
//   isChecked?: boolean; // Checkbox state for multi-select
//   onChange?: () => void; // Option change handler
//   color?: string; // Custom color for styling
//   extraLabel?: string; // Additional label text
//   [key: string]: string | number | boolean | undefined | (() => void); // Additional dynamic properties
// };

/**
 * Function type for determining the next page parameter in infinite scrolling
 * Used by react-query for pagination
 */

/**
 * Props interface for AsyncSelect component
 * Extends base SelectProps with async-specific properties
 */
export interface AsyncSelectProps<
  OptionData extends ValueType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionData> = GroupBase<OptionData>,
  TQueryFnData = unknown
> extends SelectProps<OptionData, IsMulti, Group> {
  isOnFocusApiCall?: boolean; // Whether to call API on focus
  isShowSpinner?: boolean; // Show loading spinner
  isServerSideSearch?: boolean; // Enable server-side search
  queryKey: QueryKey; // React Query key for caching
  // queryFn: ({
  //   pageParam,
  //   search
  // }: {
  //   pageParam?: number;
  //   limit?: number;
  //   page?: number;
  //   search: string;
  // }) => Promise<TQueryFnData>;
  // queryFn: QueryFunction<TQueryFnData, TQueryKey, PageParamWithSearch>;
  queryFn: QueryFunction<TQueryFnData, QueryKey, number> | SkipToken;
  isEnabled?: boolean; // Enable/disable the query
  setIsAppend?: React.Dispatch<React.SetStateAction<boolean>>; // Append state setter
  isAppend?: boolean; // Whether to append new data
  getNextPageParam: GetNextPageParamFunction<number, TQueryFnData>; // Next page function
  portalRootId?: string | true; // Portal container ID
  onScrollBottom?: () => void; // Scroll bottom handler
  onOptionChange?: (data: OptionData[]) => void; // Option change handler
  select?: (
    responseData: InfiniteData<TQueryFnData>,
    options: OptionData[]
  ) => TQueryFnData[];
  selectedOptionsValue?:
    | {
        // Pre-selected options
        label: string;
        value: string | number;
      }[]
    | null;
  staleTime?: number;
  isInitialLoadApi?: boolean;
  defaultOptions?: OptionData[];
}

/**
 * Main component implementation using forwardRef
 * Handles async data fetching, infinite scrolling, and option management
 */

export const CustomAsyncSelect = forwardRef(
  <
    OptionData extends {
      isSelected: boolean;
      value: string | number;
      label?: string;
    },
    IsMulti extends boolean = false,
    Group extends GroupBase<OptionData> = GroupBase<OptionData>,
    TQueryFnData = unknown
  >(
    {
      placeholder = 'Select...',
      onChange,
      onMenuOpen,
      onMenuClose,
      isClearable = false,
      isSearchable = true,
      isOnFocusApiCall = true,
      isMenuIsOpen,
      defaultValue,
      StylesConfig: stylesConfigPropsVal,
      isRequired = false,
      labelClassName = '',
      parentClassName = '',
      label,
      value,
      className = '',
      isDisabled = false,
      isLoading = false,
      isShowSpinner = false,
      isServerSideSearch = true,
      queryKey = ['default'],
      queryFn,
      isEnabled = true,
      getNextPageParam,
      select,
      onOptionChange,
      error,
      errorClass,
      isCreatable = false,
      filterOption,
      selectedOptionsValue,
      setIsAppend,
      isAppend,
      portalRootId,
      getOptionLabel,
      formatOptionLabel,
      menuPlacement,
      staleTime = 5 * 60 * 1000, // 5 min stale time default
      isInitialLoadApi = false,
      defaultOptions = [],
      ...props
    }: AsyncSelectProps<OptionData, IsMulti, Group, TQueryFnData>,
    ref: React.LegacyRef<SelectInstance<OptionData, IsMulti, Group>>
  ) => {
    const [search, setSearch] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<OptionData[]>([]);
    const menuListRef = useRef<HTMLDivElement | null>(null);

    /**
     * React Query hook for infinite data fetching
     * Handles pagination, caching, and data updates
     */
    const {
      data,
      dataUpdatedAt,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      isLoading: dataLoading
    } = useInfiniteQuery<
      TQueryFnData,
      Error,
      InfiniteData<TQueryFnData>,
      QueryKey,
      number
    >({
      queryKey: [...queryKey, search],
      meta: { search },
      queryFn,
      enabled: isMenuOpen && isEnabled,
      // enabled: (isMenuOpen || !isMenuIsOpen) && isEnabled,
      getNextPageParam,
      initialPageParam: 0,
      staleTime: staleTime,
      gcTime: 0,
      refetchOnMount: false,
      select: select
        ? (dataVal): InfiniteData<TQueryFnData> => {
            return {
              pages: select(dataVal, options),
              pageParams: dataVal?.pageParams ?? []
            };
          }
        : undefined
    });

    useEffect(() => {
      if (isFetchingNextPage) {
        setOptions((prev) => [
          ...prev,
          {
            value: 'loading',
            label: 'Loading...',
            isDisabled: true
          } as unknown as OptionData
        ]);
      }
    }, [isFetchingNextPage]);

    /**
     * Effect to update options when data or selected values change
     * Handles filtering and merging of options
     */
    useEffect(() => {
      if (data) {
        const transformedData = data.pages.flat() as OptionData[];
        setOptions(transformedData);
        if (selectedOptionsValue?.length) {
          setOptions((prev) => {
            const filteredOptions = prev
              .filter(
                (val) =>
                  !selectedOptionsValue?.some(
                    (selected) => selected.value === val.value
                  )
              )
              .filter(
                (val) =>
                  !Array.isArray(value) ||
                  !value?.some((selected) => selected.value === val.value)
              );
            return [...filteredOptions];
          });
        }
      }
    }, [dataUpdatedAt, selectedOptionsValue]);

    /**
     * Effect to handle search updates
     * Triggers option appending when search changes
     */
    useEffect(() => {
      if (isInitialLoadApi) {
        appendOptions();
      }
    }, [isInitialLoadApi, search]);

    /**
     * Effect to handle append flag changes
     * Triggers option appending when isAppend is true
     */
    useEffect(() => {
      if (isAppend) {
        appendOptions();
      }
    }, [isAppend]);

    /**
     * Function to append new options to existing ones
     * Handles scroll position preservation and data filtering
     */
    const appendOptions = async () => {
      if (isFetchingNextPage) return;

      const currentScrollPosition = menuListRef.current?.scrollTop ?? 0;
      setIsAppend?.(false);
      try {
        const nextPage = await fetchNextPage();

        if (nextPage?.data?.pages?.length) {
          const flattenedData = nextPage.data.pages.flat() as OptionData[];
          const findSelectedData = flattenedData.find(
            (val) => val?.isSelected === true
          );
          value = findSelectedData;

          let filteredOptions = [
            ...options.filter((opt) => opt.value !== 'loading'),
            ...flattenedData
          ];

          // For Filter Async select
          if (selectedOptionsValue?.length) {
            filteredOptions = filteredOptions.filter(
              (val) =>
                !selectedOptionsValue.some(
                  (selected) => selected.value === val.value
                )
            );
          }

          if (onOptionChange) {
            onOptionChange(filteredOptions as unknown as OptionData[]);
          }

          setOptions(filteredOptions);
        }
      } finally {
        setTimeout(() => {
          if (menuListRef.current) {
            menuListRef.current.scrollTop = currentScrollPosition; // Restore scroll position
          }
        }, 0);
      }
    };

    /**
     * Handler for menu scroll to bottom
     * Triggers next page fetch when near bottom
     */
    const onMenuScrollToBottom = async (e: Event) => {
      const menuElement = e.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = menuElement;

      if (scrollHeight - scrollTop <= clientHeight + 500) {
        if (!isFetchingNextPage || hasNextPage) {
          await appendOptions();
        }
      }
    };

    /**
     * Debounced input change handler
     * Delays search updates to prevent excessive API calls
     */
    const onInputChange = debounce((e: string) => {
      setSearch(e);
    }, 200);

    const customStyles: StylesConfig<OptionData, IsMulti, Group> = {
      singleValue: (base, state) => ({
        ...base,
        color: '#fff',
        width: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...(stylesConfigPropsVal?.singleValue
          ? stylesConfigPropsVal.singleValue(base, state)
          : {})
      }),
      control: (base, state) => ({
        ...base,
        background: '#F9F9F91A',
        border: '1px solid #EAECF01A',
        borderRadius: '6px',
        '&:hover': { borderColor: '#EAECF01A' },
        outline: state.isFocused
          ? '2px solid var(--Primary-400)'
          : error
            ? '1px solid red'
            : '2px solid transparent',
        boxShadow: 'none !important',
        ...(isDisabled
          ? { opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'auto' }
          : {}),
        ...(stylesConfigPropsVal?.control
          ? stylesConfigPropsVal.control(base, state)
          : {})
      }),
      placeholder: (base, state) => ({
        ...base,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...(stylesConfigPropsVal?.placeholder
          ? stylesConfigPropsVal.placeholder(base, state)
          : {})
      }),
      valueContainer: (base, state) => ({
        ...base,
        ...(stylesConfigPropsVal?.valueContainer
          ? stylesConfigPropsVal.valueContainer(base, state)
          : {})
      }),
      input: (base, state) => ({
        ...base,
        color: 'var(--Primary-900)',
        ...(stylesConfigPropsVal?.input
          ? stylesConfigPropsVal.input(base, state)
          : {})
      }),
      indicatorSeparator: (base) => ({
        ...base,
        display: 'none'
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--Primary-900)',
        '&:hover': { color: 'var(--Primary-900)' },
        transform: state.selectProps.menuIsOpen
          ? 'rotate(180deg)'
          : 'rotate(0deg)',
        transition: 'transform 0.3s ease-in-out',
        ...(stylesConfigPropsVal?.dropdownIndicator
          ? stylesConfigPropsVal.dropdownIndicator(base, state)
          : {})
      }),
      menu: (base, state) => ({
        ...base,
        padding: '0px',
        overflow: 'hidden',
        ...(stylesConfigPropsVal?.menu
          ? stylesConfigPropsVal.menu(base, state)
          : {})
      }),
      menuList: (base, state) => ({
        ...base,
        padding: '0px',
        ...(stylesConfigPropsVal?.menuList
          ? stylesConfigPropsVal.menuList(base, state)
          : {})
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? 'var(--Primary-300)'
          : state.isFocused
            ? 'var(--Primary-300-opacity-30)'
            : '',
        color: state.isSelected ? '#fff' : '#000',
        '&:hover': {
          backgroundColor: state.isSelected
            ? 'var(--Primary-300)'
            : 'var(--Primary-300-opacity-30)',
          color: state.isSelected ? '#fff' : '#000'
        },
        ...(stylesConfigPropsVal?.option
          ? stylesConfigPropsVal.option(base, state)
          : {})
      }),
      multiValue: (base, state) => ({
        ...base,
        ...(stylesConfigPropsVal?.multiValue
          ? stylesConfigPropsVal.multiValue(base, state)
          : {})
      }),
      multiValueLabel: (base, state) => ({
        ...base,
        ...(stylesConfigPropsVal?.multiValueLabel
          ? stylesConfigPropsVal.multiValueLabel(base, state)
          : {})
      }),
      multiValueRemove: (base, state) => ({
        ...base,
        ...(stylesConfigPropsVal?.multiValueRemove
          ? stylesConfigPropsVal.multiValueRemove(base, state)
          : {})
      }),
      loadingIndicator: (base, state) => ({
        ...base,
        ...(stylesConfigPropsVal?.loadingIndicator
          ? stylesConfigPropsVal.loadingIndicator(base, state)
          : {})
      })
    };

    const formatOptionLabelWithLoader = (
      option: OptionData,
      meta: import('react-select').FormatOptionLabelMeta<OptionData>
    ) => {
      if (option.value === 'loading') {
        return (
          <SectionLoader
            className="relative h-6"
            size="h-5 w-5 !border-[3px]"
          />
        );
      }
      return formatOptionLabel ? formatOptionLabel(option, meta) : option.label;
    };

    return (
      <div className={`flex flex-col gap-2.5 ${parentClassName}`}>
        {label && (
          <label
            className={`flex items-center gap-1 text-base font-normal leading-18px whitespace-nowrap ${labelClassName}`}>
            {label}
            {isRequired && <span className="text-red-500 font-medium">*</span>}
          </label>
        )}
        <AdvancedSelect
          getOptionLabel={getOptionLabel}
          ref={ref}
          formatOptionLabel={formatOptionLabelWithLoader}
          isLoading={dataLoading || (isLoading && !isShowSpinner)}
          options={
            defaultOptions.length ? [...defaultOptions, ...options] : options
          }
          defaultValue={defaultValue}
          value={value}
          {...(isOnFocusApiCall && {
            onFocus: () => appendOptions()
          })}
          portalRootId={portalRootId}
          isMenuIsOpen={isMenuIsOpen}
          filterOption={filterOption}
          onMenuClose={() => {
            setIsMenuOpen(false);
            onMenuClose?.();
          }}
          onMenuOpen={() => {
            // setIsMenuOpen(true);
            // resetQuery([...queryKey], { type: 'active' });
            // onMenuOpen?.();
            setIsMenuOpen(true);
            onMenuOpen?.();
          }}
          onMenuScrollToBottom={onMenuScrollToBottom}
          onInputChange={isServerSideSearch ? onInputChange : undefined}
          placeholder={placeholder}
          onChange={onChange}
          isClearable={isClearable}
          isSearchable={isSearchable}
          StylesConfig={customStyles}
          className={className}
          isDisabled={isDisabled}
          error={error}
          errorClass={` text-red-500 text-xs mt-1.5 ${errorClass} `}
          isCreatable={isCreatable}
          parentClassName="w-full"
          menuPlacement={menuPlacement}
          {...props}
        />
      </div>
    );
  }
) as <
  OptionData extends ValueType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionData> = GroupBase<OptionData>,
  TQueryFnData = unknown
>(
  props: AsyncSelectProps<OptionData, IsMulti, Group, TQueryFnData>
) => JSX.Element;

export default CustomAsyncSelect;
