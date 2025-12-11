import { USER_ROLE, UserDTO } from '@api/types/user.dto';
import { useGetUserList } from '@api/user';
import { formatDateTime } from '@helper/dateUtils';
import { combineName } from '@helper/index';
import { useTableManagement } from '@lib/Common/Table';
import { ColumnDef } from '@tanstack/react-table';

const useUserManagement = ({
  isSupervisor = false,
  isDashboard = false
}: {
  isSupervisor?: boolean;
  isDashboard?: boolean;
}) => {
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
  } = useTableManagement<UserDTO[], object>({
    apiCall: (params: object) => useGetUserList(params),
    initialQueryParams: {
      page: 1,
      limit: isDashboard ? 5 : 10,
      userType: isSupervisor ? USER_ROLE.SUPERVISOR : USER_ROLE.CAREGIVER
    }
  });

  const { data, isLoading, dataUpdatedAt } = apiData ?? {};

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPageIndex(1);
  };

  const columns: ColumnDef<UserDTO>[] = [
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => (
        <>
          {row?.original?.firstName &&
            row?.original?.lastName &&
            combineName({
              names: [row?.original?.firstName, row?.original?.lastName]
            })}
        </>
      ),
      enableSorting: !isDashboard
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <>{row?.original?.email || '-'}</>,
      enableSorting: !isDashboard
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <>{row?.original?.phone || '-'}</>,
      enableSorting: !isDashboard
    },
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      cell: ({ row }) => {
        const time = row.original?.createdAt;
        return <>{formatDateTime(time) || '-'}</>;
      },
      enableSorting: !isDashboard
    }
  ];

  return {
    columns,
    data: data?.data || [],
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
  };
};

export default useUserManagement;
