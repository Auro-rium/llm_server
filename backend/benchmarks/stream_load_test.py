import requests
import threading
import time

URL = "http://localhost:8000/generate_stream"
METRICS = "http://localhost:8000/metrics"

CONCURRENT_REQUESTS = 6


def send_stream_request(i):
    start_time = time.time()
    first_token_time = None

    with requests.post(
        URL,
        json={"prompt": "Explain gravity simply"},
        stream=True
    ) as r:

        for line in r.iter_lines():
            if line:
                decoded = line.decode("utf-8")

                if decoded.startswith("data: "):
                    content = decoded.replace("data: ", "")

                    if content == "[DONE]":
                        break

                    if first_token_time is None:
                        first_token_time = time.time()

    end_time = time.time()

    ttft = (
        first_token_time - start_time
        if first_token_time else 0
    )

    ttlt = end_time - start_time

    print(f"Request {i} → TTFT: {ttft:.3f}s | TTLT: {ttlt:.3f}s")


threads = []
start_all = time.time()

for i in range(CONCURRENT_REQUESTS):
    t = threading.Thread(target=send_stream_request, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

total_wall = time.time() - start_all

print("\nTotal wall time:", round(total_wall, 2), "seconds")

print("\nServer Metrics Snapshot:")
print(requests.get(METRICS).json())
