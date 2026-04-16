import { ElementCategory } from '../types';

export const getCategoryColor = (category: ElementCategory): string => {
  switch (category) {
    case 'alkali-metal': return '#ef4444'; // Red-500
    case 'alkaline-earth-metal': return '#f97316'; // Orange-500
    case 'transition-metal': return '#eab308'; // Yellow-500
    case 'post-transition-metal': return '#10b981'; // Emerald-500
    case 'metalloid': return '#06b6d4'; // Cyan-500
    case 'reactive-nonmetal': return '#3b82f6'; // Blue-500
    case 'noble-gas': return '#8b5cf6'; // Violet-500
    case 'lanthanide': return '#d946ef'; // Fuchsia-500
    case 'actinide': return '#f43f5e'; // Rose-500
    default: return '#64748b'; // Slate-500
  }
};

export const getCategoryGlow = (category: ElementCategory): string => {
  const color = getCategoryColor(category);
  return `0 0 15px ${color}80, 0 0 30px ${color}40`; // Neon glow effect
};

export const getCategoryName = (category: ElementCategory, lang: 'en' | 'zh'): string => {
  const names: Record<ElementCategory, { en: string; zh: string }> = {
    'alkali-metal': { en: 'Alkali Metal', zh: '碱金属' },
    'alkaline-earth-metal': { en: 'Alkaline Earth Metal', zh: '碱土金属' },
    'transition-metal': { en: 'Transition Metal', zh: '过渡金属' },
    'post-transition-metal': { en: 'Post-transition Metal', zh: '后过渡金属' },
    'metalloid': { en: 'Metalloid', zh: '类金属' },
    'reactive-nonmetal': { en: 'Reactive Nonmetal', zh: '活泼非金属' },
    'noble-gas': { en: 'Noble Gas', zh: '稀有气体' },
    'lanthanide': { en: 'Lanthanide', zh: '镧系元素' },
    'actinide': { en: 'Actinide', zh: '锕系元素' },
    'unknown': { en: 'Unknown', zh: '未知' }
  };
  return names[category][lang];
};

export const getClassificationLabel = (c: 'metal' | 'non-metal' | 'metalloid', lang: 'en' | 'zh') => {
  if (lang === 'en') {
    return c.charAt(0).toUpperCase() + c.slice(1);
  }
  const labels: Record<string, string> = {
    metal: '金属',
    'non-metal': '非金属',
    metalloid: '半金属'
  };
  return labels[c];
};

export const getClassificationColor = (c: 'metal' | 'non-metal' | 'metalloid'): string => {
  const colors = {
    metal: '#3b82f6', // blue-500
    'non-metal': '#10b981', // emerald-500
    metalloid: '#f59e0b' // amber-500
  };
  return colors[c];
};
