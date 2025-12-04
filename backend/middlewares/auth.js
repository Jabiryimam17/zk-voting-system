import { verify_token } from "../utilities/jwt.js";

export function with_auth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "unau" });
  }

  const decoded = verify_token(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }
  req.admin = decoded.admin;
  next();
}
