import { USER_ROLE } from "@api/types/user.dto";
import { ROUTES } from "@constant/routesPath";
import { IconNameType } from "@lib/Common/Icon";


export interface SidebarMenuItem {
  icon: IconNameType;
  label: string;
  path: string;
  roles: string[];
}

export const sidebarMenuItems: SidebarMenuItem[] = [

  //Admin
  {
    icon: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.ADMIN_DASHBOARD.path,
    roles: [USER_ROLE.ADMIN]
  },
  {
    icon: 'list',
    label: 'Visits',
    path: ROUTES.ADMIN_VISITS.path,
    roles: [USER_ROLE.ADMIN]
  },
  {
    icon: 'list',
    label: 'Care Givers',
    path: ROUTES.ADMIN_CAREGIVERS.path,
    roles: [USER_ROLE.ADMIN]
  },
  {
    icon: 'list',
    label: 'Supervisers',
    path: ROUTES.ADMIN_SUPERVISORS.path,
    roles: [USER_ROLE.ADMIN]
  },
  {
    icon: 'list',
    label: 'Audit Logs',
    path: ROUTES.ADMIN_AUDIT_LOGS.path,
    roles: [USER_ROLE.ADMIN]
  },
  {
    icon: 'list',
    label: 'System Settings',
    path: ROUTES.ADMIN_SYSTEM_SETTINGS.path,
    roles: [USER_ROLE.ADMIN]
  },


  //Caregiver
  {
    icon: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.CAREGIVER_DASHBOARD.path,
    roles: [USER_ROLE.CAREGIVER]
  },
  {
    icon: 'list',
    label: 'Patients History',
    path: ROUTES.HOME_VISIT.path,
    roles: [USER_ROLE.CAREGIVER]
  },
  
];

export const getMenuItemByRole = (userRole: string): SidebarMenuItem[] => {
  return sidebarMenuItems.filter((item) => item.roles.includes(userRole));
};