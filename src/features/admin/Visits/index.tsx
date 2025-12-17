import useVisitsManager from "@features/admin/Visits/hooks/getVisitsColumns";
import InputField from "@lib/Common/Input";
import Table from "@lib/Common/Table";


const Visits = ({
    isDashboard
}: {
    isDashboard: boolean
}) => {
    const {
        columns,
        data,
        handleSearchChange,
        isLoading,
        onSortingChange,
        pageIndex,
        pageSize,
        searchQuery,
        setPageSize,
        setSorting,
        sorting,
        total,
        setPageIndex
    } = useVisitsManager(isDashboard);


    return (
        <div className="bg-white rounded-20px border border-solid border-surface p-5">
            <div className="flex items-center flex-wrap gap-5 mb-5">
                <h5 className="text-lg leading-6 font-bold text-blackdark">
                    Visits
                </h5>
                {!isDashboard && <InputField
                    type="Search"
                    placeholder="Search"
                    icon="search"
                    iconFirst
                    iconClassName="text-primarygray"
                    onChange={handleSearchChange}
                    value={searchQuery}
                    parentClassName="w-full sm:w-360px ml-auto"
                />}
            </div>
            <Table
                data={data}
                columns={columns}
                className="w-full"
                onPageChange={setPageIndex}
                onPageSizeChange={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={total}
                onSortingChange={onSortingChange}
                sorting={sorting}
                setSorting={setSorting}
                isLoading={isLoading}
                pagination={!isDashboard}
            />
        </div>
    );
}

export default Visits;