import { getCurrentUser, type SafeUser } from "./getCurrentUser";

export async function requireMember(): Promise<SafeUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.membershipStatus !== "active") return null;
  return user;
}
