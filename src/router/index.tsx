import { Suspense } from 'react';

import { ErrorBoundary, ErrorElement } from '@components/common';
import Layout from '@components/Layout';
import { ROUTES } from '@constant/routesPath';
import SectionLoader from '@lib/Common/Loader/Spinner';
import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';

import AuthenticateRoute from './RouteGuard/AuthenticateRoute';
import UnAuthenticateRoute from './RouteGuard/UnAuthenticateRoute';
import { OfflineSyncProvider } from '@hooks/useOfflineFormSync';

const applySuspense = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => ({
    ...route
    // element: (
    //   <Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>
    // )
  }));
};

// // Sync is now handled by OfflineSyncProvider
// const AuthenticateRouteWrapper = ({ children }: { children: React.ReactNode }) => {
//   return <>{children}</>;
// };

export const RoutesArray: RouteObject[] = applySuspense([
  ...Object.keys(ROUTES).map((key) => {
    const route = ROUTES[key as keyof typeof ROUTES];

    const routeObj: RouteObject = {
      path: route.path,
      element: route.element,
      errorElement: route.errorElement || <ErrorElement />
    };

    // ... inside RoutesArray map function ...
    if (route.routeType === 'authenticate') {
      routeObj['element'] = (
        <AuthenticateRoute>
          <OfflineSyncProvider>
            {/* <AuthenticateRouteWrapper> */}
              <Layout>
                <Suspense fallback={<SectionLoader className="relative h-full" />}>
                  {ROUTES.DEFAULT.path !== route.path ? (
                    <ErrorBoundary path={ROUTES.DEFAULT.path}>
                      {route.element}
                    </ErrorBoundary>
                  ) : (
                    route.element
                  )}
                </Suspense>
              </Layout>
            {/* </AuthenticateRouteWrapper> */}
          </OfflineSyncProvider>
        </AuthenticateRoute>
      );
    } else if (route.routeType === 'un-authenticate') {
      routeObj['element'] = (
        <UnAuthenticateRoute>
          <Suspense fallback={<SectionLoader />}>{route.element}</Suspense>
        </UnAuthenticateRoute>
      );
    } else {
      routeObj['element'] = (
        <Suspense fallback={<SectionLoader />}>{route.element}</Suspense>
      );
    }

    return routeObj;
  })
]);

const AllRoute = createBrowserRouter(RoutesArray);

const Route = () => <RouterProvider router={AllRoute} />;

export default Route;
