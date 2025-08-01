import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Orderbook 3D Visualizer",
  description: "Real-time, multi-venue, responsive crypto market depth analytics",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-white`}>
        <main className="flex flex-col min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
