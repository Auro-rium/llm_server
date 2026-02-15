
export interface Metrics {
  cpu_percent: number;
  ram_percent: number;
  tokens_per_sec: number;
  avg_latency: number;
}

export interface MetricHistory {
  time: string;
  cpu: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ModelInfo {
  name: string;
  quantization: string;
  threads: number;
  cache: boolean;
  status: 'online' | 'offline' | 'error';
}
