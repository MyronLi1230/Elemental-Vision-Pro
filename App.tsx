import React, { useState } from 'react';
import { ElementData, Language, TableMode, FilterState, Classification } from './types';
import PeriodicTable from './components/PeriodicTable';
import ElementDetail from './components/ElementDetail';
import FilterBar from './components/FilterBar';
import { Globe, Box, Thermometer, Palette } from 'lucide-react';
import { ELEMENTS } from './data/elementData';

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
        <div className="flex-shrink-0 flex items-center gap-2 w-48">
          <div className="w-7 h-7 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            <Box size={16} className="text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none">
              {lang === 'en' ? 'Atomic Vision' : '原子视界'}
            </span>
            <span className="text-[10px] text-white/40 font-medium tracking-wide">
              {lang === 'en' ? 'See the Unseen' : '看见不可见'}
            </span>
          </div>
        </div>

        {/* Center: Main Controls */}
        <div className="flex-1 flex items-center justify-center gap-4">
          {/* History Slider (Desktop) */}
          <div className="hidden xl:flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              {lang === 'en' ? 'History' : '历史'}
            </span>
            <input 
              type="range" 
              min="1600" 
              max={new Date().getFullYear()} 
              value={historyYear} 
              onChange={(e) => setHistoryYear(Number(e.target.value))}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] font-mono w-10 text-right text-emerald-400">
              {historyYear}
            </span>
          </div>

          {/* Temperature Slider (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Thermometer size={14} className="text-rose-400" />
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
              {lang === 'en' ? 'Temp' : '温度'}
            </span>
            <input 
              type="range" 
              min="0" 
              max="6000" 
              value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[10px] font-mono w-12 text-right text-rose-400">
              {temperature}K
            </span>
          </div>

          {/* Table Mode Selector */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Palette size={14} className="text-violet-400" />
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
              {lang === 'en' ? 'Mode' : '模式'}
            </span>
            <select 
              value={tableMode}
              onChange={(e) => setTableMode(e.target.value as TableMode)}
              className="bg-transparent text-[10px] outline-none cursor-pointer text-violet-300 font-medium"
            >
              <option value="standard" className="bg-[#0f172a]">{lang === 'en' ? 'Standard' : '标准模式'}</option>
              <option value="electronegativity" className="bg-[#0f172a]">{lang === 'en' ? 'Electronegativity' : '电负性'}</option>
              <option value="ionization_energy" className="bg-[#0f172a]">{lang === 'en' ? 'Ionization Energy' : '电离能'}</option>
              <option value="electron_affinity" className="bg-[#0f172a]">{lang === 'en' ? 'Electron Affinity' : '电子亲和能'}</option>
              <option value="atomic_radius" className="bg-[#0f172a]">{lang === 'en' ? 'Atomic Radius' : '原子半径'}</option>
              <option value="ionic_radius" className="bg-[#0f172a]">{lang === 'en' ? 'Ionic Radius' : '离子半径'}</option>
              <option value="melting_point" className="bg-[#0f172a]">{lang === 'en' ? 'Melting Point' : '熔点'}</option>
              <option value="boiling_point" className="bg-[#0f172a]">{lang === 'en' ? 'Boiling Point' : '沸点'}</option>
              <option value="density" className="bg-[#0f172a]">{lang === 'en' ? 'Density' : '密度'}</option>
            </select>
          </div>

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
      <main className="pt-14 px-2 md:px-4 flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 min-h-0 relative flex flex-col pt-2">
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            lang={lang} 
            onHoverClassification={setHoveredClassification}
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