'use client';

import { BlogContent } from '@/lib/blogs';

type CoachGuideContentProps = {
  content: BlogContent;
};

export default function CoachGuideContent({ content }: CoachGuideContentProps) {
  const { sections = [], introduction, instructions, conclusion } = content;

  return (
    <div className="space-y-8">
      {introduction && (
        <div className="text-lg text-gray-300 leading-relaxed mb-12">
          {introduction}
        </div>
      )}

      {instructions && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">
            {instructions.title || 'Instructions'}
          </h3>
          <p className="text-gray-300">{instructions.text}</p>
        </div>
      )}

      {sections.map((section: any, idx: number) => (
        <div key={section.id || idx} className="space-y-6">
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center gap-3 mb-2">
              {section.number && (
                <span className="text-4xl font-bold text-purple-400">
                  {section.number}
                </span>
              )}
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-lg text-gray-400 mt-1">{section.subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {section.doPoints && section.doPoints.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">✓ DO</h3>
              <ul className="space-y-2">
                {section.doPoints.map((point: string, pIdx: number) => (
                  <li key={pIdx} className="text-gray-300 flex gap-2">
                    <span className="text-green-400 shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.dontPoints && section.dontPoints.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">✗ DON&apos;T</h3>
              <ul className="space-y-2">
                {section.dontPoints.map((point: string, pIdx: number) => (
                  <li key={pIdx} className="text-gray-300 flex gap-2">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.coachNote && (
            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded italic">
              <p className="text-gray-300">{section.coachNote}</p>
            </div>
          )}
        </div>
      ))}

      {conclusion && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            {conclusion.title}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {conclusion.content}
          </p>
          {conclusion.author && (
            <p className="text-gray-400 italic">{conclusion.author}</p>
          )}
        </div>
      )}
    </div>
  );
}
