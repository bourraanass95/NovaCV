import React from 'react';
import { ResumeData } from '@/src/types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, GraduationCap, Heart } from 'lucide-react';

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects, interests } = data;

  return (
    <div className="bg-white w-full min-h-full p-[10mm] text-slate-900 font-sans flex flex-col overflow-hidden">
      <header className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-end">
        <div className="flex items-center gap-6">
            {personalInfo.photo ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-100 flex-shrink-0 shadow-md">
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.fullName} 
                  className="w-full h-full object-cover" 
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
            <div className="w-24 h-24 rounded-2xl bg-indigo-50 flex items-center justify-center border-2 border-indigo-100 flex-shrink-0">
              <Mail className="w-8 h-8 text-indigo-200" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-display font-black uppercase tracking-tighter text-slate-900 leading-none">
              {personalInfo.fullName || "Votre Nom"}
            </h1>
            <p className="text-xl font-bold text-indigo-600 uppercase tracking-widest mt-2 bg-indigo-50 inline-block px-3 py-1 rounded-lg">
              {personalInfo.jobTitle || "Intitulé du poste"}
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] space-y-1.5 text-slate-500 font-black uppercase tracking-widest leading-none pb-1">
          {personalInfo.email && <div className="flex items-center justify-end gap-2">{personalInfo.email} <Mail className="w-3 h-3 text-indigo-400" /></div>}
          {personalInfo.phone && <div className="flex items-center justify-end gap-2">{personalInfo.phone} <Phone className="w-3 h-3 text-indigo-400" /></div>}
          {personalInfo.location && <div className="flex items-center justify-end gap-2">{personalInfo.location} <MapPin className="w-3 h-3 text-indigo-400" /></div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        <div className="col-span-8 space-y-8">
          {personalInfo.summary && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span> À propos
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 font-medium border-l-4 border-indigo-50 pl-4 py-0.5 italic">
                {personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span> Expériences
            </h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{exp.position}</h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-wide">{exp.company}</p>
                    <span className="w-1 h-1 bg-indigo-200 rounded-full"></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{exp.location}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line border-l border-slate-100 pl-4 font-medium">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {projects.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-600 rounded-full"></span> Projets
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm text-slate-900">{proj.name}</h3>
                      {proj.link && <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10">
          <section className="bg-slate-50/30 p-5 rounded-3xl border border-slate-50 shadow-sm shadow-indigo-100/10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
              <Code className="w-3.5 h-3.5" /> Expertise
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill} className="text-[10px] bg-white px-2.5 py-1.5 rounded-lg font-bold text-slate-700 shadow-sm border border-slate-100/30">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Formation
            </h2>
            <div className="space-y-5">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l border-indigo-100">
                  <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-indigo-200"></div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    {edu.startDate} — {edu.endDate}
                  </p>
                  <h3 className="font-bold text-xs text-slate-900 leading-tight mb-0.5">{edu.degree}</h3>
                  <p className="text-[9px] text-indigo-600 font-black uppercase tracking-wide">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>

          {languages.length > 0 && (
            <section className="px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Langues
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-black text-slate-700 tracking-tight">{lang.name}</span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {interests.length > 0 && (
            <section className="px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5" /> Intérêts
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span key={i} className="text-[9px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-bold uppercase tracking-tight">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="mt-auto pt-6 text-[8px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">
        Page 1/1 // CV Moderne
      </div>
    </div>
  );
}
