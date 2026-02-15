
import React from 'react';
import { Metrics, ModelInfo } from '../types';

interface TopBarProps {
  metrics: Metrics;
  info: ModelInfo;
  uptime: string;
}

export const TopBar: React.FC<TopBarProps> = ({ metrics, info, uptime }) => {
  const isHighLoad = metrics.cpu_percent > 75;
  
  return (
    <div className="h-8 bg-[#0d1218] border-b border-white/5 flex items-center px-4 justify-between text-[9px] mono uppercase tracking-tight">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className={`w-1 h-1 ${info.status === 'online' ? 'bg-[#00c8e6]' : 'bg-red-500'}`}></span>
          <span className="text-white font-bold">NODE_{info.status}</span>
        </div>
        <div className="flex gap-4 border-l border-white/5 pl-4">
          <div className="flex gap-1">
            <span className="text-tertiary">CPU:</span>
            <span className={isHighLoad ? 'text-[#ff9f1c]' : 'text-secondary'}>{metrics.cpu_percent.toFixed(2)}%</span>
          </div>
          <div className="flex gap-1">
            <span className="text-tertiary">RAM:</span>
            <span className="text-secondary">{metrics.ram_percent.toFixed(2)}%</span>
          </div>
          <div className="flex gap-1">
            <span className="text-tertiary">THR:</span>
            <span className="text-secondary">{metrics.tokens_per_sec.toFixed(1)} T/S</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex gap-2">
          <span className="text-tertiary">UPTIME:</span>
          <span className="text-secondary">{uptime}</span>
        </div>
        <div className="flex gap-2 border-l border-white/5 pl-4">
          <span className="text-tertiary">THREADS:</span>
          <span className="text-secondary">{info.threads}</span>
        </div>
        <div className="flex gap-2 border-l border-white/5 pl-4">
          <span className="text-tertiary">CORE:</span>
          <span className="text-[#00c8e6]">{info.name}</span>
        </div>
        <div className="flex gap-2 text-[#00c8e6]/30 border-l border-white/5 pl-4 font-bold">
          <span>SECURE_LOCAL</span>
        </div>
      </div>
    </div>
  );
};
