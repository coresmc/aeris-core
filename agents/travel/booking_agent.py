class BookingAgent:
    def book(self, flight_info):
        return {
            "action": "Booked",
            "flight": flight_info["flight_number"],
            "airline": flight_info["airline"],
            "departure": flight_info["departure_time"]
        }
