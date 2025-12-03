export const authQueryKey = {
  login: (params?: object) => ['login', params].filter((d) => d !== undefined),
  refreshToken: (params?: object) =>
    ['refreshToken', params].filter((d) => d !== undefined)
};
