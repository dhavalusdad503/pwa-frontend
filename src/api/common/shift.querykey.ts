export const shiftQueryKey = {
  createShift: (params?: object) => ['login', params].filter((d) => d !== undefined),
  createBulkShift: (params?: object) => ['login', params].filter((d) => d !== undefined)
};
