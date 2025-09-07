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
  title: "Trade Union Wages Across America",
  description: "Explore trade union wages and fringe benefits by location and trade. Interactive map showing current wage data for trade union workers across the United States.",
  keywords: ["trade union", "union wages", "labor", "construction", "electrical", "plumbing", "carpentry", "wages", "benefits", "America", "United States"],
  authors: [{ name: "Union Wages Map" }],
  openGraph: {
    title: "Trade Union Wages Across America",
    description: "Interactive map showing trade union wages and benefits across the United States",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trade Union Wages Across America",
    description: "Interactive map showing trade union wages and benefits across the United States",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
