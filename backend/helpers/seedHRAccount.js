/*import bcrypt from "bcrypt";
import { User, Role, UserRole } from "../src/models/index.js";

async function seedHRAccount() {
  try {
    const hrRole = await Role.findOneAndUpdate(
      { name: "HR" }, // Identify HR role
      { name: "HR" }, // Set the role name (if not exists)
      { upsert: true, new: true } // Create if it doesn't exist
    );

    const existingUser = await User.findOne({ username: "admin" });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(process.env.HR_PASSWORD || "admin", 10);// Hash the password
      const newUser = await User.create({
        username: "admin",
        password: hashedPassword,
        email: "admin@example.com", // Optional field for contact
      });

      await UserRole.create({
        userId: newUser._id,
        roleId: hrRole._id,
      });

      console.log("HR account created with username: admin and password: admin");
    } else {
      console.log("HR account already exists");
    }
  } catch (error) {
    console.error("Error creating HR account:", error);
  }
}

export default seedHRAccount;*/
import bcrypt from "bcrypt";
import { User, Role, UserRole } from "../src/models/index.js";

async function seedHRAccount() {
  try {
    // Ensure the HR role exists in the Role collection
    const hrRole = await Role.findOneAndUpdate(
      { role: "HR" }, // Query for HR role
      { role: "HR" }, // If not found, create a new role
      { upsert: true, new: true }
    );

    // Check if the admin user already exists
    const existingUser = await User.findOne({ username: "admin" });

    if (!existingUser) {
      // Hash the default password or use the one from .env
      const hashedPassword = await bcrypt.hash(process.env.HR_PASSWORD || "admin", 10);

      // Create the admin user
      const newUser = await User.create({
        username: "admin",
        password: hashedPassword,
      });

      // Link the user with the HR role
      await UserRole.create({
        userId: newUser._id,
        roleId: hrRole._id,
      });

      console.log("HR account created with username: admin and password: admin");
    } else {
      console.log("HR account already exists");
    }
  } catch (error) {
    console.error("Error creating HR account:", error);
  }
}

export default seedHRAccount;

