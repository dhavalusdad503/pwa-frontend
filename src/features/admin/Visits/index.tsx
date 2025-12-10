import Table from "@components/common/Table";
import { visitData } from "@features/admin/Visits/Data/testVisitData";
import getVisitsColumns from "@features/admin/Visits/hooks/getVisitsColumns";


const Visits = () => {
  


    return (
        <>
            <h3 className="text-2xl font-bold py-2">Visits</h3>
            <Table
            data={visitData}
            columns={getVisitsColumns().columns}
            pagination={true}
            totalCount={visitData.length}
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

export default Visits;