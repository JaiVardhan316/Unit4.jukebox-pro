import { verifyToken } from "#utils/jwt";

/** Requires a logged-in user */
export default async function requireUser(req, res, next) {
  // if (!req.user) return res.status(401).send("Unauthorized");
  // next();
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send("authorization required");
  }
  const token = header.replace("Bearer", " ").trim();
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send("invalid token");
  }
}
