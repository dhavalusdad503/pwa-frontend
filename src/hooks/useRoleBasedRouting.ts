import { useEffect } from 'react';

import { USER_ROLE } from '@api/types/user.dto';
import { getDefaultRouteByRole } from '@config/defaultRoutes';
import { ROUTES } from '@constant/routesPath';
import { currentUser } from '@redux/ducks/user';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export const useRoleBasedRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(currentUser);

  //   const userRole = user.role || USER_ROLE.CAREGIVER;
  const userRole = user?.role?.name;
  const isAuthenticated = !!user.token && !!user.id;

  // Redirect to role-appropriate default route if user is on a generic route
  useEffect(() => {
    if (isAuthenticated) {
      const currentPath = location.pathname;
      const defaultRoute = getDefaultRouteByRole(userRole);

      // If user is on root path or login path, redirect to their default route
      if (currentPath === '/' || currentPath === ROUTES.LOGIN.path) {
        navigate(defaultRoute, { replace: true });
      }
    }
  }, [isAuthenticated, userRole, location.pathname, navigate, user]);

  // Check if current route is accessible for user's role
  const isRouteAccessible = (path: string): boolean => {
    const staticRoutes = {
      [USER_ROLE.CAREGIVER]: [
        ROUTES.CAREGIVER_DASHBOARD.path,
        ROUTES.HOME_VISIT.path,
        ROUTES.NEW_SHIFT.path
        // ROUTES.CLIENT_DASHBOARD.path,
        // ROUTES.REQUEST_SLOT.path
      ],
      [USER_ROLE.ADMIN]: [ROUTES.ADMIN_DASHBOARD.path],
      [USER_ROLE.SUPERVISOR]: [ROUTES.SUPERVISOR_DASHBOARD.path]
    };

    // BACKOFFICE ROUTES

    const dynamicRoutes = {
      [USER_ROLE.CAREGIVER]: [
        ROUTES.CAREGIVER_DASHBOARD.path
        // ROUTES.CLIENT_DASHBOARD.path,
        // ROUTES.REQUEST_SLOT.path
      ],
      [USER_ROLE.ADMIN]: [ROUTES.ADMIN_DASHBOARD.path],
      [USER_ROLE.SUPERVISOR]: [ROUTES.SUPERVISOR_DASHBOARD.path]
    };

    const allowedStaticRoutes =
      staticRoutes[userRole as keyof typeof staticRoutes] || [];

    const allowedDynamicRoutes =
      dynamicRoutes[userRole as keyof typeof dynamicRoutes] || [];
    if (allowedStaticRoutes.includes(path)) {
      return true;
    }

    return allowedDynamicRoutes.some((allowedPath) => {
      const allowedSegments = allowedPath.split('/').filter(Boolean);
      const currentSegments = path.split('/').filter(Boolean);
      if (allowedSegments.length !== currentSegments.length) return false;
      return allowedSegments.every(
        (seg, i) => seg.startsWith(':') || seg === currentSegments[i]
      );
    });
  };

  // const hasPermission = (permission: string): boolean => {
  //   const userPermissions: string[] = Array.isArray(user?.permissions)
  //     ? user.permissions
  //     : [];
  //   return userPermissions?.includes(permission);
  // };

  return {
    userRole,
    isAuthenticated,
    isRouteAccessible,
    getDefaultRoute: () => getDefaultRouteByRole(userRole)
    // hasPermission
  };
};
