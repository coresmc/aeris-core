from datetime import datetime
import random

def search_flights(context, origin, destination, date, preferences):
    """
    Simulated flight search — this should later link to Skyscanner or Amadeus.
    Returns a list of flights with scores based on crew preferences and duty timing.
    """

    # Mock results
    mock_flights = [
        {
            "airline": "Delta",
            "flight_number": "DL456",
            "departure_time": f"{date}T12:00:00Z",
            "arrival_time": f"{date}T17:00:00Z",
            "price": 1100,
            "class_of_service": "Business"
        },
        {
            "airline": "United",
            "flight_number": "UA789",
            "departure_time": f"{date}T14:00:00Z",
            "arrival_time": f"{date}T18:00:00Z",
            "price": 1050,
            "class_of_service": "Business"
        },
        {
            "airline": "American",
            "flight_number": "AA123",
            "departure_time": f"{date}T09:00:00Z",
            "arrival_time": f"{date}T15:00:00Z",
            "price": 950,
            "class_of_service": "Economy"
        }
    ]

    scored_flights = []
    for flight in mock_flights:
        score = 1000  # Base score

        # Airline preference
        if flight["airline"] in preferences.get("preferred_airlines", []):
            score += 200
        else:
            score -= 100

        # Seat preference bonus (mocked only)
        if preferences.get("seat_pref") == "Window":
            score += 50

        # Class of service bonus
        if flight.get("class_of_service") == context.class_of_service:
            score += 150

        # Departure proximity to duty start
        try:
            duty_start = datetime.fromisoformat(context.duty_start_time.replace("Z", "+00:00"))
            departure = datetime.fromisoformat(flight["departure_time"].replace("Z", "+00:00"))
            time_diff = abs((duty_start - departure).total_seconds()) / 3600
            score -= time_diff * 10  # Penalize by hours from report
        except Exception as e:
            print(f"⚠️ Time scoring error: {e}")

        flight["score"] = round(score, 2)
        scored_flights.append(flight)

    scored_flights.sort(key=lambda x: x["score"], reverse=True)
    return scored_flights