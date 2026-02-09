'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
}

const experiences: ExperienceItem[] = [
  {
    title: 'Engineering Manager',
    company: 'Daniyal Technologies',
    period: 'June 2025 - Present',
    description: [
      'Leading engineering teams and driving technical strategy',
      'Establishing best practices and development processes',
      'Mentoring engineers and fostering team growth',
      'Collaborating with stakeholders to deliver innovative solutions'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes']
  },
  {
    title: 'Senior Software Engineer & Mentor',
    company: 'Codeworks',
    period: 'June 2022 - June 2025',
    description: [
      'Mentored aspiring developers through intensive software engineering bootcamp',
      'Architected and built scalable full-stack applications',
      'Conducted technical interviews and curriculum development',
      'Led workshops on advanced JavaScript, React, and system design'
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'GraphQL', 'AWS']
  },
  {
    title: 'Founder & Software Engineer',
    company: 'Astronaut Digital',
    period: 'June 2019 - June 2022',
    description: [
      'Founded and built digital products from concept to launch',
      'Developed full-stack web applications and mobile solutions',
      'Managed client relationships and project delivery',
      'Built scalable infrastructure and optimized performance'
    ],
    technologies: ['JavaScript', 'React', 'React Native', 'Node.js', 'Express', 'MongoDB', 'Firebase']
  }
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Experience
          </h2>
          <p className="text-gray-400 text-lg">6+ years of building and leading engineering teams</p>
        </motion.div>

        <div ref={ref} className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-xl text-blue-400 mb-2">{exp.company}</p>
                  </div>
                  <span className="text-gray-400 font-medium">{exp.period}</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.2 + i * 0.05 }}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
