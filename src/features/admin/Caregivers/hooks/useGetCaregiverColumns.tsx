import { CareGiverData } from "@features/admin/Caregivers/types";
import { ColumnDef } from "@tanstack/react-table";


const getCaregiverColumns = () => {

  const columns: ColumnDef<CareGiverData>[] = [
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
    {
      accessorKey: 'city',
      header: 'City',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('city')}
        </span>
      ),
    },
    {
      accessorKey: 'state',
      header: 'State',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('state')}
        </span>
      ),
    },
    {
      accessorKey: 'zip',
      header: 'Zip',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('zip')}
        </span>
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('country')}
        </span>
      ),
    },
  ];

  return {
    columns
  }
};

export default getCaregiverColumns;