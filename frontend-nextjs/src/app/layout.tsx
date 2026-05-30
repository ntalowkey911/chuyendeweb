import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import AuthHydrate from "@/components/AuthHydrate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nông Sản Sấy",
  description: "Shop nông sản sấy, hạt và thực phẩm khô gọn nhẹ cho gian bếp mỗi ngày.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

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
        </body>
      </html>
    </ClerkProvider>
  );
}
