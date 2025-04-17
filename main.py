from core.context import FlightContext
from core.travel_context import TravelContext
from agents.crew.crew_agent import CrewAgent
from agents.fuel.fuel_agent import FuelAgent
from agents.mel.mel_agent import MELAgent
from agents.ops.ops_agent import OpsAgent
from agents.travel.travel_agent import TravelAgent
from datetime import datetime, timedelta

# Simulated flight disruption context
context = FlightContext(
    flight_id="QF11",
    aircraft_type="A380",
    origin="SYD",
    destination="LAX",
    delay_minutes=180,
    reported_mel="APU inop"
)

# Initialize agents
crew_agent = CrewAgent()
fuel_agent = FuelAgent()
mel_agent = MELAgent()
ops_agent = OpsAgent()
travel_agent = TravelAgent()

# Evaluate decisions from operational agents
crew_decision = crew_agent.evaluate(context)
fuel_decision = fuel_agent.evaluate(context)
mel_decision = mel_agent.evaluate(context)
ops_decision = ops_agent.evaluate(context, crew_decision, fuel_decision, mel_decision)

# Print agent outcomes
print("CrewAgent Decision:", crew_decision)
print("FuelAgent Decision:", fuel_decision)
print("MELAgent Decision:", mel_decision)
print("OpsAgent Decision:", ops_decision)

# Simulated crew travel context
travel_context = TravelContext(
    crew_id="AL1234",
    base="JFK",
    gateway="ORD",
    preferred_airlines=["United", "Delta"],
    seat_pref="Window",
    travel_type="gateway",  # or "deadhead"
    duty_start_time="2025-04-17T06:00:00Z",
    schedule={"pairing_id": "PX123", "check_in": "2025-04-17T04:00:00Z"},
    cba_rules={"max_reposition_time": 6},
    loa_status="Active"
    self.report_time = datetime.fromisoformat(schedule["check_in"])
)

# Evaluate travel decision
travel_decision = travel_agent.evaluate(travel_context)
print("TravelAgent Decision:", travel_decision)
