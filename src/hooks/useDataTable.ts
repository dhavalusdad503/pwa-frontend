// hooks/useDataTable.js
import { useState, useMemo } from 'react';

import { useDebounce } from '@hooks/useDebounce';

import { NewShiftSchemaType } from '@/types';

export const useDataTable = (data: NewShiftSchemaType[], options = { defaultPageSize: 5 }) => {
  const { defaultPageSize } = options;

  // States
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'submittedAt', direction: 'desc' });
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Filter data
  const filteredData = useMemo(() => {
    let result = data;

    // Search filter
    if (debouncedSearch) {
      result = result.filter(item =>
        JSON.stringify(item).toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    return result;
  }, [data, debouncedSearch]);

  // Sort data
  const sortedData = useMemo(() => {
    if (sortBy.field == null) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortBy.field];
      let bVal = b[sortBy.field];

      // If values are ISO date strings → convert to timestamps
      if (typeof aVal === "string" && typeof bVal === "string") {
        const aDate = Date.parse(aVal);
        const bDate = Date.parse(bVal);

        if (!isNaN(aDate) && !isNaN(bDate)) {
          aVal = aDate;
          bVal = bDate;
        }
      }

      return sortBy.direction === "asc"
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

  }, [filteredData, sortBy]);


  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  ), [sortedData, currentPage, pageSize]);

  return {
    data: paginatedData,
    totalCount: sortedData.length,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    setPageSize,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};
