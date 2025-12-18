export const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const FIELD_TYPE = {
  DATE_RANGE: 'dateRange',
  SELECT: 'select',
  TEXT: 'text',
  NUMBER: 'number',
  ASYNC_SELECT: 'asyncSelect',
  NUMBER_RANGE: 'numberRange'
} as const;

export const AuthProvider= {
  EMAIL : 'EMAIL',
  GOOGLE : 'GOOGLE',
  FACEBOOK : 'FACEBOOK',
  GITHUB : 'GITHUB',
  TWITTER : 'TWITTER',
}

