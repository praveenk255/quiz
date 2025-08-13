import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const defaults = [
  { title: "Basic 1", csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSkl3zFBB8s5jFoh3mNbRUbETM6k0FPkBwRmu9sRO-SSTFb5O-HaxPNACCjqOLgXEdzpVJxRYetJ4aO/pub?output=csv" },
  { title: "Basic 2", csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIpr6CpRW3F9kae8F3_cqqiXOtEL6CqCJlgsiJ79_l348bEsa2UWI93i4_chElLeG4JDNGSudflxf9/pub?output=csv" },
  { title: "Terminologies", csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vStq66g33WI6VxWrVx-l_eheqjxuOW2dYZTGDwQcxC4GrZpgUflUdUwuNqSiNTnyU4g8DklR2Cy7rOi/pub?output=csv" }
];

export async function GET() {
  // Ensure there is at least the default seed
  for (const d of defaults) {
    await prisma.quiz.upsert({ where: { csvUrl: d.csvUrl }, create: d, update: {} });
  }
  const list = await prisma.quiz.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const { title, csvUrl } = await req.json();
  if (!title || !csvUrl) return NextResponse.json({ error: "missing" }, { status: 400 });
  const created = await prisma.quiz.create({ data: { title, csvUrl } });
  return NextResponse.json(created);
}
