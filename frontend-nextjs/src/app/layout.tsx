import type { Metadata } from "next";
import AuthHydrate from "@/components/AuthHydrate";
import "./globals.css";

export const metadata: Metadata = {
  title: "FASTFOOD & DRINKS",
  description: "Food ordering UI on Next.js with Spring Boot backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthHydrate />
        {children}
      </body>
    </html>
  );
}
