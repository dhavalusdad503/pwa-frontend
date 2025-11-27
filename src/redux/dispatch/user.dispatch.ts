import { type UserState, clearUser, setUser } from '../ducks/user';
import { store } from '../store';

export const dispatchSetUser = (user: Partial<UserState>) => {
  store.dispatch(setUser(user));
};

export const dispatchClearUser = () => {
  store.dispatch(clearUser());
};
