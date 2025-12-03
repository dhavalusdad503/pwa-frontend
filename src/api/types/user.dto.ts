export const USER_ROLE = {
  CAREGIVER: 'CAREGIVER',
  SUPERVISOR: 'SUPERVISOR',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface RoleType {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  authProvider: string;
  token?: string;
}

//   roles: [
//     {
//       name: string;
//       slug: string;
//       UserRole: {
//         user_id: string;
//         role_id: string;
//         tenant_id: string;
//       };
//     }
//   ];
// permissions?: string[] | [];
// }
