import UserManagement from '@features/admin/Users';

const SupervisorsPage = ({
  isSupervisor = true,
  isDashboard = false
}: {
  isSupervisor?: boolean;
  isDashboard?: boolean;
}) => {
  return (
    <UserManagement isSupervisor={isSupervisor} isDashboard={isDashboard} />
  );
};

export default SupervisorsPage;
