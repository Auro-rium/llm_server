# 🚀 Mini vLLM – CPU LLM Inference Server

A production-style Large Language Model (LLM) inference backend built from scratch using **llama.cpp**, **FastAPI**, and pure systems thinking.

This project demonstrates how real-world inference infrastructure works — including KV cache behavior, thread tuning, quantization benchmarking, and live observability.

---

# 🧠 Project Goal

Build a CPU-based inference server that includes:

* Model loading (GGUF via llama.cpp)
* Chat completion API
* KV cache experimentation
* Thread performance tuning
* Quantization benchmarking
* Metrics endpoint
* Experimental cache complexity analysis

This is not an API wrapper.
This is an infrastructure-level implementation.

---

# 🏗 Architecture Overview

```
User
  ↓
FastAPI (/generate)
  ↓
llama.cpp (GGUF model)
  ↓
KV Cache (attention reuse)
  ↓
Metrics Collector
  ↓
/metrics endpoint
```

Core components:

* `model.py` → Model loader
* `main.py` → FastAPI server
* `metrics.py` → Observability layer
* `kv_cache.py` → Cache experiment

---

# ⚙️ Tech Stack

* Python 3.12
* llama-cpp-python
* FastAPI
* Uvicorn
* psutil
* GGUF Quantized Models

---

# 🧪 KV Cache Experiment

## Objective

Measure performance difference between:

* KV cache enabled (default)
* KV cache destroyed (forced full recomputation)

## Results (TinyLlama 1.1B Q4, CPU 4 cores)

### With KV Cache

* 50 tokens generated
* Total latency ≈ **2.5 seconds**
* ≈ **0.05 sec per token**
* ≈ 26–28 tokens/sec

### Without KV Cache (Forced Reset)

* 50 tokens generated
* Total latency ≈ **44.6 seconds**
* ≈ **0.89 sec per token (avg)**
* ~18x slower overall

## Explanation

Without KV cache:

Each token recomputes attention over all previous tokens.

Total attention work:

```
1 + 2 + 3 + ... + N ≈ O(N²)
```

With KV cache:

Keys and Values are stored.
Each new token computes attention only once.

Total work:

```
N × constant ≈ O(N)
```

KV cache converts quadratic growth into linear incremental cost.

This is the reason modern chat systems are usable.

---

# 🧵 Thread Tuning Experiment

Machine: 4 logical cores (`nproc = 4`)

| Threads | Tokens/sec |
| ------- | ---------- |
| 2       | 28.6       |
| 3       | 27.0       |
| 4       | 25.8       |

Optimal configuration: **n_threads = 2**

Observation:

Increasing threads did not improve performance.
Inference was memory-bandwidth bound, not compute-bound.

---

# 📊 Metrics Endpoint

Expose live server statistics:

```
GET /metrics
```

Returns:

```json
{
  "total_requests": 2,
  "avg_latency_sec": 6.86,
  "tokens_per_sec_avg": 26.6,
  "total_tokens_generated": 365,
  "memory_mb": 1213.11,
  "cpu_percent": 21.1
}
```

Provides:

* Request count
* Average latency
* Aggregate throughput
* RAM usage
* CPU usage

Observability is built-in.

---

# 🧠 Quantization Insight

Model tested: TinyLlama 1.1B Q4_K_M

Memory footprint ≈ 1.2GB (including buffers and cache)

Quantization reduces:

* RAM usage
* Memory bandwidth
* Latency per token

Tradeoff: slight reduction in output quality.

---

# 🚀 How To Run

## 1️⃣ Install dependencies

```
pip install llama-cpp-python fastapi uvicorn psutil
```

## 2️⃣ Start server

```
python -m uvicorn server.main:app --reload
```

## 3️⃣ Generate text

```
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain gravity simply"}'
```

## 4️⃣ View metrics

```
curl http://localhost:8000/metrics
```

---

# 📈 Key Learnings

* KV cache is mandatory for usable LLM inference
* CPU inference is often memory-bandwidth bound
* More threads ≠ better performance
* Observability is essential before optimization
* Quantization dramatically affects throughput

---

# 🎯 What This Project Demonstrates

This project shows understanding of:

* Transformer attention mechanics
* KV caching behavior
* Systems performance profiling
* Async API serving
* CPU-level optimization
* Infrastructure thinking

---

# 🔮 Next Steps

* Add batching scheduler
* Implement streaming tokens (SSE)
* Add quantization comparison benchmarks
* Dockerize deployment
* Publish performance graphs

---

# 📌 Conclusion

This Mini vLLM implementation proves that efficient inference is not about model size — it is about systems design.

KV cache turns quadratic complexity into linear growth.
Thread tuning reveals memory bottlenecks.
Metrics make performance measurable.

Inference is infrastructure.
And infrastructure is engineering.
