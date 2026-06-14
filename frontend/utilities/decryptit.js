import { derive_key_from_password, from_Base64 } from "./cryptohelpers.js";
export default async function decrypt_data(
  encrypted_data,
  password,
  iv_base64,
  salt_base64
) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const encrypted_buffer = from_Base64(encrypted_data);
  const iv = from_Base64(iv_base64);
  const salt = from_Base64(salt_base64);

  const key_material = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const key = await derive_key_from_password(password, salt, "decrypt");
  console.log(key);
  const decrypted_buffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encrypted_buffer
  );
  console.log("decrypted buffer", decrypted_buffer);
  return JSON.parse(decoder.decode(decrypted_buffer));
}
// let secret =
//   "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";
// let iv = "Ci3/GtyFhjnx9cvd";
// let salt = "TUCGuxG5k86m368b0Ed3DQ==";
// // console.log(secret)
// console.log(await decrypt_data(secret, "iamlegend", iv, salt));
