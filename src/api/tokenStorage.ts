import { secureDB } from '@/db/secureDataBase';

export interface AuthTokens {
  accessToken: string;
}
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
} as const;

type StorageType = 'localStorage' | 'sessionStorage';

export const tokenStorage = {
  getAccessToken: async (
    storageType: StorageType = 'localStorage'
  ): Promise<string | null> => {
    const storage =
      storageType === 'sessionStorage' ? sessionStorage : localStorage;
    const encryptedToken = storage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (encryptedToken) {
      const decryptedToken = await secureDB.decrypt(encryptedToken);
      return decryptedToken as string;
    }
    return null;
  },

  getRefreshToken: async (
    storageType: StorageType = 'localStorage'
  ): Promise<string | null> => {
    const storage =
      storageType === 'sessionStorage' ? sessionStorage : localStorage;
    const encryptedToken = storage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    if (encryptedToken) {
      const decryptedToken = await secureDB.decrypt(encryptedToken);
      return decryptedToken as string;
    }
    return null;
  },

  setTokens: async (tokens: AuthTokens): Promise<void> => {
    const encryptedToken = await secureDB.encrypt(tokens.accessToken);
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, encryptedToken);
    sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, encryptedToken);
  },

  setRefreshToken: async (refreshToken: string): Promise<void> => {
    const encryptedToken = await secureDB.encrypt(refreshToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, encryptedToken);
    sessionStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, encryptedToken);
  },

  clearTokens: (): void => {
    sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  },

  hasValidTokens: (storageType: StorageType = 'localStorage'): boolean => {
    const accessToken = tokenStorage.getAccessToken(storageType);
    return !!accessToken;
  }
};
