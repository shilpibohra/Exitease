/*import jwt from "jsonwebtoken";

export default function (req, res, next) {
  console.log(req.header);
  //const token = req.header("Authorization");
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
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
  console.log("Headers:", req.headers); // Logs all headers
  console.log("Authorization Header:", req.header("Authorization")); // Logs Authorization header

  // Extract token from "Bearer <token>" or just "<token>"
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  console.log("Extracted Token:", token); // Logs the token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    console.log("Decoded Payload:", decoded); // Log the decoded payload

    req.user = {
      _id: decoded.userId, // Attach user ID to the request object
    };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // Log verification errors
    res.status(401).json({ error: "Invalid token" });
  }
}




/*import jwt from "jsonwebtoken";

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
}*/