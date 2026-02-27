'use client';

import { BlogContent } from '@/lib/blogs';

type ArticleContentProps = {
  content: BlogContent;
};

export default function ArticleContent({ content }: ArticleContentProps) {
  const { sections = [], introduction } = content;

  return (
    <div className="space-y-8">
      {introduction && (
        <div className="text-lg text-gray-300 leading-relaxed mb-12">
          {introduction}
        </div>
      )}

      {sections.map((section: any, idx: number) => {
        if (section.type === 'info-box') {
          return (
            <div key={section.id || idx} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-blue-400">
                {section.title}
              </h2>
              
              {section.profiles && (
                <div className="space-y-4">
                  {section.profiles.map((profile: any, pIdx: number) => (
                    <div key={pIdx} className="border-l-4 border-gray-600 pl-4">
                      <h3 className="font-semibold text-white mb-1">{profile.title}</h3>
                      <p className="text-gray-300">{profile.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item: string, iIdx: number) => (
                    <li key={iIdx} className="text-gray-300 flex gap-2">
                      <span className="text-blue-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        if (section.type === 'text-section') {
          return (
            <div key={section.id || idx} className="space-y-6">
              <h2 className="text-3xl font-bold text-white border-b border-gray-800 pb-3">
                {section.title}
              </h2>

              {section.steps && section.steps.map((step: any, sIdx: number) => (
                <div key={sIdx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    {step.stepNumber && (
                      <span className="text-3xl font-bold text-blue-400 shrink-0">
                        {step.stepNumber}
                      </span>
                    )}
                    <div className="flex-1 space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      
                      {step.content && (
                        <p className="text-gray-300 leading-relaxed">{step.content}</p>
                      )}

                      {step.listItems && step.listItems.length > 0 && (
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {step.listItems.map((item: string, liIdx: number) => (
                            <li key={liIdx}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {step.questions && (
                        <div className="space-y-3 mt-4">
                          {step.questions.map((q: any, qIdx: number) => (
                            <div key={qIdx} className="bg-gray-800/50 p-4 rounded">
                              <p className="font-semibold text-blue-300 mb-2">{q.question}</p>
                              {q.guidance && (
                                <p className="text-sm text-gray-400">{q.guidance}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {step.callout && (
                        <div className={`border-l-4 p-4 rounded ${
                          step.callout.type === 'warning' 
                            ? 'bg-yellow-500/10 border-yellow-500' 
                            : step.callout.type === 'success'
                            ? 'bg-green-500/10 border-green-500'
                            : 'bg-blue-500/10 border-blue-500'
                        }`}>
                          <p className={`font-semibold mb-2 ${
                            step.callout.type === 'warning'
                              ? 'text-yellow-400'
                              : step.callout.type === 'success'
                              ? 'text-green-400'
                              : 'text-blue-400'
                          }`}>
                            {step.callout.title}
                          </p>
                          <p className="text-gray-300">{step.callout.content}</p>
                        </div>
                      )}

                      {step.seniority && (
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded p-4 space-y-2">
                          <p className="text-sm font-semibold text-purple-400">Seniority Expectations:</p>
                          {step.seniority.junior && (
                            <p className="text-sm text-gray-300"><span className="font-semibold">Junior:</span> {step.seniority.junior}</p>
                          )}
                          {step.seniority.senior && (
                            <p className="text-sm text-gray-300"><span className="font-semibold">Senior:</span> {step.seniority.senior}</p>
                          )}
                        </div>
                      )}

                      {step.contexts && (
                        <div className="space-y-2 mt-4">
                          {step.contexts.map((ctx: any, cIdx: number) => (
                            <div key={cIdx} className="bg-gray-800/50 p-3 rounded">
                              <p className="text-sm font-semibold text-blue-300 capitalize">{ctx.type.replace('-', ' ')}:</p>
                              <p className="text-sm text-gray-300 mt-1">{ctx.expectation}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.additionalContent && (
                        <p className="text-sm text-gray-400 italic">{step.additionalContent}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {section.subsections && section.subsections.map((sub: any, subIdx: number) => (
                <div key={subIdx} className="pl-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white">{sub.title}</h3>
                  {sub.content && <p className="text-gray-300">{sub.content}</p>}
                  {sub.listItems && (
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {sub.listItems.map((item: string, liIdx: number) => (
                        <li key={liIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
