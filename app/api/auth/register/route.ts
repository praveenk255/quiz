import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sign } from "@/lib/jwt";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "missing" }, { status: 400 });
  const hash = createHash("sha256").update(password).digest("hex");
  const user = await prisma.user.create({ data: { name, email, password: hash } }).catch(async e => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing;
    throw e;
  });
  const token = await sign({ id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
  return res;
}
