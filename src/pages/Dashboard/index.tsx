import { useEffect, useState } from 'react';

import { USER_ROLE } from '@api/types/user.dto';
import AdminDashboard from '@features/admin/Dashboard';
import CaregiverDashboard from '@features/Caregiver/Dashboard';
import SetPin from '@features/HomeVisits/SetPin';
import Login from '@features/Login';
import SupervisorDashboard from '@features/Supervisor/Dashboard';
import { useSecurity } from '@pages/SecurityProvide';
import { currentUser } from '@redux/ducks/user';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const sec = useSecurity();
  const nav = useNavigate();
  const user = useSelector(currentUser);
  const userRole = user?.role?.name;
  const [isSetPassword, setIsSetProps] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  useEffect(() => {
    (async () => {
      const has = await sec.hasWrappedKey();
      // if (!has) nav('/setup', { replace: true });
      if (!has) {
        setIsSetProps(true);
        setIsOpen(true)
      }
      else {
        setIsOpen(true)
      }
      // else nav('/', { replace: true });
    })();
  }, [sec, nav]);
  const locked = sec.locked;

  const Dashboard = () => {
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
  }
  return (
    <>
      {!locked && Dashboard()}
      {locked && <SetPin isSetPassword={isSetPassword} isOpen={isOpen} setIsSetProps={setIsSetProps} />}
    </>
  )
  // Render the appropriate dashboard based on user role
};
export default Dashboard;
