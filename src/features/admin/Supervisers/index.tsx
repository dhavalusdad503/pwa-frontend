import Table from "@components/common/Table";
import getSuperviserColumns from "./hooks/useGetSuperviserColumns";
import superviserData from "@features/admin/Supervisers/Data";

const Supervisers = () => {

  const { columns } = getSuperviserColumns();

  return (
    <>
      <h3 className="text-2xl font-bold py-2"> Supervisers</h3>
      <Table
        columns={columns}
        data={superviserData}
        pagination={true}
        totalCount={superviserData.length}
        pageIndex={1}
        pageSize={10}
        onPageChange={(pageIndex) => console.log(pageIndex)}
        onPageSizeChange={(pageSize) => console.log(pageSize)}
        onSortingChange={(sorting) => console.log(sorting)}
        onRowClick={(rowData) => console.log(rowData)}
        isLoading={false}
      />
    </>
  );
}

export default Supervisers;