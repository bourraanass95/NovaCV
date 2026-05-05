import React from 'react';
import { ResumeData } from '@/src/types';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export default function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-white w-full min-h-full p-[10mm] text-[#1a1a1a] font-sans flex flex-col overflow-hidden">
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-[65%]">
          <h1 className="text-4xl font-black tracking-tighter mb-1 text-black">
            {personalInfo.fullName || "Votre Nom"}
          </h1>
          <p className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-[0.2em]">
            {personalInfo.jobTitle || "Intitulé du poste"}
          </p>
          <p className="text-[13px] leading-relaxed text-slate-600 font-medium whitespace-pre-line border-l border-slate-100 pl-4 py-0.5">
            {personalInfo.summary}
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end gap-4 pt-2">
          {personalInfo.photo && (
            <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale contrast-125 mb-1 shadow-sm">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover" 
                crossOrigin="anonymous"
              />
            </div>
          )}
          <div className="space-y-0.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {personalInfo.email && <div className="flex items-center justify-end gap-2">{personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center justify-end gap-2">{personalInfo.phone}</div>}
            {personalInfo.location && <div className="flex items-center justify-end gap-2">{personalInfo.location}</div>}
          </div>
        </div>
      </div>

      <div className="space-y-10 flex-1">
        {/* Experience */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 border-b border-slate-50 pb-2">
            Expériences
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-5 gap-6">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1.5 align-top">
                  {exp.startDate} <br/> — <br/> {exp.current ? "Present" : exp.endDate}
                </div>
                <div className="col-span-4">
                  <h3 className="text-base font-black text-slate-900 mb-0.5">{exp.position}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-wide">{exp.company}</span>
                    {exp.location && <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">• {exp.location}</span>}
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-600 font-medium whitespace-pre-line px-2 border-l border-slate-50">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* Education */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 border-b border-slate-50 pb-2">
                Formation
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-black text-[11px] text-slate-900 mb-0.5 leading-tight">{edu.degree}</h3>
                    <p className="text-[10px] font-bold text-slate-500 mb-1 tracking-tight">{edu.school}</p>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
                      {edu.startDate} — {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 border-b border-slate-50 pb-2">
                  Langues
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex gap-2 items-baseline">
                      <span className="text-xs font-black text-slate-900">{lang.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Skills */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 border-b border-slate-50 pb-2">
                Compétences
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 border-b border-slate-50 pb-2">
                  Projets
                </h2>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-black text-[11px] text-slate-900">{proj.name}</h3>
                        {proj.link && <ExternalLink className="w-3 h-3 text-slate-300" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight font-medium italic">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-6 text-[8px] font-black text-slate-200 uppercase tracking-[0.4em] text-center">
        Page 1/1 // CV Minimaliste
      </div>
    </div>
  );
}
