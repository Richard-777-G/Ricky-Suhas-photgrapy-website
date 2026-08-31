"""Backend coverage for the fine-art print inquiry flow (no payment step).

Criterion: Fine art print room, inquiry-only.
"""

import uuid


def test_submit_print_inquiry_succeeds(client):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "name": f"tscheck-print-buyer-{unique}",
        "email": f"tscheck-{unique}@example.com",
        "message": "Interested in a 24x36 framed print of the mist canopy piece.",
    }
    resp = client.post("/inquiries", json=payload)
    assert resp.status_code in (200, 201), resp.text
    body = resp.json()
    assert body.get("name") == payload["name"] or body.get("email") == payload["email"]


def test_submit_print_inquiry_missing_fields_rejected(client):
    resp = client.post("/inquiries", json={})
    assert resp.status_code == 422, resp.text
    detail = resp.json()["detail"]
    missing_fields = {d["loc"][-1] for d in detail}
    assert {"name", "email", "message"}.issubset(missing_fields)
