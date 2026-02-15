
import React from 'react';
import { Metrics } from '../types';

interface LeftPanelProps {
  metrics: Metrics;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ metrics }) => {
  const isHighLoad = metrics.cpu_percent > 75;

  return (
    <div className="w-56 bg-[#0a0e14] border-r border-white/5 flex flex-col p-4 gap-8 relative">
      <div className="vertical-scanline"></div>
      
      <div className="space-y-10">
        <section>
          <h3 className="text-[8px] text-tertiary font-bold mb-4 uppercase tracking-[0.2em] mono">CPU_TELEMETRY</h3>
          <div className="flex flex-col gap-2">
            <span className={`text-2xl font-bold mono tracking-tighter ${isHighLoad ? 'text-[#ff9f1c]' : 'text-[#00c8e6]'}`}>
              {metrics.cpu_percent.toFixed(1)}<span className="text-[10px] ml-1 opacity-30">%</span>
            </span>
            <div className="w-full h-0.5 bg-black">
              <div 
                className={`h-full transition-all duration-1000 ${isHighLoad ? 'bg-[#ff9f1c]' : 'bg-[#00c8e6]'}`}
                style={{ width: `${metrics.cpu_percent}%` }}
              ></div>
            </div>
            {isHighLoad && (
              <span className="text-[7px] text-[#ff9f1c] mono font-bold uppercase">LOAD_THRESHOLD: HIGH</span>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-[8px] text-tertiary font-bold mb-4 uppercase tracking-[0.2em] mono">RAM_DYNAMICS</h3>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold mono tracking-tighter text-secondary">
              {metrics.ram_percent.toFixed(1)}<span className="text-[10px] ml-1 opacity-30">%</span>
            </span>
            <div className="w-full h-0.5 bg-black">
              <div 
                className="h-full bg-gray-800 transition-all duration-1000"
                style={{ width: `${metrics.ram_percent}%` }}
              ></div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[8px] text-tertiary font-bold mb-4 uppercase tracking-[0.2em] mono">ACTIVE_CORE</h3>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[9px] mono px-2 py-1 bg-white/5">
              <span className="text-tertiary">THREADS</span>
              <span className="text-[#00c8e6] font-bold">04</span>
            </div>
            <div className="flex justify-between items-center text-[9px] mono px-2 py-1">
              <span className="text-tertiary">CACHE</span>
              <span className="text-green-900 font-bold">STABLE</span>
            </div>
          </div>
        </section>
      </div>
      
      <div className="mt-auto border-t border-white/5 pt-4">
         <div className="flex items-center justify-between text-[7px] mono text-tertiary uppercase tracking-widest">
            <span>SECURE_PIPE_ACTIVE</span>
            <span className="w-1 h-1 bg-[#00c8e6]/20"></span>
         </div>
      </div>
    </div>
  );
};
