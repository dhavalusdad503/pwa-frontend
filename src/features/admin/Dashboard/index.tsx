import { ManagementTitle } from '@components/common/ManagementTitle';
import { ROUTES } from '@constant/routesPath';
import CaregiversPage from '@pages/Admin/Caregivers';
import SupervisorsPage from '@pages/Admin/Supervisors';
import VisitsPage from '@pages/Admin/Visits';

const AdminDashboard = () => {
  return (
    <>
      <div className="relative bg-white rounded-10px mt-7 mb-3 p-4">
        <ManagementTitle path={ROUTES.ADMIN_SUPERVISORS.path} />
        <SupervisorsPage isDashboard isSupervisor />
      </div>
      <div className="relative bg-white rounded-10px mt-7 mb-3 p-4">
        <ManagementTitle path={ROUTES.ADMIN_CAREGIVERS.path} />
        <CaregiversPage isDashboard isSupervisor={false} />
      </div>
      <div className="relative bg-white rounded-10px mt-7 mb-3 p-4">
        <ManagementTitle path={ROUTES.ADMIN_VISITS.path} />
        <VisitsPage isDashboard />
      </div>
    </>
  );
};
export default AdminDashboard;
