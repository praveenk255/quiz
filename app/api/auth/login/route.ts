import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sign } from "@/lib/jwt";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "missing" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  const hash = createHash("sha256").update(password).digest("hex");
  if (!user || user.password !== hash) return NextResponse.json({ error: "invalid" }, { status: 401 });
  const token = await sign({ id: user.id, email: user.email, name: user.name || undefined });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
  return res;
}
