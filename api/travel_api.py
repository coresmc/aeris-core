from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging

from agents.travel.alternate_dh_logic import evaluate_alternate_deadheads

app = FastAPI()

# Enable CORS for frontend connection (adjust origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with actual domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to validate incoming JSON
class TravelRequest(BaseModel):
    name: str
    crew_id: str
    base: str
    gateway: str
    preferred_airlines: List[str]
    duty_start_time: str
    pairing_id: str
    check_in_time: str
    loa_status: str
    seat_pref: str
    travel_type: str

# Dummy function to estimate original DH cost
def estimate_original_dh_cost(travel_type: str) -> float:
    if travel_type.lower() == "alternate_deadhead":
        return 4000.0  # USD, business class benchmark
    elif travel_type.lower() == "deadhead":
        return 1200.0
    else:
        return 300.0

# Context object to simulate real backend logic (simplified)
class Context:
    def __init__(self, data: TravelRequest):
        self.name = data.name
        self.crew_id = data.crew_id
        self.base = data.base
        self.gateway = data.gateway
        self.preferred_airlines = data.preferred_airlines
        self.duty_start_time = datetime.fromisoformat(data.duty_start_time.replace("Z", "+00:00"))
        self.pairing_id = data.pairing_id
        self.check_in_time = data.check_in_time
        self.loa_status = data.loa_status
        self.seat_pref = data.seat_pref
        self.travel_type = data.travel_type
        self.class_of_service = "business" if estimate_original_dh_cost(data.travel_type) > 1500 else "economy"
        self.schedule = {"sign_on_airport": "ICN"}  # Stub for now

@app.post("/recommend-travel")
def recommend_travel(request: TravelRequest):
    try:
        context = Context(request)
        minutes_to_report = int((context.duty_start_time - datetime.utcnow()).total_seconds() / 60)
        logging.info(f"[LOG] {datetime.utcnow().isoformat()} — Time to report: {minutes_to_report} minutes")

        if context.travel_type.lower() == "gateway":
            logging.info("[LOG] Gateway travel authorized based on travel_type")
            return {"status": "authorized", "type": "gateway", "msg": "Gateway travel authorized."}

        if context.travel_type.lower() == "alternate_deadhead":
            original_price = estimate_original_dh_cost(context.travel_type)
            alt_result = evaluate_alternate_deadheads(context, original_price)
            return {"status": "complete", "type": "alternate_deadhead", "result": alt_result}

        return {"status": "unhandled", "msg": "Unhandled travel type"}

    except Exception as e:
        logging.exception("Request failed.")
        return {"error": "Request failed.", "details": str(e)}