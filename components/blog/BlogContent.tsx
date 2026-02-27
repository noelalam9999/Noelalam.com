'use client';

import { BlogContent as BlogContentType } from '@/lib/blogs';
import InterviewGuideContent from './InterviewGuideContent';
import PracticeGuideContent from './PracticeGuideContent';
import CoachGuideContent from './CoachGuideContent';
import ArticleContent from './ArticleContent';

type BlogContentProps = {
  content: BlogContentType;
};

export default function BlogContent({ content }: BlogContentProps) {
  switch (content.type) {
    case 'interview-guide':
      return <InterviewGuideContent content={content} />;
    case 'practice-guide':
      return <PracticeGuideContent content={content} />;
    case 'coach-guide':
      return <CoachGuideContent content={content} />;
    case 'article':
      return <ArticleContent content={content} />;
    default:
      return <div>Unsupported content type</div>;
  }
}
