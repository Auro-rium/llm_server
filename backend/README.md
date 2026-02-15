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

# 🚀 How To Run

## 1️⃣ Setup Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2️⃣ Start Server

```bash
./venv/bin/python -m uvicorn server.main:app --port 8000 --reload
```

## 3️⃣ API Usage

**Streaming Chat:**
```bash
curl -X POST "http://localhost:8000/generate_stream" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain gravity simply"}'
```

**Metrics:**
```bash
curl http://localhost:8000/metrics
```
