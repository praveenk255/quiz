import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Avsec Quiz", description: "Full‑stack multi quiz app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="holographic-card sticky top-0 z-50 border-b border-gray-700">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold holographic-text">Avsec Basic Quiz</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/admin" className="hover:underline">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
