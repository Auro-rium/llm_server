
import React, { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { StatusFooter } from './components/StatusFooter';
import { SidePanel } from './components/SidePanel';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { LocalAIService } from './services/api';
import { Metrics, MetricHistory, Message, ModelInfo } from './types';

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    cpu_percent: 0,
    ram_percent: 0,
    tokens_per_sec: 0,
    avg_latency: 0,
  });
  const [history, setHistory] = useState<MetricHistory[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING'>('CONNECTED');

  const modelInfo: ModelInfo = {
    name: "TINYLLAMA-1.1B",
    quantization: "Q4_K_M",
    threads: 4,
    cache: true,
    status: connectionStatus === 'CONNECTED' ? 'online' : 'offline',
  };

  const api = LocalAIService.getInstance();

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let consecutiveFailures = 0;

    const fetchMetrics = async () => {
      try {
        const data = await api.fetchMetrics();
        setMetrics(data);
        const newPoint = { time: new Date().toLocaleTimeString(), cpu: data.cpu_percent };
        setHistory(prev => {
          // Optimization: only update history if meaningful change or strictly necessary
          // For now, keep it simple but ensure we don't over-process
          return [...prev, newPoint].slice(-40);
        });

        consecutiveFailures = 0;
        if (connectionStatus !== 'CONNECTED') {
          setConnectionStatus('CONNECTED');
        }
      } catch (error) {
        consecutiveFailures++;
        if (consecutiveFailures >= 3 && connectionStatus === 'CONNECTED') {
          setConnectionStatus('DISCONNECTED');
        } else if (connectionStatus === 'DISCONNECTED') {
          // Already disconnected, just stay there
        } else if (consecutiveFailures > 0 && connectionStatus === 'CONNECTED') {
          // Transient failure
        }
      }
    };

    fetchMetrics();
    // Use a single stable interval
    intervalId = setInterval(fetchMetrics, 1000);

    return () => clearInterval(intervalId);
  }, [connectionStatus]);

  useEffect(() => {
    const timer = setInterval(() => setUptimeSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      isStreaming: true,
    };

    setTimeout(() => {
      setIsThinking(false);
      setIsStreaming(true);
      setMessages(prev => [...prev, assistantMsg]);

      api.generateStream(userMsg.content,
        (token) => {
          setMessages(prev => prev.map(m =>
            m.id === assistantMsgId ? { ...m, content: m.content + token } : m
          ));
        },
        () => {
          setIsStreaming(false);
          setMessages(prev => prev.map(m =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          ));
        }
      );
    }, 800);
  }, [inputText, isStreaming, api]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isBooting) {
    return (
      <div className="h-screen bg-[#0b0f14] flex flex-col items-center justify-center mono text-[9px] space-y-1 text-[#00c8e6]/40 uppercase tracking-widest">
        <p>BOOT SEQUENCE INITIATED</p>
        <p>ALLOCATING VIRTUAL THREADS...</p>
        <p>CACHE SYNCHRONIZED [STABLE]</p>
        <p>INFERENCE ENGINE LOADED</p>
        <p className="text-[#00c8e6] font-bold mt-4 animate-pulse">CORE ONLINE</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen selection:bg-[#00c8e6]/10 text-secondary">
      <TopBar metrics={metrics} info={modelInfo} uptime={formatUptime(uptimeSeconds)} />

      <div className="flex-1 flex min-h-0 bg-[#0b0f14]">
        <LeftPanel metrics={metrics} />

        <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f14] relative">
          <div className="flex items-center px-6 h-8 border-b border-white/5 bg-black/20">
            <span className="text-[7px] text-tertiary font-bold tracking-[0.4em] mono uppercase">Command Channel Alpha</span>
            {connectionStatus === 'DISCONNECTED' && (
              <span className="ml-auto text-[7px] text-red-500 font-bold tracking-[0.2em] mono uppercase animate-pulse">
                BACKEND_OFFLINE_RETRYING...
              </span>
            )}
            {connectionStatus === 'RECONNECTING' && (
              <span className="ml-auto text-[7px] text-yellow-500 font-bold tracking-[0.2em] mono uppercase animate-pulse">
                ESTABLISHING_LINK...
              </span>
            )}
          </div>

          <ChatWindow messages={messages} isThinking={isThinking} isStreaming={isStreaming} />

          <div className="p-4 bg-black border-t border-white/5">
            <div className="max-w-4xl mx-auto relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={isStreaming ? "PROCESSING_INFERENCE..." : "ENTER COMMAND..."}
                disabled={isStreaming}
                className="w-full bg-black border border-white/5 focus:border-[#00c8e6]/20 px-4 py-3 text-xs focus:outline-none transition-all pr-12 placeholder:text-tertiary disabled:opacity-20 resize-none mono sharp leading-relaxed"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isStreaming}
                className="absolute right-1 top-1 bottom-1 aspect-square bg-[#00c8e6]/5 hover:bg-[#00c8e6]/10 flex items-center justify-center transition-all border border-white/10 text-[#00c8e6] disabled:opacity-5 sharp"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
            <div className="max-w-4xl mx-auto mt-2 flex justify-between text-[7px] mono text-tertiary uppercase tracking-[0.2em] font-bold">
              <span>LOCAL_SECURE_PIPE</span>
              <span>VER_0.9.15-STABLE</span>
            </div>
          </div>
        </div>

        <SidePanel history={history} info={modelInfo} />
      </div>

      <StatusFooter info={modelInfo} />
    </div>
  );
};

export default App;
