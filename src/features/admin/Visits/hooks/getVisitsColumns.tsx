import { useFetchAllVisits } from "@api/newShift";
import { AllVisitsResponse } from "@api/types/visits.dto";
import { formatDateTime } from "@helper/dateUtils";
import { useTableManagement } from "@lib/Common/Table";
import { ColumnDef } from "@tanstack/react-table";
import { is } from "date-fns/locale";
import { useEffect } from "react";


const useVisitsManager = (
  isDashboard = false
) => {

  const columnsToFetch = [
    "caregiver",
    "patient",
    "startedAt",
    "endedAt",
    "submittedAt",
    "address"
  ]

  const {
    apiData,
    currentPage: pageIndex,
    pageSize,
    setCurrentPage: setPageIndex,
    setPageSize,
    setSearchQuery,
    onSortingChange,
    sorting,
    setSorting,
    searchQuery
  } = useTableManagement({
    apiCall: (params: object) => useFetchAllVisits(true, {...params, columns:columnsToFetch}),
    initialQueryParams: {
      page: 1,
      limit: isDashboard ? 5 : 10,
    }
  });

  const { data, isLoading, dataUpdatedAt } = apiData ?? {};

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPageIndex(1);
  };

  const columns: ColumnDef<AllVisitsResponse>[] = [
    {
      accessorKey: 'patient.name',
      header: 'Patient',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.original.patient.name}
        </span>
      ),
    },
    {
      accessorKey: 'careGiverName',
      header: 'Care Giver',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {`${row.original.caregiver?.firstName || ''} ${row.original.caregiver?.lastName || ''}`}
        </span>
      ),
    },
    {
      accessorKey: 'startedAt',
      header: 'Start Time',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {formatDateTime(row.getValue('startedAt'))}
        </span>
      ),
    },
    {
      accessorKey: 'endedAt',
      header: 'End Time',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {formatDateTime(row.getValue('endedAt'))}
        </span>
      ),
    },
    {
      accessorKey: 'submittedAt',
      header: 'Submitted At',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {formatDateTime(row.getValue('submittedAt'))}
        </span>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Address',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('address')}
        </span>
      ),
    },
  ];

  return {
    columns,
    data: data?.rows || [],
    total: data?.total || 0,
    pageIndex,
    pageSize,
    setPageSize,
    handleSearchChange,
    sorting,
    setSorting,
    onSortingChange,
    isLoading,
    dataUpdatedAt,
    searchQuery,
    setPageIndex
  }
};

export default useVisitsManager;