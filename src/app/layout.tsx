import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'INCURSION — Conflict-Aware Events & Expenses Manager',
  description:
    'Campus-wide event visibility, multi-dimensional clash prevention, transparent fund tracking, and digital institutional memory for the ACM Core.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B1522] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left-side Persistent Navigation Sidebar */}
            <Sidebar />

            {/* Main Application Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
                {children}
              </main>
              <footer className="border-t border-[#1E324B] py-6 text-center text-xs text-slate-500">
                <p>INCURSION ACM Campus Intelligence • Conflict-Aware Events & Fund Management System</p>
                <p className="mt-1 text-slate-600">Built for institutional continuity across executive tenures.</p>
              </footer>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
