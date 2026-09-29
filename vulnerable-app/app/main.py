import os
from pathlib import Path
from fastapi import FastAPI, HTTPException

app = FastAPI(title="NovaCorp Vulnerable Training API", version="0.1.0")

DATA_FILE = Path("/app/synthetic-data/customers.csv")
SECRET_FILE = Path("/app/lab-secrets/fake-cloud-credentials.txt")

@app.get("/")
def root():
    return {
        "service": "NovaCorp Training API",
        "warning": "INTENTIONALLY VULNERABLE LAB SERVICE",
        "mission_hint": "Explore the API documentation at /docs"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

# Intentionally vulnerable for the local lab:
# there is no authentication protecting this endpoint.
@app.get("/internal/config")
def internal_config():
    return {
        "environment": "lab",
        "debug": True,
        "credential_file": str(SECRET_FILE),
        "note": "This endpoint intentionally reveals internal metadata."
    }

# Intentionally vulnerable for Mission 04.
# It exposes only fake, non-functional credentials.
@app.get("/internal/fake-credentials")
def fake_credentials():
    if not SECRET_FILE.exists():
        raise HTTPException(status_code=404, detail="Lab credential file missing")
    return {"training_only": True, "content": SECRET_FILE.read_text()}

# Intentionally vulnerable for DSPM training.
# Data is synthetic and mounted read-only.
@app.get("/internal/customer-preview")
def customer_preview():
    if not DATA_FILE.exists():
        raise HTTPException(status_code=404, detail="Synthetic dataset missing")
    rows = DATA_FILE.read_text().splitlines()[:6]
    return {"synthetic": True, "rows": rows}
