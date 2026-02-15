import time
import psutil
from collections import deque
from statistics import mean


class Metrics:

    def __init__(self):
        self.start_time = time.time()

        # Request accounting
        self.total_requests = 0
        self.total_tokens = 0

        # Streaming latency tracking
        self.ttft = deque(maxlen=500)
        self.ttlt = deque(maxlen=500)

        # Active streams counter
        self.active_streams = 0

    def record_stream(self, ttft, ttlt, token_count):
        self.total_requests += 1
        self.ttft.append(ttft)
        self.ttlt.append(ttlt)
        self.total_tokens += token_count

    def snapshot(self):

        uptime = time.time() - self.start_time

        avg_ttft = mean(self.ttft) if self.ttft else 0
        avg_ttlt = mean(self.ttlt) if self.ttlt else 0

        tokens_per_sec = (
            self.total_tokens / uptime
            if uptime > 0 else 0
        )

        return {
            "uptime_sec": round(uptime, 2),
            "total_requests": self.total_requests,
            "total_tokens_generated": self.total_tokens,
            "tokens_per_sec_overall": round(tokens_per_sec, 2),
            "avg_ttft_sec": round(avg_ttft, 4),
            "avg_ttlt_sec": round(avg_ttlt, 4),
            "active_streams": self.active_streams,
            "memory_mb": round(psutil.Process().memory_info().rss / 1024 / 1024, 2),
            "cpu_percent": psutil.cpu_percent(interval=None),
            # Frontend compatibility
            "ram_percent": psutil.virtual_memory().percent,
            "tokens_per_sec": round(tokens_per_sec, 2),
            "avg_latency": round(avg_ttlt, 4),
        }


metrics = Metrics()
