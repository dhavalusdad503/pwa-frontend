import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
export type RoutesType = {
  [key in
    | 'DEFAULT'
    | 'LOGIN'
    // | 'PRODUCT'
    // | 'CATEGORY'
    // | 'USER'
    // | 'ADD_USER'
    // | 'EDIT_USER'
    // | 'VIEW_USER'
    // | 'REGISTER'
    | 'NOT_FOUND']: {
    path: string;
    headerName?: string;
    routeType: 'public' | 'authenticate' | 'un-authenticate';
    element: RouteObject['element'];
  };
  // } & {
  //   [key in 'EDIT_USER' | 'VIEW_USER']: {
  //     navigatePath: (id: number | string) => string;
  //   };
};

export const ROUTES: RoutesType = {
  DEFAULT: {
    path: '/',
    routeType: 'public',
    element: <Dashboard />
  },
  LOGIN: {
    path: '/login',
    routeType: 'public',
    headerName: 'Login',
    element: <Login />
  },
  NOT_FOUND: {
    path: '*',
    routeType: 'public',
    element: <Navigate to={'/'} />
  }
} as const;
