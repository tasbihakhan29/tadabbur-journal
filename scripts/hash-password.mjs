/**
 * Generate a bcrypt hash for your admin password.
 *
 * Usage:
 *   node scripts/hash-password.mjs your-password-here
 *
 * Copy the output into ADMIN_PASSWORD_HASH in your .env.local
 */

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nPaste this into .env.local as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log();
