# 📅 Scheduler Architecture

The backend implements a modular scheduling system to manage concurrent LLM requests.

## 🏗 Design

The scheduler is an abstract base class (`BaseScheduler`) that defines the interface for submitting and processing requests. This allows swapping different scheduling algorithms without changing the main application logic.

### Base Class (`server/scheduler/base.py`)
Defines:
- `start()`: Initialize workers.
- `submit_stream(prompt)`: Enqueue a request.

## 🔄 Implementations

### 1. FIFO Scheduler (`server/scheduler/fifo.py`)
**First-In-First-Out**. The simplest standard queue.
- **Logic**: Requests are processed strictly in arrival order.
- **Concurrency**: Single worker (default) processes one token stream at a time.
- **Use Case**: Simple chat bots, sequential processing.

### 2. Priority Scheduler (`server/scheduler/priority.py`) (Stub)
**Priority Queue**.
- **Logic**: Requests can be tagged with priority (High/Low).
- **Use Case**: Premium users vs Free users.

## ⚙️ Configuration

Scheduler settings are managed in `config.yaml`:
```yaml
scheduler:
  type: "fifo"  # or "priority"
  num_workers: 1
```
