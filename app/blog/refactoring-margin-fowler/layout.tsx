import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refactoring — Your Coach's Guide - Noel Alam",
  description: "A chat-style guide to Martin Fowler's \"Refactoring: Improving the Design of Existing Code\" (2nd ed.) — your path to world-class refactoring.",
  openGraph: {
    title: "Refactoring — Your Coach's Guide",
    description: "A chat-style guide to Martin Fowler's Refactoring (2nd ed.) — actionable DO/DON'T points for every chapter.",
    type: "article",
    publishedTime: "2026-02-18",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
