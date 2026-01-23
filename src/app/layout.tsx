import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Modern, yuvarlak hatlı font
import "./globals.css";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KidsGourmet Studio",
  description: "Social Media Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={font.className}>{children}</body>
    </html>
  );
}