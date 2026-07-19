import type { Metadata, Viewport } from "next";

import "./studio.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pentimento.aethe.me"),
  title: "Pentimento — Build your first project with AI",
  description:
    "A guided studio for complete beginners: turn an idea into a small, checked, published project while learning what AI tools, GitHub, prompts, previews, and versions actually do.",
  applicationName: "Pentimento",
  openGraph: {
    title: "Pentimento — From an idea to a live project",
    description:
      "Learn the whole AI-building path by guiding one small project from a rough idea to a live, recoverable version.",
    type: "website",
    url: "/",
    siteName: "Pentimento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentimento — Build your first project with AI",
    description:
      "A calm, practical studio for learning tools, prompts, GitHub, checking, publishing, and improvement through one complete project.",
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
