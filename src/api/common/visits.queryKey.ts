export const VISITS_KEY_NAME = {
  ALL_VISITS: 'fetch-all-visits'
};

export const visitsQueryKeyMap = {
  allVisits: (params?: object) =>
    [VISITS_KEY_NAME.ALL_VISITS, params].filter((item) => item !== undefined)
};
