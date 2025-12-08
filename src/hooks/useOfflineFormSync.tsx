import { useEffect, useState, createContext, useContext, ReactNode, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateShift, useFetchAllVisits, useFetchUpdatedVisits } from "@api/newShift";
import { deleteItem, getUnsyncedForms, saveFormOffline, setMeta, putItems } from "@/db";
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
  const [lastSyncEpoch, setLastSyncEpoch] = useState<number>(0);
  const [syncPhase, setSyncPhase] = useState<'idle' | 'uploading' | 'downloading'>('idle');

  const isSyncingRef = useRef<boolean>(false);
  const hasInitialSyncRun = useRef<boolean>(false);

  const queryClient = useQueryClient();
  const { mutateAsync: createShift } = useCreateShift();

  const allVisitsQuery = useFetchAllVisits(false);
  const updatedVisitsQuery = useFetchUpdatedVisits(lastSyncEpoch, false);

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
    for (const item of unsynced) {
      const { id, synced: _synced, ...payload } = item;

      try {
        const data = await createShift(payload);

        if (typeof id === 'number') {
          const dbId: string = data?.id;
          await deleteItem(id);
          await saveFormOffline({ ...payload, id: dbId, synced: 1 });
        }
      } catch (error) {
        console.error('Upload failed for item', id, error);
        return false; // Stop on first failure
      }
    }

    return true;
  }, [createShift]);

  // Download ALL visits (for full sync button)
  const downloadAllVisits = useCallback(async () => {
    try {
      console.log('[FullSync] Fetching all visits from server...');
      const result = await allVisitsQuery.refetch();

      if (result.data) {
        const data: NewShiftSchemaType[] = result.data?.data || result.data || [];
        console.log(`[FullSync] Received ${data.length} visits`);

        if (data && data.length > 0) {
          // Clear and replace all data
          await putItems(data);
        }
        await setMeta('lastSyncAt', moment().format());
        console.log('[FullSync] Complete - IndexedDB updated');
      }

      return true;
    } catch (error) {
      console.error('[FullSync] Failed:', error);
      return false;
    }
  }, [allVisitsQuery]);

  // Download server changes (incremental or initial based on lastSyncAt)
  const downloadServerChanges = useCallback(async () => {
    try {
      const lastSync = await secureDB.getMeta<string>('lastSyncAt');

      if (!lastSync) {
        // INITIAL SYNC: Fetch all visits
        console.log('[Sync] Starting initial fetch (all visits)');
        const result = await allVisitsQuery.refetch();

        if (result.data) {
          const data: NewShiftSchemaType[] = result.data?.data || result.data || [];
          if (data && data.length > 0) {
            await syncManager({ modifiedVisits: data, deletedVisits: [] }, true);
          }
          await setMeta('lastSyncAt', moment().format());
        }
      } else {
        // INCREMENTAL SYNC: Fetch only updated items
        const epoch = Math.floor(new Date(lastSync).getTime() / 1000);
        console.log('[Sync] Starting incremental fetch, epoch:', epoch);

        // Update the epoch for the query
        setLastSyncEpoch(epoch);

        // Wait for state to update, then refetch
        await new Promise(resolve => setTimeout(resolve, 100));

        const result = await updatedVisitsQuery.refetch();

        if (result.data) {
          const responseData = result.data?.data || result.data || {};
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
  }, [allVisitsQuery, updatedVisitsQuery]);

  // FULL SYNC: Upload pending + Fetch ALL visits (button click)
  const triggerFullSync = useCallback(() => {
    if (!navigator.onLine || isSyncingRef.current) {
      console.log('[FullSync] Skipped - offline or already syncing');
      return;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);
    setSynced(false);

    const runFullSync = async () => {
      try {
        // ========== PHASE 1: UPLOAD FIRST ==========
        console.log('[FullSync] Phase 1: Uploading pending items...');
        setSyncPhase('uploading');

        const uploadSuccess = await uploadPendingItems();

        if (!uploadSuccess) {
          console.log('[FullSync] Upload failed, aborting sync');
          isSyncingRef.current = false;
          setIsSyncing(false);
          setSyncPhase('idle');
          return;
        }

        console.log('[FullSync] Phase 1 complete');

        // ========== PHASE 2: FETCH ALL VISITS ==========
        console.log('[FullSync] Phase 2: Fetching ALL visits...');
        setSyncPhase('downloading');

        await downloadAllVisits();

        console.log('[FullSync] Phase 2 complete');

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
        console.log('[Sync] Phase 1: Uploading pending items...');
        setSyncPhase('uploading');

        const uploadSuccess = await uploadPendingItems();

        if (!uploadSuccess) {
          console.log('[Sync] Upload failed, aborting sync');
          isSyncingRef.current = false;
          setIsSyncing(false);
          setSyncPhase('idle');
          return;
        }

        console.log('[Sync] Phase 1 complete: All items uploaded');

        // ========== PHASE 2: DOWNLOAD AFTER UPLOAD ==========
        console.log('[Sync] Phase 2: Downloading server changes...');
        setSyncPhase('downloading');

        await downloadServerChanges();

        console.log('[Sync] Phase 2 complete: Server changes downloaded');

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

  // Trigger sync ONCE when component mounts and is online
  useEffect(() => {
    if (isOnline && !hasInitialSyncRun.current && !isSyncingRef.current) {
      hasInitialSyncRun.current = true;
      console.log('[Sync] Initial sync triggered');
      const timeout = setTimeout(() => {
        triggerSync();
      }, 1000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // Trigger sync when coming back online (after being offline)
  useEffect(() => {
    // Only trigger if we've already done initial sync and just came back online
    if (isOnline && hasInitialSyncRun.current) {
      console.log('[Sync] Coming back online, triggering sync...');
      const timeout = setTimeout(() => {
        if (!isSyncingRef.current) {
          triggerSync();
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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