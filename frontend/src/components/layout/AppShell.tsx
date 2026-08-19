'use client';

import React from 'react';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#F3F4F6]">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}
