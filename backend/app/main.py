from datetime import datetime, timezone
from threading import Lock
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NEON//RANGE Control API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])

events = []
event_lock = Lock()

@app.get("/")
def root():
    return {"project": "NEON//RANGE", "mode": "LAB", "message": "Attack → Detect → Investigate → Fix → Replay"}

@app.get("/api/status")
def status():
    return {
        "lab": "RUNNING", "score": 42,
        "assets": {"api": 1, "containers": 2, "data_stores": 1, "identities": 1},
        "findings": {"critical": 2, "high": 3, "medium": 4},
        "current_mission": {"id": 1, "name": "Find the Door", "difficulty": "BEGINNER"}
    }

@app.post("/api/events")
def ingest_event(event: dict):
    now = datetime.now(timezone.utc)
    item = {
        "id": str(int(now.timestamp() * 1000000)),
        "time": now.strftime("%H:%M:%S UTC"),
        "title": event.get("title", "NovaCorp request observed"),
        "severity": event.get("severity", "info"),
        "phase": event.get("phase", "RECON"),
        "source": "lab-attacker",
        "method": event.get("method", "GET"),
        "path": event.get("path", "/")
    }
    with event_lock:
        events.insert(0, item)
        del events[50:]
    return item

@app.get("/api/events")
def list_events():
    with event_lock:
        return {"events": list(events)}

@app.delete("/api/events")
def clear_events():
    with event_lock:
        events.clear()
    return {"cleared": True}

@app.get("/api/attack-path")
def attack_path():
    return {
        "nodes": [
            {"id": "internet", "label": "Internet", "type": "source"},
            {"id": "api", "label": "Vulnerable API", "type": "workload"},
            {"id": "identity", "label": "Fake Workload Identity", "type": "identity"},
            {"id": "data", "label": "Synthetic Customer Data", "type": "data"}
        ],
        "edges": [
            {"source": "internet", "target": "api"},
            {"source": "api", "target": "identity"},
            {"source": "identity", "target": "data"}
        ]
    }
