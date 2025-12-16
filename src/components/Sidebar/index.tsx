import { useEffect } from "react";

import { getMenuItemByRole } from "@config/sidebarConfig";
import Icon from "@lib/Common/Icon";
import { currentUser, UserState } from "@redux/ducks/user";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";


const Sidebar = ({ toggleSidebar, isSidebarOpen }: { toggleSidebar: () => void, isSidebarOpen: boolean }) => {

  const user: UserState = useSelector(currentUser);
  const menuItems = getMenuItemByRole(user.role?.slug || '');

  // Handle body scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (window.innerWidth < 1280 && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-998 xl:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'h-screen bg-white border-r border-surface fixed xl:relative top-0 left-0 z-999 transition-all duration-300 ease-in-out py-5',
          // Mobile: slide in/out from left, Desktop: always visible with width change
          isSidebarOpen
            ? 'w-270px translate-x-0'
            : 'w-79px -translate-x-full xl:translate-x-0'
        )}
      >
        <div className='flex flex-col gap-6 h-full'>
          {/* Logo/Brand Section */}
          <div className='relative transition-all duration-300 ease-in-out px-3.5'>
            <div className='flex items-center px-3.5 overflow-hidden transition-all duration-300 ease-in-out'>
              <Icon name='dashboard' className='icon-wrapper h-8 min-w-52 whitespace-nowrap' />
            </div>

            {/* Toggle Button */}
            <div
              onClick={e => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className={clsx(
                'z-10 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer absolute top-2/4 -translate-y-2/4 bg-primary text-white -right-2.5 transition-transform duration-300',
                !isSidebarOpen && 'rotate-180'
              )}
            >
              <Icon
                name='toggleArrow'
                className='icon-wrapper w-3 h-3 transition-all duration-300 ease-in-out'
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className='transition-all duration-300 ease-in-out px-3.5 flex flex-col gap-6 justify-between flex-1 overflow-hidden'>
            <ul className='flex flex-col gap-1.5 overflow-y-auto flex-1 scroll-disable'>
              {menuItems.map(item => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1280) {
                        toggleSidebar();
                      }
                    }}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out',
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100',
                        !isSidebarOpen && 'justify-center'
                      )
                    }
                  >
                    <Icon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                    <span
                      className={clsx(
                        'transition-all duration-300 ease-in-out whitespace-nowrap',
                        isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                      )}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Footer Actions */}
            <ul className='flex flex-col gap-1.5 transition-all duration-300 ease-in-out'>
              <li
                // onClick={handleLogout}
                className={clsx(
                  'flex items-center px-4 py-4 gap-3 text-base leading-18px font-medium rounded-lg transition-all duration-300 ease-in-out cursor-pointer text-red bg-redlight hover:bg-red hover:text-white',
                  !isSidebarOpen && 'justify-center'
                )}
              >
                <div className='w-5 flex-shrink-0'>
                  <Icon name='logout' className='icon-wrapper w-18px h-18px' />
                </div>
                <span
                  className={clsx(
                    'transition-all duration-300 ease-in-out whitespace-nowrap',
                    isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  )}
                >
                  Log Out
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar