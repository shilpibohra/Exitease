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
import { User, Role, UserRole, Permission, RolePermission } from "../src/models/index.js";

const seedHRAccount = async () => {
    try {
      const adminRole = await Role.findOneAndUpdate(
        { role: "admin" },
        { role: "admin", description: "Administrator role" },
        { upsert: true, new: true }
      );
  
      const hashedPassword = await bcrypt.hash("admin", 10);
  
      const adminUser = await User.findOneAndUpdate(
        { username: "admin" },
        { username: "admin", password: hashedPassword },
        { upsert: true, new: true }
      );
  
      await UserRole.findOneAndUpdate(
        { userId: adminUser._id, roleId: adminRole._id },
        { userId: adminUser._id, roleId: adminRole._id },
        { upsert: true }
      );
      
      const seeAllPermission = await Permission.findOneAndUpdate(
        { subject: "resignation", action: "see_all" },
        { subject: "resignation", action: "see_all", description: "Permission to see all resignations" },
        { upsert: true, new: true }
      );
  
      // Associate the permission with the HR role
      await RolePermission.findOneAndUpdate(
        { roleId: adminRole._id, permissionId: seeAllPermission._id },
  { roleId: adminRole._id, permissionId: seeAllPermission._id },
  { upsert: true }
);
      console.log("HR account seeded successfully.");
    } catch (error) {
      console.error("Error seeding HR account:", error);
    }
  };
  
  export default seedHRAccount;
  

