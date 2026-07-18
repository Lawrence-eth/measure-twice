import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pentimento.aethe.me"),
  title: "Pentimento — See the decisions beneath the finished surface",
  description:
    "A consequence-driven learning experience for beginners who want to plan, direct, inspect, repair, and safely share projects built with AI.",
  applicationName: "Pentimento",
  openGraph: {
    title: "Pentimento — Build with AI. Know what to trust.",
    description:
      "Take one polished-but-broken project from first impression to evidence-backed release. No coding experience required.",
    type: "website",
    url: "/",
    siteName: "Pentimento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentimento — Build with AI. Know what to trust.",
    description:
      "A consequence-driven learning experience for building trustworthy projects with AI.",
  },
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f2ed",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
