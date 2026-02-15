import asyncio
from asyncio import Queue
from server.scheduler.base import BaseScheduler
from server.model.loader import create_llm
from server.config import Config
from server.metrics import metrics
import time

class FifoScheduler(BaseScheduler):
    """
    First-In-First-Out Scheduler.
    Simple queue-based processing.
    """
    def __init__(self, config: Config):
        self.config = config
        self.queue = asyncio.Queue()
        self.llm = None 

    async def start(self):
        print(f"Starting FIFO Scheduler with {self.config.scheduler.num_workers} workers...")
        # Lazy load model in worker process/thread logic (simulated here for async compatibility)
        # For this simple implementation, we load it once in the main loop context
        self.llm = create_llm(self.config)
        asyncio.create_task(self._worker_loop())

    async def submit_stream(self, prompt: str) -> Queue:
        token_queue = Queue()
        # Store request tuple: (prompt, output_queue, arrival_time)
        await self.queue.put((prompt, token_queue, time.time()))
        metrics.active_streams += 1
        return token_queue

    async def _worker_loop(self):
        while True:
            # wait for request
            prompt, token_queue, arrival_time = await self.queue.get()
            
            # TTFT tracking
            start_gen_time = time.time()
            ttft_recorded = False
            token_count = 0

            try:
                # Streaming generation using llama-cpp-python
                stream = self.llm.create_chat_completion(
                    messages=[{"role": "user", "content": prompt}],
                    stream=True,
                    max_tokens=256,
                    temperature=0.2,
                    top_p=0.8,
                    repeat_penalty=1.15,
                    stop=["[USER]", "\n\n\n"]
                )

                tokens_generated = 0
                for chunk in stream:
                    if tokens_generated >= 256:
                        break

                    if not ttft_recorded:
                        ttft = time.time() - start_gen_time
                        metrics.ttft.append(ttft)
                        ttft_recorded = True
                        metrics.tokens_per_sec_overall = 0 # Reset or recalibrate if needed

                    delta = chunk['choices'][0]['delta']
                    if 'content' in delta:
                        content = delta['content']
                        token_count += 1
                        tokens_generated += 1
                        await token_queue.put(content)
                        # Yield control to allow other tasks (like metrics polling) to run
                        await asyncio.sleep(0) 

                await token_queue.put("[DONE]")

            except Exception as e:
                print(f"Error during generation: {e}")
                await token_queue.put(f"\n[ERROR]: {str(e)}")
                await token_queue.put("[DONE]")
            
            finally:
                metrics.active_streams -= 1
                ttlt = time.time() - start_gen_time
                metrics.record_stream(
                    ttft=metrics.ttft[-1] if metrics.ttft else 0,
                    ttlt=ttlt,
                    token_count=token_count
                )
