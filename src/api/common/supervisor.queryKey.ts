export const SUPERVISOR_KEYS_NAME = {
  VISITS_LISTS_BY_SUPERVISOR: 'visitsListsBySupervisor',
  GET_PATIENT_LIST: 'getPatientList',
  GET_CAREGIVER_LIST: 'getCaregiverList'
};

export const supervisorQueryKeyMap = {
  visitsListsBySupervisor: (params?: object) =>
    [SUPERVISOR_KEYS_NAME.VISITS_LISTS_BY_SUPERVISOR, params].filter(
      (item) => item !== undefined
    ),
  getPatientList: (params?: object) =>
    [SUPERVISOR_KEYS_NAME.GET_PATIENT_LIST, params].filter(
      (item) => item !== undefined
    ),
  getCaregiverList: (params?: object) =>
    [SUPERVISOR_KEYS_NAME.GET_CAREGIVER_LIST, params].filter(
      (item) => item !== undefined
    )
};
