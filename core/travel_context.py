from datetime import datetime

class TravelContext:
    def __init__(self, name, crew_id, base, gateway, preferred_airlines, seat_pref,
                 travel_type, duty_start_time, schedule, cba_rules, loa_status,
                 class_of_service, estimated_block_time_hours, cba_loa=None):
        self.name = name
        self.crew_id = crew_id
        self.base = base
        self.gateway = gateway
        self.preferred_airlines = preferred_airlines
        self.seat_pref = seat_pref
        self.travel_type = travel_type
        self.duty_start_time = duty_start_time
        self.schedule = schedule
        self.cba_rules = cba_rules
        self.loa_status = loa_status
        self.class_of_service = class_of_service
        self.estimated_block_time_hours = estimated_block_time_hours
        self.cba_loa = cba_loa
        self.logs = []

    def log(self, agent, message):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent,
            "message": message
        }
        self.logs.append(entry)
        print(f"[LOG] {entry['timestamp']} — {message}")
