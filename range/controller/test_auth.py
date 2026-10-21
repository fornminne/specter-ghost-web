import importlib
import os
import unittest

import app as controller
from fastapi.testclient import TestClient


def load(**env):
    for key in ("SPECTER_DRY_RUN", "SPECTER_RANGE_TOKEN"):
        os.environ.pop(key, None)
    os.environ.update(env)
    importlib.reload(controller)
    controller.instances.clear()
    return TestClient(controller.app)


class RangeAuthTests(unittest.TestCase):
    def test_dry_run_create_without_token(self):
        client = load()
        response = client.post("/v1/instances", json={"challenge": "ghost-protocol", "ttlMinutes": 15})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["status"], "running")
        self.assertEqual(client.get("/health").status_code, 200)

    def test_configured_token_is_required(self):
        client = load(SPECTER_RANGE_TOKEN="lab-token")
        denied = client.post("/v1/instances", json={"challenge": "ghost-protocol"})
        self.assertEqual(denied.status_code, 401)
        accepted = client.post(
            "/v1/instances",
            json={"challenge": "ghost-protocol"},
            headers={"authorization": "Bearer lab-token"},
        )
        self.assertEqual(accepted.status_code, 201)
        listing = client.get("/v1/instances")
        self.assertEqual(listing.status_code, 401)

    def test_live_mode_refuses_without_token(self):
        client = load(SPECTER_DRY_RUN="0")
        response = client.post("/v1/instances", json={"challenge": "ghost-protocol"})
        self.assertEqual(response.status_code, 503)
        self.assertEqual(client.get("/health").status_code, 200)
        self.assertEqual(client.get("/v1/instances").status_code, 503)


if __name__ == "__main__":
    unittest.main()
