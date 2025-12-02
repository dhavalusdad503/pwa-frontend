import { tokenStorage } from '@api/tokenStorage';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export type UserState = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: string;
    name: string;
    slug: string;
  } | null;
  authProvider: string;
  token?: string | null;
  refreshToken?: string | null;
};

const initialState: UserState = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: null,
  authProvider: '',
  token: undefined,
  refreshToken: undefined
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState> | null>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (
      state,
      action: PayloadAction<{
        isRedirect: boolean;
        isForceClear: boolean;
      }>
    ) => {
      if (action.payload.isForceClear) {
        tokenStorage.clearTokens();
      }
      if (action.payload.isRedirect) {
        return state;
      }
      return {
        ...initialState,
        token: undefined,
        refreshToken: undefined
      };
    }
  }
});

export const currentUser = (state: { user: UserState }) => state.user;

export const { setUser, clearUser } = user.actions;
export default user.reducer;
