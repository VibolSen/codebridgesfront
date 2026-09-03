import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeBridges Enterprise Suite",
  description: "Enterprise POS, Multi-Warehouse Inventory, Dynamic RBAC, Finance & HRM Cloud Platform",
  icons: {
    icon: [
      { url: "/logo/Codebridge.svg", type: "image/svg+xml" },
      { url: "/logo/Codebridge.png", type: "image/png" },
    ],
    shortcut: "/logo/Codebridge.svg",
    apple: "/logo/Codebridge.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
