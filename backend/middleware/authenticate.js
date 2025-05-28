/*import jwt from "jsonwebtoken";

export default function (req, res, next) {
  console.log(req.header);
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}*/
import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // lowercase 'authorization'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Get token after 'Bearer'
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}