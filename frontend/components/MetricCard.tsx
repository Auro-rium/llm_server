
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  percent?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, percent }) => {
  const isHighLoad = percent !== undefined && percent > 80;
  const accentColor = isHighLoad ? '#ffaa00' : '#00bfff';

  return (
    <div className="bg-[#111] border border-white/5 rounded-lg p-3 flex flex-col justify-between min-w-[150px] transition-all hover:border-[#00bfff]/30">
      <div className="flex justify-between items-start">
        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mono">{label}</span>
        {isHighLoad && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa00] animate-pulse" />
        )}
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span 
          className="text-xl font-bold mono glow-text"
          style={{ color: accentColor }}
        >
          {value}
        </span>
        <span className="text-[9px] text-gray-600 font-medium uppercase">{unit}</span>
      </div>
      {percent !== undefined && (
        <div className="w-full h-[2px] bg-gray-900 mt-2 overflow-hidden rounded-full">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${percent}%`, 
              backgroundColor: accentColor,
              boxShadow: `0 0 5px ${accentColor}` 
            }}
          />
        </div>
      )}
    </div>
  );
};
