import "server-only";

/**
 * Auth placeholder. Replace with Auth.js (NextAuth) once customer accounts
 * and the admin panel are introduced. Pages already call `getSession()` so the
 * header/account UI will light up automatically.
 */

export type Role = "customer" | "admin";

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export async function getSession(): Promise<Session | null> {
  return null;
}

export const authEnabled = false;
