import React, { useState } from 'react';
import { ElementData, Language, TableMode, FilterState, Classification } from './types';
import PeriodicTable from './components/PeriodicTable';
import ElementDetail from './components/ElementDetail';
import FilterBar from './components/FilterBar';
import { Globe, Box, Thermometer, Palette } from 'lucide-react';
import { ELEMENTS } from './data/elementData';
import { getClassificationLabel, getClassificationColor } from './utils/colors';

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  const [searchQuery, setSearchQuery] = useState('');
  const [temperature, setTemperature] = useState(298); // Kelvin (25°C)
  const [tableMode, setTableMode] = useState<TableMode>('standard');
  const [historyYear, setHistoryYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState<FilterState>({
    classification: null,
    category: null,
    group: null,
    block: null,
    period: null
  });
  const [hoveredClassification, setHoveredClassification] = useState<Classification | null>(null);

  const toggleClassification = (c: Classification) => {
    setFilters(prev => {
      if (prev.classification === c) {
        return {
          classification: null,
          category: null,
          group: null,
          block: null,
          period: null
        };
      }
      return {
        classification: c,
        category: null,
        group: null,
        block: null,
        period: null
      };
    });
  };

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
    <div className="h-screen h-[100dvh] bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden">
      
      {/* Navbar / Header */}
      <header className="flex-shrink-0 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 h-16 flex items-center px-2 md:px-6">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 md:w-12 lg:w-48 transition-all">
          <div className="w-9 h-9 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <Box size={20} className="text-black" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-black text-sm tracking-tighter leading-none">
              {lang === 'en' ? 'Atomic Vision' : '原子视界'}
            </span>
            <span className="text-[9px] text-white/30 font-bold tracking-widest">
              {lang === 'en' ? 'Elements' : '周期表'}
            </span>
          </div>
        </div>

        {/* Center: Main Controls */}
        <div className="flex-1 flex items-center justify-center gap-1 lg:gap-4 overflow-hidden">
          {/* Classification Filters */}
          <div className="flex items-center gap-0.5 bg-white/5 p-0.5 rounded-full border border-white/10 overflow-x-auto no-scrollbar scroll-smooth min-w-0 max-w-[55vw] sm:max-w-none">
            {(['metal', 'non-metal', 'metalloid'] as Classification[]).map(c => (
              <button
                key={c}
                onClick={() => toggleClassification(c)}
                onMouseEnter={() => setHoveredClassification(c)}
                onMouseLeave={() => setHoveredClassification(null)}
                style={{
                  backgroundColor: filters.classification === c ? getClassificationColor(c) : 'transparent',
                  borderColor: filters.classification === c ? 'transparent' : `${getClassificationColor(c)}22`,
                  color: filters.classification === c ? '#1e293b' : getClassificationColor(c),
                  boxShadow: filters.classification === c ? `0 0 15px ${getClassificationColor(c)}66` : 'none'
                }}
                className={`px-1.5 lg:px-4 py-1.5 rounded-full text-[8.5px] lg:text-[11px] font-black tracking-tight transition-all border shrink-0 capitalize active:scale-95`}
              >
                {getClassificationLabel(c, lang)}
              </button>
            ))}
          </div>

          {/* Tablet & Desktop Sliders */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-white/5 px-1.5 lg:px-3 py-1.5 rounded-full border border-white/10 shrink-0">
            <span className="hidden xl:inline text-[10px] font-bold text-emerald-400 tracking-widest whitespace-nowrap">Year</span>
            <span className="xl:hidden text-[10px] font-bold text-emerald-400">Y</span>
            <input 
              type="range" min="1600" max={new Date().getFullYear()} value={historyYear} 
              onChange={(e) => setHistoryYear(Number(e.target.value))}
              className="w-10 lg:w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] font-bold text-emerald-400/80 font-mono">{historyYear}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-white/5 px-1.5 lg:px-3 py-1.5 rounded-full border border-white/10 shrink-0">
            <Thermometer size={12} className="text-rose-400 shrink-0" />
            <input 
              type="range" min="0" max="6000" value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-10 lg:w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[10px] font-bold text-rose-400 whitespace-nowrap">{temperature}K</span>
          </div>

          {/* Table Mode Selector */}
          <div className="flex items-center gap-1 lg:gap-2 bg-white/5 px-2 lg:px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all shrink-0">
            <Palette size={12} className="text-violet-400 shrink-0" />
            <select 
              value={tableMode}
              onChange={(e) => setTableMode(e.target.value as TableMode)}
              className="bg-transparent text-[8.5px] lg:text-xs outline-none cursor-pointer text-violet-300 font-bold capitalize tracking-tighter max-w-[65px] lg:max-w-none"
            >
              <option value="standard" className="bg-[#0f172a]">{lang === 'en' ? 'Standard' : '标准模式'}</option>
              <option value="electronegativity" className="bg-[#0f172a]">{lang === 'en' ? 'Electronegativity' : '电负性'}</option>
              <option value="ionization_energy" className="bg-[#0f172a]">{lang === 'en' ? 'Ionization' : '电离能'}</option>
              <option value="electron_affinity" className="bg-[#0f172a]">{lang === 'en' ? 'Affinity' : '亲和能'}</option>
              <option value="atomic_radius" className="bg-[#0f172a]">{lang === 'en' ? 'Atomic Radius' : '原子半径'}</option>
              <option value="ionic_radius" className="bg-[#0f172a]">{lang === 'en' ? 'Ionic Radius' : '离子半径'}</option>
              <option value="melting_point" className="bg-[#0f172a]">{lang === 'en' ? 'Melting' : '熔点'}</option>
              <option value="boiling_point" className="bg-[#0f172a]">{lang === 'en' ? 'Boiling' : '沸点'}</option>
              <option value="density" className="bg-[#0f172a]">{lang === 'en' ? 'Density' : '密度'}</option>
            </select>
          </div>
        </div>

        {/* Right: Lang */}
        <div className="flex-shrink-0 flex items-center gap-1 md:gap-2">
           <button 
             onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')}
             className="flex items-center justify-center w-8 h-8 md:w-auto md:px-3 rounded-full hover:bg-white/5 border border-white/5 transition-all"
           >
             <Globe size={16} className="md:mr-1.5" />
             <span className="hidden md:block font-black text-[10px] uppercase">{lang}</span>
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden px-2 md:px-4">
        <div className="flex-1 min-h-0 relative flex flex-col py-2">
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            lang={lang} 
          />
          
          <div className="flex-1 min-h-0 relative flex flex-col">
            <PeriodicTable 
              onSelect={handleOpen} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredElements={filteredElements}
              lang={lang}
              temperature={temperature}
              tableMode={tableMode}
              historyYear={historyYear}
              filters={filters}
              hoveredClassification={hoveredClassification}
            />
          </div>
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
          temperature={temperature}
        />
      )}
    </div>
  );
};

export default App;