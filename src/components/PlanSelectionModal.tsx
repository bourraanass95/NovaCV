import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Sparkles, CreditCard, Loader2 } from 'lucide-react';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plan: 'pro' | 'single') => void;
  isLoading?: boolean;
}

export default function PlanSelectionModal({ isOpen, onClose, onSelect, isLoading }: PlanSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden relative p-8 md:p-12"
          >
            {isLoading && (
              <div className="absolute inset-0 z-[210] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 relative mb-8">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  <div className="w-full h-full bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 border border-slate-100">
                    <svg className="w-10 h-10 text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.067 8.478c.492.427.697 1.05.514 1.696-.64 2.257-2.074 7.291-2.074 7.291-.186.634-.73 1.035-1.341 1.035h-3.328l-.342 2.128a.428.428 0 0 1-.423.361H9.866a.286.286 0 0 1-.28-.337l1.79-11.41a.714.714 0 0 1 .705-.623h5.127c1.332 0 2.37.382 2.859.859zM8.334 1.011l-2.6 16.561a.428.428 0 0 0 .423.494h3.323a.286.286 0 0 0 .284-.241l2.457-15.632a.428.428 0 0 0-.422-.494H8.618a.286.286 0 0 0-.284.312z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2 italic">Sécurisation du paiement</h3>
                <p className="text-slate-500 max-w-sm mb-6">Connexion sécurisée à PayPal en cours... Veuillez ne pas fermer cette fenêtre.</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Transaction Chiffrée AES-256
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="absolute top-6 right-6 rounded-full hover:bg-slate-100"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-slate-400" />
            </Button>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2 italic font-display">Choisissez votre plan</h2>
              <p className="text-slate-500 font-medium">Débloquez votre potentiel avec nos options de téléchargement.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Single Plan */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black mb-1">Accès Unique</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Une recharge ponctuelle</p>
                </div>
                <div className="text-4xl font-black mb-8">0.99€<span className="text-sm font-normal text-slate-400"> / CV</span></div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["1 Téléchargement HD", "Historique conservé", "Assistance standard"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle className="w-4 h-4 text-slate-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => onSelect('single')}
                  className="w-full h-14 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black transition-all"
                >
                  Choisir ce plan
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="w-20 h-20" />
                </div>
                <div className="mb-8 relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-black mb-1 italic">Abonnement Pro</h3>
                  <p className="text-indigo-300/60 text-xs font-bold uppercase tracking-widest">Le choix des experts</p>
                </div>
                <div className="text-4xl font-black mb-8">4.99€<span className="text-sm font-normal text-white/40"> / mois</span></div>
                <ul className="space-y-4 mb-10 flex-1 relative z-10">
                  {["CV Illimités", "IA Gemini illimitée", "Pas de filigrane", "Support Prioritaire"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                      <CheckCircle className="w-4 h-4 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => onSelect('pro')}
                  className="w-full h-14 bg-indigo-600 hover:bg-white hover:text-slate-900 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20"
                >
                  Passer en Pro
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
