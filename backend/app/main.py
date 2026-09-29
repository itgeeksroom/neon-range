from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NEON//RANGE Control API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "NEON//RANGE",
        "mode": "LAB",
        "message": "Attack → Detect → Investigate → Fix → Replay"
    }

@app.get("/api/status")
def status():
    return {
        "lab": "RUNNING",
        "score": 42,
        "assets": {"api": 1, "containers": 2, "data_stores": 1, "identities": 1},
        "findings": {"critical": 2, "high": 3, "medium": 4},
        "current_mission": {
            "id": 1,
            "name": "Find the Door",
            "difficulty": "BEGINNER"
        }
    }

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
