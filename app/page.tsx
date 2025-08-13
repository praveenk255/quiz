"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Quiz = { id: string; title: string; csvUrl: string };

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetch("/api/quizzes").then(r => r.json()).then(setQuizzes).catch(()=>{});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 holographic-text">Choose a Quiz</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {quizzes.map(q => (
          <Link key={q.id} href={`/quiz/${q.id}`} className="holographic-card p-4 rounded-xl hover:scale-[1.01] transition-transform">
            <div className="font-semibold text-lg">{q.title}</div>
            <div className="text-xs text-gray-400 break-all mt-1">{q.csvUrl}</div>
          </Link>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-6">Add more via the Admin page.</p>
    </div>
  );
}
