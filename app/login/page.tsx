"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
    if (res.ok) window.location.href = "/dashboard"; else alert("Invalid credentials");
  }
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto holographic-card p-6 rounded-xl space-y-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="w-full p-2 rounded holographic-btn" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-2 rounded holographic-btn" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="holographic-btn w-full px-4 py-2 rounded-md font-bold" type="submit">Login</button>
      <p className="text-sm text-gray-400">No account? <a className="underline" href="/register">Register</a></p>
    </form>
  );
}
