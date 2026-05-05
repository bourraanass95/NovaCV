import React from 'react';
import { ResumeData } from '@/src/types';
import { Mail, Phone, MapPin, Globe, Laptop, Terminal, Cpu, Database, Link as LinkIcon } from 'lucide-react';

export default function TechTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-[#0f172a] w-full min-h-full p-[8mm] text-slate-300 font-mono flex flex-col border-[8px] border-[#1e293b] overflow-hidden">
      <header className="mb-6 p-5 bg-[#1e293b] rounded-sm border-l-4 border-indigo-500 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <Terminal className="w-32 h-32" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tighter">
              &gt; {personalInfo.fullName || "USER_ID"}
            </h1>
            <p className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
              <span className="animate-pulse">_</span> {personalInfo.jobTitle || "SOFTWARE_ENGINEER"}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] uppercase font-bold text-slate-500">
              {personalInfo.email && <div className="flex items-center gap-2 underline decoration-indigo-500/30 underline-offset-4">{personalInfo.email}</div>}
              {personalInfo.phone && <div className="flex items-center gap-2">{personalInfo.phone}</div>}
              {personalInfo.location && <div className="flex items-center gap-2">{personalInfo.location}</div>}
            </div>
          </div>
          {personalInfo.photo && (
            <div className="w-20 h-20 bg-slate-800 rounded-sm overflow-hidden p-1 border border-slate-700">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover grayscale opacity-80" 
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Sidebar */}
        <aside className="col-span-4 space-y-6">
          <section className="bg-[#1e293b]/50 p-4 rounded-sm border border-slate-800">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Core_Stack
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded-xs border border-slate-700 text-slate-400">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="p-2">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Database className="w-3 h-3" /> Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="border-l border-slate-700 pl-3">
                  <h3 className="font-bold text-[10px] text-white leading-tight">{edu.degree}</h3>
                  <p className="text-[9px] text-slate-500">{edu.school}</p>
                  <p className="text-[8px] text-indigo-400 mt-0.5">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>

          {languages.length > 0 && (
            <section className="p-2">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                Languages
              </h2>
              <div className="space-y-1.5">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-[9px]">
                    <span className="font-bold">{lang.name}</span>
                    <span className="text-slate-500 font-bold">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Main */}
        <main className="col-span-8 space-y-8">
          {personalInfo.summary && (
            <section>
              <h2 className="text-[9px] font-black text-white bg-indigo-600 px-2 py-0.5 inline-block uppercase tracking-widest mb-3">
                $ cat profile.txt
              </h2>
              <p className="text-[12px] leading-relaxed text-slate-400">
                {personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-[9px] font-black text-white bg-slate-700 px-2 py-0.5 inline-block uppercase tracking-widest mb-4">
              $ ls experience/
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-black text-indigo-400 tracking-tighter"># {exp.position}</h3>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">{exp.startDate} :: {exp.current ? "HEAD" : exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-bold text-white mb-2">@ {exp.company}</p>
                  <p className="text-[12px] leading-relaxed text-slate-400 border-l border-slate-800 pl-4 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {projects.length > 0 && (
            <section>
              <h2 className="text-[9px] font-black text-white bg-slate-700 px-2 py-0.5 inline-block uppercase tracking-widest mb-4">
                $ ls projects/
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-800/30 rounded-sm border border-slate-800 group hover:border-indigo-500 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[10px] text-white group-hover:text-indigo-400">{proj.name}</h3>
                      {proj.link && <LinkIcon className="w-2.5 h-2.5 text-slate-500" />}
                    </div>
                    <p className="text-[9px] text-slate-600 leading-relaxed italic">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      
      <footer className="mt-auto pt-4 border-t border-slate-800 text-center">
        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">
           v2.1.0 // PAGE_1_OF_1 // {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
