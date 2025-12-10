import { SuperviserData } from "@features/admin/Supervisers/types";
import { ColumnDef } from "@tanstack/react-table";


const getSuperviserColumns = () => {

  const columns: ColumnDef<SuperviserData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500 block w-full'
        >
          {row.getValue('name')}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('email')}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('phone')}
        </span>
      ),
    },
    {
      accessorKey: 'organizationName',
      header: 'Organization',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('organizationName')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('status')}
        </span>
      ),
    },
  ];

  return {
    columns
  }
};

export default getSuperviserColumns;