from core.context import FlightContext
from agents.crew.crew_agent import CrewAgent
from agents.fuel.fuel_agent import FuelAgent
from agents.mel.mel_agent import MELAgent

# Simulated disruption
context = FlightContext(
    flight_id="QF11",
    aircraft_type="B747",
    origin="SYD",
    destination="LAX",
    delay_minutes=180
)

# Add fuel price data
context.fuel_prices = {
    "SYD": 0.95,
    "LAX": 1.35
}

# Add reported MEL
context.reported_mel = "radar out"

# Initialize agents
crew_agent = CrewAgent()
fuel_agent = FuelAgent()
mel_agent = MELAgent()

mel_decision = mel_agent.evaluate(context)
print("MELAgent Decision:", mel_decision)

# Run agents
crew_decision = crew_agent.evaluate(context)
fuel_decision = fuel_agent.evaluate(context)

# Print outcomes
print("CrewAgent Decision:", crew_decision)
print("FuelAgent Decision:", fuel_decision)
