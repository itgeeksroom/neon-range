# NEON//RANGE

NEON//RANGE is a beginner-friendly, intentionally vulnerable cloud-security learning lab.

## Goal

Learn the full security lifecycle inside an isolated environment:

**Attack → Detect → Investigate → Fix → Replay**

V1 focuses on one small attack path:

```
Internet → Vulnerable API → Workload Secret → Fake Cloud Identity → Synthetic Sensitive Data
```

The project is designed to later connect to cloud security platforms such as Cortex Cloud for code, dependency, IaC, container, posture, data, and runtime visibility.

> ⚠️ LAB ONLY
>
> Everything in this repository is for local, isolated training. Credentials, identities, and customer records are synthetic. Do not point attack exercises at systems you do not own or have explicit permission to test.

## V1 Components

- `dashboard/` — colorful security command-center UI
- `backend/` — FastAPI event + mission API
- `vulnerable-app/` — intentionally vulnerable training application
- `synthetic-data/` — fake PII for DSPM exercises
- `security/` — detections and future scanning integrations
- `missions/` — guided beginner exercises
- `infrastructure/` — Docker now, Terraform/AWS later

## First Mission

Mission 01 teaches:

- what an IP address is
- what a port is
- what HTTP is
- what reconnaissance means
- why an exposed service matters

## Start locally

Prerequisites:

- Docker Desktop
- Docker Compose

Run:

```bash
docker compose up --build
```

Then open:

- Vulnerable API: http://localhost:8080
- Backend API: http://localhost:8000
- Dashboard placeholder: http://localhost:3000

## Roadmap

1. Recon
2. Broken access control
3. Containers
4. Secrets
5. Identity / IAM
6. CSPM
7. DSPM
8. Runtime
9. AI SOC
10. Remediation + replay
