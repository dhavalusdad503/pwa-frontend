import Table from "@components/common/Table";
import careGiversData from "@features/admin/Caregivers/Data";
import getCaregiverColumns from "@features/admin/Caregivers/hooks/useGetCaregiverColumns";



const Caregivers = () => {

    return (
        <>
            <h3 className="text-xl font-bold py-2">Caregivers </h3>
            <Table
                data={careGiversData}
                columns={getCaregiverColumns().columns}
                pagination={true}
                totalCount={careGiversData.length}
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

export default Caregivers;