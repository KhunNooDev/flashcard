import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import AppDataProvider from "@/context/app-data-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Create decks and study flashcards — saved locally on your device.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
