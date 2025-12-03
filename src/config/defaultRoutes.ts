import { USER_ROLE } from '@api/types/user.dto';
import { ROUTES } from '@constant/routesPath';

export const getDefaultRouteByRole = (userRole: string): string => {
  switch (userRole) {
    case USER_ROLE.CAREGIVER:
      return ROUTES.CAREGIVER_DASHBOARD.path;
    case USER_ROLE.SUPERVISOR:
      return ROUTES.SUPERVISOR_DASHBOARD.path;
    case USER_ROLE.ADMIN:
      return ROUTES.ADMIN_DASHBOARD.path;
    default:
      return ROUTES.DEFAULT.path;
  }
};
