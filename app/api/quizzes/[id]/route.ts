import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const q = await prisma.quiz.findUnique({ where: { id: params.id } });
  if (!q) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(q);
}
