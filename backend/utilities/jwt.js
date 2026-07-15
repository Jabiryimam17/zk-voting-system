import jwt from "jsonwebtoken";

import { serialize } from "cookie";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const MAX_AGE = 60 * 60 * 24; // 24 hours
const private_key = Buffer.from(
  process.env.PRIVATE_KEY || "",
  "base64",
).toString("utf8");
const public_key = Buffer.from(process.env.PUBLIC_KEY || "", "base64").toString(
  "utf8",
);

export function generate_token(user) {
  const token = jwt.sign(user, private_key, {
    algorithm: "RS256",
    expiresIn: MAX_AGE,
  });
  return token;
}

export function verify_token(token) {
  try {
    return jwt.verify(token, public_key, {
      algorithms: ["RS256"],
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function set_token_cookie(res, token) {
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "none",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function remove_token_cookie(res) {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: true,
    maxAge: -1,
    expires: new Date(0),
    path: "/",
    sameSite: "none",
  });
  return res.setHeader("Set-Cookie", cookie);
}
