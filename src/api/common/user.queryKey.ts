export const USER_KEYS_NAME = {
  LIST: 'userList',
  CREATE_USER: 'createUser'
};

export const userQueryKeyMap = {
  userList: (params?: object) =>
    [USER_KEYS_NAME.LIST, params].filter((item) => item !== undefined),

  createUser: () => [USER_KEYS_NAME.CREATE_USER],
};
