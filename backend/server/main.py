from fastapi.responses import StreamingResponse
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from server.scheduler.manager import SchedulerManager
from server.metrics import metrics
from server.config import load_config

app = FastAPI()

# Load Configuration
config = load_config("config.yaml")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Scheduler with Config
scheduler = SchedulerManager(config)

@app.on_event("startup")
async def startup():
    await scheduler.start()


class PromptRequest(BaseModel):
    prompt: str


@app.post("/generate_stream")
async def generate_stream(request: PromptRequest):
    print(f"DEBUG: Received stream request for: {request.prompt[:20]}...")
    token_queue = await scheduler.submit_stream(request.prompt)

    async def event_generator():
        print("DEBUG: Starting event generator")
        # 🔥 Instant feedback chunk
        # yield "data: Thinking...\n\n"

        while True:
            token = await token_queue.get()
            
            if token == "[DONE]":
                yield "data: [DONE]\n\n"
                break
            
            # If error, yield it as data too, or handle differently
            if token.startswith("\n[ERROR]"):
                 print(f"DEBUG: Streaming Error: {token}")

            yield f"data: {token}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

@app.post("/generate")
async def generate(request: PromptRequest):
    """Non-streaming endpoint for simple testing."""
    token_queue = await scheduler.submit_stream(request.prompt)
    full_text = ""
    while True:
        token = await token_queue.get()
        if token == "[DONE]":
            break
        full_text += token
    return {"response": full_text}

@app.get("/metrics")
async def get_metrics():
    return metrics.snapshot()
