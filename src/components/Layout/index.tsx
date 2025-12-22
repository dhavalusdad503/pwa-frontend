import { PropsWithChildren, useEffect, useState } from 'react';

import { USER_ROLE } from '@api/types/user.dto';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';
import { currentUser } from '@redux/ducks/user';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

const Layout = ({ children }: PropsWithChildren) => {
  // Initialize sidebar state based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 1280
  );
  const { role } = useSelector(currentUser);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle window resize to auto-adjust sidebar on screen size change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="flex bg-surfacelight h-screen">
        {/* {role?.name === USER_ROLE.ADMIN && ( */}
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        {/* )} */}
        <div
          className={clsx(
            'relative h-full flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out',
            // On mobile: no margin, On desktop: margin based on sidebar state
            'xl:ml-0',
            isSidebarOpen ? 'xl:ml-270px' : 'xl:ml-79px'
          )}>
          <Header toggleSidebar={toggleSidebar} />
          <div className="p-5 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
