import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Layout, FileText, Settings, LogOut, ChevronRight, Download, Edit3, Trash2 } from 'lucide-react';
import { auth, db } from '@/src/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';

interface DashboardProps {
  onNew: () => void;
  onEdit: (data: any) => void;
  onLogout: () => void;
  onProfile: () => void;
}

export default function Dashboard({ onNew, onEdit, onLogout, onProfile, userStatus }: DashboardProps & { userStatus: UserStatus }) {
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchCvs = async () => {
      try {
        const q = query(collection(db, 'resumes'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        let docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort by updatedAt
        docs.sort((a: any, b: any) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));

        // Filter based on status if not pro
        if (userStatus !== 'pro') {
          // If not pro, we only show paid CVs or the very last one? 
          // User said "only the current cv he is workin on is visible"
          // I'll show only CVs where isPaid is true, OR if no paid CVs, show nothing or instructions
          docs = docs.filter((d: any) => d.isPaid === true);
        }

        setCvs(docs);
      } catch (e) {
        console.error("Error fetching CVs", e);
        toast.error("Erreur lors de la récupération de vos CV.");
      } finally {
        setLoading(false);
      }
    };

    fetchCvs();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce CV ?")) return;
    try {
      await deleteDoc(doc(db, 'resumes', id));
      setCvs(prev => prev.filter(c => c.id !== id));
      toast.success("CV supprimé.");
    } catch (e) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar / Topbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <FileText className="text-white w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight">Mon Espace Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onProfile} className="text-right hidden sm:block hover:bg-slate-100 p-2 rounded-xl transition-colors">
            <p className="text-sm font-bold text-slate-900">{user?.displayName || user?.email}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest ${userStatus === 'pro' ? 'text-indigo-600' : 'text-slate-400'}`}>
              {userStatus === 'pro' ? 'Membre Pro' : 'Compte Gratuit'}
            </p>
          </button>
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-slate-400 hover:text-red-600">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-display font-black mb-2">Bonjour, {user?.displayName?.split(' ')[0] || 'Candidat'} !</h2>
            <p className="text-slate-500">Gérez vos candidatures et optimisez votre carrière avec l'IA.</p>
          </div>
          <Button onClick={onNew} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl h-14 px-8 font-bold shadow-xl shadow-indigo-100 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Créer un nouveau CV
          </Button>
        </div>

        {/* Stats / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'CV Créés', value: cvs.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <Card key={i} className="p-6 border-slate-100 shadow-sm flex items-center gap-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent CVs */}
        <h3 className="text-xl font-bold mb-6">Vos documents récents</h3>
        {loading ? (
          <div className="flex justify-center py-20">
            <Plus className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : cvs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cvs.map((cv) => (
              <motion.div
                key={cv.id}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="aspect-[1/1.2] bg-slate-100 relative group-hover:bg-slate-200 transition-colors p-6 overflow-hidden">
                   {/* Simplified Preview Mockup */}
                   <div className="bg-white w-full h-full rounded shadow-lg p-4 space-y-2 transform group-hover:scale-105 transition-transform">
                      <div className="w-1/2 h-2 bg-indigo-100 rounded" />
                      <div className="w-full h-1 bg-slate-100 rounded" />
                      <div className="w-full h-1 bg-slate-100 rounded" />
                      <div className="pt-4 space-y-1">
                        <div className="w-3/4 h-1 bg-slate-200 rounded" />
                        <div className="w-full h-1 bg-slate-200 rounded" />
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                      <Button size="icon" onClick={() => onEdit(cv)} className="bg-white text-indigo-600 hover:bg-slate-900 hover:text-white rounded-full">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(cv.id)} className="rounded-full">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                   </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{cv.personalInfo?.fullName || "CV Sans Nom"}</h4>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 border-indigo-100">
                      {cv.templateId}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-widest leading-none">Modifié le {new Date(cv.updatedAt || Date.now()).toLocaleDateString('fr-FR')}</p>
                  <Button variant="ghost" onClick={() => onEdit(cv)} className="w-full justify-between text-indigo-600 hover:text-white hover:bg-indigo-600 p-0 h-auto group/btn">
                    <span className="font-bold text-sm">Ouvrir l'éditeur</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h4 className="text-xl font-bold mb-2">Aucun CV pour le moment</h4>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Commencez par créer votre premier CV professionnel propulsé par l'intelligence artificielle.</p>
            <Button onClick={onNew} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl h-14 px-8 font-bold shadow-xl shadow-indigo-100">
              Créer mon premier CV
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
