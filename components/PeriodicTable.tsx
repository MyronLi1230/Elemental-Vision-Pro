import React, { useState, useRef, useEffect } from 'react';
import { ELEMENTS } from '../data/elementData';
import { ElementData, Language, TableMode, FilterState, Classification, PeriodFilter } from '../types';
import { getCategoryColor, getCategoryName } from '../utils/colors';
import { ZoomIn, ZoomOut, RotateCcw, Move, Search, X, Info, FlaskConical, Zap, Activity } from 'lucide-react';

import { CATEGORY_DESCRIPTIONS, CLASSIFICATION_DESCRIPTIONS } from '../data/categoryDescriptions';
import { GROUP_DESCRIPTIONS, PERIOD_DESCRIPTIONS, BLOCK_DESCRIPTIONS } from '../data/groupPeriodBlockDescriptions';

interface PeriodicTableProps {
  onSelect: (element: ElementData, rect?: DOMRect) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredElements: ElementData[];
  lang: Language;
  temperature: number;
  tableMode: TableMode;
  historyYear: number;
  filters: FilterState;
  hoveredClassification?: Classification | null;
}

interface TileProps {
  e: ElementData;
  onSelect: (element: ElementData, rect?: DOMRect) => void;
  isFBlock?: boolean;
  temperature: number;
  tableMode: TableMode;
  historyYear: number;
  lang: Language;
  hoveredGroup: number | null;
  hoveredPeriod: PeriodFilter | null;
  setHoveredGroup: (g: number | null) => void;
  setHoveredPeriod: (p: PeriodFilter | null) => void;
  setHoveredElement: (e: ElementData | null) => void;
  onHover: (e: ElementData | null, g: number | null, p: PeriodFilter | null, b: string | null) => void;
  filters: FilterState;
}

const isLanthanide = (n: number) => n >= 57 && n <= 71;
const isActinide = (n: number) => n >= 89 && n <= 103;

const MODE_DESCRIPTIONS: Record<TableMode, { en: string; zh: string }> = {
  standard: {
    en: 'Standard view showing element categories and physical phases at given temperature.',
    zh: '标准视图，显示元素类别及在给定温度下的物理物相。'
  },
  electronegativity: {
    en: 'A measure of the tendency of an atom to attract a bonding pair of electrons.',
    zh: '衡量原子吸引成键电子对能力的物理量。'
  },
  atomic_radius: {
    en: 'The typical distance from the center of the nucleus to the boundary of the surrounding shells of electrons.',
    zh: '从原子核中心到其最外层电子的平均距离。'
  },
  ionic_radius: {
    en: 'The radius of a monatomic ion in an ionic crystal structure.',
    zh: '离子晶体结构中单原子离子的半径。'
  },
  melting_point: {
    en: 'The temperature at which a substance changes from solid to liquid at atmospheric pressure.',
    zh: '物质在常压下由固态转变为液态时的温度。'
  },
  boiling_point: {
    en: 'The temperature at which a substance changes from liquid to gas at atmospheric pressure.',
    zh: '物质在常压下由液态转变为气态时的温度。'
  },
  density: {
    en: 'The mass per unit volume of a substance.',
    zh: '物质单位体积的质量。'
  },
  ionization_energy: {
    en: 'The minimum energy required to remove the most loosely bound electron of an isolated neutral gaseous atom.',
    zh: '从气态原子中移除一个电子所需的最小能量。'
  },
  electron_affinity: {
    en: 'The amount of energy released when an electron is added to a neutral atom in the gaseous state.',
    zh: '气态原子获得一个电子形成负离子时释放的能量。'
  },
  blocks: {
    en: 'Elements grouped by their highest-energy electron subshell (s, p, d, f).',
    zh: '根据最高能量电子亚层（s, p, d, f）对元素进行分组。'
  }
};

