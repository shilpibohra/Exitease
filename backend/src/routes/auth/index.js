import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role, UserRole } from "../../models/index.js";
import verifyToken from "../../../middleware/authenticate.js";
import fetchRoleAndPermissions from "../../../helpers/fetchRolesAndPermissions.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const data = await fetchRoleAndPermissions(req);
  res.status(200).json({ status: "Authenticated", ...data });
});

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    const { _id: userId } = await user.save();
    const { _id: roleId } = await Role.findOne({ role: "employee" });
    await new UserRole({
      userId,
      roleId,
    }).save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    req.user = {
      _id: user._id,
    };
    const token = jwt.sign(
      { userId: user._id, userName: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    const data = await fetchRoleAndPermissions(req);
    res.status(200).json({ token, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
/*import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role, UserRole } from "../../models/index.js";
import verifyToken from "../../../middleware/authenticate.js";
import fetchRoleAndPermissions from "../../../helpers/fetchRolesAndPermissions.js";

const router = express.Router();

// Protected route example
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await fetchRoleAndPermissions(req);
    res.status(200).json({ status: "Authenticated", ...data });
  } catch (err) {
    console.error("Error in / route:", err);
    res.status(500).json({ error: "Failed to fetch role and permissions" });
  }
});

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    const savedUser = await user.save();

    const role = await Role.findOne({ role: "employee" });
    if (!role) {
      return res.status(400).json({ error: "Default role not found" });
    }

    await new UserRole({
      userId: savedUser._id,
      roleId: role._id,
    }).save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.username },
      jwtSecret,
      { expiresIn: "2h" }
    );

    // Simulate req.user for fetchRoleAndPermissions
    const fakeReq = { user: { _id: user._id } };
    const data = await fetchRoleAndPermissions(fakeReq);

    res.status(200).json({ token, ...data });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;*/
