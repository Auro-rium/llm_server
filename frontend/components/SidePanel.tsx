
import React, { useEffect, useState } from 'react';
import { MetricsGraph } from './MetricsGraph';
import { MetricHistory, ModelInfo } from '../types';

interface SidePanelProps {
  history: MetricHistory[];
  info: ModelInfo;
}

export const SidePanel: React.FC<SidePanelProps> = ({ history, info }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const events = [
      "Cache hit detected (KV_CORE)",
      "Memory reallocation successful",
      "Sequence length updated: 1024",
      "Inference step completed in 38ms",
      "Vector pool garbage collected",
      "Scheduler prioritizing threads",
      "Model weights verified [CRC32:OK]"
    ];
    
    const interval = setInterval(() => {
      const log = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [log, ...prev].slice(0, 15));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-72 bg-[#0a0e14] border-l border-white/5 flex flex-col p-4 gap-6 overflow-hidden relative">
      <div className="flex-1 flex flex-col gap-8">
        <section>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[8px] text-tertiary font-bold uppercase tracking-[0.2em] mono">CPU_FLUX_1HZ</h3>
          </div>
          <div className="h-28 border border-white/5 bg-black/40 overflow-hidden relative">
            <MetricsGraph data={history} />
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0">
          <h3 className="text-[8px] text-tertiary font-bold mb-3 uppercase tracking-[0.2em] mono">KERNEL_LOG</h3>
          <div className="flex-1 bg-black/60 border border-white/5 p-2 font-mono text-[8px] overflow-hidden space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-tertiary">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <span className={`${i === 0 ? 'text-[#00c8e6]' : 'text-tertiary'} opacity-70`}> {log}</span>
              </div>
            ))}
          </div>
        </section>
        
        <section>
           <h3 className="text-[8px] text-tertiary font-bold mb-3 uppercase tracking-[0.2em] mono">TELEMETRY_DATA</h3>
           <div className="grid grid-cols-2 gap-2">
             <div className="bg-white/5 p-2 border border-white/5">
                <div className="text-[7px] text-tertiary uppercase">BUFFER</div>
                <div className="text-[9px] text-secondary mono">256MB</div>
             </div>
             <div className="bg-white/5 p-2 border border-white/5">
                <div className="text-[7px] text-tertiary uppercase">LOSS</div>
                <div className="text-[9px] text-secondary mono">0.00%</div>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};
