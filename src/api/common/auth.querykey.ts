export const authQueryKey = {
  login: (params?: object) => ['login', params].filter((d) => d !== undefined),
  resetPassword: (params?: object) =>
    ['reset-password', params].filter((d) => d !== undefined),
  forgetPassword: (params?: object) =>
    ['reset-password', params].filter((d) => d !== undefined),
  refreshToken: (params?: object) =>
    ['refreshToken', params].filter((d) => d !== undefined)
};
