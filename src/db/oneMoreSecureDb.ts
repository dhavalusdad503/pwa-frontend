// src/lib/secure-db.ts
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'secure-app-db';
const DB_VERSION = 1;
const STORE_DATA = import.meta.env.VITE_IND_DB_TABLE ?? 'visits';
const STORE_META = 'meta';
const STORE_KEYS = 'keys';

const AES_WRAPPED_KEY_ID = 'wrapped_data_key';
const AES_WRAPPED_IV_ID = 'wrapped_data_key_iv';
const KDF_SALT_ID = 'kdf_salt';
const KDF_ITERS_ID = 'kdf_iters';
const KDF_ALGO_ID = 'kdf_algo';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bufToB64(buf: ArrayBuffer | Uint8Array) {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s);
}
function b64ToBuf(b64: string): ArrayBuffer {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
}
const randomBytes = (len = 16) => crypto.getRandomValues(new Uint8Array(len));
const randomIV = () => randomBytes(12);

const DEFAULT_PBKDF2_ITERS = 250_000;

type DB = IDBPDatabase<any>;

export class SecureDB {
  private dbPromise: Promise<DB>;
  private cachedDataKey: CryptoKey | null = null;

  constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_DATA)) {
          const s = db.createObjectStore(STORE_DATA, {
            keyPath: 'id',
            autoIncrement: true
          });
          s.createIndex('synced', 'synced');
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE_KEYS)) {
          db.createObjectStore(STORE_KEYS);
        }
      }
    });
  }

  // ---------- public API ----------
  async hasWrappedKey(): Promise<boolean> {
    const db = await this.dbPromise;
    const k = await db.get(STORE_KEYS, AES_WRAPPED_KEY_ID);
    return !!k;
  }

  // setup (first-time)
  async setupWithPassword(password: string, iterations = DEFAULT_PBKDF2_ITERS) {
    const db = await this.dbPromise;
    const exists = await db.get(STORE_KEYS, AES_WRAPPED_KEY_ID);
    if (exists) throw new Error('Wrapped key already present; use unlock');

    // generate AES data key (DK)
    const dataKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // derive KEK from password
    const salt = randomBytes(16);
    const kek = await this.deriveKeyFromPassword(password, salt, iterations);

    // wrap DK with KEK using AES-GCM (wrap iv)
    const wrapIv = randomIV();
    const wrapped = await crypto.subtle.wrapKey('raw', dataKey, kek, {
      name: 'AES-GCM',
      iv: wrapIv
    });

    // store wrapped + metadata
    await db.put(STORE_KEYS, bufToB64(wrapped), AES_WRAPPED_KEY_ID);
    await db.put(STORE_KEYS, bufToB64(wrapIv), AES_WRAPPED_IV_ID);
    await db.put(STORE_KEYS, bufToB64(salt), KDF_SALT_ID);
    await db.put(STORE_KEYS, iterations, KDF_ITERS_ID);
    await db.put(STORE_KEYS, 'PBKDF2', KDF_ALGO_ID);

    // cache DK in memory
    this.cachedDataKey = dataKey;
  }

  // unlock (derive KEK and unwrap)
  async unlock(password: string) {
    const db = await this.dbPromise;
    const wrappedB64 = await db.get(STORE_KEYS, AES_WRAPPED_KEY_ID);
    if (!wrappedB64) throw new Error('No wrapped key stored; call setup first');

    const wrapIvB64 = await db.get(STORE_KEYS, AES_WRAPPED_IV_ID);
    const saltB64 = await db.get(STORE_KEYS, KDF_SALT_ID);
    const iters = (await db.get(STORE_KEYS, KDF_ITERS_ID)) as number;
    const kdfAlgo = (await db.get(STORE_KEYS, KDF_ALGO_ID)) as string;

    if (!wrapIvB64 || !saltB64 || !iters || !kdfAlgo)
      throw new Error('KDF metadata missing/corrupt');
    if (kdfAlgo !== 'PBKDF2') throw new Error('Unsupported KDF');

    const salt = new Uint8Array(b64ToBuf(saltB64));
    const wrapIv = new Uint8Array(b64ToBuf(wrapIvB64));
    const wrapped = b64ToBuf(wrappedB64);

    const kek = await this.deriveKeyFromPassword(password, salt, iters);

    const dataKey = await crypto.subtle.unwrapKey(
      'raw',
      wrapped,
      kek,
      { name: 'AES-GCM', iv: wrapIv },
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    this.cachedDataKey = dataKey;
  }

  // lock (clear)
  lock() {
    this.cachedDataKey = null;
  }

  // rotate password
  async rotatePassword(
    oldPassword: string,
    newPassword: string,
    newIters = DEFAULT_PBKDF2_ITERS
  ) {
    // unlock will throw if oldPassword invalid
    await this.unlock(oldPassword);
    if (!this.cachedDataKey) throw new Error('Unable to unlock');

    const db = await this.dbPromise;
    const newSalt = randomBytes(16);
    const newKek = await this.deriveKeyFromPassword(
      newPassword,
      newSalt,
      newIters
    );
    const newWrapIv = randomIV();
    const wrapped = await crypto.subtle.wrapKey(
      'raw',
      this.cachedDataKey,
      newKek,
      { name: 'AES-GCM', iv: newWrapIv }
    );

    await db.put(STORE_KEYS, bufToB64(wrapped), AES_WRAPPED_KEY_ID);
    await db.put(STORE_KEYS, bufToB64(newWrapIv), AES_WRAPPED_IV_ID);
    await db.put(STORE_KEYS, bufToB64(newSalt), KDF_SALT_ID);
    await db.put(STORE_KEYS, newIters, KDF_ITERS_ID);
    await db.put(STORE_KEYS, 'PBKDF2', KDF_ALGO_ID);
  }

  // ensure unlocked (helper)
  private ensureUnlocked(): asserts this is SecureDB & {
    cachedDataKey: CryptoKey;
  } {
    if (!this.cachedDataKey)
      throw new Error(
        'Locked: call unlock(password) or setupWithPassword(password) first'
      );
  }

  // encrypt / decrypt (external API unchanged)
  async encrypt<T>(value: T): Promise<string> {
    this.ensureUnlocked();
    const key = this.cachedDataKey!;
    const iv = randomIV();
    const encoded = encoder.encode(JSON.stringify(value));
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );
    return `${bufToB64(iv)}.${bufToB64(cipherBuf)}`;
  }

  async decrypt<T>(data: string): Promise<T> {
    this.ensureUnlocked();
    const key = this.cachedDataKey!;
    const [ivB64, cipherB64] = data.split('.');
    if (!ivB64 || !cipherB64) throw new Error('Invalid data format');
    const iv = new Uint8Array(b64ToBuf(ivB64));
    const cipher = b64ToBuf(cipherB64);
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipher
    );
    return JSON.parse(decoder.decode(plain)) as T;
  }

  // ---------- DB convenience wrappers ----------
  async set<T>(store: string, value: T, key?: IDBValidKey) {
    const db = await this.dbPromise;
    const encrypted = await this.encrypt(value);
    return db.put(store, { data: encrypted }, key);
  }

  async add<T>(store: string, value: T) {
    const db = await this.dbPromise;
    const encrypted = await this.encrypt(value);
    return db.add(store, { data: encrypted });
  }

  async get<T>(store: string, key: IDBValidKey) {
    const db = await this.dbPromise;
    const row = await db.get(store, key);
    if (!row) return null;
    return this.decrypt<T>(row.data);
  }

  async getAll<T>(store: string) {
    const db = await this.dbPromise;
    const rows = await db.getAll(store);
    return Promise.all(rows.map((r: any) => this.decrypt<T>(r.data)));
  }

  async put<T>(store: string, value: T, key?: IDBValidKey) {
    const db = await this.dbPromise;
    const encrypted = await this.encrypt(value);
    if (key === undefined) return db.put(store, { data: encrypted });
    return db.put(store, { id: key, data: encrypted }, key);
  }

  async delete(store: string, key: IDBValidKey) {
    const db = await this.dbPromise;
    return db.delete(store, key);
  }

  // ---------- KDF helper ----------
  private async deriveKeyFromPassword(
    password: string,
    salt: Uint8Array,
    iterations: number
  ) {
    const pwKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const kek = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      pwKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['wrapKey', 'unwrapKey']
    );
    return kek;
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
  async bulkAdd<T>(storeName: string, items: T[]): Promise<void> {
    const db = await this.dbPromise;
    // 1. Pre-encrypt everything BEFORE transaction
    const encryptedItems = [];

    for (const item of items) {
      try {
        const enc = await this.encrypt<T>(item); // OK here
        encryptedItems.push(enc);
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
      store.add({ data: enc });
    }

    // 4. Final single await
    await tx.done;
  }
}

// export single instance if you like
export const secureDB = new SecureDB();
