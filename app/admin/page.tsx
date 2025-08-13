"use client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [csvUrl, setCsvUrl] = useState("");
  const [list, setList] = useState<any[]>([]);
  const load = () => fetch("/api/quizzes").then(r=>r.json()).then(setList);
  useEffect(() => { load(); }, []);
  async function add() {
    const res = await fetch("/api/quizzes", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ title, csvUrl }) });
    if (res.ok) { setTitle(""); setCsvUrl(""); load(); }
    else alert("Failed");
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin · Manage Quizzes</h1>
      <div className="holographic-card p-4 rounded-xl space-y-2">
        <input className="w-full p-2 rounded holographic-btn" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full p-2 rounded holographic-btn" placeholder="Google Sheet CSV URL" value={csvUrl} onChange={e=>setCsvUrl(e.target.value)} />
        <button onClick={add} className="holographic-btn px-4 py-2 rounded-md font-bold">Add Quiz</button>
      </div>
      <h2 className="mt-6 mb-2 font-semibold">Existing</h2>
      <div className="space-y-2">
        {list.map(q => <div key={q.id} className="holographic-card p-3 rounded-xl"><div className="font-medium">{q.title}</div><div className="text-xs break-all">{q.csvUrl}</div></div>)}
      </div>
    </div>
  );
}
