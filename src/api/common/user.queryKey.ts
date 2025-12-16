export const USER_KEYS_NAME = {
  LIST: 'userList'
};

export const userQueryKeyMap = {
  userList: (params?: object) =>
    [USER_KEYS_NAME.LIST, params].filter((item) => item !== undefined)
};
