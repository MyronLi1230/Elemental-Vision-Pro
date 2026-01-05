export type ElementCategory = 
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface ElementData {
  number: number;
  symbol: string;
  name_en: string;
  name_cn: string;
  pinyin?: string;
  atomic_mass: number;
  category: ElementCategory;
  phase: 'Solid' | 'Liquid' | 'Gas' | 'Unknown';
  electron_configuration: string;
  shells: number[];
  oxidation_states: string; // e.g. "+1, -1"
  ionization_energy?: number; // kJ/mol
  electron_affinity?: number; // kJ/mol
  electronegativity?: number; // Pauling
  atomic_radius?: number; // pm
  melting_point?: number; // Kelvin
  boiling_point?: number; // Kelvin
  density?: number; // g/cm3
  discovery_year?: string;
  discoverer?: string;
  summary_en: string;
  summary_cn: string;
  usage_en: string;
  usage_cn: string;
  hazard_en?: string;
  hazard_cn?: string;
  cpk_hex: string; // Standard CPK color for visualization
}

export type VisualMode = 'bohr' | 'cloud';
export type Language = 'en' | 'zh';
