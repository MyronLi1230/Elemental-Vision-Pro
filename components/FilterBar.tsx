import React from 'react';
import { FilterState, Language, Classification, Block, PeriodFilter, ElementCategory } from '../types';
import { X } from 'lucide-react';
import { getCategoryColor, getCategoryName } from '../utils/colors';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  lang: Language;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, lang }) => {
  const groups = Array.from({ length: 18 }, (_, i) => i + 1);
  const periods = Array.from({ length: 7 }, (_, i) => i + 1);
  const blocks: Block[] = ['s', 'p', 'd', 'f'];

  const toggleFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      // If clicking the same filter, clear it
      if (prev[key] === value) {
        return {
          classification: null,
          category: null,
          group: null,
          block: null,
          period: null
        };
      }
      // Otherwise, set the new filter and clear all others
      return {
        classification: null,
        category: null,
        group: null,
        block: null,
        period: null,
        [key]: value
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      classification: null,
      category: null,
      group: null,
      block: null,
      period: null
    });
  };

  const hasFilters = filters.classification || filters.category || filters.group || filters.block || filters.period;

  const getClassificationLabel = (c: Classification) => {
    if (lang === 'en') {
      return c.charAt(0).toUpperCase() + c.slice(1);
    }
    const labels: Record<Classification, string> = {
      metal: '金属',
      'non-metal': '非金属',
      metalloid: '半金属'
    };
    return labels[c];
  };

  const getClassificationColor = (c: Classification) => {
    const colors: Record<Classification, string> = {
      metal: 'blue',
      'non-metal': 'emerald',
      metalloid: 'amber'
    };
    return colors[c];
  };

  return (
    <div className="w-full bg-[#1e293b]/20 backdrop-blur-md border border-white/5 rounded-lg p-1.5 mb-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 shadow-xl">
      {/* Groups */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-blue-400/60 font-bold">
          {lang === 'en' ? 'Group' : '族'}
        </span>
        <div className="flex flex-wrap gap-1">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => toggleFilter('group', g)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs font-mono transition-all border ${
                filters.group === g 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                  : 'bg-white/5 text-white/20 border-transparent hover:border-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block w-px h-4 bg-white/10"></div>

      {/* Blocks */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-violet-400/60 font-bold">
          {lang === 'en' ? 'Block' : '能区'}
        </span>
        <div className="flex gap-1">
          {blocks.map(b => (
            <button
              key={b}
              onClick={() => toggleFilter('block', b)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs font-mono uppercase transition-all border ${
                filters.block === b 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
                  : 'bg-white/5 text-white/20 border-transparent hover:border-white/10'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block w-px h-4 bg-white/10"></div>

      {/* Periods */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-amber-400/60 font-bold">
          {lang === 'en' ? 'Period' : '周期'}
        </span>
        <div className="flex flex-wrap gap-1">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => toggleFilter('period', p)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs font-mono transition-all border ${
                filters.period === p 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-white/5 text-white/20 border-transparent hover:border-white/10'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => toggleFilter('period', 'lanthanide')}
            className={`px-2 h-6 flex items-center justify-center rounded-sm text-xs font-mono transition-all border ${
              filters.period === 'lanthanide' 
                ? 'bg-teal-500/20 text-teal-400 border-teal-500/50' 
                : 'bg-white/5 text-white/20 border-transparent hover:border-white/10'
            }`}
          >
            {lang === 'en' ? 'Ln' : '镧'}
          </button>
          <button
            onClick={() => toggleFilter('period', 'actinide')}
            className={`px-2 h-6 flex items-center justify-center rounded-sm text-xs font-mono transition-all border ${
              filters.period === 'actinide' 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' 
                : 'bg-white/5 text-white/20 border-transparent hover:border-white/10'
            }`}
          >
            {lang === 'en' ? 'Ac' : '锕'}
          </button>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 text-white/40 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest border border-white/10"
        >
          <X size={14} />
          {lang === 'en' ? 'Clear' : '清除'}
        </button>
      )}
    </div>
  );
};

export default FilterBar;
