import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import AuthHydrate from "@/components/AuthHydrate";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastBite - Món Ngon Giao Ngay",
  description: "Trải nghiệm những món thức ăn nhanh hấp dẫn, gà rán giòn rụm và thức uống tươi mát.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import Chatbot from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="vi">
        <body className="min-h-screen bg-background text-foreground antialiased">
          <AuthHydrate />
          {children}
          <Chatbot />
        </body>
      </html>
    </ClerkProvider>
  );
}
