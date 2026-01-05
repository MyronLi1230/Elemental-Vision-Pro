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
