import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider, ReactReduxProvider } from "./providers";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Paisa sambalo",
  description: "Manage your finances(paisa) effectively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <NextAuthProvider>
          <ReactReduxProvider>{children}</ReactReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
