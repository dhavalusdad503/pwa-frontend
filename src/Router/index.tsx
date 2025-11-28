import { Suspense } from 'react';

import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';

import { ErrorBoundary } from '@/components/common';
import Layout from '@/components/Layout';
import { ROUTES } from '@/constant/routesPath';

import AuthenticateRoute from './RouteGuard/AuthenticateRoute';
import UnAuthenticateRoute from './RouteGuard/UnAuthenticateRoute';

const applySuspense = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => ({
    ...route,
    element: (
      <Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>
    )
  }));
};

export const RoutesArray: RouteObject[] = applySuspense([
  ...Object.keys(ROUTES).map((key) => {
    const route = ROUTES[key as keyof typeof ROUTES];

    const routeObj: RouteObject = {
      path: route.path,
      element: route.element
    };

    if (route.routeType === 'authenticate') {
      routeObj['element'] = (
        <AuthenticateRoute>
          <Layout>
            {ROUTES.DEFAULT.path !== route.path ? (
              <ErrorBoundary path={ROUTES.DEFAULT.path}>
                {route.element}
              </ErrorBoundary>
            ) : (
              route.element
            )}
          </Layout>
        </AuthenticateRoute>
      );
    } else if (route.routeType === 'un-authenticate') {
      routeObj['element'] = (
        <Layout>
          <UnAuthenticateRoute>{route.element}</UnAuthenticateRoute>
        </Layout>
      );
    }

    return routeObj;
  })
]);

const AllRoute = createBrowserRouter(RoutesArray);

const Route = () => <RouterProvider router={AllRoute} />;

export default Route;
