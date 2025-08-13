import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const attempts = await prisma.attempt.findMany({ where: { userId: user.id }, include: { answers: true } });
  const totalAnswered = attempts.reduce((acc, a) => acc + a.answers.length, 0);
  const totalCorrect = attempts.reduce((acc, a) => acc + a.answers.filter(x => x.isCorrect).length, 0);
  const totalWrong = totalAnswered - totalCorrect;
  const accuracy = totalAnswered ? (totalCorrect / totalAnswered) * 100 : 0;

  const bySectionMap = new Map<string, { total: number; wrong: number }>();
  for (const a of attempts) {
    for (const ans of a.answers) {
      const key = (ans.section || "Unlabeled");
      const entry = bySectionMap.get(key) || { total: 0, wrong: 0 };
      entry.total += 1;
      if (!ans.isCorrect) entry.wrong += 1;
      bySectionMap.set(key, entry);
    }
  }
  const bySection = Array.from(bySectionMap.entries()).map(([section, v]) => ({
    section, total: v.total, wrong: v.wrong, accuracy: v.total ? ((v.total - v.wrong) / v.total) * 100 : 0
  })).sort((a,b)=> b.wrong - a.wrong);

  return NextResponse.json({ attempts: attempts.length, totalAnswered, totalCorrect, totalWrong, accuracy, bySection });
}
