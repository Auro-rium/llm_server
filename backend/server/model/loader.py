import os
from llama_cpp import Llama
from server.config import Config

def create_llm(config: Config) -> Llama:
    """
    Creates and initializes the LLM instance based on configuration.
    """
    model_path = os.path.abspath(config.model.path)
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")
    
    print(f"Loading model from: {model_path}")
    print(f"Threads: {config.model.n_threads} | Context: {config.model.n_ctx}")

    return Llama(
        model_path=model_path,
        n_ctx=config.model.n_ctx,
        n_threads=config.model.n_threads,
        n_batch=512,
        use_mmap=True,
        use_mlock=False,
        verbose=False # Keep logs clean
    )
