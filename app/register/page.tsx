"use client";
import { useState } from "react";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name, email, password }) });
    if (res.ok) window.location.href = "/dashboard"; else alert("Failed");
  }
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto holographic-card p-6 rounded-xl space-y-3">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="w-full p-2 rounded holographic-btn" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full p-2 rounded holographic-btn" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-2 rounded holographic-btn" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="holographic-btn w-full px-4 py-2 rounded-md font-bold" type="submit">Create account</button>
    </form>
  );
}
