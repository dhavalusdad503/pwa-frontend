import { deleteMany, putItems } from '@/db';
import { secureDB } from '@/db/secureDataBase';
import { NewShiftSchemaType, UpdatedShiftType } from '@/types';

const VITE_IND_DB_TABLE = import.meta.env.VITE_IND_DB_TABLE || 'visits';

async function upsertItems(items: NewShiftSchemaType[]) {
  for (const item of items) {
    const { patient, ...rest } = item;
    const localItem = {
      ...rest,
      patientName: patient?.name,
      synced: 1 
    };
    try {
      
      if (item.id !== undefined) {
        const existing = await secureDB.get<NewShiftSchemaType>(VITE_IND_DB_TABLE, item.id);
        if (existing) {
         
          if (existing.synced === 0) {
            console.log(`[SyncManager] Skipping item ${item.id} - has unsynced local changes`);
            continue;
          }

          // Update existing synced item
          await secureDB.put(VITE_IND_DB_TABLE, localItem, item.id);
        } else {
          // Insert new item
          await secureDB.add(VITE_IND_DB_TABLE, localItem);
        }
      } else {
        // No id, just add
        await secureDB.add(VITE_IND_DB_TABLE, localItem);
      }
    } catch (error) {
      console.error('Error upserting item:', item.id, error);
    }
  }
}

/**
 * Sync manager handles both initial and incremental sync
 * @param userShifts - Object containing modifiedVisits and deletedVisits
 * @param isInitialSync - If true, clears the store before inserting (safe for first sync)
 */
export const syncManager = async (userShifts: UpdatedShiftType, isInitialSync: boolean = false) => {
  try {
    const { modifiedVisits, deletedVisits } = userShifts;

    if (isInitialSync) {
     
      const allItems = await secureDB.getAll<NewShiftSchemaType>(VITE_IND_DB_TABLE);
      const unsyncedItems = allItems.filter(item => item.synced === 0);

      if (unsyncedItems.length > 0) {
        console.log(`[SyncManager] Warning: ${unsyncedItems.length} unsynced items found during initial sync`);
        if (modifiedVisits && modifiedVisits.length > 0) {
          await upsertItems(modifiedVisits);
        }
      } else {
        if (modifiedVisits && modifiedVisits.length > 0) {
          await putItems(modifiedVisits);
        }
      }
    } else {
      if (modifiedVisits && modifiedVisits.length > 0) {
        await upsertItems(modifiedVisits);
      }
    }

    const deletedIds = deletedVisits?.map((v) => v.id).filter((id): id is string => id !== undefined) || [];

    if (deletedIds.length > 0) {
      for (const id of deletedIds) {
        const existing = await secureDB.get<NewShiftSchemaType>(VITE_IND_DB_TABLE, id);
        if (existing && existing.synced === 0) {
          console.log(`[SyncManager] Skipping delete for ${id} - has unsynced local changes`);
          continue;
        }
      }

      const syncedDeleteIds = [];
      for (const id of deletedIds) {
        const existing = await secureDB.get<NewShiftSchemaType>(VITE_IND_DB_TABLE, id);
        if (!existing || existing.synced !== 0) {
          syncedDeleteIds.push(id);
        }
      }

      if (syncedDeleteIds.length > 0) {
        await deleteMany(syncedDeleteIds);
      }
    }
  } catch (error) {
    console.error('Error in syncManager:', error);
    throw error;
  }
};
