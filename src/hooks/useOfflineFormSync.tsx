import { useEffect, useState, createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateBulkShift } from "@api/newShift";
import { axiosGet } from "@api/axios";
import { getUnsyncedForms, setMeta, putItems, deleteItem, saveFormOffline } from "@/db";
import { secureDB } from "@/db/secureDataBase";
import { syncManager } from "@/db/syncManager";
import { NewShiftSchemaType } from "@/types/index";
import moment from "moment";

interface OfflineSyncContextType {
  synced: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  triggerSync: () => void;
  triggerFullSync: () => void;  // Added: Full sync that fetches all visits
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

const useOfflineFormSyncLogic = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [synced, setSynced] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncPhase, setSyncPhase] = useState<'idle' | 'uploading' | 'downloading'>('idle');

  const isSyncingRef = useRef<boolean>(false);
  const hasInitialSyncRun = useRef<boolean>(false);

  const queryClient = useQueryClient();
  const { mutateAsync: createBulkShift } = useCreateBulkShift();


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PHASE 1: Upload unsynced items to server
  const uploadPendingItems = useCallback(async (): Promise<boolean> => {
    const unsynced: NewShiftSchemaType[] = await getUnsyncedForms();

    if (!unsynced.length) return true;

    const unsyncedMap = new Map(unsynced.map((item) => [item.tempId, item]));

    try {
      const result = await createBulkShift(unsynced);

      if (result.success && result.data) {
        const updatdIdMap = result.data;
        for (const item of updatdIdMap) {

          //delting old visit from indexDB
          await deleteItem(item.tempId);
          const unsyncedItem = unsyncedMap.get(item.tempId);
          if (!unsyncedItem) {
            throw new Error("Item not found in unsynced map");
          };
          delete unsyncedItem?.tempId;
          //Adding same visit with DB id and synced flag 
          await saveFormOffline({
            ...unsyncedItem,
            id: item.id,
            synced: 1,
          })
        }
      } else {
        throw new Error("Failed to create bulk shift");
      }
    } catch (error) {
      console.log("error in uploadPendingItems", error);
      return false;
    }
    return true;
  }, [createBulkShift]);

  // Download ALL visits (for full sync button)
  const downloadAllVisits = useCallback(async () => {
    try {
      const response = await axiosGet('/visit');

      if (response) {
        const data: NewShiftSchemaType[] = response.data || response || [];

        if (data && data.length > 0) {
          // Clear and replace all data
          await putItems(data);
        }
        await setMeta('lastSyncAt', moment().format());
      }

      return true;
    } catch (error) {
      console.error('[FullSync] Failed:', error);
      return false;
    }
  }, []);

  // Download server changes (incremental or initial based on lastSyncAt)
  const downloadServerChanges = useCallback(async () => {
    try {
      const lastSync = await secureDB.getMeta<string>('lastSyncAt');

      if (!lastSync) {
        // INITIAL SYNC: Fetch all visits
        const response = await axiosGet('/visit');
        if (response) {
          const data: NewShiftSchemaType[] = response.data.data || response || [];
          if (data && data.length > 0) {
            await syncManager({ modifiedVisits: data, deletedVisits: [] }, true);
          }
          await setMeta('lastSyncAt', moment().format());
        }
      } else {
        // INCREMENTAL SYNC: Fetch only updated items
        const epoch = Math.floor(new Date(lastSync).getTime() / 1000);

        // Directly fetch using axios to avoid state dependency loop
        const response = await axiosGet(`/visit/updated/${epoch}`);

        if (response) {
          const responseData = response.data || response || {};
          const { modifiedVisits, deletedVisits } = responseData as {
            modifiedVisits?: NewShiftSchemaType[];
            deletedVisits?: { id: string }[]
          };

          if ((modifiedVisits?.length && modifiedVisits.length > 0) ||
            (deletedVisits?.length && deletedVisits.length > 0)) {
            await syncManager({
              modifiedVisits: modifiedVisits || [],
              deletedVisits: deletedVisits || []
            }, false);
          }
          await setMeta('lastSyncAt', moment().format());
        }
      }

      return true;
    } catch (error) {
      console.error('[Sync] Download failed:', error);
      return false;
    }
  }, []);

  // FULL SYNC: Upload pending + Fetch ALL visits (button click)
  const triggerFullSync = useCallback(() => {
    if (!navigator.onLine || isSyncingRef.current) {
      return;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    setSynced(false);

    const runFullSync = async () => {
      try {
        // ========== PHASE 1: UPLOAD FIRST ==========
        setSyncPhase('uploading');

        const uploadSuccess = await uploadPendingItems();

        if (!uploadSuccess) {
          isSyncingRef.current = false;
          setIsSyncing(false);
          setSyncPhase('idle');
          return;
        }


        // ========== PHASE 2: FETCH ALL VISITS ==========
        setSyncPhase('downloading');

        await downloadAllVisits();

        // ========== SYNC COMPLETE ==========
        queryClient.invalidateQueries({ queryKey: ['local-visits'] });
        setSynced(true);

      } catch (error) {
        console.error('[FullSync] Failed:', error);
      } finally {
        isSyncingRef.current = false;
        setIsSyncing(false);
        setSyncPhase('idle');
      }
    };

    void runFullSync();
  }, [uploadPendingItems, downloadAllVisits, queryClient]);

  // INCREMENTAL SYNC: Upload pending + Fetch updated visits
  const triggerSync = useCallback(() => {
    // Guard against multiple sync calls
    if (!navigator.onLine || isSyncingRef.current) {
      console.log('[Sync] Skipped - offline or already syncing');
      return;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    setSynced(false);

    const runSync = async () => {
      try {
        // ========== PHASE 1: UPLOAD FIRST ==========
        setSyncPhase('uploading');

        const uploadSuccess = await uploadPendingItems();

        if (!uploadSuccess) {
          isSyncingRef.current = false;
          setIsSyncing(false);
          setSyncPhase('idle');
          return;
        }


        // ========== PHASE 2: DOWNLOAD AFTER UPLOAD ==========
        setSyncPhase('downloading');

        await downloadServerChanges();

        // ========== SYNC COMPLETE ==========
        queryClient.invalidateQueries({ queryKey: ['local-visits'] });
        setSynced(true);

      } catch (error) {
        console.error('[Sync] Failed:', error);
      } finally {
        isSyncingRef.current = false;
        setIsSyncing(false);
        setSyncPhase('idle');
      }
    };

    void runSync();
  }, [uploadPendingItems, downloadServerChanges, queryClient]);

  // Trigger sync when online (Initial or Reconnection)
  useEffect(() => {
    if (isOnline) {
      if (!hasInitialSyncRun.current) {
        // Initial sync
        hasInitialSyncRun.current = true;
        const timeout = setTimeout(() => {
          if (!isSyncingRef.current) triggerSync();
        }, 1000);
        return () => clearTimeout(timeout);
      } else {
        // Coming back online
        const timeout = setTimeout(() => {
          if (!isSyncingRef.current) triggerSync();
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [isOnline, triggerSync]);

  return { synced, isOnline, isSyncing, triggerSync, triggerFullSync };
};

export const OfflineSyncProvider = ({ children }: { children: ReactNode }) => {
  const value = useOfflineFormSyncLogic();

  return (
    <OfflineSyncContext.Provider value={value}>
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (context === undefined) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};