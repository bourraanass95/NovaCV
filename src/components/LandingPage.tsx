import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { 
  FileText, Sparkles, Target, Zap, CheckCircle, 
  ArrowRight, X, ChevronRight, BarChart3, ShieldCheck, 
  Search, Users, Trophy
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onSelectPlan: (plan: 'pro' | 'single') => void;
}

const Marquee = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden whitespace-nowrap bg-indigo-600/5 py-4 border-y border-indigo-100">
    <motion.div
      animate={{ x: [0, -1000] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="inline-block"
    >
      <div className="flex gap-20 items-center px-10">
        {children}
        {children}
      </div>
    </motion.div>
  </div>
);

export default function LandingPage({ onStart, onLogin }: LandingPageProps) {
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] py-2 text-center">
        Propulsé par Gemini 1.5 Pro & conçu pour le marché français
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-indigo-600 p-2 rounded-xl transition-transform group-hover:rotate-12">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">NovaCV</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-[11px]">Fonctionnalités</a>
            <a href="#templates" className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-[11px]">Modèles</a>
            <a href="#market" className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-[11px]">Expertise</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors uppercase tracking-wider text-[11px]">Tarifs</a>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onLogin} 
              className="hidden sm:block text-slate-500 hover:text-indigo-600 font-bold uppercase tracking-wider text-[11px]"
            >
              Se connecter
            </Button>
            <Button onClick={onStart} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-full px-8 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100">
              Commencer
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                IA générative premium
              </span>
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
              Votre prochain job commence <span className="text-indigo-600">ici.</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
              Oubliez les CV génériques. Obtenez un dossier de candidature optimisé pour les recruteurs français, propulsé par l'IA la plus avancée du marché.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button onClick={onStart} size="lg" className="bg-indigo-600 hover:bg-slate-900 text-white rounded-full px-10 h-16 text-lg font-bold group shadow-2xl shadow-indigo-200 w-full sm:w-auto">
                Créer mon CV gratuit
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 ring-4 ring-white text-[10px] font-bold text-slate-600">
                  +2k
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Utilisateurs actifs</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="relative z-10 bg-white rounded-3xl p-3 shadow-[0_40px_100px_-20px_rgba(79,70,229,0.2)] border border-slate-100">
              <div className="bg-slate-950 rounded-2xl p-2 overflow-hidden aspect-[1.2/1] relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent z-10" />
                 <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200&h=800" 
                  alt="Professional CV Builder" 
                  className="rounded-xl w-full h-full object-cover opacity-90"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
            
            {/* Real-time stats bubble */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-12 -right-12 z-20 bg-white p-5 rounded-3xl shadow-2xl border border-slate-50 max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Score ATS</div>
                  <div className="text-xl font-display font-black text-slate-800">98%</div>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full mb-1">
                <div className="h-1 w-[98%] bg-green-500 rounded-full" />
              </div>
              <p className="text-[9px] font-bold text-slate-400">Optimisé pour la France</p>
            </motion.div>

            {/* Float tags */}
            <div className="absolute -bottom-8 left-12 z-20 bg-slate-900 text-white py-3 px-6 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest italic">Analyse en direct...</span>
            </div>
          </motion.div>
        </div>

        {/* Backdrop Grid */}
        <div className="absolute inset-x-0 top-0 -z-10 h-full w-full bg-[#FAFAFA] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </section>

      {/* Trust Marquee */}
      <Marquee>
        {["L'ORÉAL", "AIRBUS", "SOCIÉTÉ GÉNÉRALE", "VALEO", "ENGIE", "TOTALENERGIES", "DANONE", "HERMÈS"].map(brand => (
          <span key={brand} className="text-slate-300 font-display font-black text-2xl tracking-[0.2em]">{brand}</span>
        ))}
      </Marquee>

      {/* Features - Bento Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-black mb-6 leading-tight">
              L'excellence tech au service de votre <span className="text-indigo-600 italic">candidature.</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Nous avons assemblé les meilleurs outils d'IA pour créer un éditeur de CV puissant qui comprend vos ambitions.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6"
          >
            {/* Feature 1 - Large */}
            <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-8 bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-[400px]">
              <div>
                <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Rédaction Assistée Gemini</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                  Notre IA analyse votre parcours pour suggérer des formulations percutantes et des mots-clés stratégiques. Plus besoin de chercher vos mots.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="py-2 px-4 rounded-full bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100">Précision</div>
                <div className="py-2 px-4 rounded-full bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100">Rapidité</div>
              </div>
            </motion.div>

            {/* Feature 2 - Small */}
            <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] text-white flex flex-col justify-between h-[400px]">
              <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Anti-Robot (ATS)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Optimisation structurelle pour garantir que votre CV soit lu par tous les logiciels de recrutement français.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 - Small */}
            <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4 bg-indigo-600 text-white p-10 rounded-[2.5rem] flex flex-col justify-between h-[400px]">
              <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Instant PDF</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Exportation haute fidélité au format A4 universel. Prêt pour l'envoi immédiat par mail ou LinkedIn.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 - Medium */}
            <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-8 bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-[400px] overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-orange-600" />
                </div>
                <Users className="w-12 h-12 text-slate-50 opacity-20 transition-transform group-hover:scale-[30] duration-1000 -z-0" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Analyse de Force</h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Obtenez instantanément des retours sur la clarté et l'impact de votre CV grâce à notre moteur de diagnostic IA.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Market Expertise - Recipe 1 Inspired */}
      <section id="market" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100">
                <div className="space-y-6 mb-12">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Critère Recruteur FR</span>
                    <span className="font-mono text-[10px] text-indigo-600 font-bold">STATUT</span>
                  </div>
                  {[
                    { label: "Mise en page A4 Standard", val: "CONFORME" },
                    { label: "Niveaux CECRL (A1/C2)", val: "ACTIVÉ" },
                    { label: "Structure Compétences/Exp", val: "OPTIMAL" },
                    { label: "Photo Professionnelle", val: "OPTIONNEL" }
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between group cursor-default">
                      <span className="text-slate-700 font-medium group-hover:text-indigo-600 transition-colors uppercase tracking-[0.1em] text-xs italic font-display">{stat.label}</span>
                      <span className="font-mono text-[10px] bg-slate-900 text-white px-3 py-1 rounded group-hover:bg-indigo-600 transition-all">{stat.val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                  <div className="flex gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                  <p className="text-xs text-slate-500 italic">"Génère une description pour mon poste de Chef de Projet qui souligne mon expertise en méthodologie Agile tout en étant conforme aux attentes des entreprises du CAC40."</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl">
                <span className="text-2xl font-black">+45%</span>
                <span className="text-[8px] font-medium uppercase tracking-widest">de succès</span>
              </div>
            </div>

            <div>
              <div className="py-2 px-4 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest inline-block mb-8">
                Savoir-faire Local
              </div>
              <h2 className="font-display text-5xl font-black mb-8 leading-tight">
                Une connaissance intime du marché <span className="text-indigo-600">hexagonal.</span>
              </h2>
              <p className="text-slate-500 text-xl leading-relaxed mb-10">
                La France possède ses propres standards. Nous avons collaboré avec des experts en recrutement pour que chaque ligne de votre CV résonne avec la culture d'entreprise française.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Standards ATS</h4>
                  <p className="text-sm text-slate-500">Mise en forme optimisée pour Workday, Greenhouse et SmartRecruiters.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Langue CECRL</h4>
                  <p className="text-sm text-slate-500">Définissez vos langues selon le standard européen reconnu en France.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section - Luxury Feel */}
      <section id="templates" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-black mb-6 tracking-tight italic">Designs haute couture.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Chaque modèle est une pièce unique, conçue pour un impact visuel immédiat tout en restant parfaitement lisible.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                name: "Moderne", 
                color: "bg-indigo-600",
                desc: "Parfait pour la tech et le design" 
              },
              { 
                name: "Classique", 
                color: "bg-slate-950",
                desc: "Idéal pour le luxe et la finance" 
              },
              { 
                name: "Créatif", 
                color: "bg-pink-600",
                desc: "Pour les esprits audacieux" 
              }
            ].map((template, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[1/1.414] rounded-3xl overflow-hidden border border-slate-200 mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-slate-50 p-6 md:p-8">
                  <div className="w-full h-full border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col bg-white">
                    <div className={`h-[30%] ${template.color} p-4 flex flex-col justify-end relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-20 h-20 text-white" />
                      </div>
                      <div className="h-3 w-1/2 bg-white/30 rounded mb-2" />
                      <div className="h-1.5 w-1/3 bg-white/20 rounded" />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                        <div className="h-2 w-[90%] bg-slate-100 rounded-full" />
                        <div className="h-2 w-[85%] bg-slate-100 rounded-full" />
                      </div>
                      <div className="pt-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full opacity-50" />
                          <div className="h-1.5 w-[80%] bg-slate-100 rounded-full opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full opacity-50" />
                          <div className="h-1.5 w-[80%] bg-slate-100 rounded-full opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center p-12">
                    <Button onClick={onStart} className="bg-white text-slate-900 rounded-full font-bold w-full h-12 shadow-xl">Utiliser ce modèle</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="font-display font-black text-xl tracking-tight uppercase mb-1">{template.name}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{template.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <ChevronRight className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-display text-5xl font-black mb-6 tracking-tight">Investissez dans votre <span className="text-indigo-600 italic">futur.</span></h2>
          </div>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Single Download Plan */}
            <div className="bg-white border border-slate-100 p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 underline underline-offset-8">Flexible</span>
                <h3 className="text-3xl font-black mt-6 mb-2">Paiement Unique</h3>
                <p className="text-slate-400 text-sm">Pour un besoin ponctuel.</p>
              </div>
              <div className="text-5xl font-black text-slate-900 mb-12">0.99€<span className="text-slate-300 text-lg font-bold">/CV</span></div>
              <ul className="space-y-6 mb-12">
                {["1 CV débloqué", "Tous les modèles", "Export PDF HQ", "Éditeur intuitif"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                      <CheckCircle className="w-3 w-3 text-slate-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button onClick={() => onSelectPlan('single')} variant="outline" className="w-full rounded-2xl h-14 font-bold border-slate-100 hover:bg-slate-50 transition-colors">
                Débloquer mon CV
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 bg-indigo-400/50 w-32 h-32 rounded-full blur-3xl" />
              <div className="absolute top-8 right-8 bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                Meilleure Valeur
              </div>
              <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 underline underline-offset-8">Propulsé par Gemini</span>
                <h3 className="text-3xl font-black mt-6 mb-2 text-white italic">Accès Pro</h3>
                <p className="text-indigo-200 text-sm">Libérez la puissance de l'IA.</p>
              </div>
              <div className="text-5xl font-black text-white mb-12">4.99€<span className="text-indigo-300 text-lg font-bold">/mois</span></div>
              <ul className="space-y-6 mb-12">
                {["CV Illimités", "Modèles Premium (x12)", "Analyse IA avancée", "Rédaction complète", "ATS Score Pro"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <CheckCircle className="w-3 w-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button onClick={() => onSelectPlan('pro')} className="w-full bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl h-14 font-bold transition-transform active:scale-95">
                Passer en Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Recipe 4 Inspired */}
      <footer className="bg-slate-950 text-white pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-24 border-b border-white/5 pb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight">NovaCV</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Repousser les limites du recrutement grâce à l'IA générative. Conçu à Paris pour les talents de demain.
              </p>
            </div>
            <div>
              <h5 className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-400 mb-8">Produit</h5>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#templates" className="hover:text-indigo-400 transition-colors">Modèles</a></li>
                <li><a href="#market" className="hover:text-indigo-400 transition-colors">Expertise</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-400 mb-8">Légal</h5>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li><button onClick={() => setModal('privacy')} className="hover:text-indigo-400 transition-colors">Confidentialité</button></li>
                <li><button onClick={() => setModal('terms')} className="hover:text-indigo-400 transition-colors">Conditions</button></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">
              © 2026 NOVACV — TOUS DROITS RÉSERVÉS
            </p>
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-mono tracking-[0.2em] text-slate-600 italic">FAIT AVEC AMOUR À PARIS</span>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"><Users className="w-4 h-4" /></div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"><Trophy className="w-4 h-4" /></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-600">Document Légal</div>
                <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-10">
                <h2 className="font-display text-4xl font-black mb-8">
                  {modal === 'privacy' ? 'Confidentialité' : 'Conditions'}
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-6 text-lg">
                  {modal === 'privacy' ? (
                    <>
                      <p>Votre vie privée est le fondement de la confiance que vous nous accordez. Chez NovaCV, nous appliquons le principe de minimisation des données.</p>
                      <p>Toutes vos données de CV sont prioritaires dans le stockage local de votre navigateur. La transmission à l'IA Gemini est chiffrée et temporaire.</p>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">Sécurité Enterprise</h3>
                        <p className="text-sm">Nous utilisons les protocoles Google Cloud pour garantir que vos informations ne sont jamais utilisées pour l'entraînement public des modèles.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>L'utilisation de nos services implique l'acceptation de nos protocoles d'IA générative.</p>
                      <ul className="space-y-4">
                        <li className="flex gap-4">
                          <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          <span>Responsabilité limitée sur les résultats de recrutement.</span>
                        </li>
                        <li className="flex gap-4">
                          <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          <span>Usage personnel non-commercial pour le plan gratuit.</span>
                        </li>
                        <li className="flex gap-4">
                          <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          <span>Propriété intellectuelle des modèles de CV protégée.</span>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </ScrollArea>
              <div className="p-8 border-t border-slate-50 flex justify-end">
                <Button onClick={() => setModal(null)} className="bg-indigo-600 text-white rounded-full px-8 h-12 font-bold shadow-xl shadow-indigo-100">J'ai compris</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrollArea({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`overflow-y-auto ${className || ''}`}>
      {children}
    </div>
  );
}
