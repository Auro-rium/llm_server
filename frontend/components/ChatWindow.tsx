
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isThinking: boolean;
  isStreaming: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isThinking, isStreaming }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, isStreaming]);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 overflow-y-auto p-6 space-y-1 flex flex-col scroll-smooth font-mono text-[12px] transition-all duration-150 ${isThinking || isStreaming ? 'bg-[#00c8e6]/[0.02]' : ''}`}
    >
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center opacity-20 pointer-events-none flex-col gap-2">
          <p className="text-[#00c8e6] mono tracking-[0.4em] text-xs font-bold uppercase">INITIALIZING COMMAND CHANNEL</p>
          <div className="w-32 h-[1px] bg-white/10"></div>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-4 py-0.5 group border-l border-transparent hover:border-white/5 pl-2 transition-colors">
          <span className="text-tertiary shrink-0 select-none text-[10px] pt-0.5">
            {msg.timestamp}
          </span>
          <div className="flex gap-2 flex-1">
            <span className={`font-bold shrink-0 min-w-[70px] ${msg.role === 'user' ? 'text-tertiary' : 'text-[#00c8e6]'}`}>
              [{msg.role === 'user' ? 'USER' : 'CORE'}]
            </span>
            <span className="text-tertiary font-bold shrink-0">&gt;</span>
            <div className={`flex-1 break-words whitespace-pre-wrap ${msg.role === 'user' ? 'text-secondary' : 'text-gray-200'}`}>
              {msg.content}
              {msg.isStreaming && <span className="inline-block w-2.5 h-4 ml-1 bg-[#00c8e6] align-start animate-pulse" />}
            </div>
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-4 py-0.5 pl-2 border-l border-[#00c8e6]/20">
          <span className="text-tertiary shrink-0 text-[10px] pt-0.5">
            {new Date().toLocaleTimeString([], { hour12: false })}
          </span>
          <div className="flex gap-2">
            <span className="text-[#00c8e6] font-bold shrink-0 min-w-[70px]">[CORE]</span>
            <span className="text-tertiary font-bold shrink-0">&gt;</span>
            <div className="text-[#00c8e6] mono font-bold tracking-widest opacity-60 uppercase text-[10px] flex items-center gap-2">
              AWAITING_INFERENCE...
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
