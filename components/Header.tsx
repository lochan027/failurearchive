'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/app/components/Logo';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 hover:no-underline group">
              <Logo size={32} />
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Failure Archive
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Gallery
              </Link>
              <Link href="/submit" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Submit
              </Link>
              <Link href="/premortem" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Pre-Mortem
              </Link>
              {session && (
                <Link 
                  href="/dashboard" 
                  className="px-3 py-1.5 text-blue-600 dark:text-blue-400 font-semibold border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                  {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors [&]:!text-white hover:!text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