const Tile = React.memo<TileProps>(({ 
  e, onSelect, isFBlock, temperature, tableMode, historyYear, lang,
  hoveredGroup, hoveredPeriod, setHoveredGroup, setHoveredPeriod, setHoveredElement,
  onHover, filters
}) => {
  // History Logic
  const discYear = e.discovery_year === 'Ancient' ? 0 : parseInt(e.discovery_year || '0');
  const isDiscovered = discYear <= historyYear;

  // Determine Group and Period
  let group = 0;
  let period = 0;

  if (e.number === 1) { group = 1; period = 1; }
  else if (e.number === 2) { group = 18; period = 1; }
  else if (e.number >= 3 && e.number <= 4) { group = e.number - 2; period = 2; }
  else if (e.number >= 5 && e.number <= 10) { group = e.number + 8; period = 2; }
  else if (e.number >= 11 && e.number <= 12) { group = e.number - 10; period = 3; }
  else if (e.number >= 13 && e.number <= 18) { group = e.number; period = 3; }
  else if (e.number >= 19 && e.number <= 36) { group = e.number - 18; period = 4; }
  else if (e.number >= 37 && e.number <= 54) { group = e.number - 36; period = 5; }
  else if (e.number >= 55 && e.number <= 56) { group = e.number - 54; period = 6; }
  else if (e.number >= 72 && e.number <= 86) { group = e.number - 68; period = 6; }
  else if (e.number >= 87 && e.number <= 88) { group = e.number - 86; period = 7; }
  else if (e.number >= 104 && e.number <= 118) { group = e.number - 100; period = 7; }
  else if (e.number >= 57 && e.number <= 71) { group = 3; period = 6; } // Lanthanides
  else if (e.number >= 89 && e.number <= 103) { group = 3; period = 7; } // Actinides

  // Phase Logic
  const isGas = e.boiling_point ? temperature >= e.boiling_point : e.phase === 'Gas';
  const isLiquid = e.melting_point && e.boiling_point ? (temperature >= e.melting_point && temperature < e.boiling_point) : e.phase === 'Liquid';
  const isSolid = e.melting_point ? temperature < e.melting_point : e.phase === 'Solid';

  const block = (group <= 2 || e.number === 2) ? 's' : (group >= 13) ? 'p' : (isFBlock || e.number === 57 || e.number === 89) ? 'f' : 'd';

  const phaseColor = isGas ? 'text-red-400' : isLiquid ? 'text-blue-400' : 'text-white';

  // Property Mode Coloring
  const getPropertyColor = () => {
    if (tableMode === 'standard') return getCategoryColor(e.category);
    
    let value: number | undefined;
    let min = 0;
    let max = 1;
    let colorScale = ['#1e293b', '#10b981']; // Slate to Emerald

    switch (tableMode) {
      case 'electronegativity':
        value = e.electronegativity;
        min = 0.7; max = 4.0;
        colorScale = ['#1e293b', '#f43f5e']; // Slate to Rose
        break;
      case 'atomic_radius':
        value = e.atomic_radius;
        min = 30; max = 300;
        colorScale = ['#1e293b', '#3b82f6']; // Slate to Blue
        break;
      case 'ionic_radius':
        value = e.ionic_radius;
        min = 30; max = 300;
        colorScale = ['#1e293b', '#10b981']; // Slate to Emerald
        break;
      case 'melting_point':
        value = e.melting_point;
        min = 0; max = 4000;
        colorScale = ['#1e293b', '#f59e0b']; // Slate to Amber
        break;
      case 'boiling_point':
        value = e.boiling_point;
        min = 0; max = 6000;
        colorScale = ['#1e293b', '#ef4444']; // Slate to Red
        break;
      case 'density':
        value = e.density;
        min = 0; max = 23;
        colorScale = ['#1e293b', '#8b5cf6']; // Slate to Violet
        break;
      case 'ionization_energy':
        value = e.ionization_energy;
        min = 380; max = 2400;
        colorScale = ['#1e293b', '#06b6d4']; // Slate to Cyan
        break;
      case 'electron_affinity':
        value = e.electron_affinity;
        min = -150; max = 350;
        colorScale = ['#1e293b', '#f97316']; // Slate to Orange
        break;
    }

    if (value === undefined) return '#1e293b';
    const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
    
    // Simple hex interpolation
    const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    const c1 = hexToRgb(colorScale[0]);
    const c2 = hexToRgb(colorScale[1]);
    const r = lerp(c1[0], c2[0], ratio);
    const g = lerp(c1[1], c2[1], ratio);
    const b = lerp(c1[2], c2[2], ratio);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const color = getPropertyColor();
  const isHighlighted = (hoveredGroup === group && group !== 0) || (hoveredPeriod === period && period !== 0);
  
  // Filter Match Logic
  const matchesFilters = () => {
    const hasAnyFilter = filters.classification || filters.group || filters.block || filters.period;
    if (!hasAnyFilter) return true;

    if (filters.classification) {
      const metals = ['alkali-metal', 'alkaline-earth-metal', 'transition-metal', 'post-transition-metal', 'lanthanide', 'actinide'];
      const nonMetals = ['reactive-nonmetal', 'noble-gas'];
      const metalloids = ['metalloid'];

      if (filters.classification === 'metal' && !metals.includes(e.category)) return false;
      if (filters.classification === 'non-metal' && !nonMetals.includes(e.category)) return false;
      if (filters.classification === 'metalloid' && !metalloids.includes(e.category)) return false;
    }

    if (filters.category && e.category !== filters.category) return false;

    if (filters.group && group !== filters.group) return false;
    if (filters.block) {
      const block = (group <= 2 || e.number === 2) ? 's' : (group >= 13) ? 'p' : (isFBlock || e.number === 57 || e.number === 89) ? 'f' : 'd';
      if (block !== filters.block) return false;
    }
    if (filters.period) {
      if (filters.period === 'lanthanide') {
        if (!isLanthanide(e.number)) return false;
      } else if (filters.period === 'actinide') {
        if (!isActinide(e.number)) return false;
      } else {
        if (period !== filters.period || isFBlock) return false;
      }
    }

    return true;
  };

  const getPropertyValue = () => {
    switch (tableMode) {
      case 'electronegativity': return e.electronegativity?.toFixed(2) || '-';
      case 'ionization_energy': return e.ionization_energy?.toFixed(0) || '-';
      case 'electron_affinity': return e.electron_affinity?.toFixed(0) || '-';
      case 'density': return e.density?.toFixed(2) || '-';
      case 'melting_point': return e.melting_point?.toFixed(0) || '-';
      case 'boiling_point': return e.boiling_point?.toFixed(0) || '-';
      case 'atomic_radius': return e.atomic_radius?.toFixed(0) || '-';
      case 'ionic_radius': return e.ionic_radius?.toFixed(0) || '-';
      default: return e.atomic_mass.toFixed(2);
    }
  };

  const isFiltered = !matchesFilters();
  
  let style: React.CSSProperties = {};

  // Grid Logic:
  if (!isFBlock) {
    if (e.number === 1) style = { gridRow: 2, gridColumn: 2 };
    else if (e.number === 2) style = { gridRow: 2, gridColumn: 19 };
    else if (e.number >= 3 && e.number <= 4) style = { gridRow: 3, gridColumn: e.number - 2 + 1 };
    else if (e.number >= 5 && e.number <= 10) style = { gridRow: 3, gridColumn: e.number + 8 + 1 };
    else if (e.number >= 11 && e.number <= 12) style = { gridRow: 4, gridColumn: e.number - 10 + 1 };
    else if (e.number >= 13 && e.number <= 18) style = { gridRow: 4, gridColumn: e.number + 1 }; 
    else if (e.number >= 19 && e.number <= 36) style = { gridRow: 5, gridColumn: e.number - 18 + 1 };
    else if (e.number >= 37 && e.number <= 54) style = { gridRow: 6, gridColumn: e.number - 36 + 1 };
    else if (e.number >= 55 && e.number <= 56) style = { gridRow: 7, gridColumn: e.number - 54 + 1 };
    else if (e.number >= 72 && e.number <= 86) style = { gridRow: 7, gridColumn: e.number - 68 + 1 };
    else if (e.number >= 87 && e.number <= 88) style = { gridRow: 8, gridColumn: e.number - 86 + 1 };
    else if (e.number >= 104 && e.number <= 118) style = { gridRow: 8, gridColumn: e.number - 100 + 1 };
  }

  return (
    <button
      onClick={(evt) => {
        if (evt.defaultPrevented) return;
        const rect = evt.currentTarget.getBoundingClientRect();
        onSelect(e, rect);
      }}
      onMouseEnter={() => {
        onHover(e, group, period, block);
      }}
      onMouseLeave={() => {
        onHover(null, null, null, null);
      }}
      style={style}
      className={`
        relative w-full aspect-square flex flex-col items-center justify-center p-1
        border border-white/10 rounded-md transition-colors 
        hover:border-white/50 hover:bg-white/10
        group
        ${isHighlighted ? 'border-white/40 bg-white/5' : ''}
        ${!isDiscovered ? 'opacity-5 grayscale pointer-events-none' : 'opacity-100'}
        ${isFiltered ? 'opacity-10 grayscale-[0.5]' : ''}
      `}
    >
      {/* Phase Background Effects */}
      <div className={`absolute inset-0 overflow-hidden rounded-md pointer-events-none transition-all duration-500 ${(tableMode === 'atomic_radius' || tableMode === 'ionic_radius') ? 'opacity-10' : 'opacity-100'}`}>
        {isGas ? (
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              background: `radial-gradient(circle at center, ${color} 0%, transparent 80%)`,
              filter: 'blur(4px)'
            }}
          />
        ) : isLiquid ? (
          <div 
            className="absolute bottom-0 left-0 right-0 opacity-40 transition-all duration-700"
            style={{ 
              height: '65%',
              backgroundColor: color,
              borderRadius: '40% 40% 0 0 / 15% 15% 0 0'
            }}
          />
        ) : isSolid ? (
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              backgroundColor: color,
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)`,
              backgroundSize: '8px 8px'
            }}
          />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-gray-600" />
        )}
      </div>

      {/* Hover Highlight Overlay */}
      <div className={`absolute inset-0 transition-opacity rounded-md opacity-0 group-hover:opacity-20 bg-white z-0`}></div>

      {(tableMode === 'atomic_radius' || tableMode === 'ionic_radius') && (tableMode === 'atomic_radius' ? e.atomic_radius : e.ionic_radius) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
          <div 
            className="rounded-full shadow-lg transition-all duration-500 relative"
            style={{ 
              width: `${Math.max(15, ((tableMode === 'atomic_radius' ? e.atomic_radius! : e.ionic_radius!) / 300) * 100)}%`, 
              height: `${Math.max(15, ((tableMode === 'atomic_radius' ? e.atomic_radius! : e.ionic_radius!) / 300) * 100)}%`,
              backgroundColor: getCategoryColor(e.category),
              boxShadow: `inset -2px -2px 6px rgba(0,0,0,0.4), inset 2px 2px 6px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.3)`
            }}
          >
            {/* Glossy highlight */}
            <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/40 rounded-full blur-[1px]"></div>
          </div>
        </div>
      )}
      
      {/* Atomic Number */}
      <span className={`text-[0.65rem] md:text-[0.7rem] absolute top-1 left-1.5 opacity-70 select-none z-20 ${(tableMode === 'atomic_radius' || tableMode === 'ionic_radius') ? 'text-white font-bold' : ''}`}>{e.number}</span>
      
      {/* Symbol */}
      <span className={`font-bold select-none z-10 ${(tableMode === 'atomic_radius' || tableMode === 'ionic_radius') ? 'text-white drop-shadow-md text-xs md:text-sm lg:text-base' : `text-sm md:text-base lg:text-lg ${phaseColor}`}`}>
        {tableMode === 'ionic_radius' && e.ion_symbol ? e.ion_symbol : e.symbol}
      </span>
      
      {/* Name or Radius Value */}
      <div className="flex flex-col items-center w-full z-10 mt-0.5">
        {(tableMode === 'atomic_radius' || tableMode === 'ionic_radius') ? (
          <span className="text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] text-white font-black opacity-100 drop-shadow-md select-none mt-0.5">
            {getPropertyValue()}
          </span>
        ) : (
          <>
            <span className={`text-[0.55rem] md:text-[0.65rem] font-bold opacity-90 truncate w-full text-center px-0.5 select-none ${phaseColor}`}>
              {lang === 'en' ? e.name_en : e.name_cn}
            </span>
            <span className="text-[0.45rem] md:text-[0.5rem] opacity-60 font-mono select-none">
              {getPropertyValue()}
            </span>
          </>
        )}
      </div>
    </button>
  );
});

const PeriodicTable: React.FC<PeriodicTableProps> = ({ 
  onSelect, searchQuery, setSearchQuery, filteredElements, lang, temperature, tableMode, historyYear, filters, hoveredClassification 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  // Hover State for Highlights
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [hoveredPeriod, setHoveredPeriod] = useState<PeriodFilter | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHover = React.useCallback((element: ElementData | null, group: number | null, period: PeriodFilter | null, block: string | null) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    
    // Small delay to prevent flickering when moving between elements or over gaps
    hoverTimeout.current = setTimeout(() => {
      setHoveredElement(element);
      setHoveredGroup(group);
      setHoveredPeriod(period);
      setHoveredBlock(block);
    }, 60); 
  }, []);
  
  // Refs for gesture calculations
  const gesture = useRef({
    startX: 0,
    startY: 0,
    startTransformX: 0,
    startTransformY: 0,
    initialDistance: 0,
    initialScale: 1,
    isPinching: false,
    hasMoved: false
  });

  useEffect(() => {
    const initializeTable = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        if (containerWidth > 0 && containerHeight > 0) {
          const contentWidth = 1550;
          const initialScale = containerWidth < 768 ? (containerWidth / contentWidth) * 0.95 : 0.8;
          const centeredX = (containerWidth - contentWidth * initialScale) / 2;
          const centeredY = Math.max(20, (containerHeight - 800 * initialScale) / 3); 
          
          setTransform({ x: centeredX, y: centeredY, scale: initialScale });
          return true;
        }
      }
      return false;
    };

    if (!initializeTable()) {
      const timer = setInterval(() => {
        if (initializeTable()) clearInterval(timer);
      }, 100);
      return () => clearInterval(timer);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    gesture.current.startX = e.clientX;
    gesture.current.startY = e.clientY;
    gesture.current.startTransformX = transform.x;
    gesture.current.startTransformY = transform.y;
    gesture.current.hasMoved = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.clientX - gesture.current.startX;
    const dy = e.clientY - gesture.current.startY;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
       gesture.current.hasMoved = true;
    }

    setTransform(prev => ({
      ...prev,
      x: gesture.current.startTransformX + dx,
      y: gesture.current.startTransformY + dy
    }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    if (gesture.current.hasMoved) {
      e.preventDefault();
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(transform.scale + delta, 0.2), 3);
    
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      gesture.current.startX = e.touches[0].clientX;
      gesture.current.startY = e.touches[0].clientY;
      gesture.current.startTransformX = transform.x;
      gesture.current.startTransformY = transform.y;
      gesture.current.hasMoved = false;
      gesture.current.isPinching = false;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      gesture.current.isPinching = true;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      gesture.current.initialDistance = dist;
      gesture.current.initialScale = transform.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - gesture.current.startX;
      const dy = e.touches[0].clientY - gesture.current.startY;
      
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
         gesture.current.hasMoved = true;
      }

      setTransform(prev => ({
        ...prev,
        x: gesture.current.startTransformX + dx,
        y: gesture.current.startTransformY + dy
      }));
    } else if (gesture.current.isPinching && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = dist / gesture.current.initialDistance;
      const newScale = Math.min(Math.max(gesture.current.initialScale * scaleFactor, 0.2), 3);
      setTransform(prev => ({ ...prev, scale: newScale }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    gesture.current.isPinching = false;
  };

  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.2) }));
  const reset = () => {
     if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = 1550;
        const initialScale = containerWidth < 768 ? (containerWidth / contentWidth) * 0.95 : 0.8;
        const centeredX = (containerWidth - contentWidth * initialScale) / 2;
        setTransform({ x: centeredX, y: 40, scale: initialScale });
     }
  };

  // Filter Elements
  const mainTableElements = ELEMENTS.filter(e => !isLanthanide(e.number) && !isActinide(e.number));
  const lanthanides = ELEMENTS.filter(e => isLanthanide(e.number));
  const actinides = ELEMENTS.filter(e => isActinide(e.number));

  const groupNumbers = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="w-full h-full flex flex-col items-center relative overflow-hidden">
      
      {/* Search Results Dropdown (Above Bottom Controls) */}
      {searchQuery && (
         <div className="absolute bottom-20 z-40 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto w-64 md:w-80 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
            {filteredElements.length > 0 ? (
               filteredElements.map(e => (
                  <button 
                  key={e.number}
                  onClick={() => onSelect(e)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between border-b border-white/5 last:border-0 text-sm"
                  >
                  <div>
                     <span className="font-bold text-emerald-400 w-8 inline-block">{e.symbol}</span>
                     <span className="text-white/80">{lang === 'en' ? e.name_en : e.name_cn}</span>
                  </div>
                  <span className="text-xs text-white/30">#{e.number}</span>
                  </button>
               ))
            ) : (
               <div className="p-4 text-center text-white/40 text-xs">No results found</div>
            )}
         </div>
      )}

      {/* Viewport Container */}
      <div 
        ref={containerRef}
        className="relative w-full flex-1 overflow-hidden bg-white/5 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing touch-none shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="absolute origin-top-left will-change-transform"
          style={{ 
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transition: isDragging || gesture.current.isPinching ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="min-w-[1550px] flex flex-col items-center select-none pb-24">
            {/* Main Grid: 19 Columns (1 for Period + 18 for Groups), 8 Rows (1 Header + 7 Periods) */}
            <div 
              className="grid gap-4 md:gap-5 w-full mb-6 relative" 
              style={{ gridTemplateColumns: '70px repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(8, 1fr)' }}
            >
              {/* Period Labels */}
              {[1, 2, 3, 4, 5, 6, 7].map(p => (
                <div 
                  key={`period-label-${p}`} 
                  style={{ gridRow: p + 1, gridColumn: 1 }} 
                  className="flex items-center justify-center text-white/30 text-xs font-mono cursor-help hover:text-amber-400 transition-colors"
                  onMouseEnter={() => handleHover(null, null, p, null)}
                  onMouseLeave={() => handleHover(null, null, null, null)}
                >
                  {p}
                </div>
              ))}

              {/* Group Numbers Header */}
              {groupNumbers.map(num => (
                <div 
                  key={`group-${num}`} 
                  style={{ gridRow: 1, gridColumn: num + 1 }} 
                  className="flex items-end justify-center pb-2 text-white/30 text-xs font-mono cursor-help hover:text-blue-400 transition-colors"
                  onMouseEnter={() => handleHover(null, num, null, null)}
                  onMouseLeave={() => handleHover(null, null, null, null)}
                >
                  {num}
                </div>
              ))}

              {mainTableElements.map(e => (
                <Tile 
                  key={e.number} 
                  e={e} 
                  onSelect={(el, rect) => !gesture.current.hasMoved && onSelect(el, rect)} 
                  temperature={temperature}
                  tableMode={tableMode}
                  historyYear={historyYear}
                  lang={lang}
                  hoveredGroup={hoveredGroup}
                  hoveredPeriod={hoveredPeriod}
                  setHoveredGroup={setHoveredGroup}
                  setHoveredPeriod={setHoveredPeriod}
                  setHoveredElement={setHoveredElement}
                  onHover={handleHover}
                  filters={filters}
                />
              ))}
              
              <div style={{ gridRow: 7, gridColumn: 4 }} className="border border-white/10 rounded-md flex items-center justify-center text-xs text-white/40 font-mono">57-71</div>
              <div style={{ gridRow: 8, gridColumn: 4 }} className="border border-white/10 rounded-md flex items-center justify-center text-xs text-white/40 font-mono">89-103</div>

              {/* Fixed Legend Information Box */}
              <div 
                style={{ 
                  gridRow: '2 / 5',  
                  gridColumn: '4 / 14', 
                  zIndex: 30
                }} 
                className="flex absolute inset-0 flex-col pointer-events-none"
              >
                <div 
                  className="bg-[#1e293b]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col pointer-events-auto w-full h-full overflow-hidden"
                >
                  {hoveredElement ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex gap-8 items-start h-full">
                        {/* Left: Symbol & Basic Info */}
                        <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-6 border border-white/10 min-w-[180px] h-full">
                          <span className="text-xs text-white/40 font-mono mb-2">#{hoveredElement.number}</span>
                          <span className="text-7xl font-bold text-white mb-2 drop-shadow-lg" style={{ color: getCategoryColor(hoveredElement.category) }}>
                            {hoveredElement.symbol}
                          </span>
                          <span className="text-xl font-bold text-white/90 text-center leading-tight">
                            {lang === 'en' ? hoveredElement.name_en : hoveredElement.name_cn}
                          </span>
                          <span className="text-xs text-white/40 mt-3 font-mono">{hoveredElement.atomic_mass.toFixed(4)}</span>
                        </div>
  
                        {/* Right: Property Grid */}
                        <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6 py-4 h-full content-center">
                          <div className="flex flex-col border-b border-white/5 pb-2">
                            <span className="text-xs uppercase tracking-wider text-white/30 font-bold">{lang === 'en' ? 'Phase' : '物相'}</span>
                            <span className="text-base font-bold text-white/90">{hoveredElement.phase}</span>
                          </div>
                          <div className="flex flex-col border-b border-white/5 pb-2">
                            <span className="text-xs uppercase tracking-wider text-white/30 font-bold">{lang === 'en' ? 'Electronegativity' : '电负性'}</span>
                            <span className="text-base font-bold text-white/90">{hoveredElement.electronegativity || '-'}</span>
                          </div>
                          <div className="flex flex-col border-b border-white/5 pb-2">
                            <span className="text-xs uppercase tracking-wider text-white/30 font-bold">{lang === 'en' ? 'Melt (K)' : '熔点(K)'}</span>
                            <span className="text-base font-bold text-white/90">{hoveredElement.melting_point || '-'}</span>
                          </div>
                          <div className="flex flex-col border-b border-white/5 pb-2">
                            <span className="text-xs uppercase tracking-wider text-white/30 font-bold">{lang === 'en' ? 'Boil (K)' : '沸点(K)'}</span>
                            <span className="text-base font-bold text-white/90">{hoveredElement.boiling_point || '-'}</span>
                          </div>
                          <div className="flex flex-col border-b border-white/5 pb-2">
                            <span className="text-xs uppercase tracking-wider text-white/30 font-bold">{lang === 'en' ? 'Electron Conf.' : '电子排布'}</span>
                            <span className="text-sm font-mono text-white/90 truncate">{hoveredElement.electron_configuration}</span>
                          </div>
                          <div className="flex flex-col border-b border-white/5 pb-2">
                            <span className="text-xs uppercase tracking-wider text-white/30 font-bold">{lang === 'en' ? 'Density' : '密度'}</span>
                            <span className="text-base font-bold text-white/90">{hoveredElement.density || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (tableMode !== 'standard' && !hoveredGroup && !hoveredPeriod && !hoveredBlock && !hoveredClassification && !filters.group && !filters.period && !filters.block) ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300 justify-center">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                          <Zap size={32} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-xl lg:text-2xl font-bold tracking-wider uppercase">
                            {lang === 'en' ? MODE_DESCRIPTIONS[tableMode].en.split(' ')[0] : (tableMode === 'electronegativity' ? '电负性' : tableMode === 'atomic_radius' ? '原子半径' : tableMode === 'ionic_radius' ? '离子半径' : tableMode === 'melting_point' ? '熔点' : tableMode === 'boiling_point' ? '沸点' : tableMode === 'density' ? '密度' : tableMode === 'ionization_energy' ? '电离能' : '电子亲和能')}
                          </h3>
                          <span className="text-xs text-white/40 font-bold uppercase tracking-widest">
                            {lang === 'en' ? 'Mode Insight' : '模式详情'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm lg:text-lg text-white/90 leading-relaxed font-semibold">
                        {lang === 'en' ? MODE_DESCRIPTIONS[tableMode].en : MODE_DESCRIPTIONS[tableMode].zh}
                      </p>
                      <div className="mt-6 flex flex-col gap-3">
                         <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-[#1e293b] to-white/80" style={{
                            backgroundImage: `linear-gradient(to right, #1e293b, ${
                              tableMode === 'electronegativity' ? '#f43f5e' :
                              tableMode === 'melting_point' ? '#f59e0b' :
                              tableMode === 'boiling_point' ? '#ef4444' :
                              tableMode === 'density' ? '#8b5cf6' :
                              tableMode === 'ionization_energy' ? '#06b6d4' :
                              tableMode === 'electron_affinity' ? '#f97316' : '#10b981'
                            })`
                         }}></div>
                         <div className="flex justify-between text-xs font-mono opacity-40">
                             <span>MIN</span>
                             <span>MAX</span>
                         </div>
                      </div>
                    </div>
                  ) : (hoveredGroup || hoveredPeriod || hoveredBlock || hoveredClassification || filters.group || filters.period || filters.block || filters.classification) ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300 justify-center">
                      <div className="flex items-center gap-6 mb-4">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                          style={{ 
                            backgroundColor: (hoveredGroup || filters.group) ? '#3b82f6' : 
                                            (hoveredPeriod || filters.period) ? '#f59e0b' :
                                            (hoveredBlock || filters.block) ? '#8b5cf6' :
                                            (hoveredClassification || filters.classification) === 'metal' ? '#3b82f6' : 
                                            (hoveredClassification || filters.classification) === 'non-metal' ? '#10b981' : '#f59e0b'
                          }}
                        >
                          <Info size={32} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-xl lg:text-2xl font-bold tracking-wider uppercase">
                            {hoveredGroup ? (lang === 'en' ? `Group ${hoveredGroup}` : `第 ${hoveredGroup} 族`) :
                             hoveredPeriod ? (lang === 'en' ? (typeof hoveredPeriod === 'number' ? `Period ${hoveredPeriod}` : hoveredPeriod.charAt(0).toUpperCase() + hoveredPeriod.slice(1)) : (typeof hoveredPeriod === 'number' ? `第 ${hoveredPeriod} 周期` : hoveredPeriod === 'lanthanide' ? '镧系元素' : '锕系元素')) :
                             hoveredBlock ? (lang === 'en' ? `${hoveredBlock.toUpperCase()} Block` : `${hoveredBlock.toUpperCase()} 区`) :
                             hoveredClassification ? (hoveredClassification === 'metal' ? (lang === 'en' ? 'Metals' : '金属') : hoveredClassification === 'non-metal' ? (lang === 'en' ? 'Non-metals' : '非金属') : (lang === 'en' ? 'Metalloids' : '半金属')) :
                             filters.group ? (lang === 'en' ? `Group ${filters.group}` : `第 ${filters.group} 族`) :
                             filters.period ? (lang === 'en' ? (typeof filters.period === 'number' ? `Period ${filters.period}` : filters.period.charAt(0).toUpperCase() + filters.period.slice(1)) : (typeof filters.period === 'number' ? `第 ${filters.period} 周期` : filters.period === 'lanthanide' ? '镧系元素' : '锕系元素')) :
                             filters.block ? (lang === 'en' ? `${filters.block.toUpperCase()} Block` : `${filters.block.toUpperCase()} 区`) :
                             filters.classification === 'metal' ? (lang === 'en' ? 'Metals' : '金属') :
                             filters.classification === 'non-metal' ? (lang === 'en' ? 'Non-metals' : '非金属') :
                             (lang === 'en' ? 'Metalloids' : '半金属')}
                          </h3>
                          <span className="text-xs text-white/40 font-bold uppercase tracking-widest">
                            {lang === 'en' ? 'Overview' : '概览'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm lg:text-base text-white/90 leading-relaxed font-medium">
                        {hoveredGroup ? (lang === 'en' ? GROUP_DESCRIPTIONS[hoveredGroup]?.en : GROUP_DESCRIPTIONS[hoveredGroup]?.zh) :
                         hoveredPeriod ? (lang === 'en' ? PERIOD_DESCRIPTIONS[hoveredPeriod]?.en : PERIOD_DESCRIPTIONS[hoveredPeriod]?.zh) :
                         hoveredBlock ? (lang === 'en' ? BLOCK_DESCRIPTIONS[hoveredBlock]?.en : BLOCK_DESCRIPTIONS[hoveredBlock]?.zh) :
                         hoveredClassification ? (lang === 'en' ? CLASSIFICATION_DESCRIPTIONS[hoveredClassification]?.en : CLASSIFICATION_DESCRIPTIONS[hoveredClassification]?.zh) :
                         filters.group ? (lang === 'en' ? GROUP_DESCRIPTIONS[filters.group]?.en : GROUP_DESCRIPTIONS[filters.group]?.zh) :
                         filters.period ? (lang === 'en' ? PERIOD_DESCRIPTIONS[filters.period]?.en : PERIOD_DESCRIPTIONS[filters.period]?.zh) :
                         filters.block ? (lang === 'en' ? BLOCK_DESCRIPTIONS[filters.block]?.en : BLOCK_DESCRIPTIONS[filters.block]?.zh) :
                         filters.classification ? (lang === 'en' ? CLASSIFICATION_DESCRIPTIONS[filters.classification]?.en : CLASSIFICATION_DESCRIPTIONS[filters.classification]?.zh) :
                         null
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between py-0.5 px-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Info size={18} className="text-emerald-400 shrink-0" />
                        <h3 className="text-base font-bold tracking-wider uppercase opacity-80 leading-tight">
                          {tableMode === 'standard' ? (lang === 'en' ? 'Phase Legend' : '物相图例') : (lang === 'en' ? 'Property Scale' : '数值刻度')}
                        </h3>
                      </div>
                      
                      {tableMode === 'standard' ? (
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-md bg-white/20 border border-white/20 relative overflow-hidden">
                              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)', backgroundSize: '6px 6px' }}></div>
                            </div>
                            <span className="text-sm opacity-80 uppercase tracking-widest font-bold">{lang === 'en' ? 'Solid' : '固体'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-md bg-blue-400/10 border border-white/20 relative overflow-hidden">
                              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-blue-400/40" style={{ borderRadius: '40% 40% 0 0 / 20% 20% 0 0' }}></div>
                            </div>
                            <span className="text-sm opacity-80 uppercase tracking-widest font-bold">{lang === 'en' ? 'Liquid' : '液体'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-md bg-red-400/5 border border-white/20 relative overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.4)_0%,transparent_80%)] blur-[2px]"></div>
                            </div>
                            <span className="text-sm opacity-80 uppercase tracking-widest font-bold">{lang === 'en' ? 'Gas' : '气体'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-md bg-gray-600/20 border border-white/20"></div>
                            <span className="text-sm opacity-80 uppercase tracking-widest font-bold">{lang === 'en' ? 'Unknown' : '未知'}</span>
                          </div>
                        </div>
                      ) : (tableMode === 'atomic_radius' || tableMode === 'ionic_radius') ? (
                        <div className="flex flex-col gap-0">
                          <div className="flex items-end gap-5 justify-center py-0">
                            <div className="flex flex-col items-center gap-0.5">
                              <div className={`w-3.5 h-3.5 rounded-full ${tableMode === 'atomic_radius' ? 'bg-blue-400' : 'bg-emerald-400'} shadow-lg`}></div>
                              <span className="text-[10px] opacity-40 font-mono font-bold">30pm</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <div className={`w-9 h-9 rounded-full ${tableMode === 'atomic_radius' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-lg`}></div>
                              <span className="text-[10px] opacity-40 font-mono font-bold">150pm</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <div className={`w-14 h-14 rounded-full ${tableMode === 'atomic_radius' ? 'bg-blue-600' : 'bg-emerald-600'} shadow-lg`}></div>
                              <span className="text-[10px] opacity-40 font-mono font-bold">300pm</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-center opacity-40 uppercase tracking-widest font-bold mt-0.5">
                            {lang === 'en' 
                              ? `Sphere size represents ${tableMode === 'atomic_radius' ? 'atomic' : 'ionic'} radius` 
                              : `球体大小代表${tableMode === 'atomic_radius' ? '原子' : '离子'}半径`}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="h-4 w-full rounded-full bg-gradient-to-r from-[#1e293b] to-emerald-400" style={{
                            backgroundImage: `linear-gradient(to right, #1e293b, ${
                              tableMode === 'electronegativity' ? '#f43f5e' :
                              tableMode === 'melting_point' ? '#f59e0b' :
                              tableMode === 'boiling_point' ? '#ef4444' :
                              tableMode === 'density' ? '#8b5cf6' :
                              tableMode === 'ionization_energy' ? '#06b6d4' :
                              tableMode === 'electron_affinity' ? '#f97316' : '#10b981'
                            })`
                          }}></div>
                          <div className="flex justify-between text-xs opacity-60 font-mono font-black tracking-widest">
                            <span>MIN</span>
                            <span>MAX</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-white/5 mt-auto">
                        <div className="mb-1">
                          <h4 className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-0.5">
                            {lang === 'en' ? 'Mode Definition' : '模式定义'}
                          </h4>
                          <p className="text-[0.65rem] text-white/90 leading-tight font-semibold">
                            {lang === 'en' ? MODE_DESCRIPTIONS[tableMode].en : MODE_DESCRIPTIONS[tableMode].zh}
                          </p>
                        </div>
                        <p className="text-[9px] text-white/30 italic leading-tight">
                          {lang === 'en' 
                            ? 'Hover over an element to highlight its group and period. Use sliders to explore history and temperature.' 
                            : '将鼠标悬停在元素上以突出显示其族和周期。使用滑块探索历史和温度。'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* F-Block */}
            <div className="min-w-[1550px] mt-8 flex flex-col gap-4 w-full">
              {/* Lanthanides Row */}
              <div 
                className="grid gap-4 md:gap-5" 
                style={{ gridTemplateColumns: '70px repeat(18, minmax(0, 1fr))' }}
              >
                  <div 
                    className="col-span-3 flex items-center justify-end pr-4 text-xs text-white/30 font-mono tracking-wider cursor-help hover:text-teal-400 transition-colors"
                    onMouseEnter={() => handleHover(null, null, 'lanthanide', null)}
                    onMouseLeave={() => handleHover(null, null, null, null)}
                  >
                    {lang === 'en' ? 'Lanthanides' : '镧系元素'}
                  </div>
                  {lanthanides.map(e => (
                    <Tile 
                      key={e.number} 
                      e={e} 
                      onSelect={(el, rect) => !gesture.current.hasMoved && onSelect(el, rect)} 
                      isFBlock 
                      temperature={temperature}
                      tableMode={tableMode}
                      historyYear={historyYear}
                      lang={lang}
                      hoveredGroup={hoveredGroup}
                      hoveredPeriod={hoveredPeriod}
                      setHoveredGroup={setHoveredGroup}
                      setHoveredPeriod={setHoveredPeriod}
                      setHoveredElement={setHoveredElement}
                      onHover={handleHover}
                      filters={filters}
                    />
                  ))}
              </div>
              {/* Actinides Row */}
              <div 
                className="grid gap-4 md:gap-5" 
                style={{ gridTemplateColumns: '70px repeat(18, minmax(0, 1fr))' }}
              >
                  <div 
                    className="col-span-3 flex items-center justify-end pr-4 text-xs text-white/30 font-mono tracking-wider cursor-help hover:text-rose-400 transition-colors"
                    onMouseEnter={() => handleHover(null, null, 'actinide', null)}
                    onMouseLeave={() => handleHover(null, null, null, null)}
                  >
                    {lang === 'en' ? 'Actinides' : '锕系元素'}
                  </div>
                  {actinides.map(e => (
                    <Tile 
                      key={e.number} 
                      e={e} 
                      onSelect={(el, rect) => !gesture.current.hasMoved && onSelect(el, rect)} 
                      isFBlock 
                      temperature={temperature}
                      tableMode={tableMode}
                      historyYear={historyYear}
                      lang={lang}
                      hoveredGroup={hoveredGroup}
                      hoveredPeriod={hoveredPeriod}
                      setHoveredGroup={setHoveredGroup}
                      setHoveredPeriod={setHoveredPeriod}
                      setHoveredElement={setHoveredElement}
                      onHover={handleHover}
                      filters={filters}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Helper Hint for Mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden bg-black/40 backdrop-blur px-3 py-1 rounded-full text-xs text-white/50 pointer-events-none">
          Pinch to Zoom • Drag to Move
        </div>
      </div>

      {/* Repositioned Bottom Controls */}
      <div className="sticky bottom-6 z-30 flex items-center gap-1.5 md:gap-2 bg-[#1e293b]/95 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] mt-4 pointer-events-auto transition-all animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Search Input Area */}
        <div className={`flex items-center transition-all duration-300 overflow-hidden ${showSearchInput || searchQuery ? 'w-32 md:w-48 px-2 pl-3' : 'w-0'}`}>
           <Search size={14} className="text-white/40 mr-2 shrink-0" />
           <input 
             type="text"
             className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/40"
             placeholder={lang === 'en' ? "Search..." : "搜索..."}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             autoFocus={showSearchInput}
             onBlur={() => !searchQuery && setShowSearchInput(false)}
           />
           {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="ml-1 text-white/40 hover:text-white">
               <X size={12} />
             </button>
           )}
        </div>
        
        {!showSearchInput && !searchQuery && (
          <button 
            onClick={() => setShowSearchInput(true)} 
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            title="Search"
          >
             <Search size={18} />
          </button>
        )}

        <div className="w-px h-4 bg-white/10 mx-0.5 md:mx-1"></div>

        <button onClick={zoomOut} className="p-2.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors active:scale-90" title="Zoom Out"><ZoomOut size={18} /></button>
        <button onClick={zoomIn} className="p-2.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors active:scale-90" title="Zoom In"><ZoomIn size={18} /></button>
        
        <div className="w-px h-4 bg-white/10 mx-0.5 md:mx-1"></div>
        
        <button onClick={reset} className="p-2.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors active:scale-90" title="Reset View"><RotateCcw size={16} /></button>
        
        <div className="hidden md:flex items-center gap-1.5 ml-2 text-[10px] text-white/30 border-l border-white/10 pl-3 pr-2 font-bold uppercase tracking-tighter">
           <Move size={12} /> <span>Drag Table</span>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;