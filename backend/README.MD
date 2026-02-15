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

This is not an API wrapper. This is an infrastructure-level implementation.

---

# 🏗 Architecture Overview

```
User
  ↓
FastAPI (/generate_stream)
  ↓
Scheduler (FIFO/Priority)
  ↓
llama.cpp (GGUF model)
  ↓
KV Cache (attention reuse)
  ↓
Metrics Collector
  ↓
/metrics endpoint
```

**Core components:**
* `server/model/loader.py` → Centralized Model loader
* `server/main.py` → FastAPI server & Endpoints
* `server/scheduler/` → Pluggable Request Schedulers
* `server/metrics.py` → Observability layer
* `server/kv_cache.py` → Cache experiment

---

# ⚙️ Tech Stack

* **Python 3.12**
* **llama-cpp-python**: Bindings for llama.cpp
* **FastAPI**: High-performance Async Web Framework
* **Uvicorn**: ASGI Server
* **psutil**: System Monitoring

---

# 🧪 KV Cache Deep Dive (Performance Analysis)

This project specifically investigates the performance impact of **Key-Value (KV) Caching** on CPU inference.

## Objective

Measure latency difference between:
1.  **KV Cache Enabled** (Standard inference)
2.  **KV Cache Disabled** (Forced full recomputation per token)

## Results (TinyLlama 1.1B Q4 on 4-Core CPU)

### ✅ With KV Cache
* **Throughput**: ~26–28 tokens/sec
* **Latency per Token**: ~0.05s
* **Complexity**: O(N) linear work per token
* **Total Latency (50 tokens)**: ~2.5s

### ❌ Without KV Cache
* **Throughput**: ~1.1 tokens/sec
* **Latency per Token**: ~0.89s (avg)
* **Complexity**: O(N²) quadratic work per token
* **Total Latency (50 tokens)**: ~44.6s

**Conclusion**: Without KV caching, attention mechanism recomputes the entire context for every single new token generated. KV caching stores these computations, making inference feasible for chat applications.

---

# 🧵 Thread Tuning Experiment

We benchmarked inference speed across different thread counts on a 4-core machine.

| Threads | Tokens/sec | Observation |
| ------- | ---------- | ----------- |
| 2       | **28.6**   | **Optimal**. Matches physical cores vs memory bandwidth balance. |
| 3       | 27.0       | Slight degradation due to context switching overhead. |
| 4       | 25.8       | No gain. CPU inference is often **memory-bandwidth bound**, not compute-bound. |

---

# 🚀 How To Run

## 1️⃣ Setup Environment

Navigate to the `backend` directory:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2️⃣ Start Server

Run the Uvicorn server (which initializes the FIFO scheduler):
```bash
./venv/bin/python -m uvicorn server.main:app --port 8000 --reload
```

## 3️⃣ API Usage

**Streaming Chat (SSE):**
```bash
curl -N -X POST "http://localhost:8000/generate_stream" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a short poem about code."}'
```

**Metrics:**
```bash
curl http://localhost:8000/metrics
```

**Response:**
```json
{
  "active_streams": 1,
  "tokens_per_sec": 24.5,
  "cpu_percent": 45.2,
  "ram_percent": 62.1
}
```

---

# 📊 Why This Project Matters

This is a **systems engineering** approach to AI. Instead of just "using" an LLM, we are managing its lifecycle, memory, scheduling, and performance characteristics directly.

* **KV Cache** turns quadratic slowness into linear speed.
* **Thread Tuning** reveals hardware bottlenecks.
* **Schedulers** manage concurrency.
* **Quantization** balances quality vs. resource usage.
