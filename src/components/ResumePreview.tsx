import React from 'react';
import { ResumeData } from '@/src/types';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechTemplate from './templates/TechTemplate';
import DesignTemplate from './templates/DesignTemplate';
import DefaultTemplate from './templates/DefaultTemplate';
import { Mail, Phone, MapPin, Globe, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumePreviewProps {
  data: ResumeData;
  isLocked?: boolean;
  onUnlock?: () => void;
}

export default function ResumePreview({ data, isLocked = false, onUnlock }: ResumePreviewProps) {
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [contentHeight, setContentHeight] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const padding = 64; 
        const containerWidth = containerRef.current.offsetWidth - padding;
        const containerHeight = containerRef.current.offsetHeight - padding;
        
        // Measure current content height to see if we need multiple pages
        const rawContentHeight = contentRef.current?.offsetHeight || 1122;
        const totalHeight = Math.max(1122, rawContentHeight);
        
        const widthScale = containerWidth / 794;
        const heightScale = containerHeight / totalHeight;
        
        // Scale down to fit the smaller dimension to see everything at once
        const newScale = Math.min(widthScale, heightScale, 1); 
        setScale(newScale);
      }
      
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    
    // Also re-run when content height potentially changes
    const timeoutId = setTimeout(handleResize, 100);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [data]); // Re-run if data changes

  const renderTemplate = () => {
    switch (data.templateId) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'elegant':
        return <ElegantTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'tech':
        return <TechTemplate data={data} />;
      case 'design':
        return <DesignTemplate data={data} />;
      default:
        return <DefaultTemplate data={data} />;
    }
  };

  return (
    <div className="relative group/preview w-full h-full flex items-center justify-center p-8 overflow-hidden bg-slate-200/50" ref={containerRef}>
      <div className="relative" style={{ width: 794 * scale, height: Math.max(1122, contentHeight) * scale }}>
        <div 
          id="resume-preview" 
          className={`bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] text-slate-900 font-sans transition-all duration-300 relative min-h-[1122px] w-[794px] origin-top-left ${isLocked ? 'blur-[10px] select-none pointer-events-none brightness-95 opacity-80' : ''}`}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div ref={contentRef} className="relative z-10">
            {renderTemplate()}
          </div>
          
          {/* Page break indicators */}
          {Array.from({ length: Math.max(1, Math.ceil(contentHeight / 1122) - 1) }).map((_, i) => (
            <div 
              key={i} 
              className="absolute left-0 right-0 z-30 flex items-center justify-center"
              style={{ top: (i + 1) * 1122 }}
            >
              <div className="w-[calc(100%+40px)] -ml-[20px] h-4 bg-slate-100 shadow-inner flex items-center justify-center border-y border-slate-200">
                <div className="flex gap-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-[1px] w-8 bg-slate-300 border-t border-dashed border-slate-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
              <div className="grid grid-cols-3 gap-24 rotate-45 scale-150">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span key={i} className="text-5xl font-black whitespace-nowrap tracking-tighter">NOVACV PREVIEW</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/10 backdrop-blur-[2px]">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-sm text-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-display font-black text-2xl mb-4 leading-tight">Aperçu en basse qualité</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Le rendu haute définition est réservé aux membres. Débloquez ce CV pour 0.99€ ou passez en Pro.
            </p>
            <Button 
              onClick={onUnlock}
              className="w-full bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl h-14 font-bold shadow-xl shadow-indigo-100"
            >
              Débloquer la HD
            </Button>
            <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paiement sécurisé via Stripe</p>
          </div>
        </div>
      )}
    </div>
  );
}
