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
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30">
      
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            <Box size={20} className="text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block">
            {lang === 'en' ? 'Elemental Vision' : '元素视界'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder={lang === 'en' ? "Search element, symbol, number..." : "搜索元素、符号、序号..."}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-sm"
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
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between border-b border-white/5 last:border-0"
                  >
                    <div>
                      <span className="font-bold text-emerald-400 w-8 inline-block">{e.symbol}</span>
                      <span className="text-white/80">{lang === 'en' ? e.name_en : e.name_cn}</span>
                    </div>
                    <span className="text-xs text-white/30">#{e.number}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-white/40 text-sm">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <button 
          onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-sm"
        >
          <Globe size={16} />
          <span className="uppercase">{lang}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-blue-300 mb-4">
             {lang === 'en' ? 'See the Unseen' : '看见不可见'}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
            {lang === 'en' 
              ? 'Explore the building blocks of the universe with immersive 3D visualization and real-time data.' 
              : '通过沉浸式 3D 可视化和实时数据，探索构成宇宙的基石。'}
          </p>
        </div>

        <PeriodicTable onSelect={setSelectedElement} />
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
