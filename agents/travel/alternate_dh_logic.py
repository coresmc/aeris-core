from datetime import datetime
from agents.travel.flight_search import search_flights


def calculate_class_of_service_limit(original_price, class_of_service):
    if class_of_service.lower() == "business":
        return original_price
    elif class_of_service.lower() == "economy":
        return original_price * 0.5
    else:
        return original_price


def is_legal_rest(arrival_time_str, duty_start_time_str):
    arrival = datetime.fromisoformat(arrival_time_str.replace("Z", "+00:00"))
    duty_start = datetime.fromisoformat(duty_start_time_str.replace("Z", "+00:00"))
    rest_period = (duty_start - arrival).total_seconds() / 3600
    return rest_period >= 10  # e.g., 10 hours minimum


def filter_legal_flights(flights, max_price, duty_start_time):
    valid = []
    for flight in flights:
        if flight["price"] <= max_price and is_legal_rest(flight["arrival_time"], duty_start_time):
            valid.append(flight)
    return valid


def evaluate_alternate_deadheads(context, original_deadhead_price):
    origin = context.gateway
    destination = context.schedule.get("sign_on_airport", context.base)
    departure_date = context.duty_start_time[:10]
    class_limit = calculate_class_of_service_limit(original_deadhead_price, context.class_of_service)

    all_options = search_flights(
        context,
        origin=origin,
        destination=destination,
        date=departure_date,
        preferences={
            "preferred_airlines": context.preferred_airlines,
            "seat_pref": context.seat_pref
        }
    )

    valid_flights = filter_legal_flights(all_options, class_limit, context.duty_start_time)

    if valid_flights:
        valid_flights.sort(key=lambda x: x["price"])
        return valid_flights[0]  # return the best match
    else:
        return {"message": "No valid alternate DH flights found."}