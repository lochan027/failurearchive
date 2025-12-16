import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Failure Archive - Research-Grade Knowledge Repository",
  description: "A research-grade platform for submitting and exploring failed projects, research, and ideas, where failures are treated as structured, reusable knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-[var(--border)] py-8 mt-16">
              <div className="container mx-auto px-4 text-center text-sm text-[var(--muted)]">
                <p>All textual content: CC0 1.0 Public Domain</p>
                <p>All code references: MIT License</p>
                <p className="mt-2">
                  This is NOT a social network. No likes, no comments, no engagement metrics.
                </p>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

