import yaml
import os
from pydantic import BaseModel

class ModelConfig(BaseModel):
    path: str
    n_ctx: int
    n_threads: int

class SchedulerConfig(BaseModel):
    policy: str
    num_workers: int

class LabConfig(BaseModel):
    dynamic_batching: bool
    profiling: bool

class Config(BaseModel):
    model: ModelConfig
    scheduler: SchedulerConfig
    lab: LabConfig

_config_instance = None

def load_config(path: str = "config.yaml") -> Config:
    global _config_instance
    if not os.path.exists(path):
        raise FileNotFoundError(f"Config file not found at {path}")
    
    with open(path, "r") as f:
        data = yaml.safe_load(f)
    
    _config_instance = Config(**data)
    return _config_instance

def get_config() -> Config:
    if _config_instance is None:
        return load_config()
    return _config_instance
