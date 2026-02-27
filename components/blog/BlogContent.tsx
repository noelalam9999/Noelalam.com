"use client";

import { useEffect } from "react";
import { BlogContent as BlogContentType } from "@/lib/blogs";
import InterviewGuideContent from "@/components/blog/InterviewGuideContent";
import PracticeGuideContent from "@/components/blog/PracticeGuideContent";
import CoachGuideContent from "@/components/blog/CoachGuideContent";
import ArticleContent from "@/components/blog/ArticleContent";
import ProjectGuideContent from "@/components/blog/ProjectGuideContent";

type BlogContentProps = {
  content: BlogContentType;
  slug: string;
};

const RESUME_PATH_KEY = "resumeReadingPath";

export default function BlogContent({ content, slug }: BlogContentProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const resumeData = window.sessionStorage.getItem(RESUME_PATH_KEY);
      if (!resumeData) return;

      const { path, scrollY } = JSON.parse(resumeData);
      const currentPath = window.location.pathname;

      if (currentPath === path && scrollY) {
        // Clear the flag so we don't scroll again on next visit
        window.sessionStorage.removeItem(RESUME_PATH_KEY);

        // Scroll after a brief delay to ensure content is rendered
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollY,
            behavior: "smooth"
          });
        });
      }
    } catch {
      // Ignore invalid JSON or errors
    }
  }, []);

  switch (content.type) {
    case "interview-guide":
      return <InterviewGuideContent content={content} slug={slug} />;
    case "practice-guide":
      return <PracticeGuideContent content={content} slug={slug} />;
    case "coach-guide":
      return <CoachGuideContent content={content} slug={slug} />;
    case "article":
      return <ArticleContent content={content} slug={slug} />;
    case "project-guide":
      return <ProjectGuideContent content={content} slug={slug} />;
    default:
      return <div>Unsupported content type</div>;
  }
}
