import type { Metadata, Viewport } from "next";

import "./final.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pentimento.law-ender.chatgpt.site"),
  title: "Pentimento — Learn to build with AI",
  description:
    "A guided simulation for complete beginners: make 13 useful decisions and practice a reusable method from first idea to checked release.",
  applicationName: "Pentimento",
  openGraph: {
    title: "Pentimento — Learn to build with AI",
    description:
      "Guide one small project from a rough idea to a checked release in 13 meaningful decisions.",
    type: "website",
    url: "/",
    siteName: "Pentimento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentimento — Learn to build with AI",
    description:
      "Learn a reusable AI-building method through one complete, interactive project.",
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
