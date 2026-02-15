const ITERATIONS = 100_000;
const HASH_ALGO = "SHA-256";
const KEY_LENGTH = 32; // bytes

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const hashBuffer = await crypto.subtle.exportKey("raw", key);
  const hash = bufferToHex(new Uint8Array(hashBuffer));
  const saltHex = bufferToHex(salt);
  return `${saltHex}:${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, storedHash] = stored.split(":");
  const salt = hexToBuffer(saltHex);
  const key = await deriveKey(password, salt);
  const hashBuffer = await crypto.subtle.exportKey("raw", key);
  const hash = bufferToHex(new Uint8Array(hashBuffer));
  return hash === storedHash;
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: HASH_ALGO },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH * 8 },
    true,
    ["encrypt"],
  );
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = hex.match(/.{2}/g)!.map((b) => parseInt(b, 16));
  return new Uint8Array(bytes);
}
