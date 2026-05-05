import React from 'react';
import { ResumeData } from '@/src/types';

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-white w-full min-h-full p-[12mm] text-black font-serif flex flex-col items-stretch overflow-hidden">
      <header className="text-center mb-8 w-full">
        <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-3 text-black border-b-[2px] border-black inline-block px-8 pb-2 border-t-0 border-x-0">
          {personalInfo.fullName || "Votre Nom"}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.1em] text-slate-600 mt-2">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span className="opacity-60 text-slate-300">•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span className="opacity-60 text-slate-300">•</span>}
          {personalInfo.email && <span className="underline decoration-slate-200 underline-offset-4 tracking-normal lowercase font-medium italic">{personalInfo.email}</span>}
        </div>
      </header>

      <div className="space-y-8 w-full flex-1">
        {personalInfo.summary && (
          <section>
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-black mb-3 flex items-center gap-4">
               Profil <div className="h-[1px] flex-1 bg-slate-100"></div>
            </h2>
            <p className="text-[13px] leading-relaxed text-slate-800 italic px-6 border-l-2 border-slate-100">
              {personalInfo.summary}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-black mb-5 flex items-center gap-4">
            Expérience <div className="h-[1px] flex-1 bg-slate-100"></div>
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="w-full">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-base text-black uppercase tracking-tight">{exp.position}</h3>
                  <span className="text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded leading-none">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-widest">{exp.company}</p>
                  <p className="text-[10px] italic text-slate-400 font-sans font-medium">{exp.location}</p>
                </div>
                <p className="text-[12.5px] leading-relaxed whitespace-pre-line text-slate-700 border-l border-slate-50 pl-4">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {projects.length > 0 && (
          <section>
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-black mb-4 flex items-center gap-4">
              Projets <div className="h-px flex-1 bg-slate-100"></div>
            </h2>
            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-slate-50 pl-4">
                  <h3 className="font-bold text-[11px] uppercase mb-1 text-black tracking-wide">{proj.name}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500 italic">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10 pt-2">
          <section>
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-black mb-4 flex items-center gap-4">
              Formation <div className="h-px flex-1 bg-slate-100"></div>
            </h2>
            <div className="space-y-5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[11px] text-black">{edu.degree}</h3>
                    <span className="text-[8px] font-sans font-bold text-slate-400 uppercase tracking-widest">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] italic text-slate-500 font-medium">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-black mb-4 flex items-center gap-4">
              Expertises <div className="h-px flex-1 bg-slate-100"></div>
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1.5 underline underline-offset-4 decoration-2">Compétences</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-[11px] font-bold text-slate-700 tracking-tight leading-none">• {skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[8px] font-sans font-black text-slate-400 uppercase tracking-widest mb-1.5 underline underline-offset-4 decoration-2">Langues</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex gap-2 items-baseline">
                      <span className="text-[11px] font-bold text-slate-700 leading-none">{lang.name}</span>
                      <span className="text-[9px] font-sans italic text-slate-400 uppercase tracking-tighter leading-none">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <footer className="mt-auto pt-10 text-center">
        <p className="text-[8px] font-sans font-black text-slate-200 uppercase tracking-[0.5em]">
          Page 1/1 // CV Classique
        </p>
      </footer>
    </div>
  );
}
