"use client";
import { useEffect, useState } from "react";

type SectionStat = { section: string, total: number, wrong: number, accuracy: number };
type Summary = { attempts: number, totalAnswered: number, totalCorrect: number, totalWrong: number, accuracy: number, bySection: SectionStat[] };

export default function Dashboard() {
  const [data, setData] = useState<Summary | null>(null);
  useEffect(() => { fetch("/api/stats/me").then(r=>r.json()).then(setData).catch(()=>{}); }, []);
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Performance</h1>
      <div className="grid sm:grid-cols-4 gap-3">
        <div className="holographic-card p-4 rounded-xl">Attempts <div className="text-2xl font-bold">{data.attempts}</div></div>
        <div className="holographic-card p-4 rounded-xl">Answered <div className="text-2xl font-bold">{data.totalAnswered}</div></div>
        <div className="holographic-card p-4 rounded-xl">Accuracy <div className="text-2xl font-bold">{Math.round(data.accuracy)}%</div></div>
        <div className="holographic-card p-4 rounded-xl">Wrong <div className="text-2xl font-bold">{data.totalWrong}</div></div>
      </div>
      <h2 className="mt-6 mb-2 font-semibold">Weak Areas (by Section)</h2>
      <div className="space-y-2">
        {data.bySection.map(s => (
          <div key={s.section} className="holographic-card p-3 rounded-xl flex items-center justify-between">
            <div className="font-medium">{s.section}</div>
            <div className="text-sm">Wrong: {s.wrong} / {s.total} &nbsp;·&nbsp; Acc: {Math.round(s.accuracy)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
