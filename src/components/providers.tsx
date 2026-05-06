"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { TranslationProvider } from "./translation-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TranslationProvider>
        {children}
        <Toaster position="top-center" />
      </TranslationProvider>
    </SessionProvider>
  );
}
