export const authQueryKey = {
  login: (params?: object) => ['login', params].filter((d) => d !== undefined)
};
