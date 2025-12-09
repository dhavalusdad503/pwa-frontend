// src/security/SecurityProvider.tsx
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { secureDB } from '@/db/oneMoreSecureDb';


type SecureAPI = {
    locked: boolean;
    hasWrappedKey: () => Promise<boolean>;
    setup: (password: string) => Promise<void>;
    unlock: (password: string) => Promise<void>;
    lock: () => void;
    add: <T>(store: string, value: T) => Promise<any>;
    getAll: <T>(store: string) => Promise<T[]>;
    get: <T>(store: string, key: IDBValidKey) => Promise<T | null>;
    put: <T>(store: string, value: T, key?: IDBValidKey) => Promise<any>;
    rotatePassword: (oldP: string, newP: string) => Promise<void>;
};

const SecurityContext = createContext<SecureAPI | null>(null);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
    const [locked, setLocked] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const exists = await secureDB.hasWrappedKey();
                // if no wrapped key -> user will go to setup route
                // remain locked true by default
            } catch (err) {
                console.error('Security init error', err);
            }
        })();
    }, []);

    const api = useMemo<SecureAPI>(() => ({
        locked,
        hasWrappedKey: async () => secureDB.hasWrappedKey(),
        setup: async (password: string) => {
            await secureDB.setupWithPassword(password);
            setLocked(false);
        },
        unlock: async (password: string) => {
            await secureDB.unlock(password);
            setLocked(false);
        },
        lock: () => {
            secureDB.lock();
            setLocked(true);
        },
        add: async (store, value) => secureDB.add(store, value),
        getAll: async (store) => secureDB.getAll(store),
        get: async (store, key) => secureDB.get(store, key),
        put: async (store, value, key) => secureDB.put(store, value, key),
        rotatePassword: async (oldP, newP) => secureDB.rotatePassword(oldP, newP)
    }), [locked]);

    return <SecurityContext.Provider value={api}>{children}</SecurityContext.Provider>;
};

export const useSecurity = () => {
    const ctx = useContext(SecurityContext);
    if (!ctx) throw new Error('useSecurity must be used within SecurityProvider');
    return ctx;
};
