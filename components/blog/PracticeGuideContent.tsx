'use client';

import { BlogContent } from '@/lib/blogs';

type PracticeGuideContentProps = {
  content: BlogContent;
};

export default function PracticeGuideContent({ content }: PracticeGuideContentProps) {
  const { parts = [], introduction, instructions } = content;

  return (
    <div className="space-y-8">
      {introduction && (
        <div className="text-lg text-gray-300 leading-relaxed mb-12">
          {introduction}
        </div>
      )}

      {instructions && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">
            {instructions.title || 'Instructions'}
          </h3>
          <p className="text-gray-300">{instructions.text}</p>
        </div>
      )}

      {parts.map((part: any, idx: number) => (
        <div key={part.id || idx} className="space-y-6">
          <h2 className="text-3xl font-bold text-white border-b border-gray-800 pb-3">
            {part.title}
          </h2>

          {part.steps?.map((step: any, stepIdx: number) => (
            <div key={stepIdx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">
                {step.title}
              </h3>
              
              <div className="text-gray-300 leading-relaxed space-y-4">
                {step.content && <p>{step.content}</p>}
                
                {step.interviewAngle && (
                  <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm font-semibold text-purple-300 mb-2">Interview Angle:</p>
                    <p className="text-gray-300">{step.interviewAngle}</p>
                  </div>
                )}

                {step.listItems && step.listItems.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {step.listItems.map((item: string, liIdx: number) => (
                      <li key={liIdx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
