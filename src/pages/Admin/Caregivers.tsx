import UserManagement from '@features/admin/Users';

const CaregiversPage = ({
  isSupervisor = false,
  isDashboard = false
}: {
  isSupervisor?: boolean;
  isDashboard?: boolean;
}) => {
  return (
    <UserManagement isSupervisor={isSupervisor} isDashboard={isDashboard} />
  );
};

export default CaregiversPage;
