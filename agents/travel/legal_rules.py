# agents/travel/legal_rules.py

def is_gateway_eligible(pilot):
    """
    Determines if pilot is eligible for gateway travel from home city.
    """
    gateway_cities = ["LAX", "JFK"]  # Company-designated gateways
    if pilot["home_airport"] in gateway_cities:
        return True
    if pilot["home_airport"] in ["SYD", "MEL"]:
        return True  # Edge-case override for AU pilots
    return False

def deadhead_entitlement(flight_leg):
    """
    Determines class of service entitlement for deadhead.
    """
    duration = flight_leg["block_minutes"]
    if duration >= 420:  # ≥ 7 hours = Business Class
        return "business"
    return "economy"

def requires_rest_before_duty(prev_leg, next_leg):
    """
    Applies FAA-style rest rules between long-haul segments.
    """
    rest_gap = next_leg["report_time_min"] - prev_leg["release_time_min"]
    return rest_gap < 600  # Require 10 hours rest

def can_rebook_alternate(flight, pilot):
    """
    Placeholder: Would pull from override list, known CBA exceptions.
    """
    return flight["carrier"] not in pilot.get("excluded_airlines", [])
