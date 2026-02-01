import React, { useState } from 'react';
import { ElementData, Language } from './types';
import PeriodicTable from './components/PeriodicTable';
import ElementDetail from './components/ElementDetail';
import { Search, Globe, Box } from 'lucide-react';
import { ELEMENTS } from './data/elementData';

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
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

  const handleSearchSelect = (e: ElementData) => {
    setSelectedElement(e);
    setSearchQuery('');
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
            {lang === 'en' ? 'Elemental Vision' : '元素视界'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm w-full mx-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input 
              type="text" 
              placeholder={lang === 'en' ? "Search..." : "搜索元素..."}
              className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-xs md:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Search Dropdown */}
          {searchQuery && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50">
              {filteredElements.length > 0 ? (
                filteredElements.map(e => (
                  <button 
                    key={e.number}
                    onClick={() => handleSearchSelect(e)}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between border-b border-white/5 last:border-0"
                  >
                    <div>
                      <span className="font-bold text-emerald-400 w-8 inline-block text-sm">{e.symbol}</span>
                      <span className="text-white/80 text-sm">{lang === 'en' ? e.name_en : e.name_cn}</span>
                    </div>
                    <span className="text-xs text-white/30">#{e.number}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-white/40 text-xs">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <button 
          onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs font-medium"
        >
          <Globe size={14} />
          <span className="uppercase">{lang}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-2 md:px-4 flex-1 flex flex-col h-full">
        <div className="text-center mb-2 shrink-0">
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
          <PeriodicTable onSelect={setSelectedElement} />
        </div>
      </main>

      {/* Detail Modal */}
      {selectedElement && (
        <ElementDetail 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
          lang={lang} 
        />
      )}
    </div>
  );
};

export default App;