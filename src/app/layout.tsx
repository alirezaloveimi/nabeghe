import type { Metadata } from "next";
import ThemeProvider from "@/context/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "به نابغه خوش آمدید",
  description: "وبسایت آموزشی برنامه نویسی برای همه",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
