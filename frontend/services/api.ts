
import { Metrics, Message } from '../types';

const API_BASE = 'http://127.0.0.1:8000';

export class LocalAIService {
  private static instance: LocalAIService;
  private abortController: AbortController | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new LocalAIService();
    }
    return this.instance;
  }

  async fetchMetrics(): Promise<Metrics> {
    const response = await fetch(`${API_BASE}/metrics`);
    if (!response.ok) throw new Error('Backend unreachable');
    return await response.json();
  }

  async generateStream(prompt: string, onToken: (token: string) => void, onComplete: () => void) {
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${API_BASE}/generate_stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: this.abortController.signal,
      });

      if (!response.ok) throw new Error('Stream failed');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let totalLength = 0;

      while (true) {
        try {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                onComplete();
                return;
              }

              totalLength += data.length;
              if (totalLength > 2000) {
                this.stopStream();
                onToken('\n\n[Stopped by Frontend: Length Limit Exceeded]');
                onComplete();
                return;
              }

              onToken(data);
            }
          }
        } catch (readError) {
          if (readError instanceof Error && readError.name === 'AbortError') {
            // Explicit user abort
            return;
          }
          throw readError;
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error('Stream error:', error);
        onToken('\n\n[ERROR]\nStream interrupted.');
      }
      onComplete();
    }
  }

  stopStream() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
