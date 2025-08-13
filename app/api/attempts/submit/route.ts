import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Payload = {
  quizId: string,
  total: number,
  answers: {
    questionHash: string,
    questionText: string,
    section?: string | null,
    selectedIdx: number | null,
    correctIdx: number,
    isCorrect: boolean
  }[]
};

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = (await req.json()) as Payload;
  const score = body.answers.filter(a => a.isCorrect).length;
  const accuracy = body.total ? (score / body.total) : 0;

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.id,
      quizId: body.quizId,
      total: body.total,
      score,
      accuracy,
      completedAt: new Date(),
      answers: {
        create: body.answers.map(a => ({
          questionHash: a.questionHash,
          questionText: a.questionText.slice(0, 1024),
          section: a.section || null,
          selectedIdx: a.selectedIdx ?? null,
          correctIdx: a.correctIdx,
          isCorrect: a.isCorrect
        }))
      }
    }
  });

  return NextResponse.json({ id: attempt.id, score, total: body.total, accuracy });
}
