import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export type UserState = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
};

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  phone: '',
  isLoggedIn: false
};

const user = createSlice({
  name: 'user', // unique name to slice
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      return {
        ...initialState
      };
    }
  }
});

export const currentUser = (state: { user: UserState }) => state.user; // export slice name call to reduce code in useSelector

export const { setUser, clearUser } = user.actions; // export all action
export default user.reducer;
