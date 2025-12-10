import { VisitData } from "@features/admin/Visits/types";
import { formatDateTime } from "@helper/dateUtils";
import { ColumnDef } from "@tanstack/react-table";


const getVisitsColumns = () => {

  const columns: ColumnDef<VisitData>[] = [
    {
      accessorKey: 'patientName',
      header: 'Patient',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('patientName')}
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
          {row.getValue('careGiverName')}
        </span>
      ),
    },
    {
      accessorKey: 'supervisorName',
      header: 'Supervisor',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('supervisorName')}
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
      accessorKey: 'startTime',
      header: 'Start Time',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {formatDateTime(row.getValue('startTime'))}
        </span>
      ),
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {formatDateTime(row.getValue('endTime'))}
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
      accessorKey: 'Address',
      header: 'Address',
      meta: {
        cellClassName: 'w-36',
      },
      cell: ({ row }) => (
        <span
          className='hover:text-blue-500  block w-full'
        >
          {row.getValue('Address')}
        </span>
      ),
    },
  ];

  return {
    columns
  }
};

export default getVisitsColumns;