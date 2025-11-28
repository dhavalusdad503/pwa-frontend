// import { ROUTES } from '@/constant/routesPath';

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

const Header = () => {
  // const location = useLocation();

  // const routeData = Object.values(ROUTES).find((route) =>
  //   matchPath(route.path, location.pathname)
  // );

  return (
    <>
      <nav className="border-gray-200 bg-gray-500">
        <div className="flex flex-wrap items-center mx-auto p-4">
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
        </div>
      </nav>
      {/* <div className="p-3 bg-green-500 text-white">
        <h3 className="text-lg font-bold">{routeData?.headerName || 'Home'}</h3>
      </div> */}
    </>
  );
};

export default Header;
