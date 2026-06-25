import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "tadabbur_admin_token";
const TOKEN_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function verifyAdminCredentials(
  username: string,
  password: string
  
): Promise<boolean> {
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) return false;
  if (username !== ADMIN_USERNAME) return false;
  // return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

console.log("PASSWORD:", password);
console.log("RAW HASH:", JSON.stringify(ADMIN_PASSWORD_HASH));
console.log("MATCH:", match);

return match;

  return match;

}

export function createAdminToken(): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
}

export function verifyAdminToken(token: string): boolean {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) return false;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export { COOKIE_NAME, TOKEN_MAX_AGE };
