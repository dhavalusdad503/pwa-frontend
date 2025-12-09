// import { ROUTES } from '@/constant/routesPath';

import Button from "@lib/Common/Button";
import Icon from "@lib/Common/Icon";
import { dispatchClearUser } from "@redux/dispatch/user.dispatch";
import { currentUser } from "@redux/ducks/user";
import { useSelector } from "react-redux";

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
import { useOfflineSync } from '@hooks/useOfflineFormSync';

const Header = () => {
  const { triggerFullSync, isSyncing, isOnline, synced } = useOfflineSync();

  // const routeData = Object.values(ROUTES).find((route) =>
  //   matchPath(route.path, location.pathname)
  // );
  const { firstName, role } = useSelector(currentUser);
  const handleSyncClick = () => {
    if (!isSyncing && isOnline) {
      triggerFullSync();  // Full sync - fetches all visits
    }
  };

  return (
    <>
      <nav className="border-gray-200 bg-gray-500">
        <div className="flex justify-between  items-center p-4">
          {/* <ul className="flex gap-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'text-lg font-bold',
                      isActive ? 'text-white' : 'text-gray-800'
                    )
                  }>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul> */}
          <h1 className="text-white">{`${firstName} (${role?.name} )`}</h1>

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
