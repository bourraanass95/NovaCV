import React from 'react';
import { ResumeData } from '@/src/types';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function DefaultTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, languages, projects } = data;

  return (
    <div className="p-[10mm] min-h-[1122px] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="border-b-4 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            {personalInfo.photo && (
              <div className="w-24 h-24 rounded-lg overflow-hidden ring-4 ring-slate-50 flex-shrink-0">
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.fullName} 
                  className="w-full h-full object-cover" 
                  crossOrigin="anonymous"
                />
              </div>
            )}
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-1 text-slate-900">
                {personalInfo.fullName || "Votre Nom"}
              </h1>
              <p className="text-xl font-black text-indigo-600 uppercase tracking-widest">
                {personalInfo.jobTitle || "Intitulé du poste"}
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] space-y-1 text-slate-500 font-bold uppercase tracking-wider pt-2">
            {personalInfo.email && (
              <div className="flex items-center justify-end gap-2">
                <span>{personalInfo.email}</span>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center justify-end gap-2">
                <span>{personalInfo.phone}</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center justify-end gap-2">
                <span>{personalInfo.location}</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10 flex-1">
        {/* Left Column (Main Content) */}
        <div className="col-span-8 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Profil</h2>
              <p className="text-[13px] leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Expériences</h2>
            <div className="space-y-6">
              {experience.length > 0 ? experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-black text-base text-slate-900">{exp.position}</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                      {exp.startDate} — {exp.current ? "Présent" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-black text-indigo-600 mb-2 uppercase tracking-wide">{exp.company} // {exp.location}</p>
                  <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line border-l-2 border-slate-100 pl-4 py-1">
                    {exp.description}
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 italic">Aucune expérience ajoutée.</p>
              )}
            </div>
          </section>

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Réalisations</h2>
              <div className="grid grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-black text-xs text-slate-900">{proj.name}</h3>
                      {proj.link && <ExternalLink className="w-3 h-3 text-slate-300" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="col-span-4 space-y-8">
          {/* Skills */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3 underline decoration-indigo-600/30 decoration-4 underline-offset-4">Compétences</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.length > 0 ? skills.map((skill, i) => (
                <span key={i} className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                  {skill}
                </span>
              )) : (
                <p className="text-xs text-slate-400 italic">Ajouter des compétences...</p>
              )}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 underline decoration-indigo-600/30 decoration-4 underline-offset-4">Formation</h2>
            <div className="space-y-4">
              {education.length > 0 ? education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                    {edu.startDate} — {edu.current ? "En cours" : edu.endDate}
                  </p>
                  <h3 className="font-black text-xs text-slate-900 leading-tight mb-1">{edu.degree}</h3>
                  <p className="text-[10px] text-indigo-600 font-black uppercase tracking-tight">{edu.school}</p>
                  {edu.location && <p className="text-[9px] text-slate-400 font-bold">{edu.location}</p>}
                </div>
              )) : (
                <p className="text-xs text-slate-400 italic">Ajouter des formations...</p>
              )}
            </div>
          </section>

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3 underline decoration-indigo-600/30 decoration-4 underline-offset-4">Langues</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center group">
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{lang.name}</span>
                    <div className="h-px bg-slate-100 flex-1 mx-2"></div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* Footer / Page Indicator (Visual only) */}
      <div className="mt-auto pt-8 border-t border-slate-50 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">
        Page 1/1 // CV Géneré par IA
      </div>
    </div>
  );
}
