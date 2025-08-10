export async function derive_key_from_password(password, salt, purpose) {
  const encoder = new TextEncoder();
  const key_material = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const iterations = 1000;
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    key_material,
    { name: "AES-GCM", length: 256 },
    true,
    [purpose]
  );
}

export function to_Base64(uint8_arr) {
  if (typeof window == "undefined") {
    return Buffer.from(uint8_arr).toString("base64");
  }
  return btoa(String.fromCharCode(...uint8_arr));
}

export function from_Base64(base64_str) {
  if (typeof window === "undefined") {
    return Uint8Array.from(Buffer.from(base64_str, "base64"));
  }

  return Uint8Array.from(atob(base64_str), (c) => c.charCodeAt(0));
}

// secret = Uint8Array(31) [
//   231, 155, 251,  80,  28, 138,  95,   2,
//   113, 112,   0,  50,  98, 146, 109, 168,
//    10,  37,  23, 148, 220,  99,  47,  93,
//    85, 208, 208,  92, 241, 145,  34
// ]

// iv = Uint8Array(16) [
//   181, 235, 147, 185,  70,
//   131, 150, 134,  28,  80,
//   107, 152, 101, 100, 204,
//    75
// ]

// salt = Uint8Array(12) [
//    36, 175, 12, 197, 61,
//   225, 168, 77,  26, 61,
//   217,  98
// ]
