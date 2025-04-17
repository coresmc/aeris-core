from datetime import datetime
import json
import os

class OpsAgent:
    def __init__(self):
        self.log_file = "logs/opsagent_logs.jsonl"

    def evaluate(self, context, crew_decision, fuel_decision, mel_decision):
        actions = [crew_decision["action"], fuel_decision["action"], mel_decision["action"]]
        reasons = [crew_decision["reason"], fuel_decision["reason"], mel_decision["reason"]]

        if "Cancel" in actions:
            final_action = "Cancel flight"
            reason = "Cancellation required due to agent input: " + "; ".join(reasons)
        elif "No legal reserve available" in crew_decision["reason"]:
            final_action = "Delay or re-crew"
            reason = "Crew unavailable within legal limits."
        elif "Unknown" in mel_decision["action"]:
            final_action = "Hold for maintenance"
            reason = "Unlisted MEL item needs manual review."
        elif crew_decision["action"].startswith("Suggest delay") and fuel_decision["action"] == "No tankering":
            final_action = "Delay flight"
            reason = "Crew legal after delay; MEL deferred; fuel impact low."
        else:
            final_action = "Proceed"
            reason = "All inputs within operational tolerance."

        result = {
            "action": final_action,
            "reason": reason
        }

        self.log_decision(context.flight_id, result, reasons)
        return result

    def log_decision(self, flight_id, result, reasons):
        log = {
            "timestamp": datetime.now().isoformat(),
            "flight_id": flight_id,
            "inputs": reasons,
            "result": result
        }
        os.makedirs("logs", exist_ok=True)
        with open(self.log_file, "a") as f:
            f.write(json.dumps(log) + "\n")
