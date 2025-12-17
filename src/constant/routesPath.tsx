import { lazy } from 'react';

import NotFound from '@components/common/NotFound';
import AuditLogsPage from '@pages/Admin/AuditLogs';
import SystemSettingsPage from '@pages/Admin/SystemSettings';
import VisitsPage from '@pages/Admin/Visits';
import { type RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('@pages/Dashboard'));
const Login = lazy(() => import('@pages/Login'));
const HomeVisits = lazy(() => import('@pages/HomeVisit'));
const NewShift = lazy(() => import('@pages/NewShift'));
const Root = lazy(() => import('@pages/Root'));
const ForgetPassword = lazy(
  () => import('@pages/ForgetPassword/ForgetPasswordPage')
);
// const OtpConfirmation = lazy(() => import('@pages/ForgetPassword/OtpConfirmationPage'))
const ResetPassword = lazy(
  () => import('@pages/ForgetPassword/ResetPasswordPage')
);

const SupervisorsPage = lazy(() => import('@pages/Admin/Supervisors'));

const CaregiversPage = lazy(() => import('@pages/Admin/Caregivers'));

// const Product = lazy(() => import('@/pages/Product'));
// const Category = lazy(() => import('@/pages/Category'));
// const User = lazy(() => import('@/pages/User'));
// const AddUser = lazy(() => import('@/pages/User/AddUser'));
// const Register = lazy(() => import('@/pages/Register'));
export type RoutesType = {
  [key in
    | 'DEFAULT'
    | 'LOGIN'
    | 'HOME_VISIT'
    | 'NEW_SHIFT'
    | 'CAREGIVER_DASHBOARD'
    | 'ADMIN_DASHBOARD'
    | 'ADMIN_VISITS'
    | 'ADMIN_CAREGIVERS'
    | 'ADMIN_SUPERVISORS'
    | 'ADMIN_SYSTEM_SETTINGS'
    | 'ADMIN_AUDIT_LOGS'
    | 'SUPERVISOR_DASHBOARD'
    | 'FORGET_PASSWORD'
    // | 'OTP_CONFIRMATION'
    | 'RESET_PASSWORD'
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
    enableOfflineSync?: boolean;
    routeType: 'public' | 'authenticate' | 'un-authenticate';
    element: RouteObject['element'];
    errorElement?: RouteObject['errorElement'];
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
    element: <Root />
  },
  LOGIN: {
    path: '/login',
    routeType: 'un-authenticate',
    headerName: 'Login',
    element: <Login />
  },
  FORGET_PASSWORD: {
    path: '/forget-password',
    routeType: 'un-authenticate',
    headerName: 'Forget Password',
    element: <ForgetPassword />
  },
  // OTP_CONFIRMATION: {
  //   path: '/otp-confirmation',
  //   routeType: 'un-authenticate',
  //   headerName: 'Otp Confirmation',
  //   element: <OtpConfirmation />
  // },
  RESET_PASSWORD: {
    path: '/reset-password',
    routeType: 'un-authenticate',
    headerName: 'Reset Password',
    element: <ResetPassword />
  },
  CAREGIVER_DASHBOARD: {
    path: '/caregiver/dashboard',
    routeType: 'authenticate',
    headerName: 'Dashboard',
    enableOfflineSync: true,
    element: <Dashboard />
  },
  SUPERVISOR_DASHBOARD: {
    path: '/supervisor/dashboard',
    routeType: 'authenticate',
    headerName: 'Dashboard',
    element: <Dashboard />
  },
  HOME_VISIT: {
    path: '/caregiver/home-visit',
    routeType: 'authenticate',
    enableOfflineSync: true,
    headerName: 'Home Visit',
    element: <HomeVisits />
  },
  NEW_SHIFT: {
    path: '/caregiver/new-shift',
    routeType: 'authenticate',
    headerName: 'New Shift',
    element: <NewShift />
  },

  //Admin Routes
  ADMIN_DASHBOARD: {
    path: '/admin/dashboard',
    routeType: 'authenticate',
    headerName: 'Dashboard',
    element: <Dashboard />
  },
  ADMIN_VISITS: {
    path: '/admin/visits',
    routeType: 'authenticate',
    headerName: 'Visits',
    element: <VisitsPage />
  },
  ADMIN_CAREGIVERS: {
    path: '/admin/caregivers',
    routeType: 'authenticate',
    headerName: 'Care Givers',
    element: <CaregiversPage />
  },
  ADMIN_SUPERVISORS: {
    path: '/admin/supervisors',
    routeType: 'authenticate',
    headerName: 'Supervisors',
    element: <SupervisorsPage />
  },
  ADMIN_SYSTEM_SETTINGS: {
    path: '/admin/settings',
    routeType: 'authenticate',
    headerName: 'System Settings',
    element: <SystemSettingsPage />
  },
  ADMIN_AUDIT_LOGS: {
    path: '/admin/audit-logs',
    routeType: 'authenticate',
    headerName: 'Audit Logs',
    element: <AuditLogsPage />
  },

  NOT_FOUND: {
    path: '*',
    routeType: 'un-authenticate',
    element: <NotFound />
  }
} as const;
