import React, { PropsWithChildren, Suspense } from 'react';

import { useRoleBasedRouting } from '@hooks/useRoleBasedRouting';
import SectionLoader from '@lib/Common/Loader/Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const AuthenticateRoute: React.FC<PropsWithChildren> = ({ children }) => {
  // const { isAuthenticated } = useAuthState();
  const location = useLocation();
  const { isRouteAccessible, getDefaultRoute } = useRoleBasedRouting();
  // const { role } = useSelector(currentUser);
  // if (!isAuthenticated) {
  //   if (role === UserRole.CLIENT) {
  //     return <Navigate to={ROUTES.LOGIN.path} replace />;
  //   } else if (role === UserRole.THERAPIST) {
  //     return <Navigate to={ROUTES.THERAPIST_LOGIN.path} replace />;
  //   } else if (role === UserRole.ADMIN) {
  //     return <Navigate to={ROUTES.ADMIN_LOGIN.path} replace />;
  //   } else if (role === UserRole.BACKOFFICE) {
  //     return <Navigate to={ROUTES.ADMIN_LOGIN.path} replace />;
  //   }
  //   return <Navigate to={ROUTES.LOGIN.path} replace />;
  // }

  const normalizedPath = location.pathname.replace(
    /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    '/:id'
  );

  // Check if current route is accessible for user's role
  if (!isRouteAccessible(normalizedPath)) {
    // Redirect to user's default route if they don't have access to current route
    return <Navigate to={getDefaultRoute()} />;
  }

  return <Suspense fallback={<SectionLoader />}>{children}</Suspense>;
};

export default AuthenticateRoute;
