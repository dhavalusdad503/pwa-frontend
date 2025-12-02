export const shiftQueryKey = {
  createShift: (params?: object) => ['login', params].filter((d) => d !== undefined)
};
