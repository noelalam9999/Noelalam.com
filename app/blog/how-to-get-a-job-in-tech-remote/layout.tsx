import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to get a job in a Tech Field Remote - Noel Alam",
  description: "A comprehensive guide for technical professionals, managers, and beginners on landing remote tech jobs. Learn about resume optimization, interview preparation, and strategic job searching.",
  openGraph: {
    title: "How to get a job in a Tech Field Remote",
    description: "A comprehensive guide for technical professionals, managers, and beginners on landing remote tech jobs.",
    type: "article",
    publishedTime: "2026-02-10",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
