import json
from fastapi.testclient import TestClient
from src.main import app
import sys

# Setting up TestClient
client = TestClient(app)

print("[START] Simulating AI Brain Directive from Synthara Vision to Nelmani Fresh...")

# Payload exactly matching what Synthara Vision sends
payload = {
    "decision_id": "dec-12345",
    "directive_type": "PAUSE_SALES",
    "target_system": "nelmani-fresh",
    "payload": {
        "target_product": "rice",
        "reason": "Severe Drought Detected in Palakkad - Protecting Inventory"
    }
}

headers = {
    "X-Synthara-Token": "super_secret_synthara_token"
}

# 1. Test Without Token (Should fail - Security Check)
print("\n[TEST 1] Sending Webhook without valid auth token...")
res = client.post("/api/v1/synthara/webhook", json=payload, headers={"X-Synthara-Token": "wrong"})
print(f"Status: {res.status_code}")
print(f"Response: {res.json()}")

# 2. Test With Token (Should pass - executes directive)
print("\n[TEST 2] Sending Webhook WITH valid Synthara token...")
res = client.post("/api/v1/synthara/webhook", json=payload, headers=headers)
print(f"Status: {res.status_code}")
print(f"Response: {json.dumps(res.json(), indent=2)}")

if res.status_code == 200:
    print("\n[SUCCESS] Verification Successful: Act Layer executed the AI Brain's directive.")
else:
    print("\n[ERROR] Verification Failed")
    sys.exit(1)
