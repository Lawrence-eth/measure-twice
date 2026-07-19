import type { Metadata, Viewport } from "next";

import "./final.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pentimento.law-ender.chatgpt.site"),
  title: "Pentimento — Learn to build with AI",
  description:
    "A 15-minute interactive field guide for first-time AI builders: learn to scope, direct, verify, release, and recover a trustworthy project.",
  applicationName: "Pentimento",
  openGraph: {
    title: "Pentimento — Learn to build with AI",
    description:
      "AI can make a project look finished. Learn the decisions that make it trustworthy—from first promise to checked, recoverable release.",
    type: "website",
    url: "/",
    siteName: "Pentimento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentimento — Learn to build with AI",
    description:
      "A beautiful, interactive field lesson for building trustworthy projects with AI.",
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
  themeColor: "#f3efe6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
