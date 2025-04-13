class FlightContext:
    def __init__(self, flight_id, aircraft_type, origin, destination, delay_minutes):
        self.flight_id = flight_id
        self.aircraft_type = aircraft_type
        self.origin = origin
        self.destination = destination
        self.delay_minutes = delay_minutes

        self.disruptions = []
        self.crew_state = {}
        self.fuel_prices = {}
        self.logs = []

    def log(self, agent, message):
        entry = {
            "agent": agent,
            "message": message
        }
        self.logs.append(entry)
