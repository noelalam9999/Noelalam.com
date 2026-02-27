import type { Metadata } from "next";
import BlogReadingLayout from "@/components/BlogReadingLayout";

export const metadata: Metadata = {
  title: "Blog - Noel Alam",
  description: "Insights on tech careers, engineering management, and industry trends by Noel Alam",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogReadingLayout>{children}</BlogReadingLayout>;
}
