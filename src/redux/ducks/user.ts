import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { User } from '@/api/types/user.dto';

// const initialState: User = {
//   id: '',
//   first_name: '',
//   last_name: '',
//   email: '',
//   name: '',
//   role: '',
//   profile_image: '',
//   created_at: '',
//   updated_at: '',
//   last_login: '',
//   tenant_id: '',
//   accessToken: '',
//   timezone: 'UTC',
//   permissions: []
// };
const initialState: User = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: {
    id: '',
    name: '',
    slug: ''
  },
  authProvider: '',
  token: ''
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User> | null>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () =>
      // state,
      // action: PayloadAction<{ isRedirect: boolean; isForceClear: boolean }>
      {
        return initialState;
      }
  }
});

export const currentUser = (state: { user: User }) => state.user;
export const { setUser, clearUser } = user.actions;
export default user.reducer;
