'use client';

import { BlogContent } from '@/lib/blogs';
import SectionNotes from './SectionNotes';

type ProjectGuideContentProps = {
  content: BlogContent;
  slug: string;
};

export default function ProjectGuideContent({ content, slug }: ProjectGuideContentProps) {
  const { sections = [], introduction } = content;

  return (
    <div className="space-y-8">
      {introduction && (
        <div className="text-lg text-gray-300 leading-relaxed mb-12">
          {introduction}
        </div>
      )}

      {sections.map((section: any, idx: number) => {
        if (section.type === 'goal-section') {
          return (
            <div key={section.id || idx} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-8 space-y-4">
              <h2 className="text-3xl font-bold text-blue-400">
                {section.title}
              </h2>
              
              {section.content && (
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              )}

              {section.listItems && section.listItems.length > 0 && (
                <ul className="space-y-3">
                  {section.listItems.map((item: string, liIdx: number) => (
                    <li key={liIdx} className="text-gray-300 flex gap-3">
                      <span className="text-blue-400 shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.closingNote && (
                <p className="text-gray-400 italic mt-4 pt-4 border-t border-gray-700">
                  {section.closingNote}
                </p>
              )}

              <SectionNotes sectionId={section.id || `goal-${idx}`} blogSlug={slug} />
            </div>
          );
        }

        if (section.type === 'phase') {
          return (
            <div key={section.id || idx} className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <h2 className="text-3xl font-bold text-white">
                  {section.title}
                </h2>
              </div>

              {section.subsections && section.subsections.map((subsection: any, subIdx: number) => (
                <div key={subIdx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400">
                    {subsection.title}
                  </h3>
                  
                  {subsection.content && (
                    <p className="text-gray-300 leading-relaxed">{subsection.content}</p>
                  )}

                  {subsection.listItems && subsection.listItems.length > 0 && (
                    <ul className="space-y-2 mt-3">
                      {subsection.listItems.map((item: string, liIdx: number) => (
                        <li key={liIdx} className="text-gray-300 flex gap-3">
                          <span className="text-purple-400 shrink-0">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {subsection.additionalContent && (
                    <p className="text-gray-400 text-sm mt-4 pt-3 border-t border-gray-800">
                      {subsection.additionalContent}
                    </p>
                  )}

                  <SectionNotes sectionId={subsection.id || `${section.id}-sub-${subIdx}`} blogSlug={slug} />
                </div>
              ))}
            </div>
          );
        }

        if (section.type === 'text-section') {
          return (
            <div key={section.id || idx} className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h2 className="text-3xl font-bold text-white">
                  {section.title}
                </h2>
              </div>

              {section.content && (
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              )}

              {section.themes && section.themes.length > 0 && (
                <div className="grid gap-4">
                  {section.themes.map((theme: any, themeIdx: number) => (
                    <div key={themeIdx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 flex gap-4">
                      {theme.number && (
                        <span className="text-3xl font-bold text-green-400 shrink-0">
                          {theme.number}
                        </span>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">
                          {theme.title}
                        </h3>
                        {theme.description && (
                          <p className="text-gray-300">{theme.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.closingNote && (
                <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-gray-300 italic">{section.closingNote}</p>
                </div>
              )}

              <SectionNotes sectionId={section.id || `text-${idx}`} blogSlug={slug} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
