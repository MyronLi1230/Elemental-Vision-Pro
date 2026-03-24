import React, { useState } from 'react';
import { ElementData, Language } from './types';
import PeriodicTable from './components/PeriodicTable';
import ElementDetail from './components/ElementDetail';
import { Globe, Box } from 'lucide-react';
import { ELEMENTS } from './data/elementData';

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [searchQuery, setSearchQuery] = useState('');

  // Search Logic
  const filteredElements = searchQuery 
    ? ELEMENTS.filter(e => 
        e.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.name_cn.includes(searchQuery) ||
        e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.number.toString() === searchQuery
      )
    : [];

  const handleOpen = (e: ElementData, rect?: DOMRect) => {
    setIsClosing(false);
    setSelectedElement(e);
    setOriginRect(rect || null);
    setSearchQuery('');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedElement(null);
      setOriginRect(null);
      setIsClosing(false);
    }, 300); // Matches animation duration
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden">
      
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 h-14 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            <Box size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block">
            {lang === 'en' ? 'Atomic Vision' : '原子视界'}
          </span>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs font-medium"
          >
            <Globe size={14} />
            <span className="uppercase">{lang}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 px-2 md:px-4 flex-1 flex flex-col h-full">
        <div className="text-center mb-2 mt-1 shrink-0">
          <h2 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-blue-300 mb-1">
             {lang === 'en' ? 'See the Unseen' : '看见不可见'}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-xs hidden md:block">
            {lang === 'en' 
              ? 'Explore the building blocks of the universe with immersive 3D visualization.' 
              : '通过沉浸式 3D 可视化，探索构成宇宙的基石。'}
          </p>
        </div>

        <div className="flex-1 min-h-0 relative">
          <PeriodicTable 
            onSelect={handleOpen} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredElements={filteredElements}
            lang={lang}
          />
        </div>
      </main>

      {/* Detail Modal */}
      {selectedElement && (
        <ElementDetail 
          element={selectedElement} 
          onClose={handleClose} 
          lang={lang} 
          isClosing={isClosing}
          originRect={originRect}
        />
      )}
    </div>
  );
};

export default App;