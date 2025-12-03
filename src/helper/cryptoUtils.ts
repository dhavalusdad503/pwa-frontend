export type AESPayload = {
  iv: string; // base64
  encrypted: string; // base64 (cipherText only, tag separated)
  authTag: string; // base64
};

const PUBLIC_KEY_PEM = import.meta.env.VITE_PUBLIC_KEY as string | undefined;

/* ----------------------------- helpers ----------------------------- */
/**
 * Converts a clean Base64 PEM (no header/footer) into Uint8Array
 */
export const pemToUint8Array = (pemBase64?: string): ArrayBuffer => {
  if (!pemBase64 || typeof pemBase64 !== 'string') {
    throw new Error('Invalid PEM input (expected base64 string)');
  }

  try {
    const b64 = pemBase64
      ?.replace(/-----BEGIN PUBLIC KEY-----/g, '')
      ?.replace(/-----END PUBLIC KEY-----/g, '')
      ?.replace(/\s+/g, '');
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  } catch {
    throw new Error('Failed to convert PEM base64 to Uint8Array');
  }
};

/** Convert ArrayBuffer | Uint8Array -> base64 */
export function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  // chunk to avoid large string issues in some browsers
  const chunkSize = 0x8000;
  for (let i = 0; i < u8.length; i += chunkSize) {
    const slice = u8.subarray(i, Math.min(i + chunkSize, u8.length));
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

/** Convert a base64 string -> Uint8Array */
export function base64ToUint8Array(b64: string) {
  const cleaned = b64.replace(/\s+/g, '');
  // atob can throw on malformed input
  const binary = atob(cleaned);
  const len = binary.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function toSafeArrayBuffer(input: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (input instanceof Uint8Array) {
    return input.slice().buffer; // always creates real ArrayBuffer
  }

  // Already ArrayBuffer → but clone it to avoid SAB
  return input.slice(0);
}

/* ------------------------ RSA public key import ------------------------ */

/**
 * Imports RSA public key from Base64 PEM (header/footer already removed)
 */
export const importRSAPublicKey = async (
  pemBase64: string | undefined = PUBLIC_KEY_PEM
): Promise<CryptoKey> => {
  try {
    if (!pemBase64) {
      throw new Error('Missing RSA public key');
    }

    const keyBuffer = pemToUint8Array(pemBase64);

    return crypto.subtle.importKey(
      'spki',
      keyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    );
  } catch {
    throw new Error('Failed to import RSA public key');
  }
};

/* ------------------------- AES key generation ------------------------- */

/** Generate an ephemeral AES-GCM-256 CryptoKey */
export async function generateAESKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt'
  ]);
}

/** Export AES CryptoKey to raw Uint8Array (32 bytes for AES-256) */
export async function exportAESKeyRaw(aesKey: CryptoKey): Promise<Uint8Array> {
  const raw = await crypto.subtle.exportKey('raw', aesKey);
  return new Uint8Array(raw);
}

/* ------------------------ RSA wrap (encrypt) ------------------------- */

/**
 * RSA-encrypt raw AES key (ArrayBuffer or Uint8Array) and return Uint8Array cipherText.
 * Throws on import/encrypt errors.
 */
export async function rsaEncryptRaw(
  rawKey: ArrayBuffer | Uint8Array
): Promise<Uint8Array> {
  const publicKey = await importRSAPublicKey();
  const buffer = toSafeArrayBuffer(rawKey);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    buffer
  );
  return new Uint8Array(encrypted);
}

/** Convenience: encrypt raw AES key and return base64 string for header */
export async function rsaEncryptRawToBase64(
  rawKey: ArrayBuffer | Uint8Array
): Promise<string> {
  const encrypted = await rsaEncryptRaw(rawKey);
  return bufToBase64(encrypted);
}

/* ---------------------- convenience helpers ---------------------- */
/**
 * Generates a new AES key and returns:
 * {
 *   aesKey, // CryptoKey (keep for response decryption)
 *   wrappedKeyBase64 // base64 RSA-OAEP(encrypted raw AES key) -> send in header
 * }
 */
export async function generateAndWrapAESKey(): Promise<{
  aesKey: CryptoKey;
  wrappedKeyBase64: string;
}> {
  const aesKey = await generateAESKey();
  const raw = await exportAESKeyRaw(aesKey); // Uint8Array
  const wrappedBase64 = await rsaEncryptRawToBase64(raw);
  return { aesKey, wrappedKeyBase64: wrappedBase64 };
}

/* ------------------------ AES-GCM encrypt/decrypt ------------------------ */

/**
 * AES-GCM encrypt (WebCrypto). Returns object with base64 iv, ciphertext (no tag), authTag.
 * - iv length: 12 bytes (96 bits) recommended
 * - authTag length: 16 bytes
 */
export async function aesEncrypt<T extends object | string>(
  plaintext: T,
  aesKey: CryptoKey
): Promise<string> {
  // Accept string or object
  const encoder = new TextEncoder();
  const text =
    typeof plaintext === 'string' ? plaintext : JSON.stringify(plaintext);
  const data = encoder.encode(text);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  // WebCrypto returns cipherText concatenated with tag
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);
  const ctArr = new Uint8Array(ct);

  const tagLen = 16; // bytes
  if (ctArr.length < tagLen)
    throw new Error('CipherText shorter than tag length');

  const cipherText = ctArr.slice(0, ctArr.length - tagLen);
  const authTag = ctArr.slice(ctArr.length - tagLen);

  const payload = {
    iv: bufToBase64(iv),
    encrypted: bufToBase64(cipherText),
    authTag: bufToBase64(authTag)
  };

  const dataStr = JSON.stringify(payload);
  const dataBuffer = encoder.encode(dataStr);

  const wrapData = await rsaEncryptRawToBase64(dataBuffer);
  return wrapData;
}

/**
 * AES-GCM decrypt. Accepts AES CryptoKey + AESPayload and returns parsed JSON into T.
 * Throws on invalid auth tag / parse problems.
 */
export async function aesDecrypt<T extends object>(
  aesKey: CryptoKey,
  payload: string
): Promise<T> {
  if (!payload) {
    throw new Error('Invalid AES payload shape');
  }

  const combineBuffer = base64ToUint8Array(payload);
  const iv = combineBuffer.slice(0, 12); // first 12 bytes
  const authTag = combineBuffer.slice(combineBuffer.length - 16); // last 16 bytes
  const cipherText = combineBuffer.slice(12, combineBuffer.length - 16); // middle

  const combined = new Uint8Array(cipherText.length + authTag.length);
  combined.set(cipherText, 0);
  combined.set(authTag, cipherText.length);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    combined.buffer
  );
  const decoded = new TextDecoder().decode(plainBuffer);

  try {
    return JSON.parse(decoded) as T;
  } catch {
    return decoded as unknown as T;
  }
}

export const generateRandomWord = (defaultLength?: number) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // Available characters
  let result = '';
  const length = defaultLength || Math.floor(Math.random() * 7) + 1;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length); // Get random index
    result += alphabet[randomIndex]; // Add the random letter to the result string
  }

  return result;
};
