'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function BlogPost() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <article className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm mb-4">
              Career
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              How to get a job in a Tech Field Remote
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>February 10, 2026</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="text-gray-300 leading-relaxed space-y-6">
            <p className="text-xl text-gray-400 mb-8">
              Landing a remote tech job requires a strategic approach tailored to your background. Here&apos;s a comprehensive guide based on three common resume profiles.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Understanding Your Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Resume 1: Technical Professional</h3>
                  <p className="text-gray-400">
                    You&apos;re a technically capable person (Engineer, Designer) who has been in the tech space for quite some time and has worked in a role that allowed you to contribute to tech projects.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Resume 2: Non-Technical Manager</h3>
                  <p className="text-gray-400">
                    You&apos;re a non-technical person but have significant experience as a manager or operations personnel.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Resume 3: Career Starter</h3>
                  <p className="text-gray-400">
                    No experience, doesn&apos;t know anything about technology but is willing to learn.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Path for Technical Professionals (Resume 1)</h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 1: Build Your Resume</h3>
                <p>Build a resume using a template from canva.com. Choose a clean, professional design that highlights your technical skills and achievements.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 2: Optimize Your LinkedIn Profile</h3>
                <p>Build your linkedin.com profile. Ensure it&apos;s comprehensive, professional, and mirrors your resume while adding more personality and detail.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 3: Set Up Job Search Filters</h3>
                <p>Adjust your LinkedIn search to suggest jobs that fit your resume. For example, if you are a database engineer, you can search for jobs related to that field such as:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-400 mt-3">
                  <li>Data Scientist</li>
                  <li>Data Analyst</li>
                  <li>Data Platform Engineer</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 4: Research and Document Requirements</h3>
                <p>Scan through the list of job postings and keep a note of the job requirements. Save the job circulars that interest you for detailed analysis.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 5: Tailor Your Resume (Critical Step)</h3>
                <p>Use ChatGPT to readjust your CV so that it fits the requirements for each job. For example, if the job requirement says &quot;we need someone who has worked with scalable solutions,&quot; you need to insert a line or two that reflects your experience in working with scalable solutions.</p>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300 font-medium">Important Note:</p>
                  <p className="text-gray-400 mt-2">
                    Step 5 is a repetitive process. It takes weeks and months to perfect it. You might end up with 5-10 different versions of your CV, all saying the same thing but catered to different job requirements. Also include points on how your work improved business processes.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 6: Prepare for First Round Interviews</h3>
                <p>Once you have applied to a significant number of jobs, there is a 5% chance that one of them will ask you to come in for the first round of interview. It&apos;s very important that you have answers to the following questions:</p>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Why should we hire you?</h4>
                    <p className="text-gray-400 text-sm">Prepare a compelling answer that highlights your unique value proposition.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">What are some of the biggest problems you solved in one of your previous projects?</h4>
                    <p className="text-gray-400 text-sm">Have specific examples ready with measurable outcomes.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">How do you work with someone who is difficult to work with?</h4>
                    <p className="text-gray-400 text-sm">Show emotional intelligence and conflict resolution skills.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">What&apos;s your plan for the next 5 years?</h4>
                    <p className="text-gray-400 text-sm">Demonstrate ambition aligned with the company&apos;s growth trajectory.</p>
                  </div>
                </div>

                <p className="mt-4">These questions come in different shapes or forms from the interviewer, but having clear answers written in a notepad will help you rearrange them during the interview.</p>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                  <p className="text-blue-300 font-medium">Pro Tip:</p>
                  <p className="text-gray-400 mt-2">
                    Set up mock interviews with a fellow colleague if you have performance anxiety or stage fright. Write down keywords on a piece of paper in case you have a tough time remembering.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 7: Master the Technical Round</h3>
                <p>Prepare for the technical round. This will vary based on the job you have applied for. Some good places to prepare for this round are:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-400 mt-3">
                  <li>turing.com</li>
                  <li>&apos;Mock technical interview&apos; videos on YouTube</li>
                </ul>
                
                <p className="mt-4">9 out of 10 times, the questions published online are similar to what the interviewer will ask you.</p>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
                  <p className="text-white font-medium mb-3">Understanding Seniority Levels:</p>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-400 font-medium">Junior Role:</span>
                      <p className="text-gray-400 text-sm mt-1">You would need to know what databases are used for in an application.</p>
                    </div>
                    <div>
                      <span className="text-blue-400 font-medium">Senior Role:</span>
                      <p className="text-gray-400 text-sm mt-1">You would be asked which database is more suitable for a Weather forecast website. The more senior the role, the more you&apos;re expected to give answers based on context rather than straightforward answers.</p>
                    </div>
                  </div>
                </div>

                <p className="mt-4">If it&apos;s for a more senior position, practice scenario-based questions that imitate real life.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Step 8 (Optional): The CEO Round</h3>
                <p>This is usually an interview with a CEO if you are applying for a high-stakes role. Here you will be asked management-related questions and your people skills will be assessed.</p>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 font-medium">Golden Rule:</p>
                  <p className="text-gray-400 mt-2">
                    Be as honest as you can. No amount of strategy will get you through this round. You have to appear valuable for the company.
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-white font-medium">If it&apos;s a startup:</span>
                    <p className="text-gray-400 text-sm mt-1">The CEO would expect you to work day in and day out without looking at the clock.</p>
                  </div>
                  <div>
                    <span className="text-white font-medium">If it&apos;s an established company:</span>
                    <p className="text-gray-400 text-sm mt-1">The CEO would want to see your fire-fighting and commanding skills.</p>
                  </div>
                  <div>
                    <span className="text-white font-medium">If it&apos;s a 100% technical role:</span>
                    <p className="text-gray-400 text-sm mt-1">The CEO would want to see how obsessed you are with your craft.</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-8 mt-12">
              <h2 className="text-3xl font-bold text-white mb-6">Alternative Paths</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">For Non-Technical Managers (Resume 2)</h3>
                  <p>If you are a person of Resume 2, it&apos;s best to apply for positions such as:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-400 mt-3">
                    <li>Product Lead</li>
                    <li>Engineering Manager</li>
                    <li>Operations Head</li>
                    <li>Technical Recruiter</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">For Career Starters (Resume 3)</h3>
                  <p>If you are a person of Resume 3, it&apos;s best to join a bootcamp or similar network to get some footing into the tech field. This will provide you with:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-gray-400 mt-3">
                    <li>Structured learning path</li>
                    <li>Hands-on project experience</li>
                    <li>Networking opportunities</li>
                    <li>Career support and mentorship</li>
                  </ul>
                </section>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mt-12">
              <h3 className="text-xl font-bold text-green-400 mb-3">Key Takeaways</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Tailor your resume for each application</li>
                <li>✓ Practice common interview questions extensively</li>
                <li>✓ Prepare for technical rounds with online resources</li>
                <li>✓ Be honest and authentic in CEO/leadership interviews</li>
                <li>✓ Consider your profile when choosing which roles to apply for</li>
                <li>✓ Persistence is key - the process takes time</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}
