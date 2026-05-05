import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Shield, Info, CreditCard, ChevronRight, X } from 'lucide-react';
import { auth, db } from '@/src/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updatePassword } from 'firebase/auth';
import { toast } from 'sonner';
import { UserStatus } from '../types';

interface ProfilePageProps {
  onBack: () => void;
  userStatus: UserStatus;
  onChangePlan: () => void;
}

export default function ProfilePage({ onBack, userStatus, onChangePlan }: ProfilePageProps) {
  const user = auth.currentUser;
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [showTerms, setShowTerms] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        // update users collection if needed
        await setDoc(doc(db, 'users', user.uid), { name: displayName }, { merge: true });
      }
      
      if (newPassword.length > 0) {
        if (newPassword.length < 6) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères.");
          setSaving(false);
          return;
        }
        await updatePassword(user, newPassword);
      }
      
      toast.success("Profil mis à jour avec succès.");
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Veuillez vous reconnecter pour changer de mot de passe.");
      } else {
        toast.error("Une erreur est survenue lors de la mise à jour.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold text-xl tracking-tight">Mon Profil</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8 mt-4 grid gap-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Informations Personnelles</h2>
              <p className="text-slate-500 text-sm">Gérez vos identifiants de connexion.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400">Email (Non modifiable)</Label>
              <Input value={user?.email || ''} disabled className="h-12 bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400">Nom complet</Label>
              <Input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Votre nom" 
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400">Nouveau mot de passe (Laisser vide pour ne pas changer)</Label>
              <Input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="••••••••" 
                className="h-12"
              />
            </div>
            <Button disabled={saving} type="submit" className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 w-full font-bold">
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Mon Plan</h2>
              <p className="text-slate-500 text-sm">Gérez votre abonnement NovaCV.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="font-bold text-lg mb-1">{userStatus === 'pro' ? 'Abonnement Pro' : 'Plan Gratuit / Accès Unique'}</p>
              <p className="text-slate-500 text-sm">
                {userStatus === 'pro' ? 'Vous bénéficiez de téléchargements illimités et HD.' : 'Payez uniquement lors du téléchargement HD.'}
              </p>
            </div>
            {userStatus !== 'pro' && (
              <Button onClick={onChangePlan} className="bg-indigo-600 shrink-0 hover:bg-slate-900 text-white rounded-xl font-bold">
                Passer en Pro
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-slate-100 text-slate-600 p-4 rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Légal</h2>
              <p className="text-slate-500 text-sm">Termes et conditions.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowTerms(true)} className="w-full justify-between h-14 rounded-xl border-slate-200">
            <span className="font-bold">Conditions Générales de Vente (CGV)</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Button>
        </div>
      </main>

      <AnimatePresence>
        {showTerms && (
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
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-black">Conditions d'utilisation</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowTerms(false)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-8 overflow-y-auto text-slate-600 space-y-4 text-sm">
                <h4 className="font-bold text-slate-900">1. Acceptation des conditions</h4>
                <p>En utilisant NovaCV, vous acceptez de respecter l'ensemble des conditions énoncées dans le présent document.</p>
                <h4 className="font-bold text-slate-900">2. Description des services</h4>
                <p>NovaCV permet la création, la personnalisation et l'exportation de curriculum vitae. L'accès à certaines fonctionnalités avancées ou à l'exportation haute définition nécessite un paiement ponctuel ou un abonnement au plan Pro.</p>
                <h4 className="font-bold text-slate-900">3. Paiements et abonnements</h4>
                <p>Les paiements sont traités par des prestataires tiers (ex: PayPal). En choisissant un plan Pro, vous acceptez une facturation récurrente mensuelle. Vous pouvez annuler votre abonnement à tout moment via l'interface PayPal.</p>
                <h4 className="font-bold text-slate-900">4. Données personnelles</h4>
                <p>Nous prenons la vie privée très au sérieux. Vos données (emails, informations contenues dans votre CV) sont stockées de façon sécurisée sur Firebase. Nous ne vendons pas vos données.</p>
                <h4 className="font-bold text-slate-900">5. Responsabilité</h4>
                <p>L'utilisation des modèles et des suggestions générées par l'IA se fait à vos propres risques. Nous ne garantissons pas l'obtention d'un emploi.</p>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center shrink-0">
                <Button onClick={() => setShowTerms(false)} className="w-full sm:w-auto bg-slate-900 text-white rounded-xl h-12 px-8 font-bold">
                  Compris
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
