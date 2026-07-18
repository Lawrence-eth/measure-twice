import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Measure Twice — Learn to build with AI",
  description:
    "A consequence-driven field school that teaches beginners how to direct, inspect, verify, and safely ship work built with AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
