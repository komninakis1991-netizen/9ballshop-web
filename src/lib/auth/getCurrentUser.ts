import { getPrisma } from "@/lib/prisma";
import { getSessionCookie } from "./cookies";
import { verifySession } from "./session";

export type SafeUser = {
  id: number;
  email: string;
  name: string;
  phone: string;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  addressCountry: string;
  stripeCustomerId: string;
  isAdmin: boolean;
  createdAt: Date;
};

export async function getCurrentUser(): Promise<SafeUser | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const prisma = await getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      addressStreet: true,
      addressCity: true,
      addressPostalCode: true,
      addressCountry: true,
      stripeCustomerId: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return user;
}
