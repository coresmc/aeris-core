import difflib

from core.agent_base import AgentBase
from datetime import datetime
import difflib
import json
import os

LOG_PATH = "logs/melagent_logs.jsonl"

MEL_DATABASE = {
    "B747": {
        "APU inop": {
            "action": "Fly with restriction",
            "reason": "Allowed with ground power at departure",
            "defer_days": 10
        },
        "AC Pack 1 fail": {
            "action": "Fly with restriction",
            "reason": "One pack failure allowed for non-ETOPS flight",
            "defer_days": 3
        },
        "Landing gear issue": {
            "action": "No-go",
            "reason": "Landing gear must be fully operational",
            "defer_days": 0
        },
        "Left IRS fault": {
            "action": "Fly with restriction",
            "reason": "Redundancy allows dispatch with 2 IRS working",
            "defer_days": 3
        },
        "Weather radar inop": {
            "action": "No-go",
            "reason": "Required for international and convective weather environments",
            "defer_days": 0
        },
        "Fuel qty indication inop": {
            "action": "Fly with restriction",
            "reason": "Allowed with manual verification if alternate system working",
            "defer_days": 2
        },
        "Cockpit dome light out": {
            "action": "Fly without restriction",
            "reason": "Non-essential item; no dispatch impact",
            "defer_days": 99
        }
    }
}

class MELAgent(AgentBase):
    def evaluate(self, context):
        aircraft_type = context.aircraft_type
        mel_item = context.reported_mel

        result = {
            "action": "Unknown",
            "reason": "No MEL entry found",
            "defer_days": 0
        }

        matched_key = mel_item

        if aircraft_type in MEL_DATABASE:
            mel_entries = MEL_DATABASE[aircraft_type].keys()
            close_matches = difflib.get_close_matches(mel_item, mel_entries, n=0.4, cutoff=0.6)

            if close_matches:
                matched_key = close_matches[0]
                result = MEL_DATABASE[aircraft_type][matched_key]
                result["matched_from"] = mel_item

        context.log("MELAgent", result["reason"])
        self.log_decision(context, matched_key, result)
        return result

    def log_decision(self, context, mel_item, result):
        log = {
            "timestamp": datetime.now().isoformat(),
            "flight_id": context.flight_id,
            "aircraft_type": context.aircraft_type,
            "reported_mel": mel_item,
            "result": result
        }
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        with open(LOG_PATH, "a") as f:
            f.write(json.dumps(log) + "\n")
