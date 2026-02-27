'use client';

import { BlogContent } from '@/lib/blogs';

type InterviewGuideContentProps = {
  content: BlogContent;
};

export default function InterviewGuideContent({ content }: InterviewGuideContentProps) {
  const { sections = [], introduction } = content;

  return (
    <div className="space-y-8">
      {introduction && (
        <div className="text-lg text-gray-300 leading-relaxed mb-12">
          {introduction}
        </div>
      )}

      {sections.map((section: any, idx: number) => (
        <section key={section.id || idx} className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-lg text-gray-400 mb-2">{section.subtitle}</p>
            )}
            {section.metadata && (
              <p className="text-sm text-gray-500">{section.metadata}</p>
            )}
          </div>

          {section.questions?.map((q: any, qIdx: number) => (
            <div key={qIdx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">
                {q.question}
              </h3>
              
              {q.weakSignal && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 font-semibold shrink-0">❌ Weak:</span>
                    <p className="text-gray-300">{q.weakSignal}</p>
                  </div>
                </div>
              )}

              {q.strongSignal && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-semibold shrink-0">✓ Strong:</span>
                    <p className="text-gray-300">{q.strongSignal}</p>
                  </div>
                </div>
              )}

              {q.example && (
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-blue-300 mb-2">Example:</p>
                  <p className="text-gray-300">{q.example}</p>
                </div>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
