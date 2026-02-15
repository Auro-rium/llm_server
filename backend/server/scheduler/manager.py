from server.config import Config
from server.scheduler.base import BaseScheduler
from server.scheduler.fifo import FifoScheduler
from server.scheduler.priority import PriorityScheduler

class SchedulerManager:
    """
    Factory to instantiate the correct scheduler based on config.
    Acts as a proxy for the active scheduler.
    """
    def __init__(self, config: Config):
        self.config = config
        self.scheduler: BaseScheduler = self._create_scheduler()

    def _create_scheduler(self) -> BaseScheduler:
        policy = self.config.scheduler.policy.lower()
        if policy == "fifo":
            return FifoScheduler(self.config)
        elif policy == "priority":
            return PriorityScheduler(self.config)
        else:
            print(f"Warning: Unknown policy '{policy}', defaulting to FIFO")
            return FifoScheduler(self.config)

    async def start(self):
        await self.scheduler.start()

    async def submit_stream(self, prompt: str):
        return await self.scheduler.submit_stream(prompt)
