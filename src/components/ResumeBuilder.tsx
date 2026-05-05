import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, Experience, Education, Language, Project } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { 
  Plus, Trash2, Sparkles, Download, Eye, Edit3, 
  User, Briefcase, GraduationCap, Code, 
  ChevronRight, ChevronLeft, Loader2, Wand2, Target, X, Home, Lock, CreditCard, CheckCircle, Camera, Upload, AlertTriangle, ShieldCheck
} from 'lucide-react';
import ResumePreview from './ResumePreview';
import PaymentCheckout from './PaymentCheckout';
import { improveSummary, improveExperienceDescription, improveEducationDescription, improveProjectDescription, suggestSkills, analyzeResume } from '@/src/lib/gemini';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserStatus } from '@/src/types';
import { auth, db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const initialData: ResumeData = {
  templateId: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    jobTitle: '',
    summary: '',
    photo: '',
    targetJob: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  interests: [],
};

export default function ResumeBuilder({ onBack, initialData: loadedData, user, userStatus, onUpgrade }: { onBack: () => void, initialData?: ResumeData, user: any, userStatus: UserStatus, onUpgrade: () => void }) {
  const [data, setData] = useState<ResumeData>(loadedData || initialData);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [checkoutConfig, setCheckoutConfig] = useState<{ isOpen: boolean, plan: 'pro' | 'single_paid' | null, amount: string, description: string }>({
    isOpen: false,
    plan: null,
    amount: '0.00',
    description: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvPaid, setCvPaid] = useState(false);
  const [cvDownloaded, setCvDownloaded] = useState(false);

  // Sync state with loaded data
  useEffect(() => {
    if (loadedData) {
      setData(loadedData);
      // @ts-ignore
      setCvPaid(loadedData.isPaid || false);
      // @ts-ignore
      setCvDownloaded(loadedData.hdDownloaded || false);
    }
  }, [loadedData]);

  // Load from local storage if no initial data
  useEffect(() => {
    if (loadedData) return;
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setCvPaid(parsed.isPaid || false);
        setCvDownloaded(parsed.hdDownloaded || false);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, [loadedData]);



  const saveToFirestore = async () => {
    if (!user) return;
    const cvId = (data as any).id || crypto.randomUUID();
    const resumePath = `resumes/${cvId}`;
    try {
      await setDoc(doc(db, 'resumes', cvId), {
        ...data,
        id: cvId,
        userId: user.uid,
        isPaid: cvPaid,
        hdDownloaded: cvDownloaded,
        updatedAt: serverTimestamp(),
      });
      toast.success("CV sauvegardé dans votre dashboard.");
    } catch (e) {
      console.error("Save error", e);
      handleFirestoreError(e, OperationType.WRITE, resumePath);
      toast.error("Erreur lors de la sauvegarde.");
    }
  };

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(data));
  }, [data]);

  const updatePersonalInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const addSkill = (skill: string) => {
    if (skill && !data.skills.includes(skill)) {
      setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addLanguage = () => {
    const newLang: Language = { id: crypto.randomUUID(), name: '', level: 'B2' };
    setData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const addProject = () => {
    const newProj: Project = { id: crypto.randomUUID(), name: '', description: '', link: '' };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const setTemplate = (id: string) => {
    setData(prev => ({ ...prev, templateId: id }));
  };

  const handleImproveSummary = async () => {
    if (!data.personalInfo.summary) {
      toast.error("Veuillez d'abord saisir un résumé.");
      return;
    }
    setIsGenerating('summary');
    try {
      const improved = await improveSummary(data.personalInfo.summary, data.personalInfo.jobTitle, data.personalInfo.targetJob);
      if (improved) updatePersonalInfo('summary', improved);
      toast.success("Résumé amélioré par l'IA !");
    } catch (e) {
      toast.error("Erreur lors de l'amélioration.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleImproveExp = async (id: string) => {
    const exp = data.experience.find(e => e.id === id);
    if (!exp?.description) {
      toast.error("Veuillez d'abord saisir une description.");
      return;
    }
    setIsGenerating(id);
    try {
      const improved = await improveExperienceDescription(exp.description, exp.position, data.personalInfo.targetJob);
      if (improved) updateExperience(id, 'description', improved);
      toast.success("Description optimisée !");
    } catch (e) {
      toast.error("Erreur lors de l'amélioration.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleImproveEdu = async (id: string) => {
    const edu = data.education.find(e => e.id === id);
    if (!edu?.description) {
      toast.error("Veuillez d'abord saisir une description.");
      return;
    }
    setIsGenerating(id);
    try {
      const improved = await improveEducationDescription(edu.description, edu.degree, edu.school);
      if (improved) updateEducation(id, 'description', improved);
      toast.success("Formation optimisée !");
    } catch (e) {
      toast.error("Erreur lors de l'amélioration.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleImproveProj = async (id: string) => {
    const proj = data.projects.find(p => p.id === id);
    if (!proj?.description) {
      toast.error("Veuillez d'abord saisir une description.");
      return;
    }
    setIsGenerating(id);
    try {
      const improved = await improveProjectDescription(proj.description, proj.name);
      if (improved) updateProject(id, 'description', improved);
      toast.success("Projet optimisé !");
    } catch (e) {
      toast.error("Erreur lors de l'amélioration.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (!data.personalInfo.jobTitle) {
      toast.error("Veuillez saisir un intitulé de poste.");
      return;
    }
    setIsGenerating('skills');
    try {
      const expText = data.experience.map(e => e.description).join(' ');
      const suggested = await suggestSkills(data.personalInfo.jobTitle, expText, data.personalInfo.targetJob);
      suggested.forEach(s => addSkill(s));
      toast.success("Compétences suggérées ajoutées !");
    } catch (e) {
      toast.error("Erreur lors de la suggestion.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeResume(data, data.personalInfo.targetJob);
      setAnalysis(res || null);
    } catch (e) {
      toast.error("Erreur lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestions = () => {
    if (!analysis?.suggestedUpdates) return;
    
    const updates = analysis.suggestedUpdates;
    setData(prev => {
      let newData = { ...prev };
      
      if (updates.personalInfo) {
        newData.personalInfo = { ...newData.personalInfo, ...updates.personalInfo };
      }
      
      if (updates.skills && Array.isArray(updates.skills)) {
        newData.skills = updates.skills;
      }
      
      if (updates.experience && Array.isArray(updates.experience)) {
        newData.experience = newData.experience.map((exp, index) => {
          const update = updates.experience.find((u: any) => u.id === exp.id);
          if (update) {
            const { id, ...otherFields } = update;
            return { ...exp, ...otherFields };
          }
          if (updates.experience.length === prev.experience.length) {
            const { id, ...otherFields } = updates.experience[index];
            return { ...exp, ...otherFields };
          }
          return exp;
        });
      }
      
      if (updates.education && Array.isArray(updates.education)) {
        newData.education = newData.education.map((edu, index) => {
          const update = updates.education.find((u: any) => u.id === edu.id);
          if (update) {
            const { id, ...otherFields } = update;
            return { ...edu, ...otherFields };
          }
          if (updates.education.length === prev.education.length) {
            const { id, ...otherFields } = updates.education[index];
            return { ...edu, ...otherFields };
          }
          return edu;
        });
      }

      if (updates.projects && Array.isArray(updates.projects)) {
        newData.projects = newData.projects.map((proj, index) => {
          const update = updates.projects.find((u: any) => u.id === proj.id);
          if (update) {
            const { id, ...otherFields } = update;
            return { ...proj, ...otherFields };
          }
          if (updates.projects.length === prev.projects.length) {
            const { id, ...otherFields } = updates.projects[index];
            return { ...proj, ...otherFields };
          }
          return proj;
        });
      }
      
      return newData;
    });
    
    setAnalysis(prev => ({ ...prev, suggestedUpdates: {} })); // Clear suggestions once applied
    toast.success("Suggestions Appliquées ! Votre CV a été mis à jour.");
  };

  const applySingleSuggestion = (type: string, id?: string) => {
    if (!analysis?.suggestedUpdates) return;
    const updates = analysis.suggestedUpdates;
    
    setData(prev => {
      let newData = { ...prev };
      if (type === 'summary' && updates.personalInfo?.summary) {
        newData.personalInfo = { ...newData.personalInfo, summary: updates.personalInfo.summary };
      } else if (type === 'skills' && updates.skills) {
        newData.skills = updates.skills;
      } else if (type === 'experience' && id) {
        newData.experience = newData.experience.map(exp => {
          const update = updates.experience?.find((u: any) => u.id === id);
          return update ? { ...exp, description: update.description } : exp;
        });
      } else if (type === 'education' && id) {
        newData.education = newData.education.map(edu => {
          const update = updates.education?.find((u: any) => u.id === id);
          return update ? { ...edu, description: update.description } : edu;
        });
      } else if (type === 'projects' && id) {
        newData.projects = newData.projects.map(proj => {
          const update = updates.projects?.find((u: any) => u.id === id);
          return update ? { ...proj, description: update.description } : proj;
        });
      }
      return newData;
    });

    // Remove this specific suggestion from state
    setAnalysis(prev => {
      if (!prev?.suggestedUpdates) return prev;
      const newUpdates = { ...prev.suggestedUpdates };
      if (type === 'summary') delete newUpdates.personalInfo?.summary;
      if (type === 'skills') delete newUpdates.skills;
      if (type === 'experience') newUpdates.experience = newUpdates.experience.filter((u: any) => u.id !== id);
      if (type === 'education') newUpdates.education = newUpdates.education.filter((u: any) => u.id !== id);
      if (type === 'projects') newUpdates.projects = newUpdates.projects?.filter((u: any) => u.id !== id);
      return { ...prev, suggestedUpdates: newUpdates };
    });
    
    toast.success("Suggestion appliquée !");
  };

  const hasSuggestionFor = (type: string, id?: string) => {
    if (!analysis?.suggestedUpdates) return false;
    const updates = analysis.suggestedUpdates;
    if (type === 'summary') return !!updates.personalInfo?.summary;
    if (type === 'skills') return !!updates.skills && updates.skills.length > 0;
    if (type === 'experience') return !!updates.experience?.find((u: any) => u.id === id);
    if (type === 'education') return !!updates.education?.find((u: any) => u.id === id);
    if (type === 'projects') return !!updates.projects?.find((u: any) => u.id === id);
    return false;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La photo est trop lourde (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string);
        toast.success("Photo ajoutée !");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRealPayment = async (type: UserStatus) => {
    setShowPaymentModal(false);
    if (type === 'pro') {
      onUpgrade();
      return;
    }

    if (type === 'single_paid') {
      setCheckoutConfig({
        isOpen: true,
        plan: 'single_paid',
        amount: '0.99',
        description: 'Téléchargement de votre CV Haute Définition'
      });
    }
  };

  const handleCheckoutSuccess = async (details: any) => {
    setCheckoutConfig(prev => ({ ...prev, isOpen: false }));
    
    if (checkoutConfig.plan === 'single_paid') {
      const cvId = (data as any).id || crypto.randomUUID();
      const resumePath = `resumes/${cvId}`;
      
      if (user) {
        try {
          await setDoc(doc(db, 'resumes', cvId), { 
            ...data,
            id: cvId,
            isPaid: true,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, resumePath);
        }
        setData(prev => ({ ...prev, id: cvId } as any));
      }
      
      setCvPaid(true);
      toast.success("Paiement validé avec succès ! Votre CV est prêt.");
    }
  };

  const handleDownloadClick = () => {
    if (userStatus === 'free' && !cvPaid) {
      setShowPaymentModal(true);
    } else {
      downloadPDF();
    }
  };

  const downloadPDF = async () => {
    if (userStatus === 'free' && !cvPaid) {
      setShowPaymentModal(true);
      return;
    }

    if (userStatus !== 'pro' && cvDownloaded) {
      toast.error("Vous avez déjà téléchargé ce CV en HD. Passez au mode Pro pour des téléchargements illimités !");
      return;
    }

    const element = document.getElementById('resume-preview-content');
    if (!element) return;

    const toastId = toast.loading("Calcul du rendu haute qualité...");
    setIsGenerating('download');
    
    try {
      // Ensure all images are loaded
      const images = element.getElementsByTagName('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      
      await Promise.all(imagePromises);
      await document.fonts.ready;
      
      // Give the browser more time to settle layout and high-res assets
      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await html2canvas(element, {
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, 
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`CV_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'Mon_CV'}_NovaCV.pdf`);
      
      toast.dismiss(toastId);
      toast.success("CV HD téléchargé !");

      // Mark as downloaded if single paid
      if (userStatus !== 'pro') {
        setCvDownloaded(true);
        if (user) {
          const cvId = (data as any).id;
          if (cvId) {
            const resumePath = `resumes/${cvId}`;
            try {
              await setDoc(doc(db, 'resumes', cvId), { 
                hdDownloaded: true,
                isPaid: true // Ensure it stays paid
              }, { merge: true });
            } catch (e) {
              handleFirestoreError(e, OperationType.UPDATE, resumePath);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:text-indigo-600">
            <Home className="w-5 h-5" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Edit3 className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg hidden sm:block">Éditeur de CV</h1>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
              {data.personalInfo.fullName || "Nouveau CV"}
            </Badge>
            {userStatus !== 'free' && (
              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                {userStatus === 'pro' ? 'Pro' : 'Débloqué'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden"
          >
            {showPreview ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Éditer" : "Aperçu"}
          </Button>
          {userStatus === 'pro' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveToFirestore}
              className="hidden sm:flex text-indigo-600 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100"
            >
              Sauvegarder
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="hidden sm:flex"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />}
            Analyser mon CV
          </Button>
          <Button size="sm" onClick={handleDownloadClick} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className={`flex-1 flex flex-col bg-white border-r border-slate-200 ${showPreview ? 'hidden' : 'flex'} md:flex`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-4 border-b border-slate-100">
              <TabsList className="bg-slate-100/50 p-1 w-full justify-start overflow-x-auto no-scrollbar">
                <TabsTrigger value="personal" className="data-[state=active]:bg-white"><User className="w-4 h-4 mr-2" /> Infos</TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-white"><Briefcase className="w-4 h-4 mr-2" /> Expérience</TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-white"><GraduationCap className="w-4 h-4 mr-2" /> Formation</TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-white"><Code className="w-4 h-4 mr-2" /> Compétences</TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-white"><Target className="w-4 h-4 mr-2" /> Projets</TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-white"><Sparkles className="w-4 h-4 mr-2" /> Modèles</TabsTrigger>
                <TabsTrigger value="others" className="data-[state=active]:bg-white"><Plus className="w-4 h-4 mr-2" /> Autres</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-2xl mx-auto space-y-8 pb-20">
                
                {/* Personal Info */}
                <TabsContent value="personal" className="space-y-6 mt-0">
                  <div className="flex flex-col items-center gap-4 mb-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 group relative overflow-hidden">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-indigo-50 flex items-center justify-center transition-all group-hover:scale-105">
                      {data.personalInfo.photo ? (
                        <img src={data.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-10 h-10 text-indigo-200" />
                      )}
                      <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Modifier</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-sm">Photo de profil</h3>
                      <p className="text-xs text-slate-400">Format Carré recommandé (JPG, PNG)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Jean Dupont" 
                        value={data.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Ma fonction actuelle</Label>
                      <Input 
                        id="jobTitle" 
                        placeholder="Développeur Fullstack" 
                        value={data.personalInfo.jobTitle}
                        onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-4 mb-4">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="targetJob" className="text-indigo-900 font-bold">Poste visé (pour l'IA)</Label>
                      <Input 
                        id="targetJob" 
                        placeholder="Ex: Lead Developer chez Google" 
                        className="bg-white border-indigo-100 focus-visible:ring-indigo-600 h-9 text-sm"
                        value={data.personalInfo.targetJob || ''}
                        onChange={(e) => updatePersonalInfo('targetJob', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="jean.dupont@email.com" 
                        value={data.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        placeholder="06 12 34 56 78" 
                        value={data.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Ville, Pays</Label>
                      <Input 
                        id="location" 
                        placeholder="Paris, France" 
                        value={data.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Site web / LinkedIn</Label>
                      <Input 
                        id="website" 
                        placeholder="linkedin.com/in/jeandupont" 
                        value={data.personalInfo.website}
                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="summary">Résumé professionnel</Label>
                      <div className="flex gap-2">
                        {hasSuggestionFor('summary') && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 h-8"
                            onClick={() => applySingleSuggestion('summary')}
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Appliquer suggestion IA
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8"
                          onClick={handleImproveSummary}
                          disabled={isGenerating === 'summary'}
                        >
                          {isGenerating === 'summary' ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                          Améliorer avec l'IA
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      id="summary" 
                      placeholder="Décrivez votre parcours et vos objectifs..." 
                      className="min-h-[120px] resize-none"
                      value={data.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    />
                  </div>
                  <div className="pt-8 flex justify-end">
                    <Button 
                      onClick={() => setActiveTab('experience')}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Suivant : Expériences
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Experience */}
                <TabsContent value="experience" className="space-y-6 mt-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Expériences Professionnelles</h2>
                    <Button onClick={addExperience} size="sm" className="bg-indigo-600">
                      <Plus className="w-4 h-4 mr-2" /> Ajouter
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {data.experience.map((exp, index) => (
                      <Card key={exp.id} className="p-4 border-slate-200 shadow-none relative group">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Entreprise</Label>
                            <Input 
                              placeholder="Google" 
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Poste</Label>
                            <Input 
                              placeholder="Senior Developer" 
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Début</Label>
                            <Input 
                              placeholder="Jan 2020" 
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Fin</Label>
                            <Input 
                              placeholder="Présent" 
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Description</Label>
                            <div className="flex gap-2">
                              {hasSuggestionFor('experience', exp.id) && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 h-8"
                                  onClick={() => applySingleSuggestion('experience', exp.id)}
                                >
                                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                  Appliquer suggestion IA
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8"
                                onClick={() => handleImproveExp(exp.id)}
                                disabled={isGenerating === exp.id}
                              >
                                {isGenerating === exp.id ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                Optimiser
                              </Button>
                            </div>
                          </div>
                          <Textarea 
                            placeholder="Vos réalisations et responsabilités..." 
                            className="min-h-[100px] resize-none"
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="pt-8 flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('personal')}
                      className="border-slate-200 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Précédent
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('education')}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Suivant : Formation
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Education */}
                <TabsContent value="education" className="space-y-6 mt-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Formation</h2>
                    <Button onClick={addEducation} size="sm" className="bg-indigo-600">
                      <Plus className="w-4 h-4 mr-2" /> Ajouter
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <Card key={edu.id} className="p-4 border-slate-200 shadow-none relative group">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>École / Université</Label>
                            <Input 
                              placeholder="HEC Paris" 
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Diplôme</Label>
                            <Input 
                              placeholder="Master en Management" 
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Début</Label>
                            <Input 
                              placeholder="2018" 
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Fin</Label>
                            <Input 
                              placeholder="2020" 
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              disabled={edu.current}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`edu-current-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <Label htmlFor={`edu-current-${edu.id}`} className="text-sm cursor-pointer">En cours</Label>
                        </div>

                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between items-center">
                            <Label>Description / Détails</Label>
                            <div className="flex gap-2">
                              {hasSuggestionFor('education', edu.id) && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 h-8"
                                  onClick={() => applySingleSuggestion('education', edu.id)}
                                >
                                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                  Appliquer suggestion IA
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8"
                                onClick={() => handleImproveEdu(edu.id)}
                                disabled={isGenerating === edu.id}
                              >
                                {isGenerating === edu.id ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                Optimiser
                              </Button>
                            </div>
                          </div>
                          <Textarea 
                            placeholder="Spécialisations, projets académiques, mentions..." 
                            className="min-h-[80px] resize-none"
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="pt-8 flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('experience')}
                      className="border-slate-200 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Précédent
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('skills')}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Suivant : Compétences
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Skills */}
                <TabsContent value="skills" className="space-y-6 mt-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Compétences</h2>
                    <div className="flex gap-2">
                      {hasSuggestionFor('skills') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 h-8"
                          onClick={() => applySingleSuggestion('skills')}
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Appliquer suggestions IA
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        onClick={handleSuggestSkills}
                        disabled={isGenerating === 'skills'}
                      >
                        {isGenerating === 'skills' ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 mr-1.5" />}
                        Suggérer via IA
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ajouter une compétence (ex: React, Management...)" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addSkill(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 transition-colors">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-2 text-slate-400 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8 flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('education')}
                      className="border-slate-200 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Précédent
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('projects')}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Suivant : Projets
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Projects */}
                <TabsContent value="projects" className="space-y-6 mt-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Projets Personnels</h2>
                    <Button onClick={addProject} size="sm" className="bg-indigo-600">
                      <Plus className="w-4 h-4 mr-2" /> Ajouter
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {data.projects.map((proj) => (
                      <Card key={proj.id} className="p-4 border-slate-200 shadow-none relative group">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeProject(proj.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nom du projet</Label>
                              <Input 
                                placeholder="E-commerce App" 
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Lien (optionnel)</Label>
                              <Input 
                                placeholder="github.com/..." 
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Description</Label>
                              <div className="flex gap-2">
                                {hasSuggestionFor('projects', proj.id) && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 h-8"
                                    onClick={() => applySingleSuggestion('projects', proj.id)}
                                  >
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                    Appliquer suggestion IA
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8"
                                  onClick={() => handleImproveProj(proj.id)}
                                  disabled={isGenerating === proj.id}
                                >
                                  {isGenerating === proj.id ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                  Optimiser
                                </Button>
                              </div>
                            </div>
                            <Textarea 
                              placeholder="Décrivez ce que vous avez réalisé..." 
                              className="min-h-[80px] resize-none"
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="pt-8 flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('skills')}
                      className="border-slate-200 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Précédent
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('templates')}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Suivant : Modèles
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Templates */}
                <TabsContent value="templates" className="space-y-6 mt-0">
                  <h2 className="text-lg font-bold">Choisir un modèle</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'modern', name: 'Moderne', desc: 'Indigo, propre et efficace.', color: 'bg-indigo-600' },
                      { id: 'classic', name: 'Classique', desc: 'Sérif, formel et intemporel.', color: 'bg-slate-900' },
                      { id: 'elegant', name: 'Élégant', desc: 'Haut de gamme, idéal pour les cadres.', color: 'bg-indigo-950' },
                      { id: 'minimal', name: 'Minimaliste', desc: 'Pur, direct et ultra-lisible.', color: 'bg-slate-400' },
                      { id: 'creative', name: 'Créatif', desc: 'Sombre, audacieux et unique.', color: 'bg-pink-600' },
                      { id: 'tech', name: 'Technique', desc: 'Style "terminal", parfait pour les développeurs.', color: 'bg-emerald-600' },
                      { id: 'design', name: 'Design', desc: 'Typographie massive, style Suisse moderne et audacieux.', color: 'bg-black' },
                      { id: 'default', name: 'Standard', desc: 'Basique et respectant les standards.', color: 'bg-blue-600' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all group overflow-hidden ${
                          data.templateId === t.id 
                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className={`w-12 h-16 rounded border border-slate-100 overflow-hidden flex flex-col bg-white shrink-0 shadow-sm transition-transform group-hover:scale-105 ${data.templateId === t.id ? 'ring-2 ring-indigo-200' : ''}`}>
                            <div className={`h-4 w-full ${t.color} opacity-20`} />
                            <div className="p-2 space-y-1">
                              <div className="h-0.5 w-full bg-slate-100 rounded-full" />
                              <div className="h-0.5 w-3/4 bg-slate-100 rounded-full" />
                              <div className="h-0.5 w-1/2 bg-slate-100 rounded-full" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold mb-0.5 text-sm">{t.name}</h3>
                            <p className="text-[10px] text-slate-500 leading-tight">{t.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-8 flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('projects')}
                      className="border-slate-200 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Précédent
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('others')}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Suivant : Bonus
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Others */}
                <TabsContent value="others" className="space-y-8 mt-0">
                  {/* Languages */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold">Langues</h2>
                      <Button onClick={addLanguage} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.languages.map((lang) => (
                        <Card key={lang.id} className="p-3 border-slate-200 shadow-none flex items-center gap-3">
                          <Input 
                            placeholder="Français" 
                            className="h-8 text-sm"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                          />
                          <select 
                            className="h-8 text-xs border border-slate-200 rounded px-2 bg-white"
                            value={lang.level}
                            onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                          >
                            <option value="A1">A1 - Débutant</option>
                            <option value="A2">A2 - Élémentaire</option>
                            <option value="B1">B1 - Intermédiaire</option>
                            <option value="B2">B2 - Intermédiaire avancé</option>
                            <option value="C1">C1 - Autonome</option>
                            <option value="C2">C2 - Maîtrise</option>
                            <option value="Maternel">Langue Maternelle</option>
                            <option value="Native">Native</option>
                            <option value="Bilingue">Bilingue</option>
                            <option value="Professionnel">Professionnel</option>
                          </select>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            onClick={() => setData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== lang.id) }))}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold">Loisirs</h2>
                    <Input 
                      placeholder="Ajouter un loisir (ex: Voyages, Photographie...)" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value.trim();
                          if (val && !data.interests.includes(val)) {
                            setData(prev => ({ ...prev, interests: [...prev.interests, val] }));
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {data.interests.map((interest, i) => (
                        <Badge key={i} variant="outline" className="px-3 py-1">
                          {interest}
                          <button 
                            onClick={() => setData(prev => ({ ...prev, interests: prev.interests.filter(it => it !== interest) }))}
                            className="ml-2 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8 flex justify-end gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('templates')}
                      className="border-slate-200 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Précédent
                    </Button>
                    <Button 
                      onClick={handleDownloadClick}
                      className="bg-indigo-600 hover:bg-slate-900 h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      {userStatus === 'free' ? 'Terminer & Aperçu' : 'Télécharger mon CV'}
                      {userStatus === 'free' ? <CheckCircle className="ml-2 w-4 h-4" /> : <Download className="ml-2 w-4 h-4" />}
                    </Button>
                  </div>
                </TabsContent>

              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Side */}
        <div className={`flex-1 bg-slate-200/50 flex flex-col items-center justify-center p-2 lg:p-6 overflow-hidden ${showPreview ? 'flex' : 'hidden'} md:flex relative`}>
          <div className="w-full h-full flex items-center justify-center">
            <ResumePreview 
              data={data} 
              isLocked={userStatus === 'free' && !cvPaid} 
              onUnlock={() => setShowPaymentModal(true)}
            />
          </div>
          
          {userStatus === 'free' && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Mode Aperçu SD (Basse Qualité)
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-100 flex flex-col lg:flex-row max-h-[95vh] lg:max-h-[85vh]"
            >
              {/* Left: Preview Card */}
              <div className="hidden lg:flex w-[480px] bg-slate-100 flex-col items-center justify-center p-8 relative border-r border-slate-200">
                 <div className="absolute top-8 left-8 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Basse Résolution</span>
                    </div>
                 </div>
                 
                 <div className="w-full h-full relative">
                    <ResumePreview data={data} isLocked={false} />
                    {/* Artistic elements */}
                    <div className="absolute bottom-10 -right-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                 </div>
              </div>

              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="p-6 md:p-8 space-y-5 flex-1 flex flex-col justify-center relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowPaymentModal(false)} 
                    className="absolute top-4 right-4 rounded-full hover:bg-slate-100 z-50"
                  >
                    <X className="w-5 h-5 text-slate-300" />
                  </Button>
                  
                  <div className="max-w-md mx-auto w-full space-y-4">
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-black leading-tight mb-3 tracking-tighter">
                        Accédez à votre CV en <span className="text-indigo-600 italic">HD.</span>
                      </h2>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {[
                          "Export PDF HD",
                          "Analyse ATS IA",
                          "Correction IA",
                          "Modèles Pro"
                        ].map((benefit, i) => (
                          <div key={i} className="flex gap-2 items-center group">
                            <div className="bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                              <CheckCircle className="text-indigo-600 w-3 h-3" />
                            </div>
                            <p className="text-slate-600 font-bold text-[11px] tracking-tight whitespace-nowrap">{benefit}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <CreditCard className="text-indigo-600 w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Sécurité PayPal</p>
                        <p className="text-[11px] text-slate-500 font-bold leading-none">Paiement 100% sécurisé.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {userStatus === 'free' && !cvPaid ? (
                        <div className="space-y-3">
                          <div className="relative">
                            <button 
                              onClick={() => handleRealPayment('single_paid')}
                              disabled={isGenerating === 'payment'}
                              className="group w-full bg-slate-900 px-6 py-4 rounded-2xl text-white transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 relative overflow-hidden"
                            >
                              <div className="relative z-10 flex flex-col items-start text-left">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">Accès Unique</span>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                  <h3 className="text-lg font-black tracking-tight">Télécharger en HD</h3>
                                  <span className="text-xl font-black tracking-tighter">0.99€</span>
                                </div>
                              </div>
                            </button>
                            
                            <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                              <AlertTriangle className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                              <p className="text-[9px] leading-tight font-bold text-amber-700">
                                <span className="uppercase font-black">Ne fermez pas cet onglet</span> avant d'avoir téléchargé votre CV.
                              </p>
                            </div>
                          </div>

                          <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest text-slate-300">
                            <span className="bg-white px-4 relative z-10">Ou abonnement</span>
                            <div className="absolute inset-y-1/2 left-0 w-full border-t border-slate-100 -z-0"></div>
                          </div>

                          <button 
                            onClick={() => handleRealPayment('pro')}
                            disabled={isGenerating === 'payment'}
                            className="group w-full bg-indigo-600 px-6 py-4 rounded-2xl text-white transition-all shadow-xl shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 relative overflow-hidden"
                          >
                            <div className="relative z-10 flex flex-col items-start text-left">
                              <div className="px-2 py-0.5 bg-white/10 rounded-full border border-white/20 mb-1">
                                <span className="text-[9px] font-black uppercase tracking-widest">Abonnement Pro</span>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <h3 className="text-lg font-black tracking-tight">Accès Illimité</h3>
                                <span className="text-xl font-black tracking-tighter">4.99€<span className="text-[10px] font-normal opacity-60">/m</span></span>
                              </div>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex flex-col items-center text-center gap-3">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600 shrink-0">
                               <CheckCircle className="w-6 h-6" />
                             </div>
                             <div>
                               <h3 className="text-lg font-black text-slate-900 mb-0.5 leading-none">Paiement Confirmé !</h3>
                               <p className="text-slate-500 text-[11px] font-bold">
                                 {cvDownloaded && userStatus !== 'pro' ? "Vous avez déjà téléchargé ce CV." : "Téléchargez votre CV maintenant."}
                               </p>
                             </div>
                          </div>
                          
                          <Button 
                            onClick={downloadPDF}
                            disabled={cvDownloaded && userStatus !== 'pro'}
                            className="group w-full bg-slate-900 h-14 rounded-2xl text-white transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden disabled:opacity-50"
                          >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                              <Download className="w-5 h-5" />
                              <span className="text-lg font-black">
                                {cvDownloaded && userStatus !== 'pro' ? "Déjà téléchargé" : "Télécharger le PDF"}
                              </span>
                            </div>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <PaymentCheckout 
              isOpen={checkoutConfig.isOpen}
              amount={checkoutConfig.amount}
              description={checkoutConfig.description}
              onSuccess={handleCheckoutSuccess}
              onCancel={() => setCheckoutConfig(prev => ({ ...prev, isOpen: false }))}
            />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Modal - REMOVED, HANDLED BY APP.TSX */}

      {/* Analysis Modal */}
      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Sparkles className="text-indigo-600 w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Analyse de votre CV</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setAnalysis(null)} className="rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-8">
                  <div className="prose prose-slate max-w-none prose-sm sm:prose-base prose-headings:text-indigo-900 prose-strong:text-slate-900">
                    <ReactMarkdown>{analysis.markdown || analysis}</ReactMarkdown>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 bg-white shrink-0">
                {analysis?.suggestedUpdates && Object.keys(analysis.suggestedUpdates).length > 0 && (
                  <Button 
                    onClick={applySuggestions} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Appliquer les suggestions IA
                  </Button>
                )}
                <Button variant="outline" onClick={() => setAnalysis(null)} className="border-slate-200">
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
