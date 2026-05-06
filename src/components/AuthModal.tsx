import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, LogIn, UserPlus, Key, Loader2 } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast.error("Firebase n'est pas configuré.");
      return;
    }
    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Bon retour !");
      } else if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Compte créé avec succès !");
      } else {
        await sendPasswordResetEmail(auth, email);
        toast.success("Si cet email existe, un lien de réinitialisation vous a été envoyé.");
        setAuthMode('login');
        setIsLoading(false);
        return;
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Auth error:", error.code, error.message);
      let message = "Une erreur est survenue.";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "Email ou mot de passe incorrect.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "Ce compte existe déjà. Veuillez vous connecter.";
        setAuthMode('login');
      } else if (error.code === 'auth/weak-password') {
        message = "Le mot de passe est trop court.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Format d'email invalide.";
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) {
      toast.error("Firebase n'est pas configuré.");
      return;
    }
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Connexion réussie !");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Google Auth error:", error);
      let errorMessage = error.message || error.code || 'Inconnue';
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        errorMessage = `Please add "${domain}" to your Authorized Domains in the Firebase Console (Authentication -> Settings -> Authorized domains).`;
      }
      
      toast.error(`Erreur d'authentification Google: ${errorMessage}`, {
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            <div className="p-8 md:p-10">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="absolute top-6 right-6 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </Button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {authMode === 'login' ? <LogIn className="w-8 h-8 text-indigo-600" /> : 
                   authMode === 'signup' ? <UserPlus className="w-8 h-8 text-indigo-600" /> : 
                   <Key className="w-8 h-8 text-indigo-600" />}
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {authMode === 'login' ? 'Connexion' : authMode === 'signup' ? 'Créer un compte' : 'Réinitialisation'}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  {authMode === 'login' ? 'Accédez à vos CV et au mode Pro.' : 
                   authMode === 'signup' ? 'Rejoignez-nous pour débloquer tout le potentiel.' : 
                   'Saisissez votre email pour recevoir un lien.'}
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="votre@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-indigo-600 transition-all font-medium"
                  />
                </div>

                {(authMode as string) !== 'reset' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe</Label>
                      {(authMode as string) === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setAuthMode('reset')}
                          className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                        >
                          Oublié ?
                        </button>
                      )}
                    </div>
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={(authMode as string) !== 'reset'}
                      className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-indigo-600 transition-all font-medium"
                    />
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest text-[11px]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 
                   (authMode === 'login' ? 'Se connecter' : authMode === 'signup' ? 'S\'inscrire' : 'Envoyer le lien')}
                </Button>
              </form>

              <div className="mt-6 flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-300">
                    <span className="bg-white px-4">Ou continuer avec</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGoogleAuth}
                  type="button"
                  variant="outline"
                  className="h-12 border-slate-100 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                  {authMode === 'login' ? "Pas encore de compte ?" : authMode === 'signup' ? "Déjà un compte ?" : "Retour à la"}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="ml-2 text-indigo-600 hover:text-indigo-700"
                  >
                    {authMode === 'login' ? "S'inscrire" : authMode === 'signup' ? "Se connecter" : "Connexion"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
