import time
import psutil
from llama_cpp import Llama

MODEL_PATH = "models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

def run_with_cache(prompt):
    llm = Llama(
        model_path=MODEL_PATH,
        n_ctx=2048,
        n_threads=2
    )

    start = time.time()
    output = llm.create_chat_completion(
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100
    )
    latency = time.time() - start

    tokens = output["usage"]["completion_tokens"]

    return latency, tokens


def run_without_cache(prompt):
    start = time.time()

    text = ""

    for _ in range(50):
        llm = Llama(
            model_path=MODEL_PATH,
            n_ctx=2048,
            n_threads=2
        )

        out = llm(prompt + text, max_tokens=1)
        text += out["choices"][0]["text"]

    latency = time.time() - start
    return latency, 50



if __name__ == "__main__":

    prompt = "Explain gravity simply."

    print("Running WITH cache...")
    latency_cache, tokens_cache = run_with_cache(prompt)
    print("Latency:", latency_cache)
    print("Tokens:", tokens_cache)
    print("Latency per token:", latency_cache / tokens_cache)

    print("\nRunning WITHOUT cache...")
    latency_no_cache, tokens_no_cache = run_without_cache(prompt)
    print("Latency:", latency_no_cache)
    print("Tokens:", tokens_no_cache)
    print("Latency per token:", latency_no_cache / tokens_no_cache)
