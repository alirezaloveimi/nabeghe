"use client";

import ToastWrapper from "@/components/ToastWrapper";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextThemesProvider enableSystem={false} defaultTheme="dark">
      {children}

      <ToastWrapper />
    </NextThemesProvider>
  );
}
