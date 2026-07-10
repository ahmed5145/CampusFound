import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Container from "../components/ui/Container";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";
import AnalyticsInit from "../components/analytics/AnalyticsInit";
import ErrorReporter from "../components/ErrorReporter";
import { ogImageAlt, ogImagePath, ogImageSize } from "../lib/og-image";
import { getMetadataBase, getSiteDescription } from "../lib/site";
import "./globals.css";

const campusName = process.env.NEXT_PUBLIC_CAMPUS_NAME?.trim() || "Campus Found";
const siteDescription = getSiteDescription();
const metadataBase = getMetadataBase();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase,
  title: campusName,
  description: siteDescription,
  openGraph: {
    title: campusName,
    description: siteDescription,
    siteName: campusName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: ogImagePath,
        width: ogImageSize.width,
        height: ogImageSize.height,
        alt: ogImageAlt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: campusName,
    description: siteDescription,
    images: [ogImagePath],
  },
  icons: {
    icon: [{ url: "/brand/logo-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/logo-mark.svg", type: "image/svg+xml" }],
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
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-brand-cream text-brand-navy">
        <AnalyticsInit />
        <Header />
        <ErrorReporter>
          <Container>
            <div className="py-6">{children}</div>
          </Container>
        </ErrorReporter>
        <Footer />
      </body>
    </html>
  );
}
