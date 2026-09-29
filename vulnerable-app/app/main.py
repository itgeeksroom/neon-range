import json
import os
from pathlib import Path
from urllib import request as urlrequest
from fastapi import FastAPI, HTTPException, Request

app = FastAPI(title="NovaCorp Vulnerable Training API", version="0.2.0")
DATA_FILE = Path("/app/synthetic-data/customers.csv")
SECRET_FILE = Path("/app/lab-secrets/fake-cloud-credentials.txt")
EVENT_URL = os.getenv("EVENT_URL", "http://backend:8000/api/events")

def classify(path):
    if path in ("/docs", "/openapi.json"):
        return "API documentation discovered", "low", "RECON"
    if path == "/internal/config":
        return "Internal configuration exposed", "high", "ENUMERATION"
    if path == "/internal/fake-credentials":
        return "Training credentials accessed", "critical", "CREDENTIAL ACCESS"
    if path == "/internal/customer-preview":
        return "Synthetic customer data accessed", "critical", "COLLECTION"
    return "NovaCorp endpoint probed", "info", "RECON"

def emit(method, path):
    title, severity, phase = classify(path)
    body = json.dumps({"title": title, "severity": severity, "phase": phase, "method": method, "path": path}).encode()
    try:
        req = urlrequest.Request(EVENT_URL, data=body, headers={"Content-Type": "application/json"}, method="POST")
        urlrequest.urlopen(req, timeout=0.5).read()
    except Exception:
        pass

@app.middleware("http")
async def telemetry(req: Request, call_next):
    response = await call_next(req)
    if req.url.path != "/health":
        emit(req.method, req.url.path)
    return response

@app.get("/")
def root():
    return {"service": "NovaCorp Training API", "warning": "INTENTIONALLY VULNERABLE LAB SERVICE", "mission_hint": "Explore the API documentation at /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/internal/config")
def internal_config():
    return {"environment": "lab", "debug": True, "credential_file": str(SECRET_FILE), "note": "This endpoint intentionally reveals internal metadata."}

@app.get("/internal/fake-credentials")
def fake_credentials():
    if not SECRET_FILE.exists():
        raise HTTPException(status_code=404, detail="Lab credential file missing")
    return {"training_only": True, "content": SECRET_FILE.read_text()}

@app.get("/internal/customer-preview")
def customer_preview():
    if not DATA_FILE.exists():
        raise HTTPException(status_code=404, detail="Synthetic dataset missing")
    rows = DATA_FILE.read_text().splitlines()[:6]
    return {"synthetic": True, "rows": rows}
