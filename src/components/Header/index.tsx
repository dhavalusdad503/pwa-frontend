// import { ROUTES } from '@/constant/routesPath';

import { USER_ROLE } from '@api/types/user.dto';
import { useOfflineSync } from '@hooks/useOfflineFormSync';
import Button from '@lib/Common/Button';
import Icon from '@lib/Common/Icon';
import { dispatchClearUser } from '@redux/dispatch/user.dispatch';
import { currentUser } from '@redux/ducks/user';
import { useSelector } from 'react-redux';

// interface MenuItems {
//   label: string;
//   path: string;
// }

// const menuItems: MenuItems[] = [
//   {
//     label: 'Dashboard',
//     path: ROUTES.DEFAULT.path
//   },
//   {
//     label: 'Login',
//     path: ROUTES.LOGIN.path
//   },
//   {
//     label: 'Home Visit',
//     path: ROUTES.HOME_VISIT.path
//   }
//   //   {
//   //     label: 'Category',
//   //     path: ROUTES.CATEGORY.path
//   //   },
//   //   { label: 'User', path: ROUTES.USER.path }
// ];

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { triggerFullSync, isSyncing, isOnline, synced } = useOfflineSync();

  // const routeData = Object.values(ROUTES).find((route) =>
  //   matchPath(route.path, location.pathname)
  // );
  const { firstName, role } = useSelector(currentUser);
  const handleSyncClick = () => {
    if (!isSyncing && isOnline) {
      triggerFullSync(); // Full sync - fetches all visits
    }
  };

  return (
    <>
      <nav className="border-gray-200 bg-gray-500">
        <div className="flex justify-between items-center p-4">
          {/* Hamburger Menu Button for Mobile */}
          {toggleSidebar && role?.name !== USER_ROLE.CAREGIVER && (
            <button
              onClick={toggleSidebar}
              className="xl:hidden p-2 text-white hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Toggle sidebar">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* User Info */}
          <h1 className="text-white">{`${firstName} (${role?.name})`}</h1>

          {/* Logout Button */}
          <Button
            variant="outline"
            title="Logout "
            className=" border-2 rounded-xl"
            isIconFirst={true}
            icon={<Icon name="logout" />}
            onClick={() => dispatchClearUser()}
          />
        </div>
      </nav>
    </>
  );
};

export default Header;
