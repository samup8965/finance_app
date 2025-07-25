import crypto from "crypto";

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes");
}

export function encryptToken(token) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "hex")
    ); // creates our encryption machine
    cipher.setAAD(Buffer.from("truelayer-token"));

    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");

    // We get an auth tag is like a fingerprint of the encrypted data
    const authTag = cipher.getAuthTag();

    // Combine it all together as we will need it for decrypting later

    const result =
      iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error", error);
  }
}

export function decryptToken(encryptedToken) {
  // We do the reverse process so

  try {
    // Split the data
    const [ivHex, authTagHex, encrypted] = encryptedToken.split(":");

    // Convert from HEX back to bytes
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    // We make a decryption machine

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "hex")
    );

    // Set the auth tag for verification

    decipher.setAuthTag(authTag);

    // Now we can decrypt and return original

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error", error);
  }
}

export function generateEncryptionKey() {
  return crypto.randomBytes(32).toString("hex");
}
