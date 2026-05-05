import React from 'react';
import { ResumeData } from '@/src/types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Box, Layers, Zap } from 'lucide-react';

export default function DesignTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-white w-full min-h-full text-black font-sans flex flex-col antialiased overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Massive Bold Header (Swiss Style) */}
        <header className="px-10 pt-10">
          <div className="flex justify-between items-start border-b-[12px] border-black pb-8">
            <div className="max-w-[75%]">
              <h1 className="text-[72px] font-black leading-[0.85] tracking-tighter uppercase mb-4">
                {personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : "NOM"}<br />
                <span className="text-slate-100">{personalInfo.fullName && personalInfo.fullName.includes(' ') ? personalInfo.fullName.split(' ')[1] : "PRÉNOM"}</span>
              </h1>
              <p className="text-2xl font-black uppercase tracking-tight text-indigo-600">
                {personalInfo.jobTitle || "DESIGNER"}
              </p>
            </div>
            
            <div className="flex flex-col items-end pt-2">
              {personalInfo.photo && (
                <div className="w-28 h-28 bg-black overflow-hidden mb-4 rounded-sm">
                  <img 
                    src={personalInfo.photo} 
                    alt={personalInfo.fullName} 
                    className="w-full h-full object-cover grayscale contrast-125" 
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <div className="space-y-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 text-right">
                <div>{personalInfo.email}</div>
                <div>{personalInfo.phone}</div>
                <div>{personalInfo.location}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-0 flex-1">
          {/* Main Content Pane */}
          <div className="col-span-8 p-10 space-y-12 border-r-[1px] border-black">
            {personalInfo.summary && (
              <section>
                <p className="text-lg font-black leading-tight tracking-tight uppercase">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                <Box className="w-3.5 h-3.5" /> Expérience
              </h2>
              <div className="space-y-10">
                {experience.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex gap-6">
                      <div className="w-24 shrink-0 text-[10px] font-black text-slate-200 uppercase tracking-widest pt-1">
                        {exp.startDate} <br /> — <br /> {exp.endDate}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 group-hover:text-indigo-600">
                          {exp.position}
                        </h3>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">
                          {exp.company} // {exp.location}
                        </p>
                        <p className="text-base leading-snug font-medium text-slate-700 border-l-[3px] border-black pl-6 italic">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {projects.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                  <Layers className="w-3.5 h-3.5" /> Projets
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  {projects.map((proj) => (
                    <div key={proj.id} className="border-t-[3px] border-black pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-black uppercase tracking-tight">{proj.name}</h3>
                        {proj.link && <ExternalLink className="w-3.5 h-3.5" />}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase leading-snug">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Pane */}
          <div className="col-span-4 bg-slate-50/50 p-10 space-y-12">
            <section>
              <h2 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                <Zap className="w-3.5 h-3.5" /> Core_Expertise
              </h2>
              <div className="flex flex-col gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="h-[2px] bg-black flex-1"></div>
                    <span className="text-[15px] font-black uppercase tracking-tighter leading-none">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8">Education</h2>
              <div className="space-y-8">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">{edu.startDate} — {edu.endDate}</p>
                    <h3 className="text-lg font-black uppercase tracking-tight leading-tight mb-1">{edu.degree}</h3>
                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest leading-none">{edu.school}</p>
                  </div>
                ))}
              </div>
            </section>

            {languages.length > 0 && (
              <section>
                <h2 className="text-[9px] font-black uppercase tracking-[0.5em] mb-8">Langues</h2>
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-baseline border-b border-slate-200 pb-1.5">
                      <span className="text-base font-black uppercase tracking-tighter leading-none">{lang.name}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-black text-white p-4 text-[9px] font-black uppercase tracking-[1em] text-center">
        Page 1/1 // Design // 2024
      </footer>
    </div>
  );
}
