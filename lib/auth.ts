import { cookies } from "next/headers";
import { verify } from "./jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return null;
  try {
    const payload = await verify(token);
    return payload as { id: string; email: string; name?: string };
  } catch {
    return null;
  }
}
