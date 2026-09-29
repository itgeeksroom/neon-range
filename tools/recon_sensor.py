#!/usr/bin/env python3
"""NEON//RANGE local recon sensor.

Runs Nmap ONLY against localhost/127.0.0.1, parses open ports, and sends
synthetic lab telemetry to the NEON backend. This keeps beginner recon
visible on the dashboard without scanning external systems.
"""
import json
import subprocess
import sys
from urllib import request

BACKEND = "http://localhost:8000/api/events"
TARGET = "127.0.0.1"

def send_event(title, severity, phase, path):
    payload = json.dumps({
        "title": title,
        "severity": severity,
        "phase": phase,
        "method": "NMAP",
        "path": path,
    }).encode()
    req = request.Request(BACKEND, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    request.urlopen(req, timeout=2).read()

def main():
    print("NEON//RANGE Recon Sensor")
    print("Target locked to 127.0.0.1 (local training lab)")
    print("Scanning ports 1-10000...\n")

    try:
        result = subprocess.run(
            ["nmap", "-sV", "-p", "1-10000", TARGET],
            capture_output=True, text=True, check=True
        )
    except FileNotFoundError:
        sys.exit("nmap was not found in PATH.")
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.stderr or "nmap scan failed.")

    open_ports = []
    for line in result.stdout.splitlines():
        parts = line.split()
        if len(parts) >= 3 and "/tcp" in parts[0] and parts[1] == "open":
            port = parts[0]
            service = parts[2]
            version = " ".join(parts[3:]) if len(parts) > 3 else ""
            open_ports.append((port, service, version))

    send_event(
        f"Port scan completed — {len(open_ports)} open ports found",
        "low", "RECON", "127.0.0.1:1-10000"
    )

    for port, service, version in open_ports:
        detail = f"{port} {service}"
        if version:
            detail += f" {version}"
        send_event(
            f"Open service discovered — {port}",
            "info", "SERVICE DISCOVERY", detail
        )

    print(result.stdout)
    print(f"\nSent {len(open_ports) + 1} recon events to NEON.")
    print("Open http://localhost:3000 and refresh the dashboard.")

if __name__ == "__main__":
    main()
