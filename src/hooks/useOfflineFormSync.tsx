import { deleteItem, getUnsyncedForms, saveFormOffline } from "@/db";
import { NewShiftSchemaType } from "@/types/index";
import { useCreateShift } from "@api/newShift";
import { useEffect, useState, createContext, useContext, ReactNode } from "react";

// Internal hook that handles the sync logic
const useOfflineFormSyncLogic = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const { mutateAsync: createShift } = useCreateShift();

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      setTimeout(() => void syncToCloud(), 1000); // for connection establishment
    }
  }, [isOnline]);

  const syncToCloud = async () => {
    const unsynced: NewShiftSchemaType[] = await getUnsyncedForms();

    if (!unsynced.length) {
      return;
    }

    for (const item of unsynced) {
      const { id, synced, ...payload } = item;

      const { error, data } = await createShift(payload);

      if (!error && typeof id === 'number') {
        const dbId: string = data?.id;
        await deleteItem(id);
        await saveFormOffline({ ...payload, id: dbId, synced: 1 });
      } else if (error) {
        break;
      }
    }
  };

  return { isOnline };
};

// Context definition
interface OfflineSyncContextType {
  isOnline: boolean;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

// Provider component
export const OfflineSyncProvider = ({ children }: { children: ReactNode }) => {
  const { isOnline } = useOfflineFormSyncLogic();

  return (
    <OfflineSyncContext.Provider value={{ isOnline }}>
      {children}
    </OfflineSyncContext.Provider>
  );
};

// Hook to consume the context
export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (context === undefined) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};