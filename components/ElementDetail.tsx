import React, { useState, useMemo } from 'react';
import { X, Layers, Activity, BookOpen, AlertTriangle, Atom, Zap, Scale, Thermometer } from 'lucide-react';
import { ElementData, Language, VisualMode } from '../types';
import { getCategoryColor, getCategoryGlow } from '../utils/colors';
import { AtomVisualizer } from './Atom3D';
import { DensityChart } from './PropertyCharts';

interface DetailProps {
  element: ElementData | null;
  onClose: () => void;
  lang: Language;
  isClosing: boolean;
  originRect: DOMRect | null;
}

const ElementDetail: React.FC<DetailProps> = ({ element, onClose, lang, isClosing, originRect }) => {
  const [visualMode, setVisualMode] = useState<VisualMode>('bohr');
  
  // Calculate transform-origin dynamically
  // The modal content is centered in the viewport.
  // We need to find the offset of the originRect center relative to the window center.
  const animationStyle = useMemo(() => {
    if (!originRect) return {};

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Center of the clicked element
    const originX = originRect.left + originRect.width / 2;
    const originY = originRect.top + originRect.height / 2;

    // Center of the screen (where the modal is centered)
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;

    // Calculate offset
    const deltaX = originX - centerX;
    const deltaY = originY - centerY;

    return {
      transformOrigin: `calc(50% + ${deltaX}px) calc(50% + ${deltaY}px)`
    };
  }, [originRect]);

  if (!element) return null;

  const color = getCategoryColor(element.category);
  const glow = getCategoryGlow(element.category);

  // Temperature Conversions
  const formatTemp = (k: number | undefined) => {
    if (k === undefined || k === null) return 'N/A';
    const c = (k - 273.15).toFixed(1);
    return (
      <span>
        {k} K <span className="text-white/50 text-sm">({c}°C)</span>
      </span>
    );
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`}
      onClick={(e) => {
        // Close if clicking outside
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0f172a]/90 md:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row ${isClosing ? 'anim-scale-out-safe' : 'anim-scale-in'}`}
        style={{ 
          boxShadow: glow,
          ...animationStyle
        }}
      >
        {/* Close Button Mobile */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 md:hidden p-2 bg-black/50 rounded-full hover:bg-black/70 active:scale-95 transition-all"
        >
          <X className="text-white" />
        </button>

        {/* Left: 3D Visualization Area */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-full relative bg-gradient-to-b from-black/40 to-transparent p-4 flex flex-col">
          <div className="flex-1 relative">
            <AtomVisualizer element={element} mode={visualMode} color={color} />
          </div>
          
          {/* Mode Toggle */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-1 rounded-full border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setVisualMode('bohr')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${visualMode === 'bohr' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              <Atom size={16} />
              Bohr
            </button>
            <button
              onClick={() => setVisualMode('cloud')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${visualMode === 'cloud' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
            >
              <Activity size={16} />
              Cloud
            </button>
          </div>
        </div>

        {/* Right: Data Scroll Area */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-full overflow-y-auto bg-black/20 p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 hidden md:block hover:bg-white/10 p-2 rounded-full transition-all hover:rotate-90"
          >
            <X size={24} className="text-white/70" />
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-6xl font-bold text-white tracking-tighter">{element.symbol}</h1>
              <div className="flex flex-col">
                 <span className="text-2xl font-light text-white/90">
                   {lang === 'en' ? element.name_en : element.name_cn}
                 </span>
                 {lang === 'zh' && <span className="text-sm text-white/50">{element.pinyin}</span>}
              </div>
            </div>
            <div className="flex gap-3 text-sm font-mono text-white/60">
              <span className="px-2 py-0.5 border border-white/20 rounded">No. {element.number}</span>
              <span className="px-2 py-0.5 border border-white/20 rounded">{element.atomic_mass.toFixed(3)} u</span>
              <span className="px-2 py-0.5 rounded text-black font-bold" style={{ backgroundColor: color }}>
                {element.category.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          {/* Config & Structure */}
          <section className="mb-6 grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                  <Layers size={12} /> {lang === 'en' ? 'Electron Config' : '电子排布'}
                </h3>
                <code className="text-lg text-emerald-400 font-mono">{element.electron_configuration}</code>
                <div className="mt-2 text-xs text-white/50">
                  Shells: {element.shells.join(', ')}
                </div>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                   <Zap size={12} /> {lang === 'en' ? 'Oxidation States' : '氧化态'}
                </h3>
                <div className="text-lg text-white/90 font-mono break-words">
                   {element.oxidation_states}
                </div>
             </div>
          </section>

          {/* Atomic Properties */}
          <section className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Scale size={12} /> {lang === 'en' ? 'Atomic Properties' : '原子性质'}
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="block text-xs text-white/40 mb-1">{lang === 'en' ? 'Atomic Radius' : '原子半径'}</span>
                <div className="text-lg font-mono text-white/90">
                  {element.atomic_radius ? `${element.atomic_radius} pm` : 'N/A'}
                </div>
              </div>
              <div>
                <span className="block text-xs text-white/40 mb-1">{lang === 'en' ? 'Electronegativity' : '电负性'}</span>
                <div className="text-lg font-mono text-white/90">
                  {element.electronegativity ? element.electronegativity : 'N/A'}
                </div>
              </div>
              <div>
                <span className="block text-xs text-white/40 mb-1">{lang === 'en' ? 'Ionization Energy' : '电离能'}</span>
                <div className="text-lg font-mono text-white/90">
                  {element.ionization_energy ? `${element.ionization_energy} kJ/mol` : 'N/A'}
                </div>
              </div>
              <div>
                <span className="block text-xs text-white/40 mb-1">{lang === 'en' ? 'Electron Affinity' : '电子亲和能'}</span>
                <div className="text-lg font-mono text-white/90">
                  {element.electron_affinity ? `${element.electron_affinity} kJ/mol` : 'N/A'}
                </div>
              </div>
            </div>
          </section>

          {/* Physical Properties (Updated: Text + Chart) */}
          <section className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
             <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                <Thermometer size={12} /> {lang === 'en' ? 'Physical Properties' : '物理性质'}
             </h3>
             
             {/* Text Data for Melting/Boiling Points */}
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                    <span className="block text-xs text-white/40 mb-1">{lang === 'en' ? 'Melting Point' : '熔点'}</span>
                    <div className="text-lg font-mono text-white/90">
                        {formatTemp(element.melting_point)}
                    </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <span className="block text-xs text-white/40 mb-1">{lang === 'en' ? 'Boiling Point' : '沸点'}</span>
                    <div className="text-lg font-mono text-white/90">
                         {formatTemp(element.boiling_point)}
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                <DensityChart element={element} color={color} lang={lang} />
             </div>
          </section>

          {/* History & Story */}
          <section className="mb-8">
             <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
               <BookOpen size={12} /> {lang === 'en' ? 'History & Story' : '历史背景'}
             </h3>
             <p className="text-white/80 leading-relaxed text-sm mb-4">
               {lang === 'en' ? element.summary_en : element.summary_cn}
             </p>
             <div className="text-xs text-white/50 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-white/30">Discovered By</span>
                  {element.discoverer || 'Unknown'}
                </div>
                <div>
                  <span className="block text-white/30">Year</span>
                  {element.discovery_year || 'Ancient'}
                </div>
             </div>
          </section>

          {/* Usage & Safety */}
          <section className="grid md:grid-cols-2 gap-4 mb-8">
             <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <h3 className="text-xs uppercase tracking-widest text-emerald-400 mb-2">
                   {lang === 'en' ? 'Application' : '应用'}
                </h3>
                <p className="text-sm text-white/80">
                   {lang === 'en' ? element.usage_en : element.usage_cn}
                </p>
             </div>
             {element.hazard_en && (
               <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                  <h3 className="text-xs uppercase tracking-widest text-rose-400 mb-2 flex items-center gap-2">
                     <AlertTriangle size={12} /> {lang === 'en' ? 'Hazard' : '危险性'}
                  </h3>
                  <p className="text-sm text-white/80">
                     {lang === 'en' ? element.hazard_en : element.hazard_cn}
                  </p>
               </div>
             )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default ElementDetail;