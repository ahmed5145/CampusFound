import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Container from "../components/ui/Container";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";
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
  title: "Campus Found",
  description: "Minimal found-item listings MVP",
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
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <Container>
          <div className="py-6">{children}</div>
        </Container>
        <Footer />
      </body>
    </html>
  );
}
