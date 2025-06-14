import bcrypt from "bcrypt";

async function generateHashedPassword() {
  const hashedPassword = await bcrypt.hash("admin", 10); // Replace "admin" with your desired password
  console.log("Generated Hashed Password:", hashedPassword);
}

generateHashedPassword();