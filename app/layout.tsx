import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noel Alam - Engineering Manager",
  description: "Engineering Manager with 5 years of experience",
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
