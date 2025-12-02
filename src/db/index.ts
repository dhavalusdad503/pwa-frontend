// db.ts
import { openDB, IDBPDatabase } from 'idb';
import { NewShiftSchemaType } from '@/types/index';

// Use Vite's environment variables (import.meta.env)
const VITE_IND_DB_NAME = import.meta.env.VITE_IND_DB_NAME || 'offline-db';
const VITE_IND_DB_TABLE = import.meta.env.VITE_IND_DB_TABLE || 'visits';

type DB = IDBPDatabase;

let dbPromise: Promise<DB> | null = null;

export async function getDB(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = openDB(VITE_IND_DB_NAME, 2, {
      upgrade(db) {
        // Create visits table if it doesn't exist
        if (!db.objectStoreNames.contains(VITE_IND_DB_TABLE)) {
          const store = db.createObjectStore(VITE_IND_DB_TABLE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('synced', 'synced', { unique: false });
        }

        // Create meta table if it doesn't exist (independent of visits table)
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveFormOffline(data: NewShiftSchemaType) {
  try {
    const db = await getDB();
    await db.add(VITE_IND_DB_TABLE, data);
  } catch (error) {
    console.error("Error saving form to IndexedDB:", error);
  }
}

export async function getUnsyncedForms(): Promise<NewShiftSchemaType[]> {
  try {
    const db = await getDB();
    const forms = await db.getAllFromIndex(VITE_IND_DB_TABLE, 'synced', 0);
    return forms;
  } catch (error) {
    console.error('Error retrieving unsynced forms:', error);
    return [];
  }
}

export async function markFormSynced(id: number) {
  try {
    const db = await getDB();
    const item = await db.get(VITE_IND_DB_TABLE, id);
    if (!item) {
      return;
    }
    item.synced = 1;
    await db.put(VITE_IND_DB_TABLE, item);
  } catch (error) {
    console.error(`Error marking form ${id} as synced:`, error);
  }
}

export async function updateId(id: number, newId: string) {
  try {
    const db = await getDB();
    const item = await db.get(VITE_IND_DB_TABLE, id);
    if (!item) {
      console.warn(`Form ${id} not found in IndexedDB`);
      return;
    }
    item.id = newId;
    await db.put(VITE_IND_DB_TABLE, item);
  } catch (error) {
    console.error(`Error updating form ${id}:`, error);
  }
}

export async function deleteItem(id: number) {
  try {
    const db = await getDB();
    await db.delete(VITE_IND_DB_TABLE, id);
  } catch (error) {
    console.error(`Error deleting form ${id}:`, error);
  }
}

export async function getAllForms(): Promise<NewShiftSchemaType[]> {
  try {
    const db = await getDB();
    const forms = await db.getAll(VITE_IND_DB_TABLE);
    return forms;
  } catch (error) {
    console.error('Error retrieving all forms:', error);
    return [];
  }
}

// Metadata :===================

export async function getMeta(key: string) {
  const db = await getDB();
  const metaData = await db.get("meta", key);
  return metaData?.value;
}

export async function setMeta(key: string, value: string) {
  const db = await getDB();
  const tx = db.transaction("meta", "readwrite");
  const store = tx.objectStore("meta");
  store.put({ key, value });
}

export async function putItems(items: NewShiftSchemaType[]) {
  const db = await getDB();

  try {
    const tx = db.transaction(VITE_IND_DB_TABLE, "readwrite");
    const store = tx.objectStore(VITE_IND_DB_TABLE);

    for (const serverItem of items) {
      // Only try to get existing item if serverItem has an id
      if (serverItem.id !== undefined && serverItem.id !== null) {
        const existingItem = await store.get(serverItem.id);

        if (existingItem) {
          // Merge: server data takes precedence, but preserve local 'synced' field
          const mergedItem = {
            ...existingItem,
            startedAt: serverItem.startedAt,
            endedAt: serverItem.endedAt,
            patientName: serverItem.patient?.name,
            notes: serverItem.notes,
            synced: existingItem.synced ?? 1, // Preserve local synced status, default to 1 if from server
          };

          await store.put(mergedItem);
        } else {
          // New item from server - add it with synced = 1 (already synced)
          const newItem = {
            id: serverItem.id,
            startedAt: serverItem.startedAt,
            endedAt: serverItem.endedAt,
            patientName: serverItem.patient?.name,
            notes: serverItem.notes,
            address: serverItem.address,
            orgName: serverItem.orgName,
            serviceType: serverItem.serviceType,
            synced: 1, // Items from server are already synced
          };

          await store.put(newItem);
        }
      } else {
        // Item doesn't have an id, add it as new (IndexedDB will auto-generate id)
        const newItem = {
          ...serverItem,
          synced: 1,
        };
        await store.add(newItem);
      }
    }

    await tx.done;
  } catch (error) {
    console.error('Error in putItems:', error);
    throw error;
  }
}



