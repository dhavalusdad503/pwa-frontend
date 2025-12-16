import { AxiosError, isAxiosError } from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface ErrorResponse {
  message: string;
  success: boolean;
}
export const jsonStringify = <T>(value: T, defaultValue: ''): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return defaultValue;
  }
};

export const jsonParse = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
};

export const storageHelper = (type: 'local' | 'session' = 'local') => {
  const storage = type === 'session' ? sessionStorage : localStorage;
  // Store data
  return {
    setItem: <T>(key: string, data: T, storageType = 'local'): void => {
      try {
        const jsonData = jsonStringify(data, '');
        if (storageType === 'local') storage.setItem(key, jsonData);
      } catch {
        // Handle storage errors silently or log them
      }
    },

    // Retrieve data with optional default value
    getItem: <T>(key: string, defaultValue: T) => {
      const storedData = storage.getItem(key);
      if (!storedData) {
        return defaultValue; // Return the default value if no data is found
      }
      return jsonParse(storedData?.toString(), defaultValue);
    },

    // Remove data
    removeItem: (key: string): void => {
      try {
        storage.removeItem(key);
      } catch {
        // Handle errors silently
      }
    }
  };
};

// generateYears function moved to CommonConstant.ts to avoid circular dependency

export const showToast = (
  value: AxiosError<ErrorResponse> | string,
  KEY: 'ERROR' | 'SUCCESS' = 'SUCCESS'
) => {
  if (
    KEY == 'ERROR' &&
    (isAxiosError<ErrorResponse>(value) || typeof value === 'string')
  ) {
    const message = (
      isAxiosError<ErrorResponse>(value)
        ? value?.response?.data?.message
        : value
    )
      ?.replaceAll('"', '')
      ?.replaceAll('_', ' ');
    if (message) {
      toast.error(message as string);
      return null;
    }
  } else {
    toast.success(value as string);
  }
};

export const formatTitleCase = (input: string): string => {
  return _.startCase(_.toLower(input));
};

export const navigateTo = (path: string) => {
  const navigate = useNavigate();
  navigate(path);
};

export const removeHtmlTag = (value: string) => {
  if (!value) return '';
  const textWithoutTags = value?.replace(/<[^>]+>/g, '');
  return textWithoutTags.trim();
};

export const extractNumber = (value: string): number | null => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
};

export const formatLabel = (value: string): string => {
  if (!value) return '';

  return value
    .split('_')

    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatStatusLabel = (text: string): string => {
  if (!text) return '';

  // Insert space before each capital letter (except the first one)
  const withSpaces = text.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize the first letter of each word
  return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1000) return `${bytes} B`;
  const kb = bytes / 1000;
  if (kb < 1000) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1000;
  return `${mb.toFixed(1)} MB`;
};

export const normalizeText = (text: string): string => {
  if (!text) return '';

  // Convert to lowercase → then startCase → remove extra spaces
  return _.startCase(_.toLower(text.trim()));
};

export function toEpochSeconds(isoString: string) {
  try {
    const time = new Date(isoString);
    if (!time) return 0;
    return Math.floor(time.getTime() / 1000);
  } catch (error) {
    console.log('Error in toEpochSeconds : ', error);
    return 0;
  }
}

export const combineName = ({
  names
}: {
  names: (string | undefined | null)[];
}) => {
  if (!names.length) return '-';

  return names.filter((name) => name).join(' ') || '-';
};

export interface SerializableFile {
  data: number[]; // Uint8Array converted to JSON-friendly number[]
  type: string; // mime type
  name: string; // original file name
}
export type DBValue =
  | string
  | number
  | boolean
  | null
  | Blob
  | SerializableFile
  | object;
export async function formDataToDBObject<T extends Record<string, DBValue>>(
  formData: FormData
): Promise<T> {
  const result: Record<string, DBValue> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const arrayBuffer = await value.arrayBuffer();
      const dataArray = Array.from(new Uint8Array(arrayBuffer));

      result[key] = {
        data: dataArray,
        type: value.type,
        name: value.name
      };
    } else {
      result[key] = String(value);
    }
  }

  return result as T;
}
/**
 * Convert DB object → FormData (Blob → File)
 */
