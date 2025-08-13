"use client";
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { sha256 } from "@/lib/hash";

type Row = Record<string,string>;
type Q = {
  hash: string;
  question: string;
  options: string[];
  correctIdx: number;
  section?: string | null;
};

export default function QuizPage({ params }: { params: { id: string } }) {
  const [meta, setMeta] = useState<{id:string,title:string,csvUrl:string}|null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [selected, setSelected] = useState<Record<string, number | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes/${params.id}`).then(r => r.json()).then(async (quiz) => {
      setMeta(quiz);
      const res = await fetch(quiz.csvUrl);
      const csv = await res.text();
      const parsed = Papa.parse<Row>(csv.trim(), { header: true, skipEmptyLines: true });
      const qs = parsed.data.filter(r => r["English Question"] && r["Correct"]).map((r, i) => {
        const question = (r["English Question"]||"").replace(/\s+/g," ").trim();
        const opts = [r["Option 1"], r["Option 2"], r["Option 3"], r["Option 4"]].map(x => (x||"").trim());
        const correctIdx = parseInt((r["Correct"]||"1").toString()) - 1;
        const section = (r["Section"] || r["Topic"] || r["Category"] || "").trim() || null;
        const hash = sha256(`${quiz.csvUrl}|${question}|${opts.join("|")}|${correctIdx}`);
        return { hash, question, options: opts, correctIdx, section };
      });
      // shuffle
      for (let i = qs.length -1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [qs[i],qs[j]]=[qs[j],qs[i]]; }
      setQuestions(qs);
    });
  }, [params.id]);

  const stats = useMemo(() => {
    const attempted = Object.values(selected).filter(v => v !== undefined).length;
    let correct=0, incorrect=0;
    for (const q of questions) {
      const pick = selected[q.hash];
      if (pick!==undefined) (pick===q.correctIdx ? correct++ : incorrect++);
    }
    const accuracy = attempted ? Math.round((correct/attempted)*100) : 0;
    return { attempted, correct, incorrect, accuracy, total: questions.length };
  }, [selected, questions]);

  async function onSubmit() {
    if (!meta) return;
    const payload = {
      quizId: meta.id,
      total: questions.length,
      answers: questions.map(q => ({
        questionHash: q.hash,
        questionText: q.question,
        section: q.section,
        selectedIdx: selected[q.hash] ?? null,
        correctIdx: q.correctIdx,
        isCorrect: selected[q.hash] === q.correctIdx
      }))
    };
    const res = await fetch("/api/attempts/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setSubmitted(true);
    alert(`Score: ${data.score}/${data.total} (${Math.round((data.score/data.total)*100)}%)`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{meta?.title || "Loading..."}</h1>

      <div className="holographic-card rounded-xl p-4 mb-4 text-sm font-medium sticky top-[60px] z-10">
        <div className="flex flex-wrap gap-4">
          <span>Qs Attempted: <span className="text-indigo-400">{stats.attempted}</span></span>
          <span>Correct: <span className="text-green-400">{stats.correct}</span></span>
          <span>Incorrect: <span className="text-red-400">{stats.incorrect}</span></span>
          <span>Accuracy: <span className="text-cyan-400">{stats.accuracy}%</span></span>
          <span>Total: <span className="text-gray-300">{stats.total}</span></span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.hash} className="holographic-card p-4 rounded-xl">
            <div className="font-semibold mb-3">{i+1}. {q.question}</div>
            <div className="grid gap-2">
              {q.options.map((opt, idx) => {
                const picked = selected[q.hash];
                const isCorrect = idx === q.correctIdx;
                const classes = picked === undefined ? "holographic-btn px-3 py-2 rounded-md text-left"
                  : picked === idx
                    ? (isCorrect ? "correct-answer px-3 py-2 rounded-md" : "incorrect-answer px-3 py-2 rounded-md")
                    : (isCorrect ? "correct-answer px-3 py-2 rounded-md" : "holographic-btn px-3 py-2 rounded-md opacity-60");
                return (
                  <button
                    key={idx}
                    className={classes}
                    onClick={() => setSelected(s => s[q.hash]===undefined ? ({...s, [q.hash]: idx}) : s)}
                    disabled={selected[q.hash] !== undefined}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {q.section ? <div className="text-xs text-gray-400 mt-2">Section: {q.section}</div> : null}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={onSubmit} disabled={submitted} className="holographic-btn w-full px-6 py-3 rounded-md font-bold">
          {submitted ? "Submitted" : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
