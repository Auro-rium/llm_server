import asyncio
from asyncio import Queue
from server.scheduler.base import BaseScheduler
from server.scheduler.fifo import FifoScheduler

class PriorityScheduler(FifoScheduler):
    """
    Stub for Priority-based Scheduler.
    Currently inherits from FIFO but prepared for priority queue logic.
    """
    async def submit_stream(self, prompt: str, priority: int = 0) -> Queue:
        # Future: Use asyncio.PriorityQueue
        print(f"DEBUG: Priority submission (Stub) - treating as FIFO")
        return await super().submit_stream(prompt)
