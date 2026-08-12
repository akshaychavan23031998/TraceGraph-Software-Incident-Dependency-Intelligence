import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TraceGraph — Software Incident & Dependency Intelligence",
  description:
    "Graph-powered software dependency and incident intelligence built with CognoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

