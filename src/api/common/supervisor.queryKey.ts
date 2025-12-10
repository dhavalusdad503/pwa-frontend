export const supervisorQueryKeyMap = {
  visitsListsBySupervisor: (params?: object) =>
    ['visitsListsBySupervisor', params].filter((item) => item !== undefined),
  getPatientList: (params?: object) =>
    ['getPatientList', params].filter((item) => item !== undefined),
  getCaregiverList: (params?: object) =>
    ['getCaregiverList', params].filter((item) => item !== undefined)
};
