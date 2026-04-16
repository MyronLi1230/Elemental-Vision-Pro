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
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden">
      
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 h-14 flex items-center px-4 md:px-6">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 md:w-48">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
            <Box size={18} className="text-black" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-sm tracking-tighter leading-none">
              {lang === 'en' ? 'ATOMIC VISION' : '原子视界'}
            </span>
            <span className="text-[9px] text-white/30 font-bold tracking-widest uppercase">
              {lang === 'en' ? 'Elements' : '周期表'}
            </span>
          </div>
        </div>

        {/* Center: Main Controls */}
        <div className="flex-1 flex items-center justify-end md:justify-center gap-1.5 md:gap-4 px-2">
          {/* Classification Filters */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto no-scrollbar scroll-smooth">
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
                className={`px-2.5 md:px-4 py-1.5 rounded-full text-[9px] md:text-[11px] font-black tracking-wider transition-all border shrink-0 uppercase active:scale-95`}
              >
                {getClassificationLabel(c, lang)}
              </button>
            ))}
          </div>

          {/* Table Mode Selector */}
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all">
            <Palette size={14} className="text-violet-400 shrink-0" />
            <select 
              value={tableMode}
              onChange={(e) => setTableMode(e.target.value as TableMode)}
              className="bg-transparent text-[10px] md:text-xs outline-none cursor-pointer text-violet-300 font-bold uppercase tracking-tight max-w-[60px] md:max-w-none"
            >
              <option value="standard" className="bg-[#0f172a]">{lang === 'en' ? 'STD' : '标准'}</option>
              <option value="electronegativity" className="bg-[#0f172a]">{lang === 'en' ? 'EN' : '电负性'}</option>
              <option value="ionization_energy" className="bg-[#0f172a]">{lang === 'en' ? 'IE' : '电离能'}</option>
              <option value="electron_affinity" className="bg-[#0f172a]">{lang === 'en' ? 'EA' : '亲和能'}</option>
              <option value="atomic_radius" className="bg-[#0f172a]">{lang === 'en' ? 'AR' : '原子半径'}</option>
              <option value="ionic_radius" className="bg-[#0f172a]">{lang === 'en' ? 'IR' : '离子半径'}</option>
              <option value="melting_point" className="bg-[#0f172a]">{lang === 'en' ? 'MP' : '熔点'}</option>
              <option value="boiling_point" className="bg-[#0f172a]">{lang === 'en' ? 'BP' : '沸点'}</option>
              <option value="density" className="bg-[#0f172a]">{lang === 'en' ? 'D' : '密度'}</option>
            </select>
          </div>

          {/* Desktop Only Sliders */}
          <div className="hidden xl:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">YEAR</span>
            <input 
              type="range" min="1600" max={new Date().getFullYear()} value={historyYear} 
              onChange={(e) => setHistoryYear(Number(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="hidden xl:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Thermometer size={14} className="text-rose-400" />
            <input 
              type="range" min="0" max="6000" value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        {/* Right: Lang */}
        <button 
          onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')}
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-auto md:px-4 rounded-full hover:bg-white/5 md:border md:border-white/5 transition-all"
        >
          <Globe size={18} className="md:mr-2" />
          <span className="hidden md:block font-black text-xs uppercase">{lang}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-14 px-2 md:px-4 flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 min-h-0 relative flex flex-col pt-2">
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            lang={lang} 
          />
          <div className="flex-1 min-h-0 relative">
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