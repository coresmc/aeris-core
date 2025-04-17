from core.travel_context import TravelContext
from agents.travel.travel_agent import TravelAgent
from agents.travel.flight_search import recommend_flight
from agents.travel.booking_agent import BookingAgent
from datetime import datetime, timezone

# Simulated Travel Context
travel_context = TravelContext(
    name="Corey W",
    crew_id="AL1234",
    base="JFK",
    gateway="ORD",
    travel_type="gateway",
    duty_start_time=datetime(2025, 4, 17, 6, 0, tzinfo=timezone.utc),
    preferred_airlines=["United", "Delta"],
    seat_pref="Window",
    class_of_service="Economy",
    estimated_block_time_hours=5,
    schedule={"pairing_id": "PX123", "check_in": "2025-04-17T04:00:00Z"},
    loa_status="Active",
    cba_rules={"max_reposition_time": 6}
)

# Run TravelAgent evaluation
travel_agent = TravelAgent()
travel_decision = travel_agent.evaluate(travel_context)
print("\nTravelAgent Decision:", travel_decision)

# Only search flights if approved
if travel_decision["action"] == "Approve travel":
    print("\n🔍 Searching and scoring flights...\n")
    top_flight = recommend_flight(
    travel_context,
    origin=travel_context.gateway,
    destination=travel_context.base,
    date=travel_context.duty_start_time.date().isoformat(),
    preferences={
        "airlines": travel_context.preferred_airlines,
        "seat": travel_context.seat_pref
        }
    )

    print("✈️  Top Flight Recommendation:")
    print(f"Airline: {top_flight['airline']}")
    print(f"Flight: {top_flight['flight_number']}")
    print(f"Departure: {top_flight['departure_time']}")
    print(f"Arrival: {top_flight['arrival_time']}")
    print(f"Score: {top_flight['score']}")

    # Book the top flight
    booking_agent = BookingAgent()
    booking_result = booking_agent.book(top_flight)
    print("\n✅ Booking Confirmation:", booking_result)
else:
    print("\n❌ Travel not authorized. Skipping flight search.")
