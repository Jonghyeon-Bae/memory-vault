import type { Metadata } from "next";
import { Gamja_Flower, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gamjaFlower = Gamja_Flower({
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "기억 보관함",
  description: "나의 기억을 보관하고 공유하는 공간.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gamjaFlower.className}`}
      >
        {children}
      </body>
    </html>
  );
}
