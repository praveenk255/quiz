import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  const answers = await prisma.answer.findMany({
    where: { isCorrect: false, attempt: { userId: user.id }, ...(section ? { section } : {}) },
    take: 200,
    orderBy: { id: "desc" }
  });

  // Return unique questions by hash to avoid duplicates
  const seen = new Set<string>();
  const unique = [];
  for (const a of answers) {
    if (seen.has(a.questionHash)) continue;
    seen.add(a.questionHash);
    unique.push(a);
  }
  return NextResponse.json(unique.map(a => ({
    questionHash: a.questionHash,
    questionText: a.questionText,
    section: a.section,
    correctIdx: a.correctIdx
  })));
}
