from abc import ABC, abstractmethod
from asyncio import Queue

class BaseScheduler(ABC):
    """
    Abstract base class for all scheduling strategies.
    Ensures pluggable scheduling logic.
    """
    
    @abstractmethod
    async def submit_stream(self, prompt: str) -> Queue:
        """
        Submit a prompt for streaming generation.
        Returns an asyncio.Queue that will receive tokens.
        """
        pass

    @abstractmethod
    async def start(self):
        """
        Start the worker loop(s).
        """
        pass
