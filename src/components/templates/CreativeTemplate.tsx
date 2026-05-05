import React from 'react';
import { ResumeData } from '@/src/types';

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-slate-900 w-full min-h-full text-white font-sans flex overflow-hidden">
      {/* Sidebar - Bold Indigo Rail */}
      <div className="w-[33%] bg-indigo-600 p-8 flex flex-col relative">
        <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500 rounded-bl-[4rem] opacity-50"></div>
        
        {personalInfo.photo && (
          <div className="relative z-10 w-full aspect-square rounded-[1.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl mb-8 transform rotate-2">
             <img 
               src={personalInfo.photo} 
               alt={personalInfo.fullName} 
               className="w-full h-full object-cover -rotate-2 scale-110" 
               crossOrigin="anonymous"
             />
          </div>
        )}

        <div className="relative z-10 mb-8">
          <h1 className="text-3xl font-black uppercase leading-[0.85] mb-3 tracking-tighter">
            {personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : 'VOTRE'}<br />
            <span className="text-slate-900">{personalInfo.fullName ? personalInfo.fullName.split(' ').slice(1).join(' ') : 'NOM'}</span>
          </h1>
          <div className="h-1 w-10 bg-slate-900 mb-3"></div>
          <p className="text-[11px] font-black text-indigo-100 uppercase tracking-[0.2em] leading-tight opacity-90">
            {personalInfo.jobTitle}
          </p>
        </div>

        <div className="space-y-8 flex-1 relative z-10">
          <section>
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-px bg-indigo-900"></span> Contact
            </h2>
            <div className="space-y-2 text-[10px] font-black text-indigo-50">
              {personalInfo.email && <p className="break-all opacity-80">{personalInfo.email}</p>}
              {personalInfo.phone && <p className="opacity-80">{personalInfo.phone}</p>}
              {personalInfo.location && <p className="opacity-80">{personalInfo.location}</p>}
            </div>
          </section>

          <section>
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-px bg-indigo-900"></span> Expertise
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="text-[9px] bg-slate-900/20 px-2 py-1 rounded border border-indigo-500/30 font-black uppercase tracking-wider text-white italic whitespace-nowrap">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-px bg-indigo-900"></span> Langues
            </h2>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                    <span className="text-[8px] font-black text-indigo-900 opacity-60">{lang.level}</span>
                  </div>
                  <div className="w-full h-1 bg-indigo-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 group-hover:bg-white transition-colors duration-500" 
                      style={{ width: lang.level.includes('C') ? '95%' : lang.level.includes('B') ? '75%' : '45%' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Main Content - Clean Typography */}
      <div className="flex-1 p-12 bg-white text-slate-900 relative">
        <div className="max-w-xl space-y-12">
          <section className="relative">
            <span className="absolute -left-10 -top-4 text-6xl font-serif text-indigo-50 leading-none pointer-events-none opacity-50">"</span>
            <h2 className="text-xl font-black uppercase tracking-tighter mb-4 text-slate-100">À propos</h2>
            <p className="text-[13px] leading-relaxed text-slate-700 font-bold tracking-tight italic border-l-2 border-indigo-50 pl-4 py-1">
              {personalInfo.summary}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-indigo-600">Expériences</h2>
              <div className="h-px flex-1 bg-indigo-50"></div>
            </div>
            <div className="space-y-10">
              {experience.map((exp) => (
                <div key={exp.id} className="group relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-base uppercase tracking-tight group-hover:text-indigo-600 transition-colors mb-0.5">{exp.position}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{exp.company} // {exp.location}</p>
                    </div>
                    <span className="text-[9px] font-black text-white bg-slate-900 px-2.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed font-medium pl-4 border-l border-indigo-50">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-indigo-600">Projets</h2>
                <div className="h-px flex-1 bg-indigo-50"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="group">
                    <h3 className="font-black text-[11px] uppercase tracking-widest mb-2 border-b border-slate-100 pb-1 group-hover:border-indigo-600 transition-all">{proj.name}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-indigo-600">Formation</h2>
              <div className="h-px flex-1 bg-indigo-50"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-indigo-600 uppercase mb-2 tracking-widest leading-none">
                    {edu.startDate} — {edu.endDate}
                  </p>
                  <h3 className="font-black text-xs mb-1 leading-tight tracking-tight">{edu.degree}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="absolute bottom-6 right-12 text-[8px] font-black text-slate-200 uppercase tracking-[0.5em]">
          Page 1/1 // CV Créatif
        </div>
      </div>
    </div>
  );
}