/**
 * Converts IndexedDB object → FormData
 * Handles Blob → File restoration.
 */

export interface SerializableFile {
  data: number[];
  type: string;
}

export type DBRecord = Record<string, DBValue>;

// export async function dbObjectToFormData(record: DBRecord): Promise<FormData> {
//   const formData = new FormData();

//   for (const key of Object.keys(record)) {
//     const value = record[key];

//     // Skip metadata keys
//     if (key.endsWith('_name') || key === 'id') continue;

//     // -------------------------------------
//     // CASE 1: Value is an actual Blob
//     // -------------------------------------
//     const rawName = record[`${key}_name`];
//     const fileName = typeof rawName === 'string' ? rawName : 'file.bin';
//     if (value instanceof Blob) {
//       // const fileName = (record as DBRecord)[`${key}_name`] || 'file.bin';

//       const file = new File([await value.arrayBuffer()], 'file', {
//         type: value.type
//       });

//       formData.append(key, file);
//       continue;
//     }

//     // -------------------------------------
//     // CASE 2: SerializableFile → { data, type }
//     // -------------------------------------
//     if (
//       typeof value === 'object' &&
//       value !== null &&
//       'data' in value &&
//       'type' in value
//     ) {
//       const uint8 = new Uint8Array(value.data);
//       const blob = new Blob([uint8], { type: value.type });

//       // const fileName = (record as DBRecord)[`${key}_name`] || 'file.bin';

//       const file = new File(
//         [blob],
//         typeof value.name === 'string' ? value.name : 'file',
//         { type: value.type }
//       );

//       formData.append(key, file);
//       continue;
//     }

//     // -------------------------------------
//     // CASE 3: Normal string
//     // -------------------------------------
//     if (
//       typeof value === 'string' ||
//       typeof value === 'number' ||
//       typeof value === 'boolean'
//     ) {
//       formData.append(key, value);
//       continue;
//     }

//     // Should never happen
//     console.warn('Unhandled field:', key, value);
//   }

//   return formData;
// }
export async function dbObjectToFormData(record: DBRecord): Promise<FormData> {
  const formData = new FormData();

  for (const key of Object.keys(record)) {
    const value = record[key];

    // Skip metadata keys
    if (key === 'id') continue;

    // -------------------------------------
    // CASE 1: Actual Blob
    // -------------------------------------
    if (value instanceof Blob) {
      const file = new File(
        [await value.arrayBuffer()],
        'file', // browser will infer extension from mime
        { type: value.type }
      );

      formData.append(key, file);
      continue;
    }

    // -------------------------------------
    // CASE 2: Stored File object
    // shape: { data, type, name }
    // -------------------------------------
    if (
      value &&
      typeof value === 'object' &&
      'data' in value &&
      'type' in value
    ) {
      const uint8 = new Uint8Array(value.data);
      const file = new File(
        [uint8],
        typeof value.name === 'string' ? value.name : 'file',
        { type: value.type }
      );

      formData.append(key, file);
      continue;
    }

    // -------------------------------------
    // CASE 3: Primitives
    // -------------------------------------
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      formData.append(key, String(value));
      continue;
    }

    console.warn('Unhandled field:', key, value);
  }

  return formData;
}
export const isDefined = (value: unknown) => {
  return !_.isNil(value);
};

export type ColumnItem = string | { [key: string]: string | string[] };

export const transformedColumns = (
  column: ColumnItem[],
  prefix = 'column'
): Record<string, string> => {
  return column.reduce<Record<string, string>>((acc, curr, index) => {
    if (typeof curr === 'string') {
      acc[`${prefix}[${index}]`] = curr;
    } else {
      Object.entries(curr).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, subIndex) => {
            acc[`${prefix}[${key}][${subIndex}]`] = item;
          });
        } else {
          acc[`${prefix}[${key}]`] = value;
        }
      });
    }
    return acc;
  }, {});
};
