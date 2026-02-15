
import React from 'react';
import { ModelInfo } from '../types';

interface StatusFooterProps {
  info: ModelInfo;
}

export const StatusFooter: React.FC<StatusFooterProps> = ({ info }) => {
  return (
    <div className="h-6 bg-[#0d1218] border-t border-white/5 px-4 flex items-center justify-between text-[8px] mono uppercase tracking-widest text-gray-500">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">KERNEL_STATE:</span>
          <span className={info.status === 'online' ? "text-green-700" : "text-red-700"}>
            {info.status === 'online' ? "STABLE" : "DISCONNECTED"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">VECTOR_MEM:</span>
          <span className="text-[#00e0ff]/50">MAPPING_ACTIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">PROTO:</span>
          <span className="text-gray-400">SSE_V3</span>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <span className="text-gray-700">SECURITY:</span>
          <span className="text-[#00e0ff]">LOCAL_LOOPBACK_ONLY</span>
        </div>
      </div>
    </div>
  );
};
