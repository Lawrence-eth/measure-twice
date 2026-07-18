import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Counterproof — Debug your mental model",
  description:
    "An evidence-first programming tutor that turns misconceptions into runnable counterexamples.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
