import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ResumeBuilder from './components/ResumeBuilder';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import PlanSelectionModal from './components/PlanSelectionModal';
import PaymentCheckout from './components/PaymentCheckout';
import { Toaster } from '@/components/ui/sonner';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ResumeData, UserStatus } from './types';
import { toast } from 'sonner';

type View = 'landing' | 'builder' | 'dashboard' | 'profile';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>('free');
  const [editingData, setEditingData] = useState<ResumeData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [checkoutConfig, setCheckoutConfig] = useState<{ isOpen: boolean, plan: 'pro' | null, amount: string, description: string }>({
    isOpen: false,
    plan: null,
    amount: '0.00',
    description: ''
  });

  const fetchUserStatus = async (u: any) => {
    if (!u || !db) {
      setUserStatus('free');
      return;
    }

    const userPath = `users/${u.uid}`;
    try {
      const userRef = doc(db, 'users', u.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const status = userDoc.data().status as UserStatus;
        setUserStatus(status);
      } else {
        // Create user doc if it doesn't exist (optional, but good for reporting)
        setUserStatus('free');
        try {
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email,
            status: 'free',
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn("Could not auto-create user doc:", err);
        }
      }
      
      if (view === 'landing') {
        setView('dashboard');
      }
    } catch (e: any) {
      console.error("Failed to fetch user doc:", e);
      // Fallback: if we can't read the user doc, we still let them in as free
      setUserStatus('free');
      if (view === 'landing') setView('dashboard');
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && db) {
        // Handle post-payment redirects
        const urlParams = new URLSearchParams(window.location.search);
        const paymentSuccess = urlParams.get('payment_success');
        const plan = urlParams.get('plan');
        const cvId = urlParams.get('cv_id');

        if (paymentSuccess === 'true') {
          try {
            if (plan === 'pro') {
              try {
                await setDoc(doc(db, 'users', u.uid), {
                  uid: u.uid,
                  email: u.email,
                  status: 'pro',
                  updatedAt: serverTimestamp()
                }, { merge: true });
              } catch (e) {
                console.error("Payment sync failed:", e);
              }
              toast.success("Abonnement Pro activé avec succès !");
            } else if (plan === 'single_paid' && cvId) {
              try {
                await setDoc(doc(db, 'resumes', cvId), { 
                  isPaid: true,
                  updatedAt: serverTimestamp()
                }, { merge: true });
              } catch (e) {
                console.error("Payment sync failed:", e);
              }
              toast.success("CV HD débloqué avec succès !");
            }
          } catch (e) {
            console.error(e);
            toast.error("Erreur lors de la validation du paiement.");
          }
          // Remove query params
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        await fetchUserStatus(u);
      } else {
        setUserStatus('free');
      }
    });
    return () => unsub();
  }, [auth]); // Only depend on auth

  const handleSelectPlan = async (plan: 'pro' | 'single') => {
    if (!user) {
      if (plan === 'pro') {
        setShowPlanModal(false);
        setPendingAction('buy_pro');
        setShowAuthModal(true);
      } else {
        setShowPlanModal(false);
        setView('builder');
      }
      return;
    }

    if (plan === 'pro') {
      setShowPlanModal(false);
      setCheckoutConfig({
        isOpen: true,
        plan: 'pro',
        amount: '4.99',
        description: 'Abonnement Pro Mensuel'
      });
    } else {
      setShowPlanModal(false);
      if (view === 'landing') setView('builder');
      toast.info("Plan d'accès unique sélectionné. Vous pourrez débloquer votre CV au moment du téléchargement.");
    }
  };

  const handleCheckoutSuccess = async (details: any) => {
    setCheckoutConfig(prev => ({ ...prev, isOpen: false }));
    if (checkoutConfig.plan === 'pro' && user && db) {
        const userPath = `users/${user.uid}`;
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            status: 'pro',
            updatedAt: serverTimestamp()
          }, { merge: true });
          setUserStatus('pro');
          toast.success("Accès Pro activé avec succès !");
          setView('dashboard');
        } catch (e) {
          try {
            handleFirestoreError(e, OperationType.WRITE, userPath);
          } catch(err) { }
          // Still grant proactive access locally
          setUserStatus('pro');
          toast.success("Accès Pro activé pour cette session ! (Erreur de sauvegarde)");
          setView('dashboard');
        }
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUserStatus('free');
    setView('landing');
  };

  const handleEditCv = (data: ResumeData) => {
    setEditingData(data);
    setView('builder');
  };

  const startNew = () => {
    setEditingData(null);
    setView('builder');
  };

  return (
    <main className="min-h-screen">
      {view === 'landing' && (
        <LandingPage 
          onLogin={() => setShowAuthModal(true)} 
          onStart={() => user ? setView('dashboard') : startNew()}
          onSelectPlan={handleSelectPlan}
        />
      )}
      
      {view === 'builder' && (
        <ResumeBuilder 
          initialData={editingData || undefined}
          user={user}
          userStatus={userStatus}
          onBack={() => user ? setView('dashboard') : setView('landing')} 
          onUpgrade={() => {
            if (user) {
              handleSelectPlan('pro');
            } else {
              setPendingAction('buy_pro');
              setShowAuthModal(true);
            }
          }}
          onProUpgraded={() => {
            setUserStatus('pro');
          }}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          userStatus={userStatus}
          onNew={startNew}
          onEdit={handleEditCv}
          onLogout={handleLogout}
          onProfile={() => setView('profile')}
        />
      )}

      {view === 'profile' && (
        <ProfilePage 
          onBack={() => setView('dashboard')}
          userStatus={userStatus}
          onChangePlan={() => setShowPlanModal(true)}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setShowAuthModal(false);
          const currentUser = auth?.currentUser;
          if (currentUser) {
            fetchUserStatus(currentUser);
            
            if (pendingAction === 'buy_pro' && userStatus !== 'pro') {
              setPendingAction(null);
              setCheckoutConfig({
                isOpen: true,
                plan: 'pro',
                amount: '4.99',
                description: 'Abonnement Pro Mensuel'
              });
            }
          }
        }}
      />

      <PlanSelectionModal 
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onSelect={handleSelectPlan}
        isLoading={false}
      />

      <PaymentCheckout 
        isOpen={checkoutConfig.isOpen}
        amount={checkoutConfig.amount}
        description={checkoutConfig.description}
        onSuccess={handleCheckoutSuccess}
        onCancel={() => setCheckoutConfig(prev => ({ ...prev, isOpen: false }))}
      />

      <Toaster position="top-center" />
    </main>
  );
}
