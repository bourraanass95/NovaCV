import React from 'react';
import { ResumeData } from '@/src/types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Award, BookOpen, Briefcase, GraduationCap, Laptop } from 'lucide-react';

export default function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-[#fdfcfb] w-full min-h-full p-[12mm] text-slate-800 font-serif flex flex-col items-stretch overflow-hidden">
      {/* Name and Title */}
      <header className="text-center mb-10 border-b-[1px] border-slate-200 pb-8 relative w-full">
        <div className="absolute left-0 top-0 opacity-5">
          <Award className="w-16 h-16 text-slate-900" />
        </div>
        
        {personalInfo.photo && (
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover" 
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl font-display font-light uppercase tracking-[0.25em] text-slate-900 mb-3 px-4">
          {personalInfo.fullName || "Votre Nom"}
        </h1>
        <p className="text-lg italic text-slate-500 font-medium tracking-widest uppercase text-xs">
          {personalInfo.jobTitle || "Intitulé du poste"}
        </p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-slate-400">
          {personalInfo.email && <div className="flex items-center gap-2 underline decoration-slate-200 underline-offset-4 lowercase font-medium tracking-normal text-[11px]">{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-2">{personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-2">{personalInfo.location}</div>}
        </div>
      </header>

      <div className="space-y-12 w-full flex-1">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="max-w-3xl mx-auto text-center italic text-base leading-relaxed text-slate-600 px-6">
            "{personalInfo.summary}"
          </section>
        )}

        <div className="grid grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="col-span-8 space-y-10">
            {/* Experience */}
            <section>
              <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-slate-900 mb-5 border-b border-slate-50 pb-2 flex items-center gap-3">
                <Briefcase className="w-3.5 h-3.5 text-slate-300" /> Parcours
              </h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-5 border-l-2 border-slate-50">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-200"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 mb-2">{exp.company} // {exp.location}</p>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line font-medium italic">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-slate-900 mb-5 border-b border-slate-50 pb-2 flex items-center gap-3">
                  <Laptop className="w-3.5 h-3.5 text-slate-300" /> Réalisations
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-indigo-900 text-xs">{proj.name}</h3>
                        {proj.link && <ExternalLink className="w-3 h-3 text-slate-300" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-10">
            {/* Skills */}
            <section>
              <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-slate-900 mb-5 border-b border-slate-50 pb-2">
                Expertises
              </h2>
              <div className="space-y-2.5">
                {skills.map((skill, i) => (
                  <div key={skill} className="flex items-center gap-3">
                    <span className="w-1 h-3 bg-slate-100"></span>
                    <span className="text-[13px] font-medium text-slate-700 leading-none">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-slate-900 mb-5 border-b border-slate-50 pb-2">
                Formation
              </h2>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      {edu.startDate} — {edu.endDate}
                    </p>
                    <h3 className="font-bold text-xs text-slate-900 leading-snug">{edu.degree}</h3>
                    <p className="text-[10px] italic text-slate-500 mt-0.5">{edu.school}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-slate-900 mb-5 border-b border-slate-50 pb-2">
                  Langues
                </h2>
                <div className="space-y-2.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-end border-b border-slate-50 pb-1.5">
                      <span className="text-xs font-bold text-slate-800 tracking-tight leading-none">{lang.name}</span>
                      <span className="text-[9px] font-sans font-bold text-slate-300 uppercase tracking-tighter leading-none">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-auto pt-10 text-center">
        <p className="text-[8px] font-sans font-bold text-slate-200 uppercase tracking-[0.5em]">
          Dossier de candidature // Page 1/1
        </p>
      </footer>
    </div>
  );
}
