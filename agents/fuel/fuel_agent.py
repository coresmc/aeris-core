from core.agent_base import AgentBase
import json
from datetime import datetime
import os

LOG_PATH = "logs/fuelagent_logs.jsonl"

class FuelAgent(AgentBase):
    def evaluate(self, context):
        origin_price = context.fuel_prices.get(context.origin, 1.00)
        dest_price = context.fuel_prices.get(context.destination, 1.00)
        price_diff = dest_price - origin_price

        flight_time_hours = 13  # Approx SYD-LAX
        tanker_amount_kg = 5000  # Max extra tankering
        burn_penalty_rate = 0.03  # 3% per hour

        savings = price_diff * tanker_amount_kg
        penalty = tanker_amount_kg * burn_penalty_rate * flight_time_hours
        net_savings = savings - penalty

        if net_savings > 1000:
            action = "Tanker"
            reason = f"Tanker 5T saves approx ${net_savings:.2f} after penalties."
        else:
            action = "No tankering"
            reason = f"Net savings only ${net_savings:.2f}; not worth tankering."

        result = {
            "action": action,
            "reason": reason,
            "savings": savings,
            "penalty": penalty,
            "net_savings": net_savings
        }

        context.log("FuelAgent", reason)
        self.log_decision(context, result)
        return result

    def log_decision(self, context, result):
        log = {
            "timestamp": datetime.now().isoformat(),
            "flight_id": context.flight_id,
            "origin": context.origin,
            "destination": context.destination,
            "fuel_prices": context.fuel_prices,
            "result": result
        }
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        with open(LOG_PATH, "a") as f:
            f.write(json.dumps(log) + "\\n")
