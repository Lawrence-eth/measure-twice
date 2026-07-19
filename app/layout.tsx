import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pentimento.aethe.me"),
  title: "Pentimento — See the decisions beneath the finished surface",
  description:
    "A guided simulation where complete beginners learn to lead, inspect, repair, and safely share one AI-built project—without writing code.",
  applicationName: "Pentimento",
  openGraph: {
    title: "Pentimento — Build with AI. Know what to trust.",
    description:
      "Lead one AI-built project from polished draft to evidence-backed release. Guided, code-free, and safe to explore.",
    type: "website",
    url: "/",
    siteName: "Pentimento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentimento — Build with AI. Know what to trust.",
    description:
      "A guided, code-free simulation for learning how to lead a trustworthy AI-built project.",
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
