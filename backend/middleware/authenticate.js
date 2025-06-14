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

export default function (req, res, next) {
  const authHeader = req.get("Authorization");  // safer to use .get() here
  if (!authHeader) return res.status(401).json({ error: "Access denied. Token missing." });

  // Extract token from "Bearer <token>" or just "<token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.userId,  // make sure your token payload uses 'userId'
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}