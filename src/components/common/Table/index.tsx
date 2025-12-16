import { Pagination } from '@components/common/Pagination';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import clsx from 'clsx';

interface TableProps<TData> {
  id?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  // searchPlaceholder?: string;
  // searchableColumns?: string[];
  // parentClassName?: string;
  // className?: string;
  // tableClassName?: string;
  // theadClassName?: string;
  // thClassName?: string;
  // tdClassName?: string;
  // activeRowClassName?: string;
  pagination?: boolean;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  // sorting: SortingState;
  // setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  onRowClick: (rowData: TData) => void;
  selectedRowId?: string | number;
  rowIdAccessor?: keyof TData;
  isLoading?: boolean;
  skeletonCount?: number;
}

const Table = <TData,>({
  id = 'root-table',
  data,
  columns,
  // setSorting,
  pagination,
  totalCount,
  // pageIndex,
  // pageSize,
  onPageChange,
  onPageSizeChange,
  // onSortingChange,
  // onRowClick,
  // selectedRowId,
  // rowIdAccessor,
  // isLoading,
  // skeletonCount,
  isLoading
}: TableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className={clsx('w-full')} id={id}>
      <div>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-100 border border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border border-gray-200">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-gray-50 my-2">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border border-gray-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && pagination && totalCount > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <Pagination
            table={table}
            totalCount={totalCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
