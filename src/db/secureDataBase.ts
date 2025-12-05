import { NewShiftSchemaType } from '@/types';
import { IDBPDatabase, openDB } from 'idb';

// ===== DB CONFIG =====
const VITE_IND_DB_NAME = 'Abhishek_DB';
const DB_VERSION = 2;
const DEVICE_KEY_ID = 'device-key';
const VITE_IND_DB_TABLE = import.meta.env.VITE_IND_DB_TABLE || 'visits';
type DB = IDBPDatabase;
// Text helpers
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Convert array buffers
export function bufToB64(buf: ArrayBuffer | Uint8Array): string {
  const array = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < array.byteLength; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
}

const b64ToBuf = (b64: string) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;

// Generate random IV (12 bytes for AES-GCM)
const randomIV = () => {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  return iv;
};
class SecureDB {
  private dbPromise: Promise<DB>;

  constructor() {
    this.dbPromise = openDB(VITE_IND_DB_NAME, DB_VERSION, {
      upgrade(db) {
        // MAIN DATA STORE
        if (!db.objectStoreNames.contains(VITE_IND_DB_TABLE)) {
          const store = db.createObjectStore(VITE_IND_DB_TABLE, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('synced', 'synced');
        }
        // META STORE
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('keys')) {
          db.createObjectStore('keys');
        }
      }
    });
  }

  // -----------------------------
  // AES KEY MANAGEMENT
  // -----------------------------

  private async getOrCreateKey(): Promise<CryptoKey> {
    const db = await this.dbPromise;
    const stored = await db.get('keys', DEVICE_KEY_ID);

    if (stored) {
      return crypto.subtle.importKey(
        'raw',
        b64ToBuf(stored),
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
    }

    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true, // extractable: false = HIGH SECURITY
      ['encrypt', 'decrypt']
    );

    const rawKey = await crypto.subtle.exportKey('raw', key);
    await db.put('keys', bufToB64(rawKey), DEVICE_KEY_ID);

    return key;
  }

  // -----------------------------
  // ENCRYPT / DECRYPT HELPERS
  // -----------------------------
  private async encrypt<NewShiftSchemaType>(value: NewShiftSchemaType) {
    const key = await this.getOrCreateKey();
    const iv = randomIV();
    const encoded = encoder.encode(JSON.stringify(value));

    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      iv: bufToB64(iv),
      cipher: bufToB64(cipherBuf)
    };
  }

  private async decrypt<T>(obj: { id: string, data: { iv: string; cipher: string } }) {
    const { data } = obj;
    const key = await this.getOrCreateKey();
    const iv = new Uint8Array(b64ToBuf(data.iv));
    const cipher = b64ToBuf(data.cipher);

    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipher
    );
    return JSON.parse(decoder.decode(plainBuf)) as T;
  }

  // -----------------------------
  // PUBLIC API (USABLE ANYWHERE)
  // -----------------------------

  async set<T>(store: string, value: T, key?: IDBValidKey) {
    const db = await this.dbPromise;
    const encrypted = await this.encrypt(value);
    return db.put(store, encrypted, key);
  }

  async get<T>(store: string, key: IDBValidKey) {
    const db = await this.dbPromise;
    const encrypted = await db.get(store, key);
    if (!encrypted) return null;
    return this.decrypt<T>(encrypted);
  }

  async getAll<T>(store: string) {
    const db = await this.dbPromise;
    const rows = await db.getAll(store);
    console.log("tjhese are all rows", rows);
    return Promise.all(rows.map((e) => this.decrypt<T>(e)));
  }

  async delete(store: string, key: IDBValidKey) {
    const db = await this.dbPromise;
    return db.delete(store, key);
  }

  async deleteMany(store: string, ids: IDBValidKey[]) {
    const db = await this.dbPromise;
    const tx = db.transaction(store, "readwrite");
    for (const id of ids) {
      tx.store.delete(id);
    }
    await tx.done;
}

  async add<T>(store: string, value: NewShiftSchemaType) {
    const db = await this.dbPromise;
    const { id } = value;
    const encrypted = await this.encrypt<NewShiftSchemaType>(value);
    return db.add(store, { ...(id && { id }), data: encrypted });
  }

  // -----------------------------
  // put() → insert or update (encrypted)
  // -----------------------------
  async put<T>(store: string, value: T, key?: IDBValidKey) {
    const db = await this.dbPromise;
    const {id} = value;
    const encrypted = await this.encrypt(value);
    return db.put(store, { ...(id && { id }), data: encrypted }, key);
  }

  async setMeta<T>(key: string, value: T) {
    const db = await this.dbPromise;

    const tx = db.transaction('meta', 'readwrite');
    const store = tx.objectStore('meta');

    store.put({ key, value });

    return tx.done;
  }

  async getMeta<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;

    const tx = db.transaction('meta', 'readonly');
    const store = tx.objectStore('meta');

    const result = await store.get(key);
    return result ? (result.value as T) : null;
  }

  async deleteMeta(key: string) {
    const db = await this.dbPromise;

    const tx = db.transaction('meta', 'readwrite');
    const store = tx.objectStore('meta');

    store.delete(key);

    return tx.done;
  }

  async getAllMeta() {
    const db = await this.dbPromise;

    const tx = db.transaction('meta', 'readonly');
    const store = tx.objectStore('meta');

    const items = await store.getAll();
    return items; // already in plain text
  }
  async clearStore(storeName: string): Promise<void> {
    const db = await this.dbPromise;

    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    await store.clear();
    await tx.done;
  }
  async bulkAdd<T>(storeName: string, items: NewShiftSchemaType[]): Promise<void> {
    const db = await this.dbPromise;
    // 1. Pre-encrypt everything BEFORE transaction
    const encryptedItems = [];

    for (const item of items) {
      try {
        const { id } = item;
        const enc = await this.encrypt<NewShiftSchemaType>(item); // OK here
        encryptedItems.push({ ...(id && { id }), data: enc });
      } catch (err) {
        console.error('Encryption failed for item:', item, err);
        throw err; // stop early
      }
    }

    // 2. Start transaction
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    // 3. Bulk insert without ANY await
    for (const enc of encryptedItems) {
      store.add(enc);
    }

    // 4. Final single await
    await tx.done;
  }
}

// Create SINGLE GLOBAL INSTANCE
export const secureDB = new SecureDB();
