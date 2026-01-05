import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ElementData, Language } from '../types';

interface ChartProps {
  element: ElementData;
  color: string;
  lang: Language;
}

export const DensityChart: React.FC<ChartProps> = ({ element, color, lang }) => {
  const data = [
    { name: lang === 'en' ? 'Water' : '水', val: 1, type: 'ref' },
    { name: element.symbol, val: element.density || 0, type: 'target' },
    { name: lang === 'en' ? 'Iron' : '铁', val: 7.87, type: 'ref' },
    { name: lang === 'en' ? 'Gold' : '金', val: 19.3, type: 'ref' },
  ];

  return (
    <div className="w-full h-40">
      <p className="text-xs text-white/60 mb-2">{lang === 'en' ? 'Density Comparison (g/cm³)' : '密度对比 (g/cm³)'}</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" tick={{ fill: 'white', fontSize: 12 }} width={40} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
          />
          <Bar dataKey="val" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.type === 'target' ? color : '#475569'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TempChart: React.FC<ChartProps> = ({ element, color, lang }) => {
  const mp = element.melting_point || 0;
  const bp = element.boiling_point || 0;
  
  // Normalize visuals slightly so bars aren't invisible for gases
  const data = [
    { name: lang === 'en' ? 'Melting' : '熔点', val: mp },
    { name: lang === 'en' ? 'Boiling' : '沸点', val: bp },
  ];

  return (
    <div className="w-full h-40 mt-4">
      <p className="text-xs text-white/60 mb-2">{lang === 'en' ? 'Phase Transition (Kelvin)' : '相变温度 (开尔文)'}</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
          />
          <Bar dataKey="val" fill={color} radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
