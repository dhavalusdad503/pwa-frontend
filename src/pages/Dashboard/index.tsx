import { USER_ROLE } from '@api/types/user.dto';
import AdminDashboard from '@features/admin/Dashboard';
import CaregiverDashboard from '@features/Caregiver/Dashboard';
import Login from '@features/Login';
import SupervisorDashboard from '@features/Supervisor/Dashboard';
import { currentUser } from '@redux/ducks/user';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector(currentUser);
  const userRole = user?.role?.name;

  // Render the appropriate dashboard based on user role
  switch (userRole) {
    case USER_ROLE.CAREGIVER:
      return <CaregiverDashboard />;
    case USER_ROLE.SUPERVISOR:
      return <SupervisorDashboard />;
    case USER_ROLE.ADMIN:
      return <AdminDashboard />;
    default:
      return <Login />;
  }
};
export default Dashboard;
